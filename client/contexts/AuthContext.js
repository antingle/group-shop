import { useApolloClient, useMutation } from "@apollo/client";
import React, { createContext, useState, useEffect } from "react";
import { Alert } from "react-native";
import { DELETE_USER } from "../graphql/graphql";
import {
  clearStorageData,
  getStorageData,
  setStorageData,
} from "../other/storage";

/*
authData:
    id
    screen_name
    email
    (token in future)
*/

export const AuthContext = createContext();

export const AuthProvider = ({ children, setToken }) => {
  // setToken passed down from main App
  const [authData, setAuthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lists, setLists] = useState(false);
  let client = useApolloClient();

  // hooks
  const [delete_user] = useMutation(DELETE_USER);

  // check if someone is logged in on app mount
  useEffect(() => {
    getStorageData("user").then((data) => {
      if (data != null) setAuthData(data);
      setLoading(false);
    });
    getStorageData("token").then((data) => {
      if (data != null) setToken(data);
      setLoading(false);
    });
  }, []);

  const signIn = async (data) => {
    if (!data) return;
    try {
      setStorageData("user", data.user);
      setStorageData("token", data.token);
      setAuthData(data.user);
      setToken(data.token);
    } catch (error) {
      console.log(error);
    }
  };
  const signOut = async () => {
    clearStorageData(); // clears all keys
    setLists(false);
    setAuthData(null);
    client.resetStore();
  };

  const deleteUser = async () => {
    try {
      delete_user();
      signOut();
    } catch {
      Alert.alert("Error deleting account");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authData,
        loading,
        signIn,
        signOut,
        deleteUser,
        lists,
        setLists,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
