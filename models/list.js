const { model, Schema } = require("mongoose");

const LIST_SCHEMA = new Schema({
  owner: String,
  list_name: String,
  code: String,
  members: [
    {
      screen_name: String,
    },
  ],
  items: [
    {
      name: String,
      member: String,
      purchased: Boolean,
    },
  ],
  created: String,
});

module.exports = model("lists", LIST_SCHEMA);
