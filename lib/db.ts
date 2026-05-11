// JSON-based database implementation
// This provides a simple file-based database for users, sessions, and settings.

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const DB_DIR = path.join(process.cwd(), 'data', 'db');

// Ensure database directory exists
function ensureDbDir() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
}

// Generic read function
async function readDb<T>(filename: string, defaultValue: T): Promise<T> {
  ensureDbDir();
  const filepath = path.join(DB_DIR, filename);
  try {
    await fs.promises.access(filepath);
  } catch {
    // File doesn't exist, write default value
    await writeDb(filename, defaultValue);
    return defaultValue;
  }
  try {
    const data = await fs.promises.readFile(filepath, 'utf-8');
    return JSON.parse(data) as T;
  } catch {
    return defaultValue;
  }
}

// Generic write function
async function writeDb<T>(filename: string, data: T): Promise<void> {
  ensureDbDir();
  const filepath = path.join(DB_DIR, filename);
  await fs.promises.writeFile(filepath, JSON.stringify(data, null, 2), 'utf-8');
}

// User types
export interface DbUser {
  id: string;
  email: string;
  name: string;
  image?: string;
  provider: 'google' | 'github' | 'discord';
  providerId: string;
  role: 'USER' | 'ADMIN';
  approved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DbSession {
  id: string;
  userId: string;
  token: string;
  expiresAt: string;
  createdAt: string;
}

export interface DbSettings {
  elevenLabsApiKey?: string;
  elevenLabsVoiceId?: string;
  usePremiumTTS: boolean;
  updatedAt: string;
}

// User functions
export async function getUsers(): Promise<DbUser[]> {
  return await readDb<DbUser[]>('users.json', []);
}

export async function getUserById(id: string): Promise<DbUser | null> {
  const users = await getUsers();
  return users.find(u => u.id === id) || null;
}

export async function getUserByEmail(email: string): Promise<DbUser | null> {
  const users = await getUsers();
  return users.find(u => u.email === email) || null;
}

export async function getUserByProviderId(provider: string, providerId: string): Promise<DbUser | null> {
  const users = await getUsers();
  return users.find(u => u.provider === provider && u.providerId === providerId) || null;
}

export async function createUser(user: Omit<DbUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<DbUser> {
  const users = await getUsers();
  const newUser: DbUser = {
    ...user,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  users.push(newUser);
  await writeDb('users.json', users);
  return newUser;
}

export async function updateUser(id: string, updates: Partial<Omit<DbUser, 'id' | 'createdAt'>>): Promise<DbUser | null> {
  const users = await getUsers();
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return null;

  users[index] = {
    ...users[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  await writeDb('users.json', users);
  return users[index];
}

export async function deleteUser(id: string): Promise<boolean> {
  const users = await getUsers();
  const filtered = users.filter(u => u.id !== id);
  if (filtered.length === users.length) return false;
  await writeDb('users.json', filtered);
  // Also delete associated sessions
  const sessions = await getSessions();
  const filteredSessions = sessions.filter(s => s.userId !== id);
  await writeDb('sessions.json', filteredSessions);
  return true;
}

// Session functions
export async function getSessions(): Promise<DbSession[]> {
  return await readDb<DbSession[]>('sessions.json', []);
}

export async function getSessionByToken(token: string): Promise<DbSession | null> {
  const sessions = await getSessions();
  const session = sessions.find(s => s.token === token);
  if (!session) return null;

  // Check if expired
  if (new Date(session.expiresAt) < new Date()) {
    await deleteSession(session.id);
    return null;
  }
  return session;
}

export async function createSession(userId: string): Promise<DbSession> {
  const sessions = await getSessions();
  const newSession: DbSession = {
    id: generateId(),
    userId,
    token: generateToken(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    createdAt: new Date().toISOString(),
  };
  sessions.push(newSession);
  await writeDb('sessions.json', sessions);
  return newSession;
}

export async function deleteSession(id: string): Promise<boolean> {
  const sessions = await getSessions();
  const filtered = sessions.filter(s => s.id !== id);
  if (filtered.length === sessions.length) return false;
  await writeDb('sessions.json', filtered);
  return true;
}

export async function deleteSessionByToken(token: string): Promise<boolean> {
  const sessions = await getSessions();
  const filtered = sessions.filter(s => s.token !== token);
  if (filtered.length === sessions.length) return false;
  await writeDb('sessions.json', filtered);
  return true;
}

// Helper functions
function generateId(): string {
  return crypto.randomUUID();
}

function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Settings functions
const defaultSettings: DbSettings = {
  usePremiumTTS: false,
  updatedAt: new Date().toISOString(),
};

export async function getSettings(): Promise<DbSettings> {
  return await readDb<DbSettings>('settings.json', defaultSettings);
}

export async function updateSettings(updates: Partial<Omit<DbSettings, 'updatedAt'>>): Promise<DbSettings> {
  const current = await getSettings();
  const updated: DbSettings = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  await writeDb('settings.json', updated);
  return updated;
}
