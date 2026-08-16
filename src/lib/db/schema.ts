import { boolean, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const appUser = pgTable("app_user", {
  id: uuid("id").defaultRandom().primaryKey(),
  githubUserId: text("github_user_id").notNull().unique(),
  githubLogin: text("github_login").notNull(),
  authMethod: text("auth_method").notNull().default("oauth"),
  encryptedAccessToken: text("encrypted_access_token").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const session = pgTable("session", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionHash: text("session_hash").notNull().unique(),
  appUserId: uuid("app_user_id").notNull().references(() => appUser.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const oauthState = pgTable("oauth_state", {
  id: uuid("id").defaultRandom().primaryKey(),
  stateHash: text("state_hash").notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const repository = pgTable("repository", {
  id: uuid("id").defaultRandom().primaryKey(),
  owner: text("owner").notNull(),
  name: text("name").notNull(),
  enabled: boolean("enabled").notNull().default(true),
  note: text("note"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const cacheEntry = pgTable("cache_entry", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
  fetchedAt: timestamp("fetched_at", { withTimezone: true }).notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  sourceRevision: text("source_revision"),
});

export const refreshRun = pgTable("refresh_run", {
  id: uuid("id").defaultRandom().primaryKey(),
  kind: text("kind").notNull(),
  status: text("status").notNull(),
  startedAt: timestamp("started_at", { withTimezone: true }).notNull(),
  finishedAt: timestamp("finished_at", { withTimezone: true }),
  rateLimitRemaining: text("rate_limit_remaining"),
  rateLimitReset: text("rate_limit_reset"),
  errorCode: text("error_code"),
  details: jsonb("details"),
});
