module.exports = {
  Subscription: {
    member_updates: {
      subscribe: (_, { listID }, { pubsub }) =>
        pubsub.asyncIterator(listID.toString()),
    },
    item_updates: {
      subscribe: (_, { listID }, { pubsub }) =>
        pubsub.asyncIterator(listID.toString()),
    },
  },
};
