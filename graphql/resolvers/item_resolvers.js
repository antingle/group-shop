const { UserInputError } = require("apollo-server-errors");

const { item_validation } = require("../../util/validation");

module.exports = {
  Mutation: {
    add_item: async (_, { name, listID, userID }, { pubsub }) => {
      // input validation
      const { valid, errors, list, user } = await item_validation({
        name,
        listID,
        userID,
      });
      if (!valid) throw new UserInputError("Add Item Error", { errors });

      // adds the item to the list and updates the database
      list.items.push({
        name,
        member: null,
        purchased: false,
      });
      await list.save();

      pubsub.publish(list.code, {
        item_updates: {
          type: "add",
          affector: user.screen_name,
          item: {
            id: list.items[list.items.length - 1]._id,
            ...list.items[list.items.length - 1]._doc,
          },
        },
      });

      return {
        id: list._id,
        ...list._doc,
      };
    },
    remove_item: async (_, { listID, itemID, userID }, { pubsub }) => {
      // input validation
      const { valid, errors, list, user, item_index } = await item_validation({
        listID,
        itemID,
        userID,
      });
      if (!valid) throw new UserInputError("Remove Item Error", { errors });

      const item = list.items[item_index];

      list.items.splice(item_index, 1);
      await list.save();

      pubsub.publish(list.code, {
        item_updates: {
          type: "remove",
          affector: user.screen_name,
          item: {
            id: item._id,
            ...item._doc,
          },
        },
      });

      return {
        id: list._id,
        ...list._doc,
      };
    },
    claim_item: async (_, { listID, itemID, userID, method = "claim" }) => {
      // input validation
      const { errors, valid, list, user, item_index } = await item_validation({
        listID,
        itemID,
        userID,
        method,
      });
      if (!valid) throw new UserInputError("Item Claim Error", { errors });

      if (method == "claim") list.items[item_index].member = user.screen_name;
      else if (method == "unclaim") list.items[item_index].member = null;

      await list.save();

      pubsub.publish(list.code, {
        item_updates: {
          type: method == "claim" ? "claim" : "unclaim",
          affector: user.screen_name,
          item: {
            id: list.items[item_index]._id,
            ...list.items[item_index]._doc,
          },
        },
      });

      return {
        id: list._id,
        ...list._doc,
      };
    },
    purchase_item: async (
      _,
      { listID, itemID, userID, method = "purchase" },
      { pubsub }
    ) => {
      // input validation
      const { errors, valid, list, user, item_index } = await item_validation({
        listID,
        itemID,
        userID,
        method,
      });
      if (!valid) throw new UserInputError("Purchase Error", { errors });

      if (method == "purchase") list.items[item_index].purchased = true;
      else if (method == "unpurchase") list.items[item_index].purchased = false;

      await list.save();

      pubsub.publish(list.code, {
        item_updates: {
          type: method == "purchase" ? "purchase" : "unpurchase",
          affector: user.screen_name,
          item: {
            id: list.items[item_index]._id,
            ...list.items[item_index]._doc,
          },
        },
      });

      return {
        id: list._id,
        ...list._doc,
      };
    },
  },
  Subscription: {
    item_updates: {
      subscribe: (_, { code }, { pubsub }) => pubsub.asyncIterator(code),
    },
  },
};
