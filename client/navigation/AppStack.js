import React, { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import CreateOrJoinScreen from "../screens/CreateOrJoinScreen";
import ListScreen from "../screens/ListScreen";
import NameListScreen from "../screens/NameListScreen";
import CodeScreen from "../screens/CodeScreen";
import GroceryListScreen from "../screens/GroceryListScreen";
import { getStorageData, setStorageData } from "../other/storage";
import useAuth from "../hooks/useAuth";
import { useQuery } from "@apollo/client";
import { GET_USER_LISTS } from "../graphql/graphql";

export default function AppStack() {
  const Stack = createStackNavigator();
  const { authData, updateLists, lists } = useAuth();
  const { loading, error } = useQuery(GET_USER_LISTS, {
    variables: { userID: authData.id },
    onCompleted: (data) => {
      returnedData = data.get_user_lists;
      if (returnedData) updateLists(returnedData);
    },
  });

  useEffect(() => {
    getStorageData("lists")
      .then((data) => {
        console.log("Number of lists:", data?.length);
      })
      .catch((e) => {
        console.log("No data in lists", e);
      });
  }, []);

  if (error) console.log(error);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {!lists ? (
        <Stack.Screen name="createOrJoin" component={CreateOrJoinScreen} />
      ) : (
        <Stack.Screen
          name="lists"
          component={ListScreen}
          options={{
            animationEnabled: false,
          }}
        />
      )}

      <Stack.Screen name="nameList" component={NameListScreen} />
      <Stack.Screen name="code" component={CodeScreen} />
      <Stack.Screen name="groceryList" component={GroceryListScreen} />
    </Stack.Navigator>
  );
}
