import { websiteService } from "@/features/websites";
import { scanProfileService } from "@/features/scan-profiles";
import { testPackService } from "@/features/test-packs";
import { testRunService } from "@/features/test-runs";
import { reportService } from "@/features/reports";
import { dashboardService } from "@/features/dashboard";
import { authService } from "@/features/auth";

/**
 * Backwards-compatible apiClient facade delegating to individual feature services.
 * Direct consumption of specific services from `@/features/<feature>` is recommended.
 */
export const apiClient = {
  websites: {
    list: websiteService.getWebsites,
    get: websiteService.getWebsite,
    create: websiteService.createWebsite,
    verify: websiteService.verifyWebsite,
    addCredential: websiteService.addCredential,
  },

  scanProfiles: {
    list: scanProfileService.getScanProfiles,
    get: scanProfileService.getScanProfile,
    create: scanProfileService.createScanProfile,
  },

  testPacks: {
    list: testPackService.getTestPacks,
    get: testPackService.getTestPack,
    create: testPackService.createTestPack,
    validate: testPackService.validateTestPack,
  },

  testRuns: {
    list: testRunService.getTestRuns,
    get: testRunService.getTestRun,
    trigger: testRunService.triggerScan,
    cancel: testRunService.cancelScan,
  },

  reports: {
    get: reportService.getReport,
  },

  dashboard: {
    getSummary: dashboardService.getDashboardSummary,
    getRecentActivity: dashboardService.getRecentActivity,
  },

  auth: {
    login: authService.login,
    logout: authService.logout,
    isAuthenticated: authService.isAuthenticated,
    getStoredToken: authService.getStoredToken,
  },
};

export default apiClient;
