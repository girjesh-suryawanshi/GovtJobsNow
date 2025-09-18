import bcrypt from "bcryptjs";

// Simple in-memory session storage for users (in production, use Redis or database)
const userSessions = new Map<string, { userId: string; expiresAt: number }>();

export function generateSessionToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function createUserSession(userId: string): string {
  const token = generateSessionToken();
  const expiresAt = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 days
  
  userSessions.set(token, { userId, expiresAt });
  return token;
}

export function validateUserSession(token: string): string | null {
  const session = userSessions.get(token);
  if (!session || Date.now() > session.expiresAt) {
    if (session) userSessions.delete(token);
    return null;
  }
  return session.userId;
}

export function revokeUserSession(token: string): void {
  userSessions.delete(token);
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

export function requireUserAuth(token?: string): string | null {
  if (!token) return null;
  return validateUserSession(token);
}