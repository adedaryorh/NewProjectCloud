const { check, validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(422).json({
    errors: extractedErrors
  });
};

const registerValidation = () => {
  return [
    check("name", "Name is required").notEmpty(),
    check("email", "Please use a valid Email").isEmail(),
    check(
      "password",
      "Please enter a password with 5 or more characters"
    ).isLength({ min: 5 }),
  ];
};

const loginValidation = () => {
  return [
    check("email", "Please use a valid Email").isEmail(),
    check(
      "password",
      "Please enter a password with 5 or more characters"
    ).isLength({ min: 5 }),
  ];
};

const resetValidation = () => {
  return [
    check("email", "Please use a valid Email").isEmail(),
    check(
      "password",
      "Please enter a password with 5 or more characters"
    ).isLength({ min: 5 }),
    check(
      "confirmPassword", "Confirm password is required").isLength({ min: 5 }),
  ];
};

const activationValidation = () => {
  return [
    check("email", "Please use a valid Email").isEmail(),
    check(
      "token",
      "Please enter activation code"
    ).notEmpty(),
  ];
};

const resendCodeValidation = () => {
  return [
    check("email", "Please use a valid Email").isEmail()
  ];
};

const cartValidation = () => {
  return [
    check("productId", "ProductId is required").notEmpty()
  ];
};

const checkoutValidation = () => {
  return [
    check("cartIds", "Cart Ids is required").isArray()
  ];
};


module.exports = {
  validate,
  registerValidation,
  loginValidation,
  activationValidation,
  resendCodeValidation,
  resetValidation,
  cartValidation,
  checkoutValidation
};
