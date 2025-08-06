import bcrypt from "bcryptjs";
import type { AdminUser } from "@shared/schema";

// Simple session storage for admin users
const adminSessions = new Map<string, { adminId: string; expiresAt: number }>();

export function generateSessionToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function createAdminSession(adminId: string): string {
  const token = generateSessionToken();
  const expiresAt = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
  
  adminSessions.set(token, { adminId, expiresAt });
  return token;
}

export function validateAdminSession(token: string): string | null {
  const session = adminSessions.get(token);
  if (!session || Date.now() > session.expiresAt) {
    if (session) adminSessions.delete(token);
    return null;
  }
  return session.adminId;
}

export function revokeAdminSession(token: string): void {
  adminSessions.delete(token);
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

export function requireAdminAuth(token?: string): string | null {
  if (!token) return null;
  return validateAdminSession(token);
}