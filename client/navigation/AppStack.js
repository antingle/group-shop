import React, { useContext, useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import CreateOrJoinScreen from "../screens/CreateOrJoinScreen";
import ListScreen from "../screens/ListScreen";
import NameListScreen from "../screens/NameListScreen";
import CodeScreen from "../screens/CodeScreen";
import GroceryListScreen from "../screens/GroceryListScreen";
import useAuth from "../hooks/useAuth";
import { useQuery } from "@apollo/client";
import { GET_USER_LISTS } from "../graphql/graphql";
import Loading from "../screens/Loading";
import { ListContext } from "../contexts/ListContext";

export default function AppStack() {
  const Stack = createStackNavigator();
  const { authData, updateLists, lists, loading } = useAuth();
  const { creatingList } = useContext(ListContext);
  const [listsLoading, setListsLoading] = useState(true);

  const { error } = useQuery(GET_USER_LISTS, {
    variables: { userID: authData.id },
    onCompleted: async (data) => {
      returnedData = data.get_user_lists;
      if (returnedData) await updateLists(returnedData);
      setListsLoading(false);
    },
  });
  if (listsLoading) return <Loading />;
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
          unmountOnBlur={true}
          options={{
            animationEnabled: false,
          }}
        />
      )}

      <Stack.Screen name="groceryList" component={GroceryListScreen} />
      {creatingList ? (
        <>
          <Stack.Screen name="nameList" component={NameListScreen} />
          <Stack.Screen name="code" component={CodeScreen} />
        </>
      ) : null}
    </Stack.Navigator>
  );
}
