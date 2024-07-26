export const USER_TYPES = {
  USER: "user",
};

export const AUTH_TOKEN_STRATEGY = {
  PASSWORD: "password",
  REFRESH_TOKEN: "refresh_token",
};

export const AUTH_TOKEN_STRATEGY_ENUM = [AUTH_TOKEN_STRATEGY.PASSWORD, AUTH_TOKEN_STRATEGY.REFRESH_TOKEN];

export const OTP_STRATEGY = {
  LOGIN: "login",
  PASSWORD_RESET: "reset",
};

export const OTP_STRATEGY_ENUM = [OTP_STRATEGY.LOGIN, OTP_STRATEGY.PASSWORD_RESET];
