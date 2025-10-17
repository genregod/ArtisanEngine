import { pgTable, text, integer, serial, timestamp, boolean, jsonb, varchar, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique(),
  email: text("email").unique(),
  replitId: text("replit_id").unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImageUrl: text("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const releases = pgTable("releases", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  artist: text("artist").notNull(),
  type: text("type").notNull(), // single, ep, album
  releaseDate: timestamp("release_date").notNull(),
  status: text("status").notNull().default("draft"), // draft, scheduled, released
  spotifyUrl: text("spotify_url"),
  youtubeUrl: text("youtube_url"),
  coverArt: text("cover_art"),
  genre: text("genre"),
  mood: text("mood"),
  instruments: text("instruments"),
  story: text("story"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const campaigns = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  releaseId: integer("release_id").references(() => releases.id).notNull(),
  name: text("name").notNull(),
  strategy: text("strategy").notNull(), // waterfall, reignition, momentum, standard
  phase: text("phase").notNull(), // awareness, engagement, conversion
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  budget: integer("budget"),
  goals: jsonb("goals"), // { streams: 10000, saves: 500, followers: 200 }
  status: text("status").notNull().default("active"), // active, paused, completed
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const contentCalendar = pgTable("content_calendar", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").references(() => campaigns.id),
  weekTheme: text("week_theme"), // "The Story Behind", "The Echo", "The Response", "The Deep Dive"
  title: text("title").notNull(),
  description: text("description"),
  scheduledDate: timestamp("scheduled_date").notNull(),
  platforms: text("platforms").array().notNull(), // ["tiktok", "instagram", "youtube"]
  contentType: text("content_type").notNull(), // video, image, story, reel, short
  status: text("status").notNull().default("draft"), // draft, scheduled, posted
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const socialPosts = pgTable("social_posts", {
  id: serial("id").primaryKey(),
  contentId: integer("content_id").references(() => contentCalendar.id),
  platform: text("platform").notNull(), // tiktok, instagram, facebook, youtube
  caption: text("caption").notNull(),
  hashtags: text("hashtags").array(),
  script: text("script"),
  visualConcept: text("visual_concept"),
  cta: text("cta"),
  thumbnail: text("thumbnail"),
  musicUrl: text("music_url"),
  postedAt: timestamp("posted_at"),
  engagement: jsonb("engagement"), // { likes: 0, comments: 0, shares: 0, saves: 0 }
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const templates = pgTable("templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // script, ad_copy, caption, thumbnail_concept, email
  type: text("type").notNull(), // awareness, engagement, conversion
  platform: text("platform"), // tiktok, instagram, facebook, youtube, email, all
  content: text("content").notNull(),
  variables: text("variables").array(), // ["song_title", "artist_name", "story_hook"]
  isPublic: boolean("is_public").default(true),
  useCount: integer("use_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const assets = pgTable("assets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  releaseId: integer("release_id").references(() => releases.id),
  name: text("name").notNull(),
  type: text("type").notNull(), // image, video, audio, document, lyric_sheet
  url: text("url").notNull(),
  fileSize: integer("file_size"),
  metadata: jsonb("metadata"), // { duration: 180, dimensions: "1920x1080" }
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const analytics = pgTable("analytics", {
  id: serial("id").primaryKey(),
  releaseId: integer("release_id").references(() => releases.id).notNull(),
  platform: text("platform").notNull(), // spotify, youtube, tiktok, instagram
  date: timestamp("date").notNull(),
  metrics: jsonb("metrics").notNull(), // { streams: 1000, saves: 50, listeners: 800, ctr: 0.05 }
  segment: text("segment"), // super_listeners, moderate_listeners, light_listeners, programmed
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const playlistPitches = pgTable("playlist_pitches", {
  id: serial("id").primaryKey(),
  releaseId: integer("release_id").references(() => releases.id).notNull(),
  playlistName: text("playlist_name").notNull(),
  curatorName: text("curator_name"),
  curatorContact: text("curator_contact"),
  platform: text("platform").notNull().default("spotify"), // spotify, apple, youtube
  pitchDate: timestamp("pitch_date").defaultNow().notNull(),
  status: text("status").notNull().default("pending"), // pending, accepted, rejected, added
  playlistUrl: text("playlist_url"),
  followers: integer("followers"),
  notes: text("notes"),
});

export const abTests = pgTable("ab_tests", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").references(() => campaigns.id).notNull(),
  name: text("name").notNull(),
  testType: text("test_type").notNull(), // headline, primary_text, cta, creative, thumbnail
  variantA: text("variant_a").notNull(),
  variantB: text("variant_b").notNull(),
  variantC: text("variant_c"),
  results: jsonb("results"), // { a: { clicks: 100, ctr: 0.05 }, b: { clicks: 150, ctr: 0.075 } }
  winner: text("winner"),
  status: text("status").notNull().default("running"), // running, completed
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, updatedAt: true });
export const upsertUserSchema = createInsertSchema(users).omit({ id: true, username: true, createdAt: true, updatedAt: true });
export const insertReleaseSchema = createInsertSchema(releases).omit({ id: true, createdAt: true });
export const insertCampaignSchema = createInsertSchema(campaigns).omit({ id: true, createdAt: true });
export const insertContentCalendarSchema = createInsertSchema(contentCalendar).omit({ id: true, createdAt: true });
export const insertSocialPostSchema = createInsertSchema(socialPosts).omit({ id: true, createdAt: true });
export const insertTemplateSchema = createInsertSchema(templates).omit({ id: true, createdAt: true });
export const insertAssetSchema = createInsertSchema(assets).omit({ id: true, createdAt: true });
export const insertAnalyticsSchema = createInsertSchema(analytics).omit({ id: true, createdAt: true });
export const insertPlaylistPitchSchema = createInsertSchema(playlistPitches).omit({ id: true });
export const insertABTestSchema = createInsertSchema(abTests).omit({ id: true, createdAt: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type Release = typeof releases.$inferSelect;
export type InsertRelease = z.infer<typeof insertReleaseSchema>;
export type Campaign = typeof campaigns.$inferSelect;
export type InsertCampaign = z.infer<typeof insertCampaignSchema>;
export type ContentCalendar = typeof contentCalendar.$inferSelect;
export type InsertContentCalendar = z.infer<typeof insertContentCalendarSchema>;
export type SocialPost = typeof socialPosts.$inferSelect;
export type InsertSocialPost = z.infer<typeof insertSocialPostSchema>;
export type Template = typeof templates.$inferSelect;
export type InsertTemplate = z.infer<typeof insertTemplateSchema>;
export type Asset = typeof assets.$inferSelect;
export type InsertAsset = z.infer<typeof insertAssetSchema>;
export type Analytics = typeof analytics.$inferSelect;
export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;
export type PlaylistPitch = typeof playlistPitches.$inferSelect;
export type InsertPlaylistPitch = z.infer<typeof insertPlaylistPitchSchema>;
export type ABTest = typeof abTests.$inferSelect;
export type InsertABTest = z.infer<typeof insertABTestSchema>;
