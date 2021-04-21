const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");

const { URI } = require("./config");
const typeDefs = require("./graphql/type_defs");
const resolvers = require("./graphql/resolvers");

const PORT = process.env.PORT | 5000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
});

mongoose
  .connect(URI, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => server.listen({ port: PORT }))
  .then((res) => {
    console.log(`server listening on ${res.url}`);
  })
  .catch((err) => {
    console.log(err);
  });
