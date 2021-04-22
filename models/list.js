const { model, Schema } = require("mongoose");

const LIST_SCHEMA = new Schema({
  list_name: String,
  code: String,
  members: [String],
  items: [
    {
      name: String,
      amount: Number,
      member: String,
      purchased: Boolean,
    },
  ],
  createdAt: String,
});

module.exports = model("lists", LIST_SCHEMA);
