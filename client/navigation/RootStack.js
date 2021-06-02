import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import ListSettingsScreen from "../screens/ListSettingsScreen";
import SettingsScreen from "../screens/SettingsScreen";
import AppStack from "./AppStack";

const Stack = createStackNavigator();

export default function RootStack() {
  return (
    <Stack.Navigator
      mode={"modal"}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="main" component={AppStack} />
      <Stack.Screen name="settings" component={SettingsScreen} />
      <Stack.Screen name="listSettings" component={ListSettingsScreen} />
    </Stack.Navigator>
  );
}
