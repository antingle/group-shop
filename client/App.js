import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import CreateOrJoinScreen from "./screens/CreateOrJoinScreen";
import NameScreen from "./screens/NameScreen";
import ListScreen from "./screens/ListScreen";
import NameListScreen from "./screens/NameListScreen";
import CodeScreen from "./screens/CodeScreen";
import GroceryListScreen from "./screens/GroceryListScreen";

export default function App() {
  const Stack = createStackNavigator();

  const client = new ApolloClient({
    uri: "localhost:5000",
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="createOrJoin" component={CreateOrJoinScreen} />
          <Stack.Screen name="nameList" component={NameListScreen} />
          <Stack.Screen name="code" component={CodeScreen} />
          <Stack.Screen name="name" component={NameScreen} />
          <Stack.Screen name="lists" component={ListScreen} />
          <Stack.Screen name="groceryList" component={GroceryListScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ApolloProvider>
  );
}
