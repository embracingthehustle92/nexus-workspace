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
