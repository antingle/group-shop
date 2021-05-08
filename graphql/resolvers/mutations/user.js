const { UserInputError } = require("apollo-server-errors");
const bcrypt = require("bcryptjs");

const User = require("../../../models/user");
const { user_validation } = require("../../../util/validation");

module.exports = {
  register: async (
    _,
    { info: { email, password, confirm_password, screen_name } }
  ) => {
    // validation
    const { valid, errors } = await user_validation({
      method: "register",
      email,
      password,
      confirm_password,
      screen_name,
    });
    if (!valid) throw new UserInputError("Registration Error", { errors });

    // hash the password BEFORE saving to the database
    password = await bcrypt.hash(password, 12);

    // adds the new user to the database
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
    // validation
    const { valid, errors, user } = await user_validation({
      method: "login",
      email,
      password,
    });
    if (!valid) throw new UserInputError("Login Error", { errors });

    return user.lists;
  },
  create_temp_user: async (_, { screen_name }) => {
    // validation
    const { valid, errors } = await user_validation({
      method: "register",
      screen_name,
    });
    if (!valid) throw new UserInputError("Temp Creation Error", { errors });

    // adds the temp user to the database
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
  delete_user: async (_, { userID }) => {
    try {
      const deleted_user = await User.findByIdAndDelete(userID);
      return {
        id: deleted_user._id,
        ...deleted_user._doc,
      };
    } catch (err) {
      throw new Error("Account Deletion Error", err);
    }
  },
};
