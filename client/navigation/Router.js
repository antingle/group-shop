import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import useAuth from "../hooks/useAuth";
import Loading from "../screens/Loading";
import AppStack from "./AppStack";
import AuthStack from "./AuthStack";

export default function Router() {
  const { authData, loading, signOut } = useAuth();

  if (loading) return <Loading />;

  return (
    <NavigationContainer>
      {authData ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
