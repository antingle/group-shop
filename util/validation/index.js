const { creation, join } = require("./list_validation");
const { registration, login } = require("./user_validation");

module.exports = {
  list_validation: {
    creation,
    join,
  },
  user_validation: {
    registration,
    login,
  },
};
