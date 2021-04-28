const user_resolvers = require("./user_resolvers");
const list_resolvers = require("./list_resolvers");
const item_resolvers = require("./item_resolvers");

module.exports = {
  Query: {
    ...user_resolvers.Query,
    ...list_resolvers.Query,
  },
  Mutation: {
    ...user_resolvers.Mutation,
    ...list_resolvers.Mutation,
    ...item_resolvers.Mutation,
  },
  Subscription: {
    update: {
      subscribe: (_, { code }, { pubsub }) => pubsub.asyncIterator(code),
    },
  },
};
