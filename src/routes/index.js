import express from "express";
import authController from "../controllers/auth-controller.js";
import otpController from "../controllers/otp-controller.js";
import userController from "../controllers/user-controller.js";
import { authTokenValidator, createUserValidator, resetUserPasswordValidator, userOtpValidator, userOtpVerifyValidator } from "../serializers/validator/auth-controller-validator.js";
import { accessControlManager } from "@secure-access-control/server";

const route = express();

/**
 * Route which is used get login a user by email and password or refresh token
 * Route: /v1/oauth/login
 * Return: { status: true / false, ,message: string, data }
 */
route.post("/token", authTokenValidator, authController.userLoginTokenController);

/**
 * Route which is used to create a new user
 * Route: /v1/oauth/register
 * Return: { status: true / false, ,message: string }
 */
route.post("/register", createUserValidator, authController.createUserController);

/**
 * Route which is used to get OTP for a user,
 * Route: /v1/oauth/otp
 * Body: phone : string
 * Return : { status: true / false,  is_existing: true / false}
 */
route.post("/otp", userOtpValidator, otpController.userOtpController);

/**
 * Route which is used to verify an otp
 * Route: /v1/oauth/otp/verify
 * Body: phone : string
 * Return : { status: true / false}
 */
route.post("/otp/verify", userOtpVerifyValidator, otpController.userOtpVerifyController);

/**
 * Route which is used to logout a user
 * Route: /v1/oauth/logout
 * Return: { status: true / false, ,message: string }
 */

route.post("/logout", accessControlManager.auth, userController.userLogoutController);

/**
 * Route which is used to reset the password of a user,
 * Route: /v1/oauth/password/reset
 * Body: phone : string
 * Return : { status: true / false}
 */
route.post("/password/reset", resetUserPasswordValidator, userController.userPasswordResetController);

export default route;
