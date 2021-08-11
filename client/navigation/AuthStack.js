import React from "react";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import NameScreen from "../screens/NameScreen";
import FirstScreen from "../screens/FirstScreen";
import GetStartedScreen from "../screens/GetStartedScreen";

export default function AuthStack() {
  const Stack = createSharedElementStackNavigator();

  const forFade = ({ current: { progress } }) => ({
    cardStyle: {
      opacity: progress,
    },
  });

  return (
    <Stack.Navigator
      mode="modal"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="getStarted"
        component={GetStartedScreen}
        options={{
          cardStyleInterpolator: forFade,
        }}
      />
      <Stack.Screen
        name="firstScreen"
        component={FirstScreen}
        options={{
          cardStyleInterpolator: forFade,
        }}
      />
      {/* <Stack.Screen name="createAccount" component={CreateAccountScreen} />
      <Stack.Screen name="signIn" component={SignInScreen} /> */}
      <Stack.Screen name="name" component={NameScreen} />
    </Stack.Navigator>
  );
}
