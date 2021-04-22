const { UserInputError } = require("apollo-server-errors");

const List = require("../../models/list");
const { add_validation } = require("../../util/validation");

module.exports = {
  Mutation: {
    add_item: async (_, { name, amount, id }) => {
      // Input validation
      const { errors, valid } = add_validation(name);
      if (!valid) throw new UserInputError("Item Addition Error", errors);

      // Finds the correct list in the database
      const list = await List.findById(id);
      if (!list) throw new Error("List not found");

      // Increases the amount of a pre-existing item
      let isNewItem = true;
      for (let i = 0; i < list.items.length; i++) {
        if (list.items[i].name === name) {
          list.items[i].amount += amount;
          isNewItem = false;
          break;
        }
      }

      // Adds a new item to the list if it didn't already exist
      if (isNewItem) {
        const item = {
          name,
          amount,
          member: null,
          purchased: false,
        };
        list.items.push(item);
      }

      // Updates the list in the database
      const updated_list = await list.save();

      return {
        id: updated_list._id,
        ...updated_list._doc,
      };
    },
    remove_item: async (_, { name, amount, id }) => {
      // finds the list in the database
      const list = await List.findById(id);
      if (!list) throw new Error("List not found");

      // finds the index of the specified item
      for (let i = 0; i < list.items.length; i++) {
        if (list.items[i].name == name) {
          var index = i;
          break;
        }
      }

      // subtracts the amount and removes it from teh database if there are none left in the list
      list.items[index].amount -= amount;
      if (list.items[index].amount <= 0) list.items.splice(index, 1);

      // updates the database
      const updated_list = await list.save();

      return {
        id: updated_list._id,
        ...updated_list._doc,
      };
    },
  },
};
