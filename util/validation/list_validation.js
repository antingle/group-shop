const User = require("../../models/user");
const List = require("../../models/list");
const { get_user_index } = require("../../util/get_index");

module.exports = async ({
  list_name = null,
  listID = null,
  userID = null,
  code = null,
  method = "no-user-check",
}) => {
  const errors = {};

  // makes sure the list name is valid
  if (list_name != null)
    if (list_name.trim() === "")
      errors.list_name = "List name must not be empty";

  // makes sure that the id is valid and exists in the database
  if (userID != null) {
    if (userID === "") errors.userID = "User id must not be empty";
    else {
      var user = await User.findById(userID);
      if (!user) errors.userID = "User with that id not found";
    }
  }

  // makes sure that the code is valid and exists in the database
  if (code != null) {
    if (code.trim() === "") errors.code = "Code must not be empty";
    else {
      var list = await List.findOne({ code });
      if (!list) errors.code = "List not found";
    }
  }

  if (listID != null) {
    if (listID === "") errors.listID = "List ID must not be empty";
    else {
      var list = await List.findById(listID);
      if (!list) errors.listID = "List with that ID not found";
    }
  }

  switch (method) {
    case "no-user-check":
      return {
        valid: Object.keys(errors).length < 1,
        errors,
        list: list ? list : null,
        user: user ? user : null,
      };
    case "user-join":
      var user_index = get_user_index(list, userID);
      if (user_index != -1)
        errors.userID = "User is already a part of this list";
      break;
    case "user-leave":
      var user_index = get_user_index(list, userID);
      if (user_index == -1) errors.userID = "User is not a part of the list";
      break;
    default:
      errors.method = "Invalid method";
  }

  return {
    valid: Object.keys(errors).length < 1,
    errors,
    list: list ? list : null,
    user: user ? user : null,
    user_index: user_index != -1 ? user_index : null,
  };
};
