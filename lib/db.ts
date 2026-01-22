// JSON-based database implementation
// This provides a simple file-based database for users and teachers

import fs from 'fs';
import path from 'path';

const DB_DIR = path.join(process.cwd(), 'data', 'db');

// Ensure database directory exists
function ensureDbDir() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
}

// Generic read function
function readDb<T>(filename: string, defaultValue: T): T {
  ensureDbDir();
  const filepath = path.join(DB_DIR, filename);
  if (!fs.existsSync(filepath)) {
    writeDb(filename, defaultValue);
    return defaultValue;
  }
  try {
    const data = fs.readFileSync(filepath, 'utf-8');
    return JSON.parse(data) as T;
  } catch {
    return defaultValue;
  }
}

// Generic write function
function writeDb<T>(filename: string, data: T): void {
  ensureDbDir();
  const filepath = path.join(DB_DIR, filename);
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8');
}

// User types
export interface DbUser {
  id: string;
  email: string;
  name: string;
  image?: string;
  provider: 'google' | 'github';
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

export interface DbTeacher {
  id: string;
  name: string;
  imageUrl: string;
  greeting: string;
  greetingTranslation: string;
  specialty: string;
  gender?: 'male' | 'female';
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DbSettings {
  elevenLabsApiKey?: string;
  elevenLabsVoiceId?: string;
  usePremiumTTS: boolean;
  updatedAt: string;
}

// User functions
export function getUsers(): DbUser[] {
  return readDb<DbUser[]>('users.json', []);
}

export function getUserById(id: string): DbUser | null {
  const users = getUsers();
  return users.find(u => u.id === id) || null;
}

export function getUserByEmail(email: string): DbUser | null {
  const users = getUsers();
  return users.find(u => u.email === email) || null;
}

export function getUserByProviderId(provider: string, providerId: string): DbUser | null {
  const users = getUsers();
  return users.find(u => u.provider === provider && u.providerId === providerId) || null;
}

export function createUser(user: Omit<DbUser, 'id' | 'createdAt' | 'updatedAt'>): DbUser {
  const users = getUsers();
  const newUser: DbUser = {
    ...user,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  users.push(newUser);
  writeDb('users.json', users);
  return newUser;
}

export function updateUser(id: string, updates: Partial<Omit<DbUser, 'id' | 'createdAt'>>): DbUser | null {
  const users = getUsers();
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return null;

  users[index] = {
    ...users[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  writeDb('users.json', users);
  return users[index];
}

export function deleteUser(id: string): boolean {
  const users = getUsers();
  const filtered = users.filter(u => u.id !== id);
  if (filtered.length === users.length) return false;
  writeDb('users.json', filtered);
  // Also delete associated sessions
  const sessions = getSessions().filter(s => s.userId !== id);
  writeDb('sessions.json', sessions);
  return true;
}

// Session functions
export function getSessions(): DbSession[] {
  return readDb<DbSession[]>('sessions.json', []);
}

export function getSessionByToken(token: string): DbSession | null {
  const sessions = getSessions();
  const session = sessions.find(s => s.token === token);
  if (!session) return null;

  // Check if expired
  if (new Date(session.expiresAt) < new Date()) {
    deleteSession(session.id);
    return null;
  }
  return session;
}

export function createSession(userId: string): DbSession {
  const sessions = getSessions();
  const newSession: DbSession = {
    id: generateId(),
    userId,
    token: generateToken(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    createdAt: new Date().toISOString(),
  };
  sessions.push(newSession);
  writeDb('sessions.json', sessions);
  return newSession;
}

export function deleteSession(id: string): boolean {
  const sessions = getSessions();
  const filtered = sessions.filter(s => s.id !== id);
  if (filtered.length === sessions.length) return false;
  writeDb('sessions.json', filtered);
  return true;
}

export function deleteSessionByToken(token: string): boolean {
  const sessions = getSessions();
  const filtered = sessions.filter(s => s.token !== token);
  if (filtered.length === sessions.length) return false;
  writeDb('sessions.json', filtered);
  return true;
}

// Teacher functions
export function getTeachers(includeInactive = false): DbTeacher[] {
  const teachers = readDb<DbTeacher[]>('teachers.json', []);
  if (includeInactive) return teachers;
  return teachers.filter(t => t.isActive).sort((a, b) => a.order - b.order);
}

export function getTeacherById(id: string): DbTeacher | null {
  const teachers = readDb<DbTeacher[]>('teachers.json', []);
  return teachers.find(t => t.id === id) || null;
}

export function createTeacher(teacher: Omit<DbTeacher, 'id' | 'createdAt' | 'updatedAt'>): DbTeacher {
  const teachers = readDb<DbTeacher[]>('teachers.json', []);
  const newTeacher: DbTeacher = {
    ...teacher,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  teachers.push(newTeacher);
  writeDb('teachers.json', teachers);
  return newTeacher;
}

export function updateTeacher(id: string, updates: Partial<Omit<DbTeacher, 'id' | 'createdAt'>>): DbTeacher | null {
  const teachers = readDb<DbTeacher[]>('teachers.json', []);
  const index = teachers.findIndex(t => t.id === id);
  if (index === -1) return null;

  teachers[index] = {
    ...teachers[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  writeDb('teachers.json', teachers);
  return teachers[index];
}

export function deleteTeacher(id: string): boolean {
  // Soft delete - just set isActive to false
  const result = updateTeacher(id, { isActive: false });
  return result !== null;
}

export function hardDeleteTeacher(id: string): boolean {
  const teachers = readDb<DbTeacher[]>('teachers.json', []);
  const filtered = teachers.filter(t => t.id !== id);
  if (filtered.length === teachers.length) return false;
  writeDb('teachers.json', filtered);
  return true;
}

// Helper functions
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function generateToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 64; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

// Settings functions
const defaultSettings: DbSettings = {
  usePremiumTTS: false,
  updatedAt: new Date().toISOString(),
};

export function getSettings(): DbSettings {
  return readDb<DbSettings>('settings.json', defaultSettings);
}

export function updateSettings(updates: Partial<Omit<DbSettings, 'updatedAt'>>): DbSettings {
  const current = getSettings();
  const updated: DbSettings = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  writeDb('settings.json', updated);
  return updated;
}

// Initialize teachers from static data if database is empty
export function initializeTeachersFromStatic() {
  const teachers = readDb<DbTeacher[]>('teachers.json', []);
  if (teachers.length > 0) return; // Already initialized

  // Import will be done separately to avoid circular dependencies
  console.log('Teachers database needs to be seeded');
}
