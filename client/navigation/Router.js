import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import useAuth from "../hooks/useAuth";
import Loading from "../screens/Loading";
import AuthStack from "./AuthStack";
import { ListProvider } from "../contexts/ListContext";
import RootStack from "./RootStack";

export default function Router() {
  const { authData, loading, signOut } = useAuth();

  if (loading) return <Loading />;

  return (
    <NavigationContainer>
      {authData ? (
        <ListProvider>
          <RootStack />
        </ListProvider>
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
}
