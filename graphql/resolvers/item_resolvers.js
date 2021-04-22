const { UserInputError } = require("apollo-server-errors");

const List = require("../../models/list");
const { add_validation } = require("../../util/validation");

module.exports = {
  Mutation: {
    add_item: async (_, { name, id }) => {
      /*
       * 1) Validate the input
       * 2) Create a new item
       * 3) Add it to the list
       */

      // Input validation
      const { errors, valid } = add_validation(name);
      if (!valid) throw new UserInputError("Item Addition Error", errors);

      // Finds the correct list in the database
      const list = await List.findById(id);
      if (!list) throw new Error("List not found");

      // creates a new item and adds it into the list
      const item = {
        name,
        member: null,
        purchased: false,
      };
      list.items.push(item);

      // Updates the list in the database
      const updated_list = await list.save();

      return {
        id: updated_list._id,
        ...updated_list._doc,
      };
    },
    remove_item: async (_, { name, id }) => {
      // finds the list in the database
      const list = await List.findById(id);
      if (!list) throw new Error("List not found");

      // removes item from the list
      const index = list.items.indexOf(name);
      list.items.splice(index, 1);

      // updates the database
      const updated_list = await list.save();

      return {
        id: updated_list._id,
        ...updated_list._doc,
      };
    },
  },
};
