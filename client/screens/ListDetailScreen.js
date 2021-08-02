import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  SectionList,
  StyleSheet,
  Text,
  TouchableHighlight,
  SafeAreaView,
  LayoutAnimation,
} from "react-native";
import Item from "../components/Item";
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
import {
  sortByDateAscending,
  sortByDateDescending,
} from "../other/helperFunctions";
import { useFocusEffect } from "@react-navigation/native";
import useScheme from "../hooks/useScheme";

const DATA = [{ data: [] }, { title: "Purchased", data: [] }];

export default function ListDetailScreen() {
  const { colors } = useScheme();
  const [refreshing, setRefreshing] = useState(false);
  const [adding, setAdding] = useState("");

  const [dataChanged, setDataChanged] = useState(false);
  const listRef = useRef();
  const { authData } = useAuth();
  const { setCreatingList, currentListID } = useList();
  const userID = authData.id;

  useEffect(() => {
    setCreatingList(false);
  }, [currentListID]);

  useFocusEffect(
    React.useCallback(() => {
      if (!loading) {
        try {
          refetch();
          replaceData();
        } catch (e) {
          console.log(e);
        }
      }
    }, [])
  );

  // get list query to use on first load
  const { data, loading, error, refetch } = useQuery(GET_LIST, {
    variables: { listID: currentListID },
    onCompleted: () => {
      replaceData();
    },
  });

  // renders SectionList
  const renderItem = useCallback(
    ({ item }) => {
      return (
        <Item
          id={item.id}
          name={item.name}
          member={item.member}
          onPress={(id, purchased) => onPurchase(id, purchased)}
          purchased={item.purchased}
          onTriggerLeftSwipe={(id, member) => onTriggerLeftSwipe(id, member)}
          onEndRightSwipe={(id) => onRemove(id)}
          onAdd={onAdd}
          onChangeAdd={onChangeAdd}
        />
      );
    },
    [onAdd, onChangeAdd]
  );

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

  // replace complete list with data prop
  const replaceData = () => {
    const unpurchasedItems = data.get_list.items
      .filter((item) => !item.purchased)
      .sort(sortByDateAscending);

    const purchasedItems = data.get_list.items
      .filter((item) => item.purchased)
      .sort(sortByDateDescending);
    DATA[0].data = unpurchasedItems;
    DATA[1].data = purchasedItems;
    setDataChanged((prev) => !prev);
  };

  const purchaseStateChange = (id, method) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (method === "purchase") {
      const index = DATA[0].data.findIndex((item) => item.id == id);
      const items = DATA[0].data.splice(index, 1);
      const item = {};
      Object.assign(item, items[0]);
      item.purchased = true;
      item.member = authData.screen_name;
      DATA[1].data.unshift(item);
    } else if (method === "unpurchase") {
      const index = DATA[1].data.findIndex((item) => item.id == id);
      const items = DATA[1].data.splice(index, 1);
      const item = {};
      Object.assign(item, items[0]);
      item.purchased = false;
      item.member = null;
      DATA[0].data.push(item);
    }
    setDataChanged((prev) => !prev);
  };

  const createNewItem = () => {
    const newItem = {
      __typename: "Item",
      id: `new${Math.random() * 10000}`,
      name: "",
      member: null,
      purchased: false,
      last_modified: new Date().toString(),
    };

    // cache.modify({
    //   id: `List:${currentListID}`,
    //   fields: {
    //     items(existingItemRefs) {
    //       const newItemRef = cache.writeFragment({
    //         data: newItem,

    //         fragment: gql`
    //           fragment NewItem on Item {
    //             id
    //             name
    //             member
    //             purchased
    //             last_modified
    //           }
    //         `,
    //       });
    //       return [...existingItemRefs, newItemRef];
    //     },
    //   },
    // });

    DATA[0].data.push(newItem);
    setDataChanged((prev) => !prev);

    listRef.current.scrollToLocation({
      itemIndex: DATA[0].data.length,
      sectionIndex: 0,
      viewPosition: 1,
    });
  };

  function onAdd() {
    // don't add if item is empty
    let index = DATA[0].data.findIndex(({ id }) => id.includes("new"));
    if (adding == "") {
      DATA[0].data.splice(index, 1);
      // cache.modify({
      //   id: `List:${currentListID}`,
      //   fields: {
      //     items(existingItemRefs, { readField }) {
      //       return existingItemRefs.filter(
      //         (itemRef) => !readField("id", itemRef).includes("new")
      //       );
      //     },
      //   },
      // });
    } else {
      DATA[0].data[index].name = adding;
      addItem({ variables: { name: adding, listID: currentListID, userID } });
      console.log(DATA[0].data[index]);
      setAdding("");
    }
    setDataChanged((prev) => !prev);
  }

  // pass state in when changing text when adding new item
  function onChangeAdd(text) {
    setAdding(text);
  }

  function onPurchase(id, purchased) {
    let method = purchased ? "unpurchase" : "purchase";
    purchaseStateChange(id, method);
    Haptics.impactAsync("light");
    // cache.modify({
    //   id: `Item:${id}`,
    //   fields: {
    //     purchased(value) {
    //       return !value;
    //     },
    //     last_modified(date) {
    //       return new Date();
    //     },
    //   },
    // });
    purchaseItem({
      variables: { listID: currentListID, itemID: id, userID, method },
    });
  }

  function onRemove(id) {
    let array = DATA[0].data;
    let index = array.findIndex((item) => item.id == id);
    if (index == -1) {
      array = DATA[1].data;
      let index = array.findIndex((item) => item.id == id);
    }
    array.splice(index, 1);
    Haptics.impactAsync("medium");

    // might need to keep this cache so we dont get an angry warning from graphql
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
    let index = DATA[0].data.findIndex((item) => item.id == id);

    let item = {};
    Object.assign(item, DATA[0].data[index]);
    item.member = method == "claim" ? authData.screen_name : null;
    DATA[0].data[index] = item;

    setDataChanged((prev) => !prev);
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
      setDataChanged((prev) => !prev);
    }
  };

  // console.log("--*-- re-rendered --*--");

  // styles
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

  return (
    <View style={styles.container}>
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
        initialNumToRender={15}
        onRefresh={refreshList}
        refreshing={refreshing}
        extraData={dataChanged}
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
    </View>
  );
}
