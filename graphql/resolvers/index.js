const list_resolvers = require("./list_resolvers");
const item_resolvers = require("./item_resolvers");
const user_resolvers = require("./user_resolvers");

module.exports = {
  Query: {
    ...user_resolvers.Query,
    //...list_resolvers.Query,
  },
  Mutation: {
    //...item_resolvers.Mutation,
    ...user_resolvers.Mutation,
    ...list_resolvers.Mutation,
  },
};
