import { useApolloClient, useMutation } from "@apollo/client";
import React, { createContext, useState, useEffect, useRef } from "react";
import { Alert, Platform } from "react-native";
import { DELETE_USER } from "../graphql/graphql";
import {
  clearStorageData,
  getStorageData,
  setStorageData,
} from "../other/storage";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

/*
authData:
    id
    screen_name
    email
    (token in future)
*/

export const AuthContext = createContext();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export const AuthProvider = ({ children, setToken }) => {
  // setToken passed down from main App
  const [authData, setAuthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lists, setLists] = useState(false);

  // notifications
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  // graphql
  const [delete_user] = useMutation(DELETE_USER);
  const client = useApolloClient();

  // check if someone is logged in on app mount
  useEffect(() => {
    getStorageData("user").then((data) => {
      if (data != null) setAuthData(data);
      setLoading(false);
    });
    getStorageData("token").then((data) => {
      if (data != null) setToken(data);
    });

    // notifications
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
        console.log(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  // recieve push notification token
  async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  }

  async function schedulePushNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Guess what??",
        body: "Ma balls are thicc",
        data: { data: "goes here" },
      },
      trigger: { seconds: 2 },
    });
  }

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
        schedulePushNotification,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
