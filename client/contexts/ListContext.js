import { useApolloClient } from "@apollo/client";
import React, { createContext, useState } from "react";
import { DELETE_LIST, GET_USER_LISTS, LEAVE_LIST } from "../graphql/graphql";
import useAuth from "../hooks/useAuth";
import { getStorageData, setStorageData } from "../other/storage";

export const ListContext = createContext();

export const ListProvider = ({ children }) => {
  const { lists, setLists, authData } = useAuth();
  const client = useApolloClient();

  const [loading, setLoading] = useState(false);
  const [creatingList, setCreatingList] = useState(false);
  const [currentListID, setCurrentListID] = useState(null);

  const updateLists = async (lists) => {
    let currentLists = await getStorageData("lists");
    if (lists == null || lists.length == 0) {
      console.log("No lists for this user");
      return;
    } else {
      await setStorageData("lists", lists);
      setLists(lists);
    }
  };

  const refreshLists = async () => {
    setLoading(true);
    await client
      .mutate({
        mutation: GET_USER_LISTS,
        variables: {
          userID: authData.id,
        },
      })
      .then((res) => {
        setLists(res.data.get_user_lists);
        console.log("lists refreshed!");
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleList = async (type) => {
    await client
      .mutate({
        mutation: type == "delete" ? DELETE_LIST : LEAVE_LIST,
        variables:
          type == "leave"
            ? {
                listID: currentListID,
                userID: authData.id,
              }
            : {
                listID: currentListID,
              },
      })
      .then((res) => {
        client.cache.evict({ id: `Shortened_List:${currentListID}` });
        setLists(lists.filter(({ id }) => id === currentListID));
      })
      .catch((e) => {
        console.log(e);
      });
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
        loading,
      }}
    >
      {children}
    </ListContext.Provider>
  );
};
