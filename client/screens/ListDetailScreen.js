import React, { useEffect, useRef, useState } from "react";
import {
  View,
  SectionList,
  StyleSheet,
  Text,
  TouchableHighlight,
  KeyboardAvoidingView,
  Platform,
  LayoutAnimation,
  SafeAreaView,
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
import useList from "../hooks/useList";
import Header from "../components/Header";
import Loading from "./Loading";
import { sortByDate } from "../other/helperFunctions";
import { useFocusEffect } from "@react-navigation/native";

const DATA = [
  { data: [] },
  {
    title: "Purchased",
    data: [],
  },
];

export default function ListDetailScreen() {
  // refreshes SectionList state (could be temporary fix)
  const [adding, setAdding] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const listRef = useRef();
  const { authData } = useAuth();
  const { setCreatingList, currentListID } = useList();
  const userID = authData.id;
  // gets id and name from the join or create screen

  useEffect(() => {
    setCreatingList(false);
  }, [currentListID]);

  useFocusEffect(
    React.useCallback(() => {
      if (!loading) refetch();
    }, [])
  );

  // get list query to use on first load
  const { data, loading, error, refetch } = useQuery(GET_LIST, {
    variables: { listID: currentListID },
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
            last_modified
          }
        }
      }
    `,
    variables: { listID: currentListID },
  });

  const createNewItem = () => {
    const newItem = {
      __typename: "Item",
      id: `new${Math.random() * 10000}`,
      name: "",
      member: null,
      purchased: false,
      last_modified: new Date().toString(),
    };

    cache.modify({
      id: `List:${currentListID}`,
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
                last_modified
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
  useSubscription(ITEM_UPDATES, {
    variables: { listID: currentListID },
    onSubscriptionData: ({ subscriptionData }) => {
      const returnedData = subscriptionData.data.item_updates;
      if (returnedData.affector.id != authData.id)
        switch (returnedData.type) {
          case "add":
            cache.modify({
              id: `List:${currentListID}`,
              fields: {
                items(existingItemRefs, { readField }) {
                  const newItemRef = cache.writeFragment({
                    data: returnedData.item,

                    fragment: gql`
                      fragment NewItem on Item {
                        id
                        name
                        member
                        purchased
                        last_modified
                      }
                    `,
                  });
                  return [...existingItemRefs, newItemRef];
                },
              },
            });
            break;
          case "remove":
            cache.modify({
              id: `List:${currentListID}`,
              fields: {
                items(existingItemRefs, { readField }) {
                  return existingItemRefs.filter(
                    (itemRef) =>
                      returnedData.item.id !== readField("id", itemRef)
                  );
                },
              },
            });
        }
    },
  });

  const [addItem] = useMutation(ADD_ITEM, {
    ignoreResults: true,
    update(cache, result) {
      cache.modify({
        id: `List:${currentListID}`,
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
  });

  if (loading) return <Loading />;

  if (error)
    return (
      <SafeAreaView>
        <Text>{JSON.stringify(error)}</Text>
      </SafeAreaView>
    );

  function onAdd() {
    // don't add if item is empty
    if (adding === "") {
      cache.modify({
        id: `List:${currentListID}`,
        fields: {
          items(existingItemRefs, { readField }) {
            return existingItemRefs.filter(
              (itemRef) => !readField("id", itemRef).includes("new")
            );
          },
        },
      });
    } else {
      addItem({ variables: { name: adding, listID: currentListID, userID } });
      setAdding("");
    }
  }

  function onPurchase(id, purchased) {
    let method = purchased ? "unpurchase" : "purchase";
    Haptics.impactAsync("light");
    cache.modify({
      id: `Item:${id}`,
      fields: {
        purchased(value) {
          return !value;
        },
        last_modified(date) {
          return new Date();
        },
      },
    });
    purchaseItem({
      variables: { listID: currentListID, itemID: id, userID, method },
    });
  }

  // pass state in when changing text when adding new item
  function onChangeAdd(text) {
    setAdding(text);
  }

  function onRemove(id) {
    Haptics.impactAsync("medium");
    cache.modify({
      id: `List:${currentListID}`,
      fields: {
        items(existingItemRefs, { readField }) {
          return existingItemRefs.filter(
            (itemRef) => id !== readField("id", itemRef)
          );
        },
      },
    });
    removeItem({ variables: { listID: currentListID, itemID: id, userID } });
  }

  function onTriggerLeftSwipe(id, member) {
    let method = member === authData.screen_name ? "unclaim" : "claim";
    claimItem({
      variables: { listID: currentListID, itemID: id, userID, method },
    });
    Haptics.impactAsync("light");
  }

  const refreshList = () => {
    try {
      setRefreshing(true);
      refetch();
      console.log("refreshed the list!");
    } catch (e) {
      console.log(e);
    } finally {
      setRefreshing(false);
    }
  };

  console.log("--*-- re-rendered --*--");
  let unpurchasedItems = readList.get_list.items.filter(
    (item) => !item.purchased
  );
  let purchasedItems = readList.get_list.items.filter((item) => item.purchased);
  if (DATA[0].data != unpurchasedItems.sort(sortByDate))
    DATA[0].data = unpurchasedItems.sort(sortByDate);

  if (DATA[1].data != purchasedItems.sort(sortByDate)) {
    DATA[1].data = purchasedItems.sort(sortByDate);

    // Remove "Purchased" heading if no items purchased
    if (DATA[1].data.length == 0) DATA[1].title = null;
    else DATA[1].title = "Purchased";
  }

  // renders SectionList (newitem is rendered when adding a new item)
  const renderItem = ({ item }) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    return item.id.includes("new") ? (
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
        onEndRightSwipe={(id) => onRemove(id)}
      />
    );
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Header
        title={data.get_list.list_name}
        headerLeft={"back"}
        backPress={"lists"}
        headerRight={"settings"}
        settingsScreen={"listSettings"}
      />
      <SectionList
        sections={DATA}
        renderItem={renderItem}
        renderSectionHeader={({ section: { title } }) =>
          title && <Text style={styles.heading}>{title}</Text>
        }
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled={false}
        ref={listRef}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        onRefresh={refreshList}
        refreshing={refreshing}
      />
      <View style={styles.absolute}>
        <TouchableHighlight
          style={styles.addButton}
          onPress={createNewItem}
          underlayColor={colors.background}
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
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    fontSize: 40,
    fontWeight: "800",
    color: colors.primary,
    marginBottom: 12,
    marginTop: 60,
  },
  heading: {
    fontSize: 28,
    fontWeight: "800",
    width: 280,
    marginTop: 20,
    marginBottom: 10,
    color: colors.primary,
  },
  nameInput: {
    fontSize: 24,
    paddingTop: 80,
    paddingBottom: 300,
    color: colors.text,
  },
  addButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  plus: {
    fontSize: 45,
    color: colors.background,
  },
  absolute: {
    position: "absolute",
    bottom: 40,
    right: 40,
  },
});
