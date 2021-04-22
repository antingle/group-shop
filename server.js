const { ApolloServer, PubSub } = require("apollo-server");
const mongoose = require("mongoose");

const { URI } = require("./config");
const typeDefs = require("./graphql/type_defs");
const resolvers = require("./graphql/resolvers");

// Subscriptions
const pubsub = new PubSub();

const PORT = process.env.PORT | 5000;

// Server start
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req, pubsub }),
});

// database connection
mongoose
  .connect(URI, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => server.listen({ port: PORT }))
  .then((res) => {
    console.log(`server listening on ${res.url}`);
  })
  .catch((err) => {
    console.log(err);
  });
