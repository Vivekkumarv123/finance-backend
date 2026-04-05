import { RecordModel } from "../records/record.model.js";

export const DashboardRepository = {
  aggregateSummary: async (match: any) => {
    const result = await RecordModel.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          totalIncome: {
            $sum: {
              $cond: [{ $eq: ["$type", "income"] }, "$amount", 0],
            },
          },
          totalExpense: {
            $sum: {
              $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalIncome: 1,
          totalExpense: 1,
          netBalance: { $subtract: ["$totalIncome", "$totalExpense"] },
        },
      },
    ]);

    return result[0] || { totalIncome: 0, totalExpense: 0, netBalance: 0 };
  },

  categoryBreakdown: async (match: any) => {
    return RecordModel.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);
  },

  monthlyTrends: async (match: any, year?: number) => {
    if (year) {
      match.date = {
        $gte: new Date(`${year}-01-01`),
        $lte: new Date(`${year}-12-31`),
      };
    }

    return RecordModel.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            month: { $month: "$date" },
            year: { $year: "$date" },
          },
          income: {
            $sum: {
              $cond: [{ $eq: ["$type", "income"] }, "$amount", 0],
            },
          },
          expense: {
            $sum: {
              $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          year: "$_id.year",
          income: 1,
          expense: 1,
          net: { $subtract: ["$income", "$expense"] },
        },
      },
      { $sort: { year: 1, month: 1 } },
    ]);
  },

  recentTransactions: async (match: any) => {
    return RecordModel.find(match)
      .sort({ createdAt: -1 })
      .limit(5);
  },
};