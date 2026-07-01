import type {
  AdminUser,
  InsertAdminUser,
  UrlProcessingLog,
  ExtractionTemplate
} from "@shared/schema";
import { db } from "./db";
import { adminUsers } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

class AdminStorage {
  // NOTE: processingLogs and templates remain in-memory (no dedicated DB tables yet)
  private processingLogs: UrlProcessingLog[] = [];
  private templates: ExtractionTemplate[] = [];

  // ─── Admin User Operations (Database-backed) ──────────────────────────────

  async getAdminByUsername(username: string): Promise<AdminUser | undefined> {
    try {
      const [admin] = await db
        .select()
        .from(adminUsers)
        .where(eq(adminUsers.username, username));
      return admin && admin.isActive ? admin : undefined;
    } catch (err) {
      console.error("[AdminStorage] getAdminByUsername error:", err);
      return undefined;
    }
  }

  async getAdminById(id: string): Promise<AdminUser | undefined> {
    try {
      const [admin] = await db
        .select()
        .from(adminUsers)
        .where(eq(adminUsers.id, id));
      return admin && admin.isActive ? admin : undefined;
    } catch (err) {
      console.error("[AdminStorage] getAdminById error:", err);
      return undefined;
    }
  }

  async createAdminUser(data: InsertAdminUser): Promise<AdminUser> {
    const [newAdmin] = await db.insert(adminUsers).values(data).returning();
    return newAdmin;
  }

  async updateAdminLastLogin(id: string): Promise<void> {
    try {
      await db
        .update(adminUsers)
        .set({ lastLogin: new Date(), updatedAt: new Date() })
        .where(eq(adminUsers.id, id));
    } catch (err) {
      console.error("[AdminStorage] updateAdminLastLogin error:", err);
    }
  }

  async updateAdminPassword(id: string, newPassword: string): Promise<boolean> {
    try {
      const result = await db
        .update(adminUsers)
        .set({ password: newPassword, updatedAt: new Date() })
        .where(eq(adminUsers.id, id));
      return (result.rowCount ?? 0) > 0;
    } catch (err) {
      console.error("[AdminStorage] updateAdminPassword error:", err);
      return false;
    }
  }

  async getAllAdminUsers(): Promise<AdminUser[]> {
    try {
      return await db
        .select()
        .from(adminUsers)
        .where(eq(adminUsers.isActive, true))
        .orderBy(desc(adminUsers.createdAt));
    } catch (err) {
      console.error("[AdminStorage] getAllAdminUsers error:", err);
      return [];
    }
  }

  async updateAdminUser(id: string, updates: Partial<Omit<AdminUser, 'id' | 'createdAt'>>): Promise<AdminUser | undefined> {
    try {
      const [updated] = await db
        .update(adminUsers)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(adminUsers.id, id))
        .returning();
      return updated || undefined;
    } catch (err) {
      console.error("[AdminStorage] updateAdminUser error:", err);
      return undefined;
    }
  }

  async deleteAdminUser(id: string): Promise<boolean> {
    try {
      const result = await db.delete(adminUsers).where(eq(adminUsers.id, id));
      return (result.rowCount ?? 0) > 0;
    } catch (err) {
      console.error("[AdminStorage] deleteAdminUser error:", err);
      return false;
    }
  }

  // ─── URL Processing Log Operations (In-memory) ───────────────────────────

  async createProcessingLog(data: Omit<UrlProcessingLog, 'id' | 'createdAt' | 'updatedAt'>): Promise<UrlProcessingLog> {
    const log: UrlProcessingLog = {
      id: `log-${Date.now()}`,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.processingLogs.push(log);
    return log;
  }

  async updateProcessingLog(id: string, updates: Partial<UrlProcessingLog>): Promise<UrlProcessingLog | undefined> {
    const logIndex = this.processingLogs.findIndex(log => log.id === id);
    if (logIndex === -1) return undefined;
    this.processingLogs[logIndex] = {
      ...this.processingLogs[logIndex],
      ...updates,
      updatedAt: new Date()
    };
    return this.processingLogs[logIndex];
  }

  async getProcessingLogsByAdmin(adminId: string, limit: number = 50): Promise<UrlProcessingLog[]> {
    return this.processingLogs
      .filter(log => log.adminId === adminId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
      .slice(0, limit);
  }

  async getProcessingLogById(id: string): Promise<UrlProcessingLog | undefined> {
    return this.processingLogs.find(log => log.id === id);
  }

  async getRecentProcessingLogs(limit: number = 20): Promise<UrlProcessingLog[]> {
    return this.processingLogs
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
      .slice(0, limit);
  }

  // ─── Template Operations (In-memory) ─────────────────────────────────────

  async getTemplates(): Promise<ExtractionTemplate[]> {
    return this.templates.filter(t => t.isActive);
  }

  async getTemplateById(id: string): Promise<ExtractionTemplate | undefined> {
    return this.templates.find(t => t.id === id && t.isActive);
  }

  async createTemplate(data: Omit<ExtractionTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<ExtractionTemplate> {
    const template: ExtractionTemplate = {
      id: `template-${Date.now()}`,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.templates.push(template);
    return template;
  }

  async updateTemplateSuccessRate(id: string, successRate: number): Promise<void> {
    const template = this.templates.find(t => t.id === id);
    if (template) {
      template.successRate = successRate;
      template.updatedAt = new Date();
    }
  }

  // ─── Dashboard Statistics ─────────────────────────────────────────────────

  async getAdminDashboardStats(adminId: string): Promise<{
    totalProcessed: number;
    successfulExtractions: number;
    failedExtractions: number;
    reviewRequired: number;
    avgProcessingTime: number;
    recentActivity: UrlProcessingLog[];
  }> {
    const adminLogs = await this.getProcessingLogsByAdmin(adminId);
    const totalProcessed = adminLogs.length;
    const successfulExtractions = adminLogs.filter(log => log.status === 'completed').length;
    const failedExtractions = adminLogs.filter(log => log.status === 'failed').length;
    const reviewRequired = adminLogs.filter(log => log.status === 'review_required').length;
    const totalTime = adminLogs.reduce((sum, log) => sum + (log.processingTimeMs || 0), 0);
    const avgProcessingTime = totalProcessed > 0 ? Math.round(totalTime / totalProcessed) : 0;
    const recentActivity = adminLogs.slice(0, 10);

    return {
      totalProcessed,
      successfulExtractions,
      failedExtractions,
      reviewRequired,
      avgProcessingTime,
      recentActivity
    };
  }
}

export const adminStorage = new AdminStorage();