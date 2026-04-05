import { RecordRepository } from "./record.repository.js";
import { AppError } from "../../common/errors/AppError.js";
import { Types } from "mongoose";

export const RecordService = {
  createRecord: async (userId: string, data: any) => {
    return RecordRepository.create({
      ...data,
      userId: new Types.ObjectId(userId),
      createdBy: new Types.ObjectId(userId),
    });
  },

  getRecords: async (userId: string, role: string, query: any) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    const findAllQuery: Parameters<typeof RecordRepository.findAll>[0] = {
      userId,
      role,
      page,
      limit,
    };
    if (query.type !== undefined) findAllQuery.type = query.type;
    if (query.category !== undefined) findAllQuery.category = query.category;
    if (query.dateFrom) findAllQuery.dateFrom = new Date(query.dateFrom);
    if (query.dateTo) findAllQuery.dateTo = new Date(query.dateTo);

    return RecordRepository.findAll(findAllQuery);
  },

  updateRecord: async (
    recordId: string,
    userId: string,
    role: string,
    data: any
  ) => {
    const record = await RecordRepository.findById(recordId);

    if (!record || record.isDeleted) {
      throw new AppError("Record not found", 404);
    }

    // 🔐 Ownership check
    if (role !== "admin" && record.userId.toString() !== userId) {
      throw new AppError("Not allowed to update this record", 403);
    }

    return RecordRepository.updateById(recordId, {
      ...data,
      updatedBy: new Types.ObjectId(userId),
    });
  },

  softDeleteRecord: async (
    recordId: string,
    userId: string,
    role: string
  ) => {
    const record = await RecordRepository.findById(recordId);

    if (!record || record.isDeleted) {
      throw new AppError("Record not found", 404);
    }

    // 🔐 Ownership check
    if (role !== "admin" && record.userId.toString() !== userId) {
      throw new AppError("Not allowed to delete this record", 403);
    }

    await RecordRepository.updateById(recordId, {
      isDeleted: true,
      updatedBy: new Types.ObjectId(userId),
    });
  },
};