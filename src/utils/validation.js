const validator = require("validator");

const validateSignUpData = (data) => {
  const { firstName, lastName, emailId, password } = data;
  if (!firstName || !lastName) {
    throw new Error("Name is not valid!");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid!");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not strong!");
  }
};

const validateEditProfileData = (data) => {
  const isAllowedFields = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "about",
    "photo",
    "skills",
  ];

  const isAllowed = Object.keys(data).every((key) =>
    isAllowedFields.includes(key)
  );

  return isAllowed;
};

module.exports = { validateSignUpData, validateEditProfileData };
