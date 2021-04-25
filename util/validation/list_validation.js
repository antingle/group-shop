const User = require("../models/user");
const List = require("../models/list");

module.exports.creation = async (list_name, id) => {
  const errors = {};

  // makes sure the list name is valid
  if (list_name.trim() === "") errors.list_name = "List name must not be empty";

  // makes sure that the id is valid and exists in the database
  if (id === "") errors.id = "User id must not be empty";
  else {
    const user = await User.findById(id);
    if (!user) errors.id = "User with that id not found";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.join = async (code, id) => {
  const errors = {};

  // makes sure that the code is valid and exists in the database
  if (code.trim() === "") errors.code = "Code must not be empty";
  else {
    const list = await List.findOne({ code });
    if (!list) errors.code = "List not found";
  }

  // makes sure that the id is valid and exists in the database
  if (id === "") errors.id = "User id must not be empty";
  else {
    const user = await User.findById(id);
    if (!user) errors.id = "User with that id not found";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};
