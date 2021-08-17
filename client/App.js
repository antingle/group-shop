import React from "react";
import { ApolloClient, ApolloProvider, split, HttpLink } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { WebSocketLink } from "@apollo/client/link/ws";
import { cache } from "./graphql/cache";
import { AuthProvider } from "./contexts/AuthContext";
import Router from "./navigation/Router";
import { SchemeProvider } from "./contexts/SchemeContext";
import { setContext } from "@apollo/client/link/context";

export default function App() {
  const [token, setToken] = React.useState(null); // stores token

  const httpLink = new HttpLink({
    uri: "https://group-shop-dev.herokuapp.com/graphql",
    credentials: "include",
  });

  const wsLink = new WebSocketLink({
    uri: "ws://group-shop-dev.herokuapp.com/subscriptions",
    options: {
      reconnect: true,
    },
  });

  const authLink = setContext((_, { headers }) => {
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
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
    link: authLink.concat(splitLink),
    cache: cache,
  });

  return (
    <ApolloProvider client={client}>
      <AuthProvider setToken={setToken}>
        <SchemeProvider>
          <Router />
        </SchemeProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}
