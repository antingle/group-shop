import React from "react";
import { ApolloClient, ApolloProvider, split, HttpLink } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { WebSocketLink } from "@apollo/client/link/ws";
import { cache } from "./graphql/cache";
import { AuthProvider } from "./contexts/AuthContext";
import Router from "./navigation/Router";

export default function App() {
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
  // getStorageData("@user")
  //   .then((data) => {
  //     if (data) {
  //       setAuth(true);
  //       setUserID(data.id);
  //       console.log("User:", data.screen_name);
  //       setIsLoading(false);
  //     }
  //   })
  //   .catch((e) => {
  //     setIsLoading(false);
  //     console.log("No data for user", e);
  //   });

  // if (isLoading) return <SplashScreen />;

  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </ApolloProvider>
  );
}
