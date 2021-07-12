import React, { useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ListScreen from "../screens/ListScreen";
import NameListScreen from "../screens/NameListScreen";
import CodeScreen from "../screens/CodeScreen";
import ListDetailScreen from "../screens/ListDetailScreen";
import useAuth from "../hooks/useAuth";
import { useQuery } from "@apollo/client";
import { GET_USER_LISTS } from "../graphql/graphql";
import Loading from "../screens/Loading";
import { StyleSheet } from "react-native";
import { colors } from "../other/colors";
import useList from "../hooks/useList";
import JoiningScreen from "../screens/JoiningScreen";

export default function AppStack() {
  const Stack = createStackNavigator();
  const { authData } = useAuth();
  const { creatingList, updateLists, currentListID } = useList();
  const [listsLoading, setListsLoading] = useState(true);

  const { error } = useQuery(GET_USER_LISTS, {
    variables: { userID: authData.id },
    onCompleted: async (data) => {
      let returnedData = data.get_user_lists;
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
      <Stack.Screen name="join" component={JoiningScreen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.background,
  },
});
