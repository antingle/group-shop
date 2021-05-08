module.exports = {
  Subscription: {
    member_updates: {
      subscribe: (_, { code }, { pubsub }) => pubsub.asyncIterator(code),
    },
    item_updates: {
      subscribe: (_, { code }, { pubsub }) => pubsub.asyncIterator(code),
    },
  },
};
