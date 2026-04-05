import { EncryptJWT, jwtDecrypt } from "jose";
import { env } from "../../config/env.js";
import { AppError } from "../errors/AppError.js";

const secret = new TextEncoder().encode(env.JWE_SECRET);

export type TokenPayload = {
  userId: string;
  role: "viewer" | "analyst" | "admin";
};

export const encryptToken = async (payload: TokenPayload): Promise<string> => {
  return await new EncryptJWT(payload)
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .encrypt(secret);
};

export const decryptToken = async (token: string): Promise<TokenPayload> => {
  try {
    const { payload } = await jwtDecrypt(token, secret);

    return payload as TokenPayload;
  } catch {
    throw new AppError("Invalid or expired token", 401);
  }
};