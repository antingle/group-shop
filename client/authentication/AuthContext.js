import React, { createContext, useState, useEffect } from "react";
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

  useEffect(() => {
    getStorageData("user").then((data) => {
      if (data != null) setAuthData(data);
      setLoading(false);
    });
  }, []);

  const signIn = async (data) => {
    console.log(data);
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
    setAuthData(null);
  };

  const updateLists = async (lists) => {
    await setStorageData("lists", lists);
    setLists(lists);
  };

  return (
    <AuthContext.Provider
      value={{ authData, loading, signIn, signOut, lists, updateLists }}
    >
      {children}
    </AuthContext.Provider>
  );
};
