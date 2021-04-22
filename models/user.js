const { model, Schema } = require("mongoose");

const USER_SCHEMA = new Schema({
  email: String,
  password: String,
  screen_name: String,
  lists: [String],
  join_date: String,
});

module.exports = model("users", USER_SCHEMA);
