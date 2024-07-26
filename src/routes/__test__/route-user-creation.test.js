import "dotenv/config";
import server from "supertest";
import { createRequest, HttpClient } from "@secure-access-control/client";
import { expressApp } from "../../server";
import { mysqlDisconnect } from "../../services/mysql-service";
import NumberHelper from "../../helpers/number-helper";
import { OTP_STRATEGY } from "../../resources/constants";
import { generateDefaultOtp } from "../../services/otp-service";

afterAll(async () => {
  await mysqlDisconnect();
});

const SERVICE_ROUTE = "v1/oauth";

const otp = generateDefaultOtp();
const name = `test_${NumberHelper.randomNumber(99999)}_${NumberHelper.randomNumber(99999)}`;
const TEST_EMAIL = `${name}@omrnmore.com`;
/**
 * Test Register api
 */
describe("Register Route", () => {
  let refreshToken = null;

  /**
   * Test to validate OTP sending,
   * It should respond with success
   */
  test("GET v1/auth/otp : To send an OTP to the specified email address", async () => {
    let request = createRequest(process.env.BASE_URL, SERVICE_ROUTE + "/otp", "post", HttpClient.SERVER);
    let response = await server(expressApp)
      .post("/" + request.url)
      .send({ strategy: OTP_STRATEGY.LOGIN, email: TEST_EMAIL })
      .set({ ...request.headers, "user-agent": "jest" });
    expect(response.statusCode).toBe(200);
  });

  /**
   * Test to validate  OTP,
   * It should respond with success
   */
  test("GET v1/auth/otp/verify : To verify the OTP", async () => {
    let request = createRequest(process.env.BASE_URL, SERVICE_ROUTE + "/otp/verify", "post", HttpClient.SERVER);
    let response = await server(expressApp)
      .post("/" + request.url)
      .send({ strategy: OTP_STRATEGY.LOGIN, email: TEST_EMAIL, otp: otp })
      .set({ ...request.headers, "user-agent": "jest" });
    expect(response.statusCode).toBe(200);
  });

  /**
   * Test to validate user account creation,
   * It should respond with user: userObject, token and refresh token
   */
  test("GET v1/oauth/register : To create a new user & return the token", async () => {
    let request = createRequest(process.env.BASE_URL, SERVICE_ROUTE + "/register", "post", HttpClient.SERVER);
    let response = await server(expressApp)
      .post("/" + request.url)
      .send({ strategy: "email", name: name, email: TEST_EMAIL, password: process.env.TEST_NEW_PASSWORD, confirm_password: process.env.TEST_NEW_PASSWORD, otp: otp })
      .set({ ...request.headers, "user-agent": "jest" });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("user");
    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("refresh_token");
    refreshToken = response.body.refresh_token;
  });
});

describe("Password Reset Route", () => {
  let refreshToken = null;

  /**
   * Test to validate OTP sending,
   * It should respond with success
   */
  test("GET v1/auth/otp : To send an OTP to the specified email address", async () => {
    let request = createRequest(process.env.BASE_URL, SERVICE_ROUTE + "/otp", "post", HttpClient.SERVER);

    let response = await server(expressApp)
      .post("/" + request.url)
      .send({ strategy: OTP_STRATEGY.PASSWORD_RESET, email: TEST_EMAIL })
      .set({ ...request.headers, "user-agent": "jest" });
    expect(response.statusCode).toBe(200);
  });

  /**
   * Test to validate  OTP,
   * It should respond with success
   */
  test("GET v1/auth/otp/verify : To verify the OTP", async () => {
    let request = createRequest(process.env.BASE_URL, SERVICE_ROUTE + "/otp/verify", "post", HttpClient.SERVER);
    let response = await server(expressApp)
      .post("/" + request.url)
      .send({ strategy: OTP_STRATEGY.PASSWORD_RESET, email: TEST_EMAIL, otp: otp })
      .set({ ...request.headers, "user-agent": "jest" });
    expect(response.statusCode).toBe(200);
  });

  /**
   * Test to validate password reset,
   * It should respond with success message
   */
  test("GET v1/auth/reset : To reset password of a user account", async () => {
    let request = createRequest(process.env.BASE_URL, SERVICE_ROUTE + "/password/reset", "post", HttpClient.SERVER);

    let response = await server(expressApp)
      .post("/" + request.url)
      .send({ strategy: "email", email: TEST_EMAIL, password: process.env.TEST_NEW_PASSWORD, confirm_password: process.env.TEST_NEW_PASSWORD, otp: otp })
      .set({ ...request.headers, "user-agent": "jest" });
    expect(response.statusCode).toBe(200);
  });
});
