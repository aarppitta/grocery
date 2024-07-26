import redisService from "../services/redis-service.js";
import * as OTPAuth from "otpauth";

const TIME_FOR_REPEATED_CALL = 30; //in seconds
const OTP_TIMEOUT = 5 * 60;

const OTP_SIZE = 6;
const OTP_CONFIG = { MIN: Number.parseInt(new Array(OTP_SIZE).fill(1).join("")), MAX: Number.parseInt(new Array(OTP_SIZE).fill(9).join("")) };

let otpGenerator = new OTPAuth.TOTP({
  issuer: "GROCERY",
  label: "Default OTP",
  algorithm: "SHA1",
  digits: 6,
  period: 30,
  secret: process.env.OTP_GENERATOR_HASH_KEY,
});

/**
 * Function which is used to generate the default OTP
 * @returns
 */
export const generateDefaultOtp = () => {
  let otp = otpGenerator.generate();
  return otp.toString();
};

/**
 * Function which is used to create a unique otp
 * @param { number } minimum
 * @param { number } maximum
 * @returns
 */
const generateOTP = (minimum, maximum) => {
  let previousValue;
  const random = () => {
    const number = Math.floor(Math.random() * (maximum - minimum + 1) + minimum);
    previousValue = number === previousValue && minimum !== maximum ? random() : number;
    return previousValue;
  };
  return random();
};

const OTPService = class {
  constructor() {}

  /**
   * Function which is used to get the OTP by mobile or phone
   * @param { number } mobile
   * @param { string } email
   */
  async getOTP(strategy, mobile, email) {
    let key = `${strategy}.${mobile || email}`;
    return redisService.get(`otp.${key}`);
  }

  /**
   * Function which is used to get the last request send
   * @param { number } mobile
   * @param { string } email
   * @returns
   */
  async getLastRequest(strategy, mobile, email) {
    let key = `${strategy}.${mobile || email}`;
    return redisService.get(`otp.${key}.last_request`);
  }

  /**
   * Function which is used to send last request
   * @param { number } mobile
   * @param { string } email
   * @returns
   */
  async setLastRequest(strategy, mobile, email) {
    let key = `${strategy}.${mobile || email}`;
    return redisService.set(`otp.${key}.last_request`, new Date().toString(), TIME_FOR_REPEATED_CALL);
  }

  /**
   * Function which is used to generate OTP and set the otp to redis
   * @param { number } mobile
   * @param { string } email
   * @returns
   */
  async generateOTP(strategy, mobile, email) {
    let key = `${strategy}.${mobile || email}`;
    let otp = await this.getOTP(mobile, email);
    if (!otp) {
      otp = generateOTP(OTP_CONFIG.MIN, OTP_CONFIG.MAX);
      await redisService.set(`otp.${key}`, otp, OTP_TIMEOUT);
    }
    return otp;
  }

  /**
   * Function which is used to generate OTP and trigger the SQS-OTP to send the OTP
   * Function also store the last send OTP to the redis, So incase the user requested for the OTP within the next 5min,
   * System will send the same OTP message to the user, so that, incase of delay in OTP receiving can be handled,
   * @param { { mobile, email } } userDetails
   * @param { boolean } dns
   * @param { string } type
   * @param { { emailService, smsService  } } dependencies
   * @returns
   */
  async sendOTP(strategy, { mobile, email }, dns, type, { emailService, smsService }) {
    let hasLastRequest = await this.getLastRequest(strategy, mobile, email);

    if (hasLastRequest) {
      let secondsRemaining = TIME_FOR_REPEATED_CALL - Math.floor((new Date().getTime() - new Date(hasLastRequest).getTime()) / 1000);
      throw { status: 400, statusCode: 400, message: `Please send the otp request after ${secondsRemaining} seconds` };
    }

    let otp = await this.generateOTP(strategy, mobile, email);
    if (!dns) {
      if (smsService && mobile) await smsService.send(type || "OTP", mobile,  otp );
      if (emailService && email) await emailService.send(type || "OTP", [email], [], null, { otp, company_name: "OMR N MORE" });
    }

    await this.setLastRequest(strategy, mobile, email);
    return otp;
  }

  /**
   * Function which is used to verify the OTP provided by the user
   * @param { { mobile, email } } userDetails
   * @param { number } otp
   * @returns
   */
  async verifyOTP(strategy, { mobile, email }, otp) {
    let savedOTP = await this.getOTP(strategy, mobile, email);

    // if (process.env.NODE_ENV === "test") return true;

    let defaultOtp = generateDefaultOtp();
    if (savedOTP != null && (savedOTP == otp || otp == defaultOtp)) return true;
    throw { status: 400, statusCode: 400, message: `Please check your OTP, entered details are incorrect` };
  }
};

const otpService = new OTPService();

export default otpService;
