import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, json } from "drizzle-orm/mysql-core";

// ==================== USERS ====================
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  preferences: json("preferences"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ==================== WORKSPACES ====================
export const workspaces = mysqlTable("workspaces", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  icon: varchar("icon", { length: 64 }),
  color: varchar("color", { length: 32 }),
  isDefault: boolean("isDefault").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Workspace = typeof workspaces.$inferSelect;
export type InsertWorkspace = typeof workspaces.$inferInsert;

// ==================== NOTES (Notion-style) ====================
export const notes = mysqlTable("notes", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  workspaceId: int("workspaceId"),
  parentId: int("parentId"),
  title: varchar("title", { length: 500 }).notNull().default("Untitled"),
  content: json("content"), // Block-based content
  icon: varchar("icon", { length: 64 }),
  coverImage: text("coverImage"),
  isArchived: boolean("isArchived").default(false),
  isFavorite: boolean("isFavorite").default(false),
  position: int("position").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Note = typeof notes.$inferSelect;
export type InsertNote = typeof notes.$inferInsert;

// ==================== CRM - CONTACTS ====================
export const contacts = mysqlTable("contacts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  workspaceId: int("workspaceId"),
  firstName: varchar("firstName", { length: 100 }).notNull(),
  lastName: varchar("lastName", { length: 100 }),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 50 }),
  company: varchar("company", { length: 255 }),
  jobTitle: varchar("jobTitle", { length: 255 }),
  avatar: text("avatar"),
  status: mysqlEnum("status", ["lead", "prospect", "customer", "inactive"]).default("lead"),
  source: varchar("source", { length: 100 }),
  notes: text("notes"),
  tags: json("tags"),
  customFields: json("customFields"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Contact = typeof contacts.$inferSelect;
export type InsertContact = typeof contacts.$inferInsert;

// ==================== CRM - COMPANIES ====================
export const companies = mysqlTable("companies", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  workspaceId: int("workspaceId"),
  name: varchar("name", { length: 255 }).notNull(),
  domain: varchar("domain", { length: 255 }),
  industry: varchar("industry", { length: 100 }),
  size: varchar("size", { length: 50 }),
  revenue: varchar("revenue", { length: 50 }),
  logo: text("logo"),
  description: text("description"),
  address: text("address"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Company = typeof companies.$inferSelect;
export type InsertCompany = typeof companies.$inferInsert;

// ==================== CRM - DEALS ====================
export const deals = mysqlTable("deals", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  workspaceId: int("workspaceId"),
  contactId: int("contactId"),
  companyId: int("companyId"),
  title: varchar("title", { length: 255 }).notNull(),
  value: int("value").default(0),
  currency: varchar("currency", { length: 10 }).default("USD"),
  stage: mysqlEnum("stage", ["lead", "qualified", "proposal", "negotiation", "closed_won", "closed_lost"]).default("lead"),
  probability: int("probability").default(0),
  expectedCloseDate: timestamp("expectedCloseDate"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Deal = typeof deals.$inferSelect;
export type InsertDeal = typeof deals.$inferInsert;

// ==================== CONTENT MANAGEMENT ====================
export const content = mysqlTable("content", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  workspaceId: int("workspaceId"),
  title: varchar("title", { length: 500 }).notNull(),
  type: mysqlEnum("type", ["document", "image", "video", "file", "link"]).default("document"),
  content: json("content"),
  fileUrl: text("fileUrl"),
  fileKey: varchar("fileKey", { length: 500 }),
  mimeType: varchar("mimeType", { length: 100 }),
  fileSize: int("fileSize"),
  category: varchar("category", { length: 100 }),
  tags: json("tags"),
  status: mysqlEnum("status", ["draft", "published", "archived"]).default("draft"),
  version: int("version").default(1),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Content = typeof content.$inferSelect;
export type InsertContent = typeof content.$inferInsert;

// ==================== PROJECTS ====================
export const projects = mysqlTable("projects", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  workspaceId: int("workspaceId"),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  color: varchar("color", { length: 32 }),
  icon: varchar("icon", { length: 64 }),
  status: mysqlEnum("status", ["active", "on_hold", "completed", "cancelled"]).default("active"),
  startDate: timestamp("startDate"),
  endDate: timestamp("endDate"),
  progress: int("progress").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;

// ==================== TASKS ====================
export const tasks = mysqlTable("tasks", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  projectId: int("projectId"),
  workspaceId: int("workspaceId"),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description"),
  status: mysqlEnum("status", ["backlog", "todo", "in_progress", "review", "done"]).default("todo"),
  priority: mysqlEnum("priority", ["low", "medium", "high", "urgent"]).default("medium"),
  dueDate: timestamp("dueDate"),
  assigneeId: int("assigneeId"),
  tags: json("tags"),
  position: int("position").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Task = typeof tasks.$inferSelect;
export type InsertTask = typeof tasks.$inferInsert;

// ==================== CANVAS ELEMENTS ====================
export const canvasElements = mysqlTable("canvas_elements", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  workspaceId: int("workspaceId"),
  projectId: int("projectId"),
  type: mysqlEnum("type", ["shape", "text", "image", "sticky", "connector", "frame"]).default("shape"),
  x: int("x").default(0),
  y: int("y").default(0),
  width: int("width").default(100),
  height: int("height").default(100),
  rotation: int("rotation").default(0),
  content: json("content"),
  style: json("style"),
  zIndex: int("zIndex").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CanvasElement = typeof canvasElements.$inferSelect;
export type InsertCanvasElement = typeof canvasElements.$inferInsert;

// ==================== EMAILS ====================
export const emails = mysqlTable("emails", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  workspaceId: int("workspaceId"),
  threadId: varchar("threadId", { length: 100 }),
  fromAddress: varchar("fromAddress", { length: 320 }).notNull(),
  toAddresses: json("toAddresses"),
  ccAddresses: json("ccAddresses"),
  subject: varchar("subject", { length: 500 }),
  body: text("body"),
  htmlBody: text("htmlBody"),
  folder: mysqlEnum("folder", ["inbox", "sent", "drafts", "trash", "archive", "spam"]).default("inbox"),
  isRead: boolean("isRead").default(false),
  isStarred: boolean("isStarred").default(false),
  hasAttachments: boolean("hasAttachments").default(false),
  attachments: json("attachments"),
  sentAt: timestamp("sentAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Email = typeof emails.$inferSelect;
export type InsertEmail = typeof emails.$inferInsert;

// ==================== CODE FILES ====================
export const codeFiles = mysqlTable("code_files", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  workspaceId: int("workspaceId"),
  projectId: int("projectId"),
  parentId: int("parentId"),
  name: varchar("name", { length: 255 }).notNull(),
  type: mysqlEnum("type", ["file", "folder"]).default("file"),
  language: varchar("language", { length: 50 }),
  content: text("content"),
  path: varchar("path", { length: 1000 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CodeFile = typeof codeFiles.$inferSelect;
export type InsertCodeFile = typeof codeFiles.$inferInsert;

// ==================== TERMINAL SESSIONS ====================
export const terminalSessions = mysqlTable("terminal_sessions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  workspaceId: int("workspaceId"),
  name: varchar("name", { length: 100 }).default("Terminal"),
  history: json("history"),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TerminalSession = typeof terminalSessions.$inferSelect;
export type InsertTerminalSession = typeof terminalSessions.$inferInsert;

// ==================== ACTIVITIES ====================
export const activities = mysqlTable("activities", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  workspaceId: int("workspaceId"),
  entityType: varchar("entityType", { length: 50 }).notNull(),
  entityId: int("entityId").notNull(),
  action: varchar("action", { length: 50 }).notNull(),
  description: text("description"),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = typeof activities.$inferInsert;


// ==================== STORAGE DRIVES ====================
export const storageDrives = mysqlTable("storage_drives", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  type: mysqlEnum("type", ["local", "cloud", "virtual", "network", "external"]).default("local"),
  provider: varchar("provider", { length: 100 }), // s3, gdrive, dropbox, onedrive, etc.
  icon: varchar("icon", { length: 64 }),
  color: varchar("color", { length: 32 }),
  totalSpace: varchar("totalSpace", { length: 50 }),
  usedSpace: varchar("usedSpace", { length: 50 }),
  status: mysqlEnum("status", ["connected", "disconnected", "syncing", "error"]).default("connected"),
  credentials: text("credentials"), // encrypted credentials
  mountPath: varchar("mountPath", { length: 500 }),
  lastSynced: timestamp("lastSynced"),
  settings: json("settings"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type StorageDrive = typeof storageDrives.$inferSelect;
export type InsertStorageDrive = typeof storageDrives.$inferInsert;

// ==================== STORAGE FILES ====================
export const storageFiles = mysqlTable("storage_files", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  driveId: int("driveId").notNull(),
  parentId: int("parentId"),
  name: varchar("name", { length: 500 }).notNull(),
  type: mysqlEnum("type", ["file", "folder", "shortcut"]).default("file"),
  mimeType: varchar("mimeType", { length: 200 }),
  size: varchar("size", { length: 50 }),
  path: varchar("path", { length: 2000 }),
  fileUrl: text("fileUrl"),
  fileKey: varchar("fileKey", { length: 500 }),
  thumbnail: text("thumbnail"),
  isStarred: boolean("isStarred").default(false),
  isTrashed: boolean("isTrashed").default(false),
  isShared: boolean("isShared").default(false),
  shareSettings: json("shareSettings"),
  metadata: json("metadata"),
  tags: json("tags"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type StorageFile = typeof storageFiles.$inferSelect;
export type InsertStorageFile = typeof storageFiles.$inferInsert;

// ==================== SECRETS VAULT ====================
export const secretsVault = mysqlTable("secrets_vault", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  type: mysqlEnum("type", ["api_key", "credential", "certificate", "token", "ssh_key", "other"]).default("credential"),
  category: varchar("category", { length: 100 }),
  encryptedValue: text("encryptedValue").notNull(),
  description: text("description"),
  expiresAt: timestamp("expiresAt"),
  lastUsed: timestamp("lastUsed"),
  tags: json("tags"),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SecretVault = typeof secretsVault.$inferSelect;
export type InsertSecretVault = typeof secretsVault.$inferInsert;

// ==================== PASSWORD VAULT ====================
export const passwordVault = mysqlTable("password_vault", {
  id: int("id").autoincrement().primaryKey(),
  odId: varchar("odId", { length: 64 }).notNull(), // offline-capable unique ID
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  username: varchar("username", { length: 320 }),
  encryptedPassword: text("encryptedPassword").notNull(),
  url: text("url"),
  category: varchar("category", { length: 100 }),
  folderId: int("folderId"),
  icon: varchar("icon", { length: 64 }),
  favicon: text("favicon"),
  notes: text("notes"),
  isFavorite: boolean("isFavorite").default(false),
  lastUsed: timestamp("lastUsed"),
  passwordStrength: int("passwordStrength").default(0),
  customFields: json("customFields"),
  tags: json("tags"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PasswordVault = typeof passwordVault.$inferSelect;
export type InsertPasswordVault = typeof passwordVault.$inferInsert;

// ==================== PASSWORD FOLDERS ====================
export const passwordFolders = mysqlTable("password_folders", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  parentId: int("parentId"),
  name: varchar("name", { length: 255 }).notNull(),
  icon: varchar("icon", { length: 64 }),
  color: varchar("color", { length: 32 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PasswordFolder = typeof passwordFolders.$inferSelect;
export type InsertPasswordFolder = typeof passwordFolders.$inferInsert;

// ==================== 2FA / TOTP TOKENS ====================
export const totpTokens = mysqlTable("totp_tokens", {
  id: int("id").autoincrement().primaryKey(),
  odId: varchar("odId", { length: 64 }).notNull(), // offline-capable unique ID
  userId: int("userId").notNull(),
  passwordId: int("passwordId"), // linked to password entry
  name: varchar("name", { length: 255 }).notNull(),
  issuer: varchar("issuer", { length: 255 }),
  encryptedSecret: text("encryptedSecret").notNull(),
  algorithm: varchar("algorithm", { length: 20 }).default("SHA1"),
  digits: int("digits").default(6),
  period: int("period").default(30),
  icon: varchar("icon", { length: 64 }),
  favicon: text("favicon"),
  category: varchar("category", { length: 100 }),
  isFavorite: boolean("isFavorite").default(false),
  lastUsed: timestamp("lastUsed"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TotpToken = typeof totpTokens.$inferSelect;
export type InsertTotpToken = typeof totpTokens.$inferInsert;

// ==================== MFA BACKUP CODES ====================
export const mfaBackupCodes = mysqlTable("mfa_backup_codes", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  passwordId: int("passwordId"),
  totpId: int("totpId"),
  encryptedCodes: text("encryptedCodes").notNull(),
  usedCodes: json("usedCodes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MfaBackupCode = typeof mfaBackupCodes.$inferSelect;
export type InsertMfaBackupCode = typeof mfaBackupCodes.$inferInsert;

// ==================== PASSWORD HISTORY ====================
export const passwordHistory = mysqlTable("password_history", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  passwordId: int("passwordId").notNull(),
  encryptedPassword: text("encryptedPassword").notNull(),
  changedAt: timestamp("changedAt").defaultNow().notNull(),
});

export type PasswordHistoryEntry = typeof passwordHistory.$inferSelect;
export type InsertPasswordHistory = typeof passwordHistory.$inferInsert;

// ==================== BREACH ALERTS ====================
export const breachAlerts = mysqlTable("breach_alerts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  passwordId: int("passwordId"),
  breachName: varchar("breachName", { length: 255 }),
  breachDate: timestamp("breachDate"),
  description: text("description"),
  severity: mysqlEnum("severity", ["low", "medium", "high", "critical"]).default("medium"),
  isResolved: boolean("isResolved").default(false),
  resolvedAt: timestamp("resolvedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type BreachAlert = typeof breachAlerts.$inferSelect;
export type InsertBreachAlert = typeof breachAlerts.$inferInsert;
