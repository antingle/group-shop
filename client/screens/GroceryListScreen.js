import React from "react";
import {
  View,
  SafeAreaView,
  SectionList,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
} from "react-native";
import Item from "../components/Item";
import NewItem from "../components/NewItem";
import { colors } from "../colors.js";
import { useLazyQuery, useMutation } from "@apollo/client";
import { get_list, add_item, purchase_item, remove_item } from "../graphql.js";
import { TouchableHighlight } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

const DATA = [
  {
    data: [],
  },
  {
    title: "Purchased",
    data: [],
  },
];

export default function ({ route, navigation }) {
  // refreshes SectionList state (could be temporary fix)
  const [refresh, setRefresh] = React.useState(false);
  const [listName, setListName] = React.useState("");
  const [adding, setAdding] = React.useState("");
  const [items, setItems] = React.useState([
    { data: [{ id: 1234, name: "beef", purchased: false }] },
    { title: "Purchased", data: [] },
  ]);

  const listRef = React.useRef();

  // gets id and name from the join or create screen
  // const { listID, listName } = route.params;
  const tempID = "608c3d535cbba308d0fecbcf";
  const userID = "608b5ddddb8f322bbc238bca";

  const sortItems = (data, queryName) => {
    const itemsArray = data[queryName].items;
    const unPurchasedItems = itemsArray.filter((item) => !item.purchased);
    const PurchasedItems = itemsArray.filter((item) => item.purchased);
    setItems([
      { data: unPurchasedItems },
      { title: items[1].title, data: PurchasedItems },
    ]);
  };

  const createNewItem = () => {
    const newItem = {
      id: Math.random(),
      new: true,
    };
    setItems([
      { data: [...items[0].data, newItem] },
      { title: items[1].title, data: items[1].data },
    ]);
    listRef.current.scrollToLocation({
      itemIndex: items[0].data.length,
      sectionIndex: 0,
      viewPosition: 0.5,
    });
  };

  // graphql
  const [getList, { loading, error, data }] = useLazyQuery(get_list, {
    variables: { listID: tempID },
    onCompleted: () => {
      setListName(data.get_list.list_name);
      sortItems(data, "get_list");
    },
  });

  const [addItem] = useMutation(add_item, {
    update(proxy, result) {
      const latestItem = result.data.add_item.items.pop();
      setItems([
        { data: [...items[0].data.filter((i) => !i.new), latestItem] },
        { title: items[1].title, data: items[1].data },
      ]);
    },
  });

  const [purchaseItem] = useMutation(purchase_item, {
    update(proxy, result) {
      sortItems(result.data, "purchase_item");
    },
  });

  const [removeItem] = useMutation(remove_item, {
    update(proxy, result) {
      sortItems(result.data, "remove_item");
    },
  });

  React.useEffect(() => {
    getList();
  }, []);

  if (loading)
    return (
      <SafeAreaView>
        <Text>Loading...</Text>
      </SafeAreaView>
    );

  if (error) console.log(error);

  // const updateCache = (cache, { data }) => {
  //   // Fetch the todos from the cache
  //   const existingTodos = cache.readQuery({
  //     query: get_list,
  //   });
  //   console.log(cache);
  //   console.log(data);
  // };

  function onAdd() {
    if (adding === "") {
      setItems([
        { data: [...items[0].data.filter((i) => !i.new)] },
        { title: items[1].title, data: items[1].data },
      ]);
    } else {
      addItem({ variables: { name: adding, listID: tempID, userID } });
      setAdding("");
    }
  }

  function onPurchase(id, purchased) {
    let method = purchased ? "unpurchase" : "purchase";
    purchaseItem({ variables: { listID: tempID, itemID: id, userID, method } });
  }

  // pass state in when changing text when adding new item
  function onChangeAdd(text) {
    setAdding(text);
  }

  function onTriggerRightSwipe(id) {
    Haptics.impactAsync("medium");
  }

  function onRightOpen(id) {
    removeItem({ variables: { listID: tempID, itemID: id, userID } });
  }

  function onTriggerLeftSwipe(id, { progress }) {
    if (progress >= 0.2) {
      console.log(`claim ${id}`);
      Haptics.impactAsync("medium");
    }
  }

  // renders SectionList (newitem is rendered when adding a new item)
  const renderItem = ({ item }) => {
    return item.new ? (
      <NewItem
        id={items[0].data.length}
        onChangeAdd={onChangeAdd}
        onAdd={onAdd}
      />
    ) : (
      <Item
        id={item.id}
        name={item.name}
        onPress={(id, purchased) => onPurchase(id, purchased)}
        purchased={item.purchased}
        onTriggerLeftSwipe={(id, progress) => onTriggerLeftSwipe(id, progress)}
        onTriggerRightSwipe={(id) => onTriggerRightSwipe(id)}
        onRightOpen={onRightOpen}
      />
    );
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Text style={styles.title}>{listName}</Text>
      <SectionList
        sections={items}
        renderItem={renderItem}
        renderSectionHeader={({ section: { title } }) =>
          title && <Text style={styles.heading}>{title}</Text>
        }
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled={false}
        ref={listRef}
      />
      <View style={styles.absolute}>
        <TouchableHighlight
          style={styles.addButton}
          onPress={createNewItem}
          underlayColor={colors.light}
        >
          <View style={styles.addButton}>
            <AntDesign name="plus" style={styles.plus} />
          </View>
        </TouchableHighlight>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    fontSize: 40,
    fontWeight: "800",
    color: colors.green,
    marginBottom: 12,
    marginTop: 60,
  },
  heading: {
    fontSize: 28,
    fontWeight: "800",
    width: 280,
    marginTop: 20,
    marginBottom: 10,
    color: colors.green,
  },
  nameInput: {
    fontSize: 24,
    paddingTop: 80,
    paddingBottom: 300,
    color: colors.dark,
  },
  addButton: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.green,
    alignItems: "center",
    justifyContent: "center",
  },
  plus: {
    fontSize: 45,
    color: colors.light,
  },
  absolute: {
    position: "absolute",
    bottom: 40,
    right: 40,
  },
});
