const list_resolvers = require("./list_resolvers");
const item_resolvers = require("./item_resolvers");
const user_resolvers = require("./user_resolvers");

module.exports = {
  Query: {
    //...list_resolvers.Query,
    ...user_resolvers.Query,
  },
  Mutation: {
    //...list_resolvers.Mutation,
    //...item_resolvers.Mutation,
    ...user_resolvers.Mutation,
  },
};
