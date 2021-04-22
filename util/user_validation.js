module.exports.validate_registration_info = (
  email,
  password,
  confirm_password,
  screen_name
) => {
  const errors = {};

  const regEx =
    "/^([0-9a-zA-Z]([-.w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-w]*[0-9a-zA-Z].)+[a-zA-Z]{2,9})$/";

  // email validation
  if (email.trim() === "") errors.email = "Email must not be empty";
  else if (!email.match(regEx)) errors.email = "Must be a valid email";

  // password validation
  if (password === "") errors.password = "Pasword must not be empty";
  else if (password.length < 8) errors.password = "Password is too short";

  // confirm password validation
  if (confirm_password === "")
    errors.confirm_password = "Confirm password must not be empty";
  else if (confirm_password != password)
    errors.confirm_password = "Passwords do not match";

  // screen name validation
  if (screen_name.trim() === "") s;
  errors.screen_name = "Screen name must not be empty";

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};
