const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");

const { BACKUP_URI } = require("../config");
const typeDefs = require("../graphql/type_defs");
const resolvers = require("../graphql/resolvers");

const PORT = process.env.PORT | 5001;

const backup_server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => ({
    req,
    res,
  }),
});

module.exports = {
  connect: async () => {
    mongoose
      .connect(BACKUP_URI, { useUnifiedTopology: true, useNewUrlParser: true })
      .then(backup_server.listen({ port: PORT }))
      .catch((err) => {
        console.log(`Error connecting to backup server: ${err}`);
      });
  },
  disconnect: async () => {
    mongoose.disconnect();
  },
};
