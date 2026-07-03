import jwt, { SignOptions } from "jsonwebtoken";
import { UserDocument } from "../models/user.model";
import { config } from "../config/app.config";

export type AccessTPayload = {
  userId: UserDocument["_id"];
};

// Type assertion for string like '7d' or '1h'
const defaults: SignOptions = {
  audience: ["user"],
  expiresIn: config.JWT_EXPIRES_IN as SignOptions["expiresIn"],
};

const jwtSecret = config.JWT_SECRET;

export const signJwtToken = (
  payload: AccessTPayload,
  options?: SignOptions
) => {
  return jwt.sign(payload, jwtSecret, {
    ...defaults,
    ...(options || {}),
  });
};
