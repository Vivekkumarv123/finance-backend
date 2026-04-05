import { DashboardRepository } from "./dashboard.repository.js";

export const DashboardService = {
  buildMatch: (userId: string, role: string) => {
    if (role === "admin") {
      return { isDeleted: false };
    }
    return { userId, isDeleted: false };
  },

  getSummary: async (userId: string, role: string) => {
    const match = DashboardService.buildMatch(userId, role);
    return DashboardRepository.aggregateSummary(match);
  },

  getCategoryBreakdown: async (userId: string, role: string) => {
    const match = DashboardService.buildMatch(userId, role);
    return DashboardRepository.categoryBreakdown(match);
  },

  getMonthlyTrends: async (
    userId: string,
    role: string,
    year?: number
  ) => {
    const match = DashboardService.buildMatch(userId, role);
    return DashboardRepository.monthlyTrends(match, year);
  },

  getRecent: async (userId: string, role: string) => {
    const match = DashboardService.buildMatch(userId, role);
    return DashboardRepository.recentTransactions(match);
  },
};