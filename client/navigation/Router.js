import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import useAuth from "../hooks/useAuth";
import Loading from "../screens/Loading";
import AuthStack from "./AuthStack";
import { ListProvider } from "../contexts/ListContext";
import { colors } from "../other/colors";
import MainStack from "./MainStack";

export default function Router() {
  const { authData, loading, signOut } = useAuth();
  const theme = {
    colors: {
      primary: colors.primary,
      background: colors.background,
    },
  };

  if (loading) return <Loading />;

  return (
    <NavigationContainer theme={theme}>
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
