const { UserInputError } = require("apollo-server-errors");
const bcrypt = require("bcryptjs");

const User = require("../../models/user");
const { validate_registration_info } = require("../../util/user_validation");

module_exports = {
  Query: {
    get_user: (_, { id }) => {},
  },
  Mutation: {
    register: async (
      _,
      { info: { email, password, confirm_password, screen_name } }
    ) => {
      /*
      // input validation
      const { errors, valid } = validate_registration_info(
        email,
        password,
        confirm_password,
        screen_name
      );
      if (!valid) throw new UserInputError("Registration Error", { errors });
        */
      const user = new User({
        email: "hello",
        password: "hello",
        screen_name: "hello",
        lists: ["item1", "item2", "item3"],
        join_date: new Date().toISOString,
      });

      return {
        id: "1234",
        ...user,
      };
    },
  },
};
