const { model, Schema } = require("mongoose");

const LIST_SCHEMA = new Schema({
  code: String,
  members: [String],
  items: [
    {
      name: String,
      member: String,
      purchased: Boolean,
    },
  ],
  createdAt: String,
});

module.exports = model("lists", LIST_SCHEMA);
