const { UserInputError } = require("apollo-server-errors");

const List = require("../../models/list");
const { create_validation, join_validation } = require("../../util/validation");

module.exports = {
  Query: {
    get_list: async (_, { id }) => {
      // Get the list from the database and check to see if it exists
      const list = await List.findById(id);
      if (!list) throw new Error("List not found");

      return {
        id: list._id,
        ...list._doc,
      };
    },
  },
  Mutation: {
    create_list: async (_, { list_name, name }) => {
      // Input validation
      const { errors, valid } = create_validation(list_name, name);
      if (!valid) throw new UserInputError("Create Error", errors);

      // generates a unique 4-digit code
      do {
        var code = Math.floor(Math.random() * (100000 - 10000)) + 10000;
        var invalid = await List.findOne({ code: code.toString() });
      } while (invalid);

      // saves the list to the database
      const list = await new List({
        list_name,
        code,
        members: [name],
        items: [],
        createdAt: new Date().toISOString(),
      }).save();

      return {
        id: list._id,
        ...list._doc,
      };
    },
    join_list: async (_, { name, code }, { pubsub }) => {
      // Input validation
      const { errors, valid } = await join_validation(name, code);
      if (!valid) throw new UserInputError("Join Error", errors);

      // Update the database with the new member
      const list = await List.findOne({ code });
      list.members.push(name);
      const updated_list = await list.save();

      pubsub.publish(code, {
        user_added: `${name} has joined`,
      });

      return {
        id: updated_list._id,
        ...updated_list._doc,
      };
    },
    leave_list: async (_, { name, id }) => {
      // finds the list and makes sure it still exists
      const list = await List.findById(id);
      if (!list) throw new Error("List not found");

      // removes the member from the members array
      const index = list.members.indexOf(name);
      list.members.splice(index, 1);

      // updates the list in the database
      const res = await list.save();

      if (!res) return "Successfully left the list";
      else return "Failed to leave list";
    },
    delete_list: async (_, { id }) => {
      if (!List.findById(id)) throw new Error("List not found");

      const res = await List.findByIdAndDelete(id, (err) => {
        if (err) throw new Error("Could not delete list", err);
      });

      if (!res) return "Successfully deleted the list";
      else return "Failed to delete the list";
    },
  },
  Subscription: {
    user_added: {
      subscribe: (_, { code }, { pubsub }) => pubsub.asyncIterator(code),
    },
  },
};
