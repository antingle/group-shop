const { UserInputError } = require("apollo-server-errors");

const List = require("../../models/list");
const User = require("../../models/user");
const { list_validation } = require("../../util/validation");

module.exports = {
  Mutation: {
    create_list: async (_, { list_name, id }) => {
      // input validation
      const { errors, valid } = await list_validation.creation(list_name, id);
      if (!valid) throw new UserInputError("List Creation Error", { errors });

      // generate a 5-digit join code
      do {
        var code = Math.floor(Math.random() * (100000 - 10000)) + 10000;
        var invalid = await List.findOne({ code: code.toString() });
      } while (invalid);

      // gets the user's screen name to add to the members array
      const { screen_name } = await User.findById(id);

      // creates a new list and saves it to the database
      const list = await new List({
        list_name,
        code,
        members: [screen_name],
        items: [],
        created: new Date().toISOString(),
      }).save();

      return {
        id: list._id,
        ...list._doc,
      };
    },
    join_list: async (_, { code, id }) => {
      // input validation
      const { errors, valid } = await list_validation.join(code, id);
      if (!valid) throw new UserInputError("List Join Error", { errors });

      // adds the user to the members array in the list and updates the database
      const list = await List.findOne({ code });
      const user = await User.findById(id);
      list.members.push(user.screen_name);
      list.save();

      return {
        id: list._id,
        ...list._doc,
      };
    },
    leave_list: async (_, { listID, userID }) => {
      try {
        const list = await List.findById(listID);
        const { screen_name } = await User.findById(userID);

        // finds the index of the leaving member, removes them, and updates the database
        const index = list.members.indexOf(screen_name);
        list.members.splice(index, 1);
        list.save();

        return "Successfully left the list";
      } catch (err) {
        throw new Error("Leave Error", err);
      }
    },
    delete_list: async (_, { id }) => {
      try {
        await List.findByIdAndDelete(id);
        return "Successfully deleted the list";
      } catch (err) {
        throw new Error("List Deletion Error", err);
      }
    },
  },
};
