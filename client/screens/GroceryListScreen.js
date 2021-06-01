import React, { useContext, useEffect } from "react";
import {
  View,
  SafeAreaView,
  SectionList,
  StyleSheet,
  Text,
  TouchableHighlight,
  KeyboardAvoidingView,
} from "react-native";
import Item from "../components/Item";
import NewItem from "../components/NewItem";
import { colors } from "../other/colors.js";
import { useQuery, useMutation, gql, useSubscription } from "@apollo/client";
import {
  GET_LIST,
  ADD_ITEM,
  PURCHASE_ITEM,
  REMOVE_ITEM,
  CLAIM_ITEM,
  ITEM_UPDATES,
} from "../graphql/graphql.js";
import { AntDesign } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { cache } from "../graphql/cache";
import useAuth from "../hooks/useAuth";
import GoBackButton from "../components/GoBackButton";
import { ListContext } from "../contexts/ListContext";

const DATA = [
  { data: [] },
  {
    title: "Purchased",
    data: [],
  },
];

export default function ({ route, navigation }) {
  // refreshes SectionList state (could be temporary fix)
  const [listName, setListName] = React.useState("");
  const [adding, setAdding] = React.useState("");
  const [refresh, setRefresh] = React.useState(false);

  const listRef = React.useRef();
  const { authData } = useAuth();
  const { setCreatingList } = useContext(ListContext);
  const userID = authData.id;
  // gets id and name from the join or create screen
  const { listID } = route.params;

  useEffect(() => {
    setCreatingList(false);
  }, []);

  // get list query to use on first load
  const { data, loading, error } = useQuery(GET_LIST, {
    variables: { listID },
  });

  const readList = cache.readQuery({
    query: gql`
      query readList($listID: String!) {
        get_list(listID: $listID) {
          items {
            id
            name
            member
            purchased
          }
        }
      }
    `,
    variables: { listID },
  });

  const createNewItem = () => {
    const newItem = {
      __typename: "Item",
      id: "new",
      name: "",
      member: null,
      purchased: false,
    };

    cache.modify({
      id: `List:${listID}`,
      fields: {
        items(existingItemRefs) {
          const newItemRef = cache.writeFragment({
            data: newItem,

            fragment: gql`
              fragment NewItem on Item {
                id
                name
                member
                purchased
              }
            `,
          });
          return [...existingItemRefs, newItemRef];
        },
      },
    });

    listRef.current.scrollToLocation({
      itemIndex: DATA[0].data.length,
      sectionIndex: 0,
      viewPosition: 0.5,
    });
  };
  // const subscriptionResult = useSubscription(ITEM_UPDATES, {
  //   variables: { code: "SNS82" },
  //   onSubscriptionData: ({ client, subscriptionData }) => {
  //     if (subscriptionData.data.item_updates.affector == "testmaballs")
  //       console.log("my mutation");

  //     cache.modify({
  //       id: `List:${listID}`,
  //       fields: {
  //         items(existingItemRefs, { readField }) {
  //           const newItemRef = cache.writeFragment({
  //             data: subscriptionData.data.item_updates.item,

  //             fragment: gql`
  //               fragment NewItem on Item {
  //                 id
  //                 name
  //                 member
  //                 purchased
  //               }
  //             `,
  //           });
  //           console.log(newItemRef);
  //           return [...existingItemRefs, newItemRef];
  //         },
  //       },
  //     });
  //   },
  // });

  const [addItem] = useMutation(ADD_ITEM, {
    ignoreResults: true,
    update(cache, result) {
      cache.modify({
        id: `List:${listID}`,
        fields: {
          items(existingItemRefs, { readField }) {
            return existingItemRefs
              .filter((itemRef) => "new" !== readField("id", itemRef))
              .push(result.data);
          },
        },
      });
    },
  });

  const [purchaseItem] = useMutation(PURCHASE_ITEM, {
    ignoreResults: true,
  });

  const [claimItem] = useMutation(CLAIM_ITEM, {
    ignoreResults: true,
  });

  const [removeItem] = useMutation(REMOVE_ITEM, {
    ignoreResults: true,
    update(cache, result) {
      cache.modify({
        id: `List:${listID}`,
        fields: {
          items(existingItemRefs, { readField }) {
            return existingItemRefs.filter(
              (itemRef) =>
                result.data.remove_item.id !== readField("id", itemRef)
            );
          },
        },
      });
    },
  });

  if (loading)
    return (
      <SafeAreaView>
        <Text>Loading...</Text>
      </SafeAreaView>
    );

  if (error) console.log(error);

  function onAdd() {
    // don't add if item is empty
    if (adding === "") {
      cache.modify({
        id: `List:${listID}`,
        fields: {
          items(existingItemRefs, { readField }) {
            return existingItemRefs.filter(
              (itemRef) => "new" !== readField("id", itemRef)
            );
          },
        },
      });
    } else {
      addItem({ variables: { name: adding, listID, userID } });
      setAdding("");
    }
  }

  function onPurchase(id, purchased) {
    let method = purchased ? "unpurchase" : "purchase";
    Haptics.selectionAsync();
    purchaseItem({ variables: { listID, itemID: id, userID, method } });
  }

  // pass state in when changing text when adding new item
  function onChangeAdd(text) {
    setAdding(text);
  }

  function onTriggerRightSwipe(id) {
    Haptics.impactAsync("medium");
  }

  function onRightOpen(id) {
    removeItem({ variables: { listID, itemID: id, userID } });
  }

  function onTriggerLeftSwipe(id, member) {
    let method = member ? "unclaim" : "claim";
    claimItem({
      variables: { listID, itemID: id, userID, method },
    });
    Haptics.impactAsync("light");
  }

  const handleGoBack = () => {
    navigation.navigate("lists");
  };

  console.log("--*-- re-rendered --*--");
  DATA[0].data = readList.get_list.items.filter((item) => !item.purchased);
  DATA[1].data = readList.get_list.items.filter((item) => item.purchased);

  // Remove "Purchased" heading if no items purchased
  if (DATA[1].data.length == 0) DATA[1].title = null;
  else DATA[1].title = "Purchased";

  // renders SectionList (newitem is rendered when adding a new item)
  const renderItem = ({ item }) => {
    return item.id === "new" ? (
      <NewItem
        id={DATA[0].data.length}
        onChangeAdd={onChangeAdd}
        onAdd={onAdd}
      />
    ) : (
      <Item
        id={item.id}
        name={item.name}
        member={item.member}
        onPress={(id, purchased) => onPurchase(id, purchased)}
        purchased={item.purchased}
        onTriggerLeftSwipe={(id, member) => onTriggerLeftSwipe(id, member)}
        onTriggerRightSwipe={(id) => onTriggerRightSwipe(id)}
        onRightOpen={onRightOpen}
      />
    );
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      behavior={"padding"}
      style={styles.container}
    >
      <Text style={styles.title}>{data.get_list.list_name}</Text>
      <GoBackButton onPress={handleGoBack} />
      <SectionList
        sections={DATA}
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

// Styles for grocery list
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
