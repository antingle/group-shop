import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  SectionList,
  StyleSheet,
  Text,
  SafeAreaView,
  LayoutAnimation,
  KeyboardAvoidingView,
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
import AnimatedPressable from "../components/AnimatedPressable";

export default function ListDetailScreen() {
  const { globalStyles, colors } = useScheme();
  const [refreshing, setRefreshing] = useState(false);
  const [adding, setAdding] = useState("");
  const [dataChanged, setDataChanged] = useState(false);
  const listRef = useRef();
  const { authData } = useAuth();
  const { setCreatingList, currentListID } = useList();
  const userID = authData.id;

  const DATA = useCallback(
    [{ data: [] }, { title: "Purchased", data: [] }],
    [loading, data]
  );

  useEffect(() => {
    setCreatingList(false);
  }, [currentListID]);

  useFocusEffect(
    React.useCallback(() => {
      if (!loading) {
        refetch()
          .then((data) => {
            replaceData(data);
          })
          .catch((e) => console.log(e));
      }
    }, [])
  );

  // get list query to use on first load
  const { data, loading, error, refetch } = useQuery(GET_LIST, {
    variables: { listID: currentListID },
    onCompleted: (data) => {
      replaceData(data);
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
            // cache.modify({
            //   id: `List:${currentListID}`,
            //   fields: {
            //     items(existingItemRefs, { readField }) {
            //       const newItemRef = cache.writeFragment({
            //         data: returnedData.item,

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
            DATA[0].data.push(returnedData.item);
            LayoutAnimation.configureNext(
              LayoutAnimation.Presets.easeInEaseOut
            );
            setDataChanged((prevState) => !prevState);
            break;
          case "remove":
            removeStateChange(returnedData.item.id);
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
            break;
          case "purchase":
          case "unpurchase":
            purchaseStateChange(returnedData.item.id, returnedData.type);
            break;
          case "claim":
          case "unclaim":
            claimStateChange(
              returnedData.item.id,
              returnedData.item.member,
              returnedData.type
            );
        }
    },
  });

  const [addItem] = useMutation(ADD_ITEM, {
    update(cache, result) {
      let index = DATA[0].data.findIndex(({ id }) => id.includes("new"));
      DATA[0].data[index] = result.data.add_item;
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setDataChanged((prev) => !prev);
    },
  });

  // mutations on items
  const [purchaseItem] = useMutation(PURCHASE_ITEM);
  const [claimItem] = useMutation(CLAIM_ITEM);
  const [removeItem] = useMutation(REMOVE_ITEM);

  // replace complete list with data prop
  const replaceData = (data = data) => {
    const unpurchasedItems = data.get_list.items
      .filter((item) => !item.purchased)
      .sort(sortByDateAscending);

    const purchasedItems = data.get_list.items
      .filter((item) => item.purchased)
      .sort(sortByDateDescending);

    DATA[0].data = unpurchasedItems;
    DATA[1].data = purchasedItems;

    // if items that are older than a week then create new section
    if (DATA[1].data) {
      const ONE_WEEK = 1000 * 60 * 60 * 24 * 7;
      const weekAgo = DATA[1].data.filter(
        ({ last_modified }) => new Date() - new Date(last_modified) > ONE_WEEK
      );
      const newPurchased = DATA[1].data.filter(
        ({ last_modified }) => new Date() - new Date(last_modified) < ONE_WEEK
      );
      if (weekAgo?.length > 0) {
        DATA[2] = { title: "Over A Week Ago", data: [...weekAgo] };
        DATA[1].data = newPurchased;
      }
    }

    if (DATA[1].data.length == 0) DATA[1].title = null;
    else DATA[1].title = "Purchased";
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setDataChanged((prev) => !prev);
  };

  const purchaseStateChange = (id, method) => {
    if (method === "purchase") {
      const index = DATA[0].data.findIndex((item) => item.id == id);
      const items = DATA[0].data.splice(index, 1);
      const item = {};
      Object.assign(item, items[0]);
      item.purchased = true;
      item.member = authData.screen_name;
      DATA[1].data.unshift(item);
    } else if (method === "unpurchase") {
      let index = DATA[1].data.findIndex((item) => item.id == id);
      let items;
      if (index == -1) {
        index = DATA[2]?.data.findIndex((item) => item.id == id);
        if (index == -1) return;
        items = DATA[2].data.splice(index, 1);
      } else items = DATA[1].data.splice(index, 1);
      const item = {};
      Object.assign(item, items[0]);
      item.purchased = false;
      item.member = null;
      DATA[0].data.push(item);
    }
    if (DATA[1].data.length == 0) DATA[1].title = null;
    else DATA[1].title = "Purchased";
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    // setDataChanged((prev) => !prev);
  };

  const removeStateChange = (id) => {
    let array = DATA[0].data;
    let index = array.findIndex((item) => item.id == id);
    if (index == -1) {
      array = DATA[1].data;
      index = array.findIndex((item) => item.id == id);
      if (index == -1) {
        array = DATA[2]?.data;
        index = array.findIndex((item) => item.id == id);
        if (index == -1) return;
      }
    }
    array.splice(index, 1);
    if (DATA[1].data.length == 0) DATA[1].title = null;
    else DATA[1].title = "Purchased";
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  const claimStateChange = (id, member, method) => {
    let index = DATA[0].data.findIndex((item) => item.id == id);
    if (index == -1) return;

    let item = {};
    Object.assign(item, DATA[0].data[index]);
    item.member = method == "claim" ? member : null;
    DATA[0].data[index] = item;

    setDataChanged((prevState) => !prevState);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
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
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setDataChanged((prev) => !prev);

    listRef.current.scrollToLocation({
      itemIndex: DATA[0].data.length,
      sectionIndex: 0,
      viewPosition: 0.4,
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
      addItem({ variables: { name: adding, listID: currentListID, userID } });
      setAdding("");
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
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
    removeStateChange(id);
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
    const method = member == authData.screen_name ? "unclaim" : "claim";
    claimStateChange(id, authData.screen_name, method);
    claimItem({
      variables: { listID: currentListID, itemID: id, userID, method },
    });
    Haptics.impactAsync("light");
  }

  const refreshList = async () => {
    try {
      setRefreshing(true);
      Haptics.impactAsync();
      await refetch();
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
      width: 75,
      height: 75,
      borderRadius: 40,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    plus: {
      fontSize: 40,
      color: colors.background,
    },
    absolute: {
      position: "absolute",
      bottom: 40,
      right: 40,
    },
  });

  if (loading) return <Loading />;

  if (error)
    return (
      <SafeAreaView>
        <Text>{JSON.stringify(error)}</Text>
      </SafeAreaView>
    );

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
        initialNumToRender={15}
        onRefresh={refreshList}
        refreshing={refreshing}
        getItemLayout={(_, index) => ({
          length: 56,
          offset: 56 * index, // THIS IS HARDCODDEDDE!!!!!!
          index,
        })}
        ListFooterComponent={<View style={{ paddingBottom: 40 }}></View>}
      />
      <View style={styles.absolute}>
        <AnimatedPressable onPress={createNewItem}>
          <View style={[styles.addButton, globalStyles.shadow]}>
            <AntDesign name="plus" style={styles.plus} />
          </View>
        </AnimatedPressable>
      </View>
    </KeyboardAvoidingView>
  );
}
