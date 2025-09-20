import type { 
  AdminUser, 
  InsertAdminUser, 
  UrlProcessingLog, 
  ExtractionTemplate 
} from "@shared/schema";

// In-memory storage for admin functionality
// In production, this would be replaced with database operations

class AdminStorage {
  private adminUsers: AdminUser[] = [
    {
      id: "admin-1",
      username: "admin",
      email: "admin@govtjobsnow.in",
      password: "admin123", // Temporarily use plain text for testing
      role: "admin",
      isActive: true,
      lastLogin: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
  
  private processingLogs: UrlProcessingLog[] = [];
  private templates: ExtractionTemplate[] = [];

  // Admin User Operations
  async getAdminByUsername(username: string): Promise<AdminUser | undefined> {
    return this.adminUsers.find(user => user.username === username && user.isActive);
  }

  async getAdminById(id: string): Promise<AdminUser | undefined> {
    return this.adminUsers.find(user => user.id === id && user.isActive);
  }

  async createAdminUser(data: InsertAdminUser): Promise<AdminUser> {
    const newAdmin: AdminUser = {
      id: `admin-${Date.now()}`,
      ...data,
      role: data.role || "admin",
      isActive: true, // Explicitly set new users as active
      lastLogin: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    
    this.adminUsers.push(newAdmin);
    return newAdmin;
  }

  async updateAdminLastLogin(id: string): Promise<void> {
    const admin = this.adminUsers.find(user => user.id === id);
    if (admin) {
      admin.lastLogin = new Date();
      admin.updatedAt = new Date();
    }
  }

  async updateAdminPassword(id: string, newPassword: string): Promise<boolean> {
    const admin = this.adminUsers.find(user => user.id === id);
    if (admin) {
      admin.password = newPassword;
      admin.updatedAt = new Date();
      return true;
    }
    return false;
  }

  async getAllAdminUsers(): Promise<AdminUser[]> {
    return this.adminUsers.filter(user => user.isActive);
  }

  async updateAdminUser(id: string, updates: Partial<Omit<AdminUser, 'id' | 'createdAt'>>): Promise<AdminUser | undefined> {
    const adminIndex = this.adminUsers.findIndex(user => user.id === id);
    if (adminIndex === -1) return undefined;
    
    this.adminUsers[adminIndex] = {
      ...this.adminUsers[adminIndex],
      ...updates,
      updatedAt: new Date()
    };
    
    return this.adminUsers[adminIndex];
  }

  async deleteAdminUser(id: string): Promise<boolean> {
    const adminIndex = this.adminUsers.findIndex(user => user.id === id);
    if (adminIndex === -1) return false;
    
    // Don't actually delete, just mark as inactive
    this.adminUsers[adminIndex].isActive = false;
    this.adminUsers[adminIndex].updatedAt = new Date();
    return true;
  }

  // URL Processing Log Operations
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

  // Template Operations
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

  // Statistics
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