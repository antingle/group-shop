const bcrypt = require("bcryptjs");

const User = require("../../models/user");

const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;

module.exports = {
  registration: async (email, password, confirm_password, screen_name) => {
    const errors = {};

    // email validation
    if (email.trim() === "") errors.email = "Email must not be empty";
    else if (!email.match(regEx)) errors.email = "Must be a valid email";
    else {
      const user = await User.findOne({ email });
      if (user) errors.email = "There is already a user with that email";
    }

    // password validation
    if (password === "") errors.password = "Pasword must not be empty";
    else if (password.length < 8) errors.password = "Password is too short";

    // confirm password validation
    if (confirm_password === "")
      errors.confirm_password = "Confirm password must not be empty";
    else if (confirm_password != password)
      errors.confirm_password = "Passwords do not match";

    // screen name validation
    if (screen_name.trim() === "")
      errors.screen_name = "Screen name must not be empty";

    return {
      errors,
      valid: Object.keys(errors).length < 1,
    };
  },
  login: async (email, password) => {
    const errors = {};

    // email validation
    if (email.trim() === "") errors.email = "Email must not be empty";
    else if (!email.match(regEx)) errors.email = "Email must be valid";
    else {
      var user = await User.findOne({ email });
      if (!user) errors.email = "Email is not registered";
    }

    // password validation
    if (password === "") errors.password = "Password must not be empty";
    else if (password.length < 8)
      errors.password = "Password is not long enough";
    else {
      if (user) {
        const matched = await bcrypt.compare(password, user.password);
        if (!matched) errors.password = "Password is incorrect";
      }
    }

    return {
      errors,
      valid: Object.keys(errors).length < 1,
    };
  },
};
