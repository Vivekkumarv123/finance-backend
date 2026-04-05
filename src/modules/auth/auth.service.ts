import { UserRepository } from "../users/user.repository.js";
import { hashPassword, verifyPassword } from "../../common/utils/password.js";
import { encryptToken } from "../../common/utils/jwe.js";
import { AppError } from "../../common/errors/AppError.js";

export const AuthService = {
  register: async ({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) => {
    const existingUser = await UserRepository.findByEmail(email);

    if (existingUser) {
      throw new AppError("Email already in use", 409);
    }

    const hashedPassword = await hashPassword(password);

    const user = await UserRepository.create({
      name,
      email,
      password: hashedPassword,
      role: "viewer",
    });

    const token = await encryptToken({
      userId: user._id.toString(),
      role: user.role,
    });

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  },

  login: async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    const user = await UserRepository.findByEmail(email);

    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    const isMatch = await verifyPassword(password, user.password);

    if (!isMatch) {
      throw new AppError("Invalid credentials", 401);
    }

    if (!user.isActive) {
      throw new AppError("User is inactive", 403);
    }

    const token = await encryptToken({
      userId: user._id.toString(),
      role: user.role,
    });

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  },
};