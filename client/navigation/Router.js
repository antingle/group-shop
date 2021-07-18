import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import useAuth from "../hooks/useAuth";
import Loading from "../screens/Loading";
import AuthStack from "./AuthStack";
import { ListProvider } from "../contexts/ListContext";
import { colors } from "../other/colors";
import MainStack from "./MainStack";
import * as Linking from "expo-linking";

const prefix = Linking.createURL("/");

export default function Router() {
  const { authData, loading } = useAuth();
  const theme = {
    colors: {
      primary: colors.primary,
      background: colors.background,
    },
  };

  const linking = {
    prefixes: [prefix],
  };

  if (loading) return <Loading />;

  return (
    <NavigationContainer theme={theme} linking={linking}>
      {authData ? (
        <ListProvider>
          <MainStack />
        </ListProvider>
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
}
