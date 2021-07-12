import React from "react";
import { ApolloClient, ApolloProvider, split, HttpLink } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { WebSocketLink } from "@apollo/client/link/ws";
import { cache } from "./graphql/cache";
import { AuthProvider } from "./contexts/AuthContext";
import Router from "./navigation/Router";
import { UIManager } from "react-native";

export default function App() {
  const httpLink = new HttpLink({
    uri: "https://group-shop.herokuapp.com/graphql",
  });

  const wsLink = new WebSocketLink({
    uri: "ws://group-shop.herokuapp.com/subscriptions",
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

  // To allow Android to use LayoutAnimation
  if (Platform.OS === "android") {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </ApolloProvider>
  );
}
