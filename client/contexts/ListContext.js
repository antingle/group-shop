import { useApolloClient } from "@apollo/client";
import React, { createContext, useEffect, useState } from "react";
import { LayoutAnimation } from "react-native";
import { DELETE_LIST, GET_USER_LISTS, LEAVE_LIST } from "../graphql/graphql";
import useAuth from "../hooks/useAuth";
import {
  getStorageData,
  removeStorageData,
  setStorageData,
} from "../other/storage";
import * as Haptics from "expo-haptics";

export const ListContext = createContext();

export const ListProvider = ({ children }) => {
  const { lists, setLists, authData } = useAuth();
  const client = useApolloClient();

  const [loading, setLoading] = useState(true);
  const [creatingList, setCreatingList] = useState(false);
  const [currentListID, setCurrentListID] = useState(null);

  // check async storage on app mount
  useEffect(() => {
    getStorageData("lists").then((storedLists) => {
      if (storedLists == null || storedLists?.length == 0) return;
      setLists(storedLists);
    });
  }, []);

  const updateLists = async (lists) => {
    if (lists == null || lists.length == 0) return;
    else {
      await setStorageData("lists", lists);
      setLists(lists);
    }
  };

  const refreshLists = async () => {
    setLoading(true);
    Haptics.impactAsync();
    await client
      .mutate({
        mutation: GET_USER_LISTS,
        variables: {
          userID: authData.id,
        },
      })
      .then((res) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setLists(res.data.get_user_lists);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchLists = async () => {
    await client
      .mutate({
        mutation: GET_USER_LISTS,
        variables: {
          userID: authData.id,
        },
      })
      .then((res) => {
        setLists(res.data.get_user_lists);
        updateLists(res.data.get_user_lists);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };

  const handleList = async (type) => {
    await client
      .mutate({
        mutation: type == "delete" ? DELETE_LIST : LEAVE_LIST,
        variables: {
          listID: currentListID,
        },
      })
      .then((res) => {
        client.cache.evict({ id: `Shortened_List:${currentListID}` });
        setLists(lists.filter(({ id }) => id === currentListID));
        deleteItems(currentListID);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const storeItems = (items) => {
    if (items != null && !items[0].data && !items[1].data) return;
    setStorageData(currentListID, items);
  };

  const deleteItems = (id) => {
    removeStorageData(id);
  };

  const getItems = async () => {
    let data = await getStorageData(currentListID);
    if (data) return data;
    else return [{ data: [] }, { title: null, data: [] }];
  };

  const getListName = () => {
    try {
      if (lists) return lists.find(({ id }) => id == currentListID).list_name;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  const leaveList = () => handleList("leave");
  const deleteList = () => handleList("delete");

  return (
    <ListContext.Provider
      value={{
        lists,
        setLists,
        creatingList,
        updateLists,
        setCreatingList,
        currentListID,
        setCurrentListID,
        deleteList,
        leaveList,
        refreshLists,
        fetchLists,
        loading,
        storeItems,
        deleteItems,
        getItems,
        getListName,
      }}
    >
      {children}
    </ListContext.Provider>
  );
};
