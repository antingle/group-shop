const List = require("../../models/list");
const User = require("../../models/user");

module.exports = {
  add: async (name, listID) => {
    const errors = {};

    // makes sure the name is valid
    if (name.trim === "") errors.name = "Name must not be empty";

    // make sure the list ID is valid, exists in the database, and does not already heave that item in it
    if (listID === "") errors.listID = "List ID must not be empty";
    else {
      const list = await List.findById(listID);
      if (!list) errors.listID = "List with that ID not found";

      const index = list.items.indexOf({ name });
      if (index != -1) errors.name = "Item already exists in the list";
    }

    return {
      errors,
      valid: Object.keys(errors).length < 1,
    };
  },
  remove: async (name, listID) => {
    const errors = {};

    // makes sure the name is valid
    if (name.trim === "") errors.name = "Name must not be empty";

    // make sure the list ID is valid, exists in the database, and has the item in it
    if (listID === "") errors.listID = "List ID must not be empty";
    else {
      const list = await List.findById(listID);
      if (!list) errors.listID = "List with that ID not found";

      const index = list.items.indexOf({ name });
      if (index == -1) errors.name = "Item does not exist in the list";
    }

    return {
      errors,
      valid: Object.keys(errors).length < 1,
    };
  },
  claim: async (name, listID, userID) => {
    const errors = {};

    // makes sure the name is valid
    if (name.trim === "") errors.name = "Name must not be empty";

    // make sure the list ID is valid, exists in the database, and has the item in it
    if (listID === "") errors.listID = "List ID must not be empty";
    else {
      var list = await List.findById(listID);
      if (!list) errors.listID = "List with that ID not found";

      const index = list.items.indexOf({ name });
      if (index == -1) errors.name = "Item does not exist in the list";
    }

    // makes sure that the user ID is valid, exists in the database, and is apart of the list
    if (userID === "") errors.userID = "User ID must not be empty";
    else {
      const user = await User.findById(userID);
      if (!user) errors.userID = "User with that ID not found";

      const index = list.members.indexOf(user.screen_name);
      if (index == -1) errors.userID = "User is not apart of this list";
    }

    return {
      errors,
      valid: Object.keys(errors).length < 1,
    };
  },
  unclaim: async (name, listID, userID) => {
    const errors = {};

    // makes sure the name is valid
    if (name.trim === "") errors.name = "Name must not be empty";

    // make sure the list ID is valid, exists in the database, and has the item in it
    if (listID === "") errors.listID = "List ID must not be empty";
    else {
      var list = await List.findById(listID);
      if (!list) errors.listID = "List with that ID not found";

      var index = list.items.indexOf({ name });
      if (index == -1) errors.name = "Item does not exist in the list";
    }

    // makes sure that the user ID is valid, exists in the database, and is apart of the list
    if (userID === "") errors.userID = "User ID must not be empty";
    else {
      const user = await User.findById(userID);
      if (!user) errors.userID = "User with that ID not found";

      const user_index = list.members.indexOf(user.screen_name);
      if (user_index == -1) errors.userID = "User is not apart of this list";

      if (index != -1) {
        if (list.items[index].member != user.screen_name)
          errors.userID = "User did not claim this item";
      }
    }

    return {
      errors,
      valid: Object.keys(errors).length < 1,
    };
  },
};
