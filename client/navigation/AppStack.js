import React, { useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ListScreen from "../screens/ListScreen";
import NameListScreen from "../screens/NameListScreen";
import CodeScreen from "../screens/CodeScreen";
import ListDetailScreen from "../screens/ListDetailScreen";
import { StyleSheet } from "react-native";
import { colors } from "../other/colors";
import useList from "../hooks/useList";
import JoiningScreen from "../screens/JoiningScreen";

export default function AppStack() {
  const Stack = createStackNavigator();
  const { creatingList } = useList();

  const forFade = ({ current: { progress } }) => ({
    cardStyle: {
      opacity: progress,
    },
  });

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="lists"
        component={ListScreen}
        unmountOnBlur={true}
        options={{
          animationEnabled: false,
        }}
      />

      <Stack.Screen name="listDetail" component={ListDetailScreen} />
      {creatingList ? (
        <>
          <Stack.Screen name="nameList" component={NameListScreen} />
          <Stack.Screen name="code" component={CodeScreen} />
        </>
      ) : null}
      <Stack.Screen
        name="join"
        component={JoiningScreen}
        options={{
          cardStyleInterpolator: forFade,
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.background,
  },
});
