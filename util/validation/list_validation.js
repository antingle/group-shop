const User = require("../../models/user");
const List = require("../../models/list");

module.exports = {
  creation: async (list_name, userID) => {
    const errors = {};

    // makes sure the list name is valid
    if (list_name.trim() === "")
      errors.list_name = "List name must not be empty";

    // makes sure that the id is valid and exists in the database
    if (userID === "") errors.userID = "User id must not be empty";
    else {
      const user = await User.findById(userID);
      if (!user) errors.userID = "User with that id not found";
    }

    return {
      errors,
      valid: Object.keys(errors).length < 1,
    };
  },
  join: async (code, userID) => {
    const errors = {};

    // makes sure that the code is valid and exists in the database
    if (code.trim() === "") errors.code = "Code must not be empty";
    else {
      var list = await List.findOne({ code });
      if (!list) errors.code = "List not found";
    }

    // makes sure that the id is valid, exists in the database, and that they haven't joined the list already
    if (userID === "") errors.userID = "User id must not be empty";
    else {
      const user = await User.findById(userID);
      if (!user) errors.userID = "User with that id not found";

      const index = list.members.indexOf(user.screen_name);
      if (index != -1) errors.userID = "User is already a member of this list";
    }

    return {
      errors,
      valid: Object.keys(errors).length < 1,
    };
  },
};
