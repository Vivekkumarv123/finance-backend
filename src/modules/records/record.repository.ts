import { RecordModel, type IRecord } from "./record.model.js";

export const RecordRepository = {
  create: async (data: Partial<IRecord>): Promise<IRecord> => {
    return RecordModel.create(data);
  },

  findById: async (id: string): Promise<IRecord | null> => {
    return RecordModel.findById(id);
  },

  findAll: async ({
    userId,
    role,
    page,
    limit,
    type,
    category,
    dateFrom,
    dateTo,
    sortBy = "date",
    sortOrder = "desc",
  }: {
    userId: string;
    role: string;
    page: number;
    limit: number;
    type?: string;
    category?: string;
    dateFrom?: Date;
    dateTo?: Date;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) => {
    const filter: any = { isDeleted: false };

    // Role-based filtering
    if (role !== "admin") {
      filter.userId = userId;
    }

    if (type) filter.type = type;
    if (category) filter.category = category;

    if (dateFrom || dateTo) {
      filter.date = {};
      if (dateFrom) filter.date.$gte = dateFrom;
      if (dateTo) filter.date.$lte = dateTo;
    }

    const skip = (page - 1) * limit;

    const sort: any = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    const [records, total] = await Promise.all([
      RecordModel.find(filter)
        .skip(skip)
        .limit(limit)
        .sort(sort),
      RecordModel.countDocuments(filter),
    ]);

    return { records, total };
  },

  updateById: async (
    id: string,
    data: Partial<IRecord>
  ): Promise<IRecord | null> => {
    return RecordModel.findByIdAndUpdate(id, data, { new: true });
  },
};