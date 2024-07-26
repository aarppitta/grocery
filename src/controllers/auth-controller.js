// Libraries
import Express from "express";
import { metricsLogError, parseError } from "prom-nodejs-client";
import { accessTokenManager } from "@secure-access-control/server";

// Services
import bcryptService from "../services/bcrypt-service.js";
import refreshTokenService from "../services/refresh-token-service.js";
import otpService from "../services/otp-service.js";
import postgresService from "../services/postgres-service.js";
import mysqlService from "../services/mysql-service.js";

// Usecases & constants
import { getUserById, getUserByEmail, createUser } from "../usecases/user-usecases.js";
import { AUTH_TOKEN_STRATEGY, OTP_STRATEGY, USER_TYPES } from "../resources/constants.js";

/**
 * Route controller to handle token
 * If the user exists, the is_existing: true
 * return user: string, token and refresh token if al the operations are find
 * return status: 400 if there are any issues
 *
 * @param { Express.Request } req
 * @param { Express.Response } res
 */
const userLoginTokenController = async (req, res) => {
  const { strategy, email, password, refresh_token } = req.body;
  const userAgent = req.headers["user-agent"];
  try {
    let user = null;

    if (strategy === AUTH_TOKEN_STRATEGY.PASSWORD) {
      /**
       * Condition which us used to run for password strategy
       */
      user = await getUserByEmail(email, null, { mysqlService });
      await bcryptService.compare(password, user?.password || "null");
    } else if (strategy === AUTH_TOKEN_STRATEGY.REFRESH_TOKEN) {
      /**
       * Condition which us used to run for refresh_token strategy
       * If the refresh token is not found, it will throw error
       */
      let userId = await refreshTokenService.verifyRefreshToken(USER_TYPES.USER, refresh_token, userAgent);
      user = await getUserById(Number.parseInt(userId), null, { mysqlService });
    }

    if (!user)
      return res.status(400).json({
        message: "Account doesn't exits, Please create a new account",
      });

    /**
     * Remove password field from user object
     */
    delete user.password;

    /**
     * Generate refresh token and token for the user
     */
    let refreshToken = await refreshTokenService.generateRefreshToken(USER_TYPES.USER, user.user_id, userAgent);
    let token = accessTokenManager.generate(user.user_id, { user_id: user.user_id }, userAgent);

    if (strategy === AUTH_TOKEN_STRATEGY.REFRESH_TOKEN)
      return res.status(200).json({
        token: token,
      });

    res.status(200).json({
      user: user,
      token: token,
      refresh_token: refreshToken,
    });
  } catch (ex) {
    metricsLogError("userLoginTokenController: ", ex);
    console.log("userLoginTokenController: ", parseError(ex));
    res.status(ex?.status || 500).json({
      statusCode: ex?.statusCode || 500,
      message: ex?.message || "server error",
    });
  }
};

/**
 * Route controller to handle user logout
 *
 * @param { Express.Request } req
 * @param { Express.Response } res
 */
const createUserController = async (req, res) => {
  const { strategy, name, email, password, otp } = req.body;
  const userAgent = req.headers["user-agent"]
  try {
    let userExits = await getUserByEmail(email, ["user_id"], { mysqlService });
    if (userExits) {
      return res.status(400).json({
        message: "User already exits with this email address",
        is_existing: true,
        status: false,
      });
    }

    const hasVerified = await otpService.verifyOTP(OTP_STRATEGY.LOGIN, { email }, otp);
    const user = await createUser(name, email, password, { mysqlService, bcryptService });
    delete user.password;

    let refreshToken = await refreshTokenService.generateRefreshToken(USER_TYPES.USER, user.user_id, userAgent);
    let token = accessTokenManager.generate(user.user_id, { user_id: user.user_id }, userAgent);

    res.status(200).json({
      user: user,
      token: token,
      refresh_token: refreshToken,
    });
  } catch (ex) {
    metricsLogError("createUserController: ", ex);
    console.log("createUserController: ", parseError(ex));
    res.status(ex?.status || 500).json({
      statusCode: ex?.statusCode || 500,
      message: ex?.message || "server error",
    });
  }
};

const authController = {
  userLoginTokenController,
  createUserController,
};

export default authController;
