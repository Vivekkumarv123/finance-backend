import { UserRepository } from "./user.repository.js";
import { hashPassword } from "../../common/utils/password.js";
import { AppError } from "../../common/errors/AppError.js";
import { Types } from "mongoose";
import type { Role } from "./user.model.js";

export const UserService = {
  createUser: async (data: any, actorId: string) => {
    const existing = await UserRepository.findByEmail(data.email);
    if (existing) throw new AppError("Email already exists", 409);

    const hashed = await hashPassword(data.password);

    return UserRepository.create({
      ...data,
      password: hashed,
      createdBy: new Types.ObjectId(actorId),
    });
  },

  listUsers: async (query: any) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    const findAllQuery: Parameters<typeof UserRepository.findAll>[0] = {
      page,
      limit,
    };
    if (query.role !== undefined) findAllQuery.role = query.role;
    if (query.isActive !== undefined) findAllQuery.isActive = query.isActive === "true";

    const { users, total } = await UserRepository.findAll(findAllQuery);

    return {
      users,
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  assignRole: async (userId: string, role: Role, actorId: string) => {
    const user = await UserRepository.updateById(userId, {
      role,
      updatedBy: new Types.ObjectId(actorId),
    });

    if (!user) throw new AppError("User not found", 404);

    return user;
  },

  setActiveStatus: async (
    userId: string,
    isActive: boolean,
    actorId: string
  ) => {
    const user = await UserRepository.updateById(userId, {
      isActive,
      updatedBy: new Types.ObjectId(actorId),
    });

    if (!user) throw new AppError("User not found", 404);

    return user;
  },
};