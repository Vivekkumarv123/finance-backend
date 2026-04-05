import { UserModel, type IUser, type Role } from "./user.model.js";

export const UserRepository = {
  findByEmail: async (email: string): Promise<IUser | null> => {
    return UserModel.findOne({ email });
  },

  findById: async (id: string): Promise<IUser | null> => {
    return UserModel.findById(id);
  },

  create: async (data: Partial<IUser>): Promise<IUser> => {
    return UserModel.create(data);
  },

  findAll: async ({
    page,
    limit,
    role,
    isActive,
  }: {
    page: number;
    limit: number;
    role?: Role;
    isActive?: boolean;
  }) => {
    const filter: any = {};

    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive;

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      UserModel.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      UserModel.countDocuments(filter),
    ]);

    return { users, total };
  },

  updateById: async (
    id: string,
    data: Partial<IUser>
  ): Promise<IUser | null> => {
    return UserModel.findByIdAndUpdate(id, data, { new: true });
  },
};