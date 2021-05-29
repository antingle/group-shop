import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { ApolloClient, ApolloProvider, split, HttpLink } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { WebSocketLink } from "@apollo/client/link/ws";
import CreateOrJoinScreen from "./screens/CreateOrJoinScreen";
import NameScreen from "./screens/NameScreen";
import ListScreen from "./screens/ListScreen";
import NameListScreen from "./screens/NameListScreen";
import CodeScreen from "./screens/CodeScreen";
import GroceryListScreen from "./screens/GroceryListScreen";
import FirstScreen from "./screens/FirstScreen";
import CreateAccountScreen from "./screens/CreateAccountScreen";
import SignInScreen from "./screens/SignInScreen";
import SplashScreen from "./screens/SplashScreen";
import { cache } from "./graphql/cache";
import { getStorageData } from "./storage";

export default function App() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [auth, setAuth] = React.useState(false);
  const [hasLists, setHasLists] = React.useState(false);
  const [userID, setUserID] = React.useState(null);

  const Stack = createStackNavigator();

  const httpLink = new HttpLink({
    uri: "http://192.168.1.110:5000/graphql",
  });

  const wsLink = new WebSocketLink({
    uri: "ws://localhost:5000/subscriptions",
    options: {
      reconnect: true,
    },
  });

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      );
    },
    wsLink,
    httpLink
  );

  const client = new ApolloClient({
    link: splitLink,
    cache: cache,
  });

  // check user async storage
  getStorageData("@user")
    .then((data) => {
      if (data) {
        setAuth(true);
        setUserID(data.id);
        console.log("User:", data.screen_name);
        setIsLoading(false);
      }
    })
    .catch((e) => console.log("No data for user", e));

  // check lists async storage
  getStorageData("@lists")
    .then((data) => {
      if (data != null && data.length > 0) setHasLists(true);
      console.log("Number of lists:", data.length);
      setIsLoading(false);
    })
    .catch((e) => console.log("No data in lists", e));

  if (isLoading) return <SplashScreen />;

  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          {!auth ? (
            <>
              <Stack.Screen name="firstScreen" component={FirstScreen} />
              <Stack.Screen
                name="createAccount"
                component={CreateAccountScreen}
              />
              <Stack.Screen name="signIn" component={SignInScreen} />
              <Stack.Screen name="name" component={NameScreen} />
            </>
          ) : (
            <>
              {!hasLists ? (
                <Stack.Screen
                  name="createOrJoin"
                  component={CreateOrJoinScreen}
                />
              ) : (
                <Stack.Screen
                  name="lists"
                  component={ListScreen}
                  initialParams={{ userID }}
                  options={{
                    animationEnabled: false,
                  }}
                />
              )}

              <Stack.Screen name="nameList" component={NameListScreen} />
              <Stack.Screen name="code" component={CodeScreen} />
              <Stack.Screen name="groceryList" component={GroceryListScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </ApolloProvider>
  );
}
