import { useApolloClient, useMutation } from "@apollo/client";
import React, { createContext, useState, useEffect } from "react";
import { Alert } from "react-native";
import { DELETE_USER } from "../graphql/graphql";
import {
  getStorageData,
  removeStorageData,
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

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lists, setLists] = useState(false);
  let client = useApolloClient();

  // hooks
  const [delete_user] = useMutation(DELETE_USER);

  useEffect(() => {
    getStorageData("user").then((data) => {
      if (data != null) setAuthData(data);
      setLoading(false);
    });
  }, []);

  const signIn = async (data) => {
    if (!data) return;
    try {
      setStorageData("user", data);
      setAuthData(data);
    } catch (error) {
      console.log(error);
    }
  };
  const signOut = async () => {
    removeStorageData("user");
    removeStorageData("lists");
    setLists(false);
    setAuthData(null);
    client.clearStore();
  };

  const deleteUser = async () => {
    try {
    delete_user({variables: { userID: authData.id }})
    signOut();
    } catch {
      Alert.alert("Error deleting account");
    }
  }
  
  return (
    <AuthContext.Provider
      value={{
        authData,
        loading,
        signIn,
        signOut,
        deleteUser,
        lists, 
        setLists
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
