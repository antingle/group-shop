const user_resolvers = require("./user_resolvers");
const item_resolvers = require("./item_resolvers");

module.exports = {
  Query: {
    ...user_resolvers.Query,
  },
  Mutation: {
    ...user_resolvers.Mutation,
    ...item_resolvers.Mutation,
  },
};
