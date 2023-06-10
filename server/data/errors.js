const { ObjectId } = require("mongodb");

const checkUserPosted = (userID) => {
  if (typeof userID !== "string") {
    throw "User ID must be of string type.";
  }
  if (!ObjectId.isValid(userID)) {
    throw userID + " is not a valid userID";
  }
};

const checkString = (parameter, name, cannotBeEmpty = true) => {
  if (parameter === undefined) {
    throw `Please pass ${name} parameter to the function`;
  }
  if (typeof parameter != "string")
    throw `parameter ${name} must be of type string.`;
  if (cannotBeEmpty && parameter.trim().length === 0)
    throw `parameter ${name} cannot be an empty string.`;
};

const checkEmail = (email) => {
  checkString(email, "email");

  const emailRe =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!emailRe.test(String(email).toLowerCase())) {
    throw `Email is not in proper format.`;
  }
};

const checkInt = (parameter, name) => {
  if (parameter === undefined) {
    throw `Please pass ${name} parameter to the function`;
  }
  if (typeof parameter != "number")
    throw `parameter ${name} must be of type Number.`;

  if (parameter.toString().split(".").length > 1)
    throw `Error! ${name} cannot be a float.`;
};

const checkStringObjectId = (parameter, name) => {
  checkString(parameter, name);
  if (!ObjectId.isValid(parameter))
    throw `Passed parameter ${name} is not a valid object ID.`;
};

const checkObject = (object, name) => {
  if (typeof object === "undefined") {
    throw `Error! Please provide ${name} into the function`;
  }
  if (typeof object !== "object" || Array.isArray(object) || object === null)
    throw `Error! Parameter ${name} should be of object type.`;

  if (Object.keys(object).length == 0) {
    throw `${name} object should have atleast one key-value pair`;
  }
};

module.exports = {
  checkEmail,
  checkString,
  checkUserPosted,
  checkInt,
  checkStringObjectId,
  checkObject,
};
