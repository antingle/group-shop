const { UserInputError } = require("apollo-server-errors");

const List = require("../models/list");
const { create_validation, join_validation } = require("../util/validation");

module.exports = {
  Query: {
    get_list: () => {},
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
       * 2) Verify existence in database
       * 3) Add new name to the members in list
       * 4) Update the database
       */
      const { errors, valid } = await join_validation(name, code);
      if (!valid) throw new UserInputError("Join Error", errors);

      const list = await List.findOne({ code });
      list.members.push(name);
      const res = await list.save();

      return {
        id: res._id,
        ...res._doc,
      };
    },
  },
};
