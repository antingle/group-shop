const { UserInputError } = require("apollo-server-errors");

const List = require("../../models/list");
const User = require("../../models/user");
const { item_validation } = require("../../util/validation");
const get_index = require("../../util/get_index");

module.exports = {
  Mutation: {
    add_item: async (_, { name, listID, userID }, { pubsub }) => {
      // input validation
      const { errors, valid } = await item_validation.add(name, listID, userID);
      if (!valid) throw new UserInputError("Add Item Error", { errors });

      // adds the item to the list and updates the database
      const list = await List.findById(listID);
      list.items.push({
        name,
        member: null,
        purchased: false,
      });
      list.save();

      const { screen_name } = await User.findById(userID);

      pubsub.publish(list.code, {
        update: `${screen_name} added ${name} to the list`,
      });

      return {
        id: list._id,
        ...list._doc,
      };
    },
    remove_item: async (_, { listID, itemID, userID }, { pubsub }) => {
      // input validation
      const { errors, valid } = await item_validation.remove(
        listID,
        itemID,
        userID
      );
      if (!valid) throw new UserInputError("Remove Item Error", { errors });

      // finds the index of the item, removes it, and updates the database
      const list = await List.findById(listID);
      const index = get_index(list, itemID);
      const name = list.items[index].name;
      list.items.splice(index, 1);
      list.save();

      const { screen_name } = await User.findById(userID);

      pubsub.publish(list.code, {
        update: `${screen_name} removed ${name} from the list`,
      });

      return {
        id: list._id,
        ...list._doc,
      };
    },
    claim_item: async (_, { listID, itemID, userID, method = "claim" }) => {
      // input validation
      const { errors, valid } = await item_validation.claim(
        listID,
        itemID,
        userID,
        method
      );
      if (!valid) throw new UserInputError("Item Claim Error", { errors });

      const list = await List.findById(listID);

      // sets the user to null if there was no specified userID
      const { screen_name } = await User.findById(userID);
      const index = get_index(list, itemID);

      if (method == "claim") {
        list.items[index].member = screen_name;
        pubsub.publish(list.code, {
          update: `${screen_name} has claimed ${list.items[index].name}`,
        });
      } else {
        list.items[index].member = null;
        pubsub.publish(list.code, {
          update: `${screen_name} has unclaimed ${list.items[index].name}`,
        });
      }

      list.save();

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
      const { errors, valid } = await item_validation.purchase(
        listID,
        itemID,
        userID,
        method
      );
      if (!valid) throw new UserInputError("Purchase Error", { errors });

      const list = await List.findById(listID);
      const index = get_index(list, itemID);

      const { screen_name } = await User.findById(userID);

      if (method == "purchase") {
        list.items[index].purchased = true;
        pubsub.publish(list.code, {
          update: `${screen_name} has purchased ${list.items[index].name}`,
        });
      } else {
        list.items[index].purchased = false;
        pubsub.publish(list.code, {
          update: `${screen_name} has unpurchased ${list.items[index].name}`,
        });
      }

      list.save();

      return {
        id: list._id,
        ...list._doc,
      };
    },
  },
};
