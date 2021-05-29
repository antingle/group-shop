const { UserInputError } = require("apollo-server-errors");
const bcrypt = require("bcryptjs");

const User = require("../../../models/user");
const List = require("../../../models/list");
const { user_validation } = require("../../../util/validation");
const { get_user_index, get_list_index } = require("../../../util/get_index");

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

    return user;
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
  delete_user: async (_, { userID }, { pubsub }) => {
    /*
     * 1) DELETE THE USER
     * 2) Seperate the owned and unowned lists
     * 3) For every user in the owned lists, remove the list from the user's list array *exluding the owner*
     * 4) For every list in the unowned lists, remove the user from the list members array and send an update
     */

    try {
      const deleted_user = await User.findByIdAndDelete(userID);

      // seperates the deleted user's lists into owned and unowned
      const owned_lists = [];
      const unowned_lists = [];

      for (let i = 0; i < deleted_user.lists.length; i++) {
        if (deleted_user.lists[i].owned)
          owned_lists.push(deleted_user.lists[i]);
        else unowned_lists.push(deleted_user.lists[i]);
      }

      // For every user in every owned list *exluding the owner*, removes the list from that user's list array
      owned_lists.forEach(async (user_list) => {
        const list = await List.findById(user_list._id);

        list.members.forEach(async (member) => {
          if (member._id != deleted_user._id) {
            const user = await User.findById(member._id);

            const list_index = get_list_index(user, list._id);

            user.lists.splice(list_index, 1);
            await user.save();
          }
        });
      });

      // For every unowned list, removes the deleted user from that list
      unowned_lists.forEach(async (user_list) => {
        const list = await List.findById(user_list._id);

        const user_index = get_user_index(list, deleted_user._id);

        list.members.splice(user_index, 1);
        await list.save();
      });

      return {
        id: deleted_user._id,
        ...deleted_user._doc,
      };
    } catch (err) {
      throw new Error("Account Deletion Error", err);
    }
  },
};
