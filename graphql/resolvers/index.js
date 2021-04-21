const groceries = require("./grocery_resolvers");

module.exports = {
  Query: {
    ...groceries.Query,
  },
  Mutation: {
    ...groceries.Mutation,
  },
};
