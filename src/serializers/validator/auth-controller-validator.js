import { body, param, query, check } from "express-validator";
import errorValidator from "./validator.js";
import { AUTH_TOKEN_STRATEGY, AUTH_TOKEN_STRATEGY_ENUM, OTP_STRATEGY_ENUM } from "../../resources/constants.js";

export const authTokenValidator = [
  body("strategy")
    .isIn(AUTH_TOKEN_STRATEGY_ENUM)
    .withMessage(`strategy should be one of ${AUTH_TOKEN_STRATEGY_ENUM.join(",")}`)
    .notEmpty()
    .withMessage("strategy is required"),
  body("email").if(body("strategy").equals(AUTH_TOKEN_STRATEGY.PASSWORD)).notEmpty().withMessage("email is required"),
  body("password").if(body("strategy").equals(AUTH_TOKEN_STRATEGY.PASSWORD)).notEmpty().withMessage("password is required"),
  body("refresh_token").if(body("strategy").equals(AUTH_TOKEN_STRATEGY.REFRESH_TOKEN)).notEmpty().withMessage("refresh_token is required"),
  errorValidator,
];

export const createUserValidator = [
  body("name").isString().isLength({ min: 2, max: 50 }).withMessage("Please provide a valid name.").notEmpty().withMessage("name is required"),
  body("email").isEmail().withMessage("Please provide a valid email address.").notEmpty().withMessage("email is required"),
  body("otp").isLength({ min: 6, max: 6 }).withMessage("Please provide a valid OTP consisting of 6 digits.").notEmpty().withMessage("otp is required"),
  body("password")
    .isStrongPassword({ minLength: 6, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })
    .withMessage("Your password must meet the following criteria: Minimum length of 6 characters, At least one lowercase character, At least one uppercase character, At least one number, At least one symbol")
    .notEmpty()
    .withMessage("password is required"),
  body("confirm_password")
    .isStrongPassword({ minLength: 6, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })
    .withMessage("Your confirm_password must meet the following criteria: Minimum length of 6 characters, At least one lowercase character, At least one uppercase character, At least one number, At least one symbol")
    .notEmpty()
    .withMessage("confirm_password is required")
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage("Your password and confirmation password must not match."),
  errorValidator,
];

export const userOtpValidator = [
  body("strategy")
    .isIn(OTP_STRATEGY_ENUM)
    .withMessage(`strategy should be one of ${OTP_STRATEGY_ENUM.join(",")}`)
    .notEmpty()
    .withMessage("strategy is required"),
  body("email").isEmail().withMessage("Please provide a valid email address.").notEmpty().withMessage("email is required"),
  errorValidator,
];

export const userOtpVerifyValidator = [
  body("strategy")
    .isIn(OTP_STRATEGY_ENUM)
    .withMessage(`strategy should be one of ${OTP_STRATEGY_ENUM.join(",")}`)
    .notEmpty()
    .withMessage("strategy is required"),
  body("email").isEmail().withMessage("Please provide a valid email address.").notEmpty().withMessage("email is required"),
  body("otp").isLength({ min: 6, max: 6 }).withMessage("Please provide a valid OTP consisting of 6 digits.").notEmpty().withMessage("otp is required"),
  errorValidator,
];

export const resetUserPasswordValidator = [
  body("email").isEmail().withMessage("Please provide a valid email address.").notEmpty().withMessage("email is required"),
  body("otp").isLength({ min: 6, max: 6 }).withMessage("Please provide a valid OTP consisting of 6 digits.").notEmpty().withMessage("otp is required"),
  body("password")
    .isStrongPassword({ minLength: 6, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })
    .withMessage("Your password must meet the following criteria: Minimum length of 6 characters, At least one lowercase character, At least one uppercase character, At least one number, At least one symbol")
    .notEmpty()
    .withMessage("password is required"),
  body("confirm_password")
    .isStrongPassword({ minLength: 6, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })
    .withMessage("Your confirm_password must meet the following criteria: Minimum length of 6 characters, At least one lowercase character, At least one uppercase character, At least one number, At least one symbol")
    .notEmpty()
    .withMessage("confirm_password is required")
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage("Your password and confirmation password must not match."),
  errorValidator,
];
