import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
  split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { WebSocketLink } from "@apollo/client/link/ws";
import { CssBaseline } from "@material-ui/core";
import { getMainDefinition } from "@apollo/client/utilities";
import { ThemeProvider } from "@material-ui/styles";
import "core-js";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { SubscriptionClient } from "subscriptions-transport-ws";
//import { createUploadLink } from "apollo-upload-client";
import App from "./App";
import theme from "./components/theme";
import "./i18n";
import "./index.css";
// import logoutUser from "./helper/logoutUser";

const GRAPHQL_ENDPOINT = "localhost:4000/graphql";
//const uploadLink = createUploadLink({ uri: `http://${GRAPHQL_ENDPOINT}` });
const token1 = localStorage.getItem("token");
const subsClient = new SubscriptionClient(`ws://${GRAPHQL_ENDPOINT}`, {
  reconnect: true,
  connectionParams: {
    authorization: token1 ? `Bearer ${token1}` : null,
  },
});
const wsLink = new WebSocketLink(subsClient);
const httpLink = createHttpLink({
  uri: `http://${GRAPHQL_ENDPOINT}`,
});
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem("token");
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
  authLink.concat(httpLink)
);

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  operation.setContext(({ headers = {} }: { headers: any }) => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : null,
      },
    };
  });
  return forward(operation);
});

const cache = new InMemoryCache();

const apolloLink = ApolloLink.from([
  onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      if (
        graphQLErrors.some(
          (error) =>
            error.extensions && error.extensions.code === "UNAUTHENTICATED"
        )
      ) {
        // logoutUser(client);
      }
    }
    if (networkError) {
      // logoutUser();
    }
  }),
  authMiddleware,
  splitLink,
]);
const client = new ApolloClient({
  link: apolloLink,
  cache,
});
const root = document.getElementById("root");
if (root !== null)
  ReactDOM.render(
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </ApolloProvider>,
    root
  );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
