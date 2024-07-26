import "dotenv/config";
import server from "supertest";
import { createRequest, HttpClient } from "@secure-access-control/client";
import { expressApp } from "../../server";
import { mysqlDisconnect } from "../../services/mysql-service";

afterAll(async () => {
  await mysqlDisconnect();
});

const SERVICE_ROUTE = "v1/oauth";

/**
 * Test Login Token api
 */
describe("Token Route", () => {
  let refreshToken = null;

  /**
   * Test to validate auth token based on password strategy and default password,
   * It should respond with user: userObject, token and refresh token
   */
  test("GET v1/auth/token : To test login with password", async () => {
    let request = createRequest(process.env.BASE_URL, SERVICE_ROUTE + "/token", "post", HttpClient.SERVER);
    let response = await server(expressApp)
      .post("/" + request.url)
      .send({ strategy: "password", email: process.env.TEST_EMAIL, password: process.env.TEST_PASSWORD })
      .set({ ...request.headers, "user-agent": "jest" });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("user");
    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("refresh_token");
    refreshToken = response.body.refresh_token;
  });

  /**
   * Test to validate auth token based on refresh_token strategy,
   * It should respond with user: userObject, token and refresh token
   */
  test("GET v1/auth/token : To test login with refresh token", async () => {
    let request = createRequest(process.env.BASE_URL, SERVICE_ROUTE + "/token", "post", HttpClient.SERVER);
    let response = await server(expressApp)
      .post("/" + request.url)
      .send({ strategy: "refresh_token", refresh_token: refreshToken })
      .set({ ...request.headers, "user-agent": "jest" });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("token");
  });
});
