const { UserInputError } = require("apollo-server-errors");

const List = require("../../models/list");
const { create_validation, join_validation } = require("../../util/validation");

module.exports = {
  Query: {
    get_list: async (_, { id }) => {
      /*
       * 1) Find the list in the database
       * 2) Return it
       */

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
    create_list: async (_, { name }) => {
      /*
       * 1) Input validation
       * 2) Generate unique code
       * 3) Save the list to the database
       */

      // Input validation
      const { errors, valid } = create_validation(name);
      if (!valid) throw new UserInputError("Create Error", errors);

      // generates a unique 4-digit code
      do {
        var code = Math.floor(Math.random() * (10000 - 1000)) + 1000;
        var invalid = await List.findOne({ code: code.toString() });
      } while (invalid);

      // saves the list to the database
      const list = await new List({
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
    join_list: async (_, { name, code }) => {
      /*
       * 1) Input validation
       * 2) Update the list of memebrs in the database
       */

      // Input validation
      const { errors, valid } = await join_validation(name, code);
      if (!valid) throw new UserInputError("Join Error", errors);

      // Update the database with the new member
      const list = await List.findOne({ code });
      list.members.push(name);
      const updated_list = await list.save();

      return {
        id: updated_list._id,
        ...updated_list._doc,
      };
    },
    leave_list: async (_, { name, id }) => {
      /*
       * 1) Find the list in the database
       * 2) Remove the name from the members array
       * 3) Update the database
       */

      // finds the list and makes sure it still exists
      const list = await List.findById(id);
      if (!list) throw new Error("List not found");

      // removes the member from the members array
      const index = list.members.indexOf(name);
      list.members.splice(index, 1);

      // updates the list in the database
      await list.save().catch((err) => {
        throw new Error("Unable to leave list", err);
      });

      return "Successfully left the list";
    },
  },
};
