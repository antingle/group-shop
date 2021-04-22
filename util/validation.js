const List = require("../models/list");

module.exports.create_validation = (list_name, name) => {
  const errors = {};

  if (name === "") errors.list_name = "List name must not be empty";
  if (name === "") errors.name = "Name must not be empty";

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.join_validation = async (name, code) => {
  const errors = {};

  if (name === "") errors.name = "Name must not be empty";

  if (code === "") errors.code = "Code must not be empty";
  else if (code.length != 4) errors.code = "Incorrect code format";
  else {
    const list = await List.findOne({ code });
    if (!list) errors.code = "List not found";
    else {
      for (let i = 0; i < list.members.length; i++) {
        if (list.members[i] === name) {
          errors.code = "Name must be unique";
          break;
        }
      }
    }
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.add_validation = (item) => {
  const errors = {};

  if (item === "") errors.name = "Item name must not be empty";

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};
