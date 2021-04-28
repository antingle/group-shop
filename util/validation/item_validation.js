const List = require("../../models/list");
const User = require("../../models/user");
const get_index = require("../../util/get_index");

module.exports = {
  add: async (name, listID) => {
    const errors = {};

    // makes sure the name is valid
    if (name.trim() === "") errors.name = "Name must not be empty";

    // make sure the list ID is valid and exists in the database
    if (listID === "") errors.listID = "List ID must not be empty";
    else {
      const list = await List.findById(listID);
      if (!list) errors.listID = "List with that ID not found";
    }

    return {
      errors,
      valid: Object.keys(errors).length < 1,
    };
  },
  remove: async (listID, itemID) => {
    const errors = {};

    // make sure the list ID is valid, exists in the database, and has the item in it
    if (listID === "") errors.listID = "List ID must not be empty";
    else {
      var list = await List.findById(listID);
      if (!list) errors.listID = "List with that ID not found";
    }

    // makes sure the item ID is valid and exists in the list
    if (itemID === "") errors.itemID = "Item ID must not be empty";
    else if (list) {
      const index = get_index(list, itemID);
      if (index == -1) errors.itemID = "Item does not exist in the list";
    }

    return {
      errors,
      valid: Object.keys(errors).length < 1,
    };
  },
  claim: async (listID, itemID, method, userID) => {
    const errors = {};

    console.log(method);

    // make sure the list ID is valid, exists in the database, and has the item in it
    if (listID === "") errors.listID = "List ID must not be empty";
    else {
      var list = await List.findById(listID);
      if (!list) errors.listID = "List with that ID not found";
    }

    // makes sure the item ID is valid and exists in the list
    if (itemID === "") errors.itemID = "Item ID must not be empty";
    else if (list) {
      const index = get_index(list, itemID);
      if (index == -1) errors.itemID = "Item does not exist in the list";
    }

    if (method != "claim" && method != "unclaim")
      errors.method = "Invalid method";

    // returns early if the userID is null
    if (!userID) {
      return {
        errors,
        valid: Object.keys(errors).length < 1,
      };
    }

    // makes sure that the user ID is valid, exists in the database, and is part of the list
    if (userID === "") errors.userID = "User ID must not be empty";
    else {
      const user = await User.findById(userID);
      if (user) {
        const index = list.members.indexOf(user.screen_name);
        if (index == -1) errors.userID = "User is not apart of this list";
      } else errors.userID = "User with that ID not found";
    }

    return {
      errors,
      valid: Object.keys(errors).length < 1,
    };
  },
  purchase: async (listID, itemID, method) => {
    const errors = {};

    // make sure the list ID is valid, exists in the database, and has the item in it
    if (listID === "") errors.listID = "List ID must not be empty";
    else {
      var list = await List.findById(listID);
      if (!list) errors.listID = "List with that ID not found";
    }

    // makes sure the item ID is valid and exists in the list
    if (itemID === "") errors.itemID = "Item ID must not be empty";
    else if (list) {
      const index = get_index(list, itemID);
      if (index == -1) errors.itemID = "Item does not exist in the list";
    }

    if (method != "purchase" && method != "unpurchase")
      errors.method = "Invald method";

    return {
      errors,
      valid: Object.keys(errors).length < 1,
    };
  },
};
