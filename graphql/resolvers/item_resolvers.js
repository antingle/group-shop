const { UserInputError } = require("apollo-server-errors");

const { item_validation } = require("../../util/validation");
const List = require("../../models/list");
const User = require("../../models/user");

module.exports = {
  Mutation: {
    add_item: async (_, { name, listID }) => {
      // input validation
      const { errors, valid } = await item_validation.add(name, listID);
      if (!valid) throw new UserInputError("Add Item Error", { errors });

      // adds the item to the list and updates the database
      const list = await List.findById(listID);
      list.items.push({
        name,
        member: null,
        purchased: false,
      });
      list.save();

      return {
        id: list._id,
        ...list._doc,
      };
    },
    remove_item: async (_, { name, listID }) => {
      // input validation
      const { errors, valid } = await item_validation.remove(name, listID);
      if (!valid) throw new UserInputError("Remove Item Error", { errors });

      // finds the index of the item, removes it, and updates the database
      const list = await List.findById(listID);
      const index = list.items.indexOf({ name });
      list.items.splice(index, 1);
      list.save();

      return {
        id: list._id,
        ...list._doc,
      };
    },
    claim_item: async (_, { name, listID, userID }) => {
      // input validation
      const { errors, valid } = await item_validation.claim(
        name,
        listID,
        userID
      );
      if (!valid) throw new UserInputError("Item Claim Error", { errors });

      const list = await List.findById(listID);
      const { screen_name } = await User.findById(userID);

      // gets the index of the item, updates its member key, and saves it to the database
      const index = list.items.indexOf({ name });
      list.items[index].member = screen_name;
      list.save();

      return {
        id: list._id,
        ...list._doc,
      };
    },
    unclaim_item: async (_, { name, listID, userID }) => {
      // input validation
      const { errors, valid } = await item_validation.unclaim(
        name,
        listID,
        userID
      );
      if (!valid) throw new UserInputError("Item Unclaim Error", { errors });

      //   const list = await List.findById(listID);
      // QUESTIONS: do we want multiple people to be able to claim the same item?
    },
  },
};
