import React from "react";

import { createStackNavigator } from "@react-navigation/stack";
import NameScreen from "../screens/NameScreen";
import FirstScreen from "../screens/FirstScreen";
import CreateAccountScreen from "../screens/CreateAccountScreen";
import SignInScreen from "../screens/SignInScreen";
import GetStartedScreen from "../screens/GetStartedScreen";

export default function AuthStack() {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="getStarted" component={GetStartedScreen} />
      <Stack.Screen name="firstScreen" component={FirstScreen} />
      <Stack.Screen name="createAccount" component={CreateAccountScreen} />
      <Stack.Screen name="signIn" component={SignInScreen} />
      <Stack.Screen name="name" component={NameScreen} />
    </Stack.Navigator>
  );
}
