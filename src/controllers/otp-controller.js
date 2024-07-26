// Libraries
import Express from "express";
import { metricsLogError, parseError } from "prom-nodejs-client";

// Services
import otpService from "../services/otp-service.js";
import SMSService from "../services/sms-service.js";
import emailService from "../services/email-service.js";
import postgresService from "../services/postgres-service.js";
import mysqlService from "../services/mysql-service.js";

// Usecases & constants
import { getUserByEmail } from "../usecases/user-usecases.js";
import { OTP_STRATEGY } from "../resources/constants.js";

/**
 * Route control to handle otp
 * If the user exists, the is_existing: true
 * return status : true if all operations are fine
 * return status: 400 if the OTP has been requested within 30s
 *
 * @param { Express.Request } req
 * @param { Express.Response } res
 */
const userOtpController = async (req, res) => {
  const { strategy, email } = req.body;
  try {
    const smsService = new SMSService();

    let user = await getUserByEmail(email, ["user_id"], { mysqlService });
    if (strategy === OTP_STRATEGY.LOGIN && user) {
      return res.status(400).json({
        message: "A user already exists with this email address, Please try login",
        is_existing: !!user,
        status: false,
      });
    }

    await otpService.sendOTP(strategy, { email }, req.query.dns || false, strategy === OTP_STRATEGY.LOGIN ? "OTP" : "RESET_PASSWORD", { smsService, emailService });
    res.status(200).json({
      is_existing: !!user,
      status: true,
    });
  } catch (ex) {
    metricsLogError("userOtpController: ", ex);
    console.log("userOtpController: ", parseError(ex));
    res.status(ex?.status || 500).json({
      statusCode: ex?.statusCode || 500,
      message: ex?.message || "server error",
    });
  }
};

/**
 * Route control to handle otp verify
 * return status : true if all operations are fine
 * return status: false if the OTP is incorrect
 *
 * @param { Express.Request } req
 * @param { Express.Response } res
 */
const userOtpVerifyController = async (req, res) => {
  const { strategy, email, otp } = req.body;
  try {
    let user = await getUserByEmail(email, ["user_id"], {mysqlService });
    if (strategy === OTP_STRATEGY.LOGIN && user) {
      return res.status(400).json({
        message: "A user already exists with this email address, Please try login",
        status: false,
      });
    }

    const verified = await otpService.verifyOTP(strategy, { email }, otp);
    res.status(200).json({
      status: true,
      message: "Entered OTP is correct",
    });
  } catch (ex) {
    metricsLogError("userOtpVerifyController: ", ex);
    console.log("userOtpVerifyController: ", parseError(ex));
    res.status(ex?.status || 500).json({
      statusCode: ex?.statusCode || 500,
      message: ex?.message || "server error",
    });
  }
};

const otpController = {
  userOtpController,
  userOtpVerifyController,
};

export default otpController;
