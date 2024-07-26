// Libraries
import Express from "express";
import { metricsLogError, parseError } from "prom-nodejs-client";

// Services
import bcryptService from "../services/bcrypt-service.js";
import refreshTokenService from "../services/refresh-token-service.js";
import otpService from "../services/otp-service.js";
import postgresService from "../services/postgres-service.js";
import mysqlService from "../services/mysql-service.js";

// Usecases & constants
import { getUserById, getUserByEmail, updateUserPassword } from "../usecases/user-usecases.js";
import { OTP_STRATEGY, USER_TYPES } from "../resources/constants.js";

/**
 * Route controller to handle user logout
 *
 * @param { Express.Request } req
 * @param { Express.Response } res
 */
const userLogoutController = async (req, res) => {
  const userId = req.auth.user.user_id;
  const userAgent = req.headers["user-agent"];
  try {
    await refreshTokenService.clearRefreshToken(USER_TYPES.USER, userId, userAgent);
    res.status(200).json({
      status: true,
      message: "success",
    });
  } catch (ex) {
    metricsLogError("userLogoutController: ", ex);
    console.log("userLogoutController: ", parseError(ex));
    res.status(200).json({
      statusCode: ex?.statusCode || 500,
      message: ex?.message || "server error",
    });
  }
};
/**
 * Route control to handle otp
 * If the user exists, the is_existing: true
 * return status : true if all operations are fine
 * return status: 400 if the OTP has been requested within 30s
 *
 * @param { Express.Request } req
 * @param { Express.Response } res
 */
const userPasswordResetController = async (req, res) => {
  const { email, password, otp } = req.body;

  try {
    let user = await getUserByEmail(email, ["user_id"], { mysqlService });
    if (!user) {
      return res.status(400).json({
        message: "Could not find an account with this email address, Please again",
        is_existing: !!user,
        status: false,
      });
    }

    const hasVerified = await otpService.verifyOTP(OTP_STRATEGY.PASSWORD_RESET, { email }, otp);
    const userUpdated = await updateUserPassword(user.user_id, password, { mysqlService, bcryptService });
    res.status(200).json({
      message: "password updated",
      status: true,
    });
  } catch (ex) {
    metricsLogError("userPasswordResetController: ", ex);
    console.log("userPasswordResetController: ", parseError(ex));
    res.status(ex?.status || 500).json({
      statusCode: ex?.statusCode || 500,
      message: ex?.message || "server error",
    });
  }
};

const userController = {
  userPasswordResetController,
  userLogoutController,
};

export default userController;
