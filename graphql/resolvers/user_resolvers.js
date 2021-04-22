const { UserInputError } = require("apollo-server-errors");
const bcrypt = require("bcryptjs");

const User = require("../../models/user");
const {
  validate_registration_info,
  validate_login_info,
} = require("../../util/validation");

module.exports = {
  Query: {
    get_every_user: async () => {
      try {
        const users = await User.find();
        return users;
      } catch (err) {
        throw new Error("Every User Query Error", err);
      }
    },
    get_user: async (_, { id }) => {
      try {
        const user = await User.findById(id);
        return {
          id: user._id,
          ...user._doc,
        };
      } catch (err) {
        throw new Error("User Query Error", err);
      }
    },
  },
  Mutation: {
    register: async (
      _,
      { info: { email, password, confirm_password, screen_name } }
    ) => {
      // input validation
      const { errors, valid } = await validate_registration_info(
        email,
        password,
        confirm_password,
        screen_name
      );
      if (!valid) throw new UserInputError("Registration Error", { errors });

      // password hashing
      password = await bcrypt.hash(password, 12);

      // adds the user to the database
      const user = await new User({
        email,
        password,
        screen_name,
        lists: [],
        join_date: new Date().toISOString(),
      }).save();

      return {
        id: user._id,
        ...user._doc,
      };
    },
    login: async (_, { email, password }) => {
      // input validation
      const { errors, valid } = await validate_login_info(email, password);
      if (!valid) throw new UserInputError("Login Error", { errors });

      const user = await User.findOne({ email });

      return {
        id: user._id,
        ...user._doc,
      };
    },
    create_temp_user: async (_, { screen_name }) => {
      // input validation
      if (screen_name.trim() === "") {
        const errors = { screen_name: "Screen name must not be empty" };
        throw new UserInputError("Temp Creation Error", { errors });
      }

      const user = await new User({
        email: null,
        password: null,
        screen_name,
        lists: [],
        join_date: "temp",
      }).save();

      return {
        id: user._id,
        ...user._doc,
      };
    },
    delete_user: async (_, { id }) => {
      try {
        await User.findByIdAndDelete(id);
        return "Successfully deleted account";
      } catch (err) {
        throw new Error("Account Deletion Error", err);
      }
    },
  },
};
