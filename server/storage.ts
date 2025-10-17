import { db } from "./db";
import { eq, desc, and, gte, lte } from "drizzle-orm";
import {
  users, releases, campaigns, contentCalendar, socialPosts,
  templates, assets, analytics, playlistPitches, abTests,
  type User, type InsertUser, type UpsertUser,
  type Release, type InsertRelease,
  type Campaign, type InsertCampaign,
  type ContentCalendar, type InsertContentCalendar,
  type SocialPost, type InsertSocialPost,
  type Template, type InsertTemplate,
  type Asset, type InsertAsset,
  type Analytics, type InsertAnalytics,
  type PlaylistPitch, type InsertPlaylistPitch,
  type ABTest, type InsertABTest
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByReplitId(replitId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Releases
  getReleases(userId: number): Promise<Release[]>;
  getRelease(id: number): Promise<Release | undefined>;
  createRelease(release: InsertRelease): Promise<Release>;
  updateRelease(id: number, release: Partial<InsertRelease>): Promise<Release | undefined>;
  deleteRelease(id: number): Promise<void>;

  // Campaigns
  getCampaigns(releaseId?: number): Promise<Campaign[]>;
  getCampaign(id: number): Promise<Campaign | undefined>;
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  updateCampaign(id: number, campaign: Partial<InsertCampaign>): Promise<Campaign | undefined>;
  deleteCampaign(id: number): Promise<void>;

  // Content Calendar
  getContentCalendar(campaignId?: number): Promise<ContentCalendar[]>;
  getContentItem(id: number): Promise<ContentCalendar | undefined>;
  createContentItem(item: InsertContentCalendar): Promise<ContentCalendar>;
  updateContentItem(id: number, item: Partial<InsertContentCalendar>): Promise<ContentCalendar | undefined>;
  deleteContentItem(id: number): Promise<void>;

  // Social Posts
  getSocialPosts(contentId?: number): Promise<SocialPost[]>;
  getSocialPost(id: number): Promise<SocialPost | undefined>;
  createSocialPost(post: InsertSocialPost): Promise<SocialPost>;
  updateSocialPost(id: number, post: Partial<InsertSocialPost>): Promise<SocialPost | undefined>;
  deleteSocialPost(id: number): Promise<void>;

  // Templates
  getTemplates(category?: string): Promise<Template[]>;
  getTemplate(id: number): Promise<Template | undefined>;
  createTemplate(template: InsertTemplate): Promise<Template>;
  updateTemplate(id: number, template: Partial<InsertTemplate>): Promise<Template | undefined>;
  deleteTemplate(id: number): Promise<void>;

  // Assets
  getAssets(userId: number, releaseId?: number): Promise<Asset[]>;
  getAsset(id: number): Promise<Asset | undefined>;
  createAsset(asset: InsertAsset): Promise<Asset>;
  updateAsset(id: number, asset: Partial<InsertAsset>): Promise<Asset | undefined>;
  deleteAsset(id: number): Promise<void>;

  // Analytics
  getAnalytics(releaseId: number, startDate?: Date, endDate?: Date): Promise<Analytics[]>;
  createAnalytics(analytics: InsertAnalytics): Promise<Analytics>;

  // Playlist Pitches
  getPlaylistPitches(releaseId: number): Promise<PlaylistPitch[]>;
  getPlaylistPitch(id: number): Promise<PlaylistPitch | undefined>;
  createPlaylistPitch(pitch: InsertPlaylistPitch): Promise<PlaylistPitch>;
  updatePlaylistPitch(id: number, pitch: Partial<InsertPlaylistPitch>): Promise<PlaylistPitch | undefined>;
  deletePlaylistPitch(id: number): Promise<void>;

  // A/B Tests
  getABTests(campaignId: number): Promise<ABTest[]>;
  getABTest(id: number): Promise<ABTest | undefined>;
  createABTest(test: InsertABTest): Promise<ABTest>;
  updateABTest(id: number, test: Partial<InsertABTest>): Promise<ABTest | undefined>;
  deleteABTest(id: number): Promise<void>;
}

export class DbStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async getUserByReplitId(replitId: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.replitId, replitId)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const result = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.replitId,
        set: {
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          profileImageUrl: userData.profileImageUrl,
          updatedAt: new Date(),
        },
      })
      .returning();
    return result[0];
  }

  // Releases
  async getReleases(userId: number): Promise<Release[]> {
    return await db.select().from(releases).where(eq(releases.userId, userId)).orderBy(desc(releases.releaseDate));
  }

  async getRelease(id: number): Promise<Release | undefined> {
    const result = await db.select().from(releases).where(eq(releases.id, id)).limit(1);
    return result[0];
  }

  async createRelease(release: InsertRelease): Promise<Release> {
    const result = await db.insert(releases).values(release).returning();
    return result[0];
  }

  async updateRelease(id: number, release: Partial<InsertRelease>): Promise<Release | undefined> {
    const result = await db.update(releases).set(release).where(eq(releases.id, id)).returning();
    return result[0];
  }

  async deleteRelease(id: number): Promise<void> {
    await db.delete(releases).where(eq(releases.id, id));
  }

  // Campaigns
  async getCampaigns(releaseId?: number): Promise<Campaign[]> {
    if (releaseId) {
      return await db.select().from(campaigns).where(eq(campaigns.releaseId, releaseId)).orderBy(desc(campaigns.startDate));
    }
    return await db.select().from(campaigns).orderBy(desc(campaigns.startDate));
  }

  async getCampaign(id: number): Promise<Campaign | undefined> {
    const result = await db.select().from(campaigns).where(eq(campaigns.id, id)).limit(1);
    return result[0];
  }

  async createCampaign(campaign: InsertCampaign): Promise<Campaign> {
    const result = await db.insert(campaigns).values(campaign).returning();
    return result[0];
  }

  async updateCampaign(id: number, campaign: Partial<InsertCampaign>): Promise<Campaign | undefined> {
    const result = await db.update(campaigns).set(campaign).where(eq(campaigns.id, id)).returning();
    return result[0];
  }

  async deleteCampaign(id: number): Promise<void> {
    await db.delete(campaigns).where(eq(campaigns.id, id));
  }

  // Content Calendar
  async getContentCalendar(campaignId?: number): Promise<ContentCalendar[]> {
    if (campaignId) {
      return await db.select().from(contentCalendar).where(eq(contentCalendar.campaignId, campaignId)).orderBy(contentCalendar.scheduledDate);
    }
    return await db.select().from(contentCalendar).orderBy(contentCalendar.scheduledDate);
  }

  async getContentItem(id: number): Promise<ContentCalendar | undefined> {
    const result = await db.select().from(contentCalendar).where(eq(contentCalendar.id, id)).limit(1);
    return result[0];
  }

  async createContentItem(item: InsertContentCalendar): Promise<ContentCalendar> {
    const result = await db.insert(contentCalendar).values(item).returning();
    return result[0];
  }

  async updateContentItem(id: number, item: Partial<InsertContentCalendar>): Promise<ContentCalendar | undefined> {
    const result = await db.update(contentCalendar).set(item).where(eq(contentCalendar.id, id)).returning();
    return result[0];
  }

  async deleteContentItem(id: number): Promise<void> {
    await db.delete(contentCalendar).where(eq(contentCalendar.id, id));
  }

  // Social Posts
  async getSocialPosts(contentId?: number): Promise<SocialPost[]> {
    if (contentId) {
      return await db.select().from(socialPosts).where(eq(socialPosts.contentId, contentId));
    }
    return await db.select().from(socialPosts).orderBy(desc(socialPosts.createdAt));
  }

  async getSocialPost(id: number): Promise<SocialPost | undefined> {
    const result = await db.select().from(socialPosts).where(eq(socialPosts.id, id)).limit(1);
    return result[0];
  }

  async createSocialPost(post: InsertSocialPost): Promise<SocialPost> {
    const result = await db.insert(socialPosts).values(post).returning();
    return result[0];
  }

  async updateSocialPost(id: number, post: Partial<InsertSocialPost>): Promise<SocialPost | undefined> {
    const result = await db.update(socialPosts).set(post).where(eq(socialPosts.id, id)).returning();
    return result[0];
  }

  async deleteSocialPost(id: number): Promise<void> {
    await db.delete(socialPosts).where(eq(socialPosts.id, id));
  }

  // Templates
  async getTemplates(category?: string): Promise<Template[]> {
    if (category) {
      return await db.select().from(templates).where(eq(templates.category, category)).orderBy(desc(templates.useCount));
    }
    return await db.select().from(templates).orderBy(desc(templates.useCount));
  }

  async getTemplate(id: number): Promise<Template | undefined> {
    const result = await db.select().from(templates).where(eq(templates.id, id)).limit(1);
    return result[0];
  }

  async createTemplate(template: InsertTemplate): Promise<Template> {
    const result = await db.insert(templates).values(template).returning();
    return result[0];
  }

  async updateTemplate(id: number, template: Partial<InsertTemplate>): Promise<Template | undefined> {
    const result = await db.update(templates).set(template).where(eq(templates.id, id)).returning();
    return result[0];
  }

  async deleteTemplate(id: number): Promise<void> {
    await db.delete(templates).where(eq(templates.id, id));
  }

  // Assets
  async getAssets(userId: number, releaseId?: number): Promise<Asset[]> {
    if (releaseId) {
      return await db.select().from(assets).where(and(eq(assets.userId, userId), eq(assets.releaseId, releaseId))).orderBy(desc(assets.createdAt));
    }
    return await db.select().from(assets).where(eq(assets.userId, userId)).orderBy(desc(assets.createdAt));
  }

  async getAsset(id: number): Promise<Asset | undefined> {
    const result = await db.select().from(assets).where(eq(assets.id, id)).limit(1);
    return result[0];
  }

  async createAsset(asset: InsertAsset): Promise<Asset> {
    const result = await db.insert(assets).values(asset).returning();
    return result[0];
  }

  async updateAsset(id: number, asset: Partial<InsertAsset>): Promise<Asset | undefined> {
    const result = await db.update(assets).set(asset).where(eq(assets.id, id)).returning();
    return result[0];
  }

  async deleteAsset(id: number): Promise<void> {
    await db.delete(assets).where(eq(assets.id, id));
  }

  // Analytics
  async getAnalytics(releaseId: number, startDate?: Date, endDate?: Date): Promise<Analytics[]> {
    let conditions = [eq(analytics.releaseId, releaseId)];
    
    if (startDate) {
      conditions.push(gte(analytics.date, startDate));
    }
    if (endDate) {
      conditions.push(lte(analytics.date, endDate));
    }

    return await db.select().from(analytics).where(and(...conditions)).orderBy(analytics.date);
  }

  async createAnalytics(analyticsData: InsertAnalytics): Promise<Analytics> {
    const result = await db.insert(analytics).values(analyticsData).returning();
    return result[0];
  }

  // Playlist Pitches
  async getPlaylistPitches(releaseId: number): Promise<PlaylistPitch[]> {
    return await db.select().from(playlistPitches).where(eq(playlistPitches.releaseId, releaseId)).orderBy(desc(playlistPitches.pitchDate));
  }

  async getPlaylistPitch(id: number): Promise<PlaylistPitch | undefined> {
    const result = await db.select().from(playlistPitches).where(eq(playlistPitches.id, id)).limit(1);
    return result[0];
  }

  async createPlaylistPitch(pitch: InsertPlaylistPitch): Promise<PlaylistPitch> {
    const result = await db.insert(playlistPitches).values(pitch).returning();
    return result[0];
  }

  async updatePlaylistPitch(id: number, pitch: Partial<InsertPlaylistPitch>): Promise<PlaylistPitch | undefined> {
    const result = await db.update(playlistPitches).set(pitch).where(eq(playlistPitches.id, id)).returning();
    return result[0];
  }

  async deletePlaylistPitch(id: number): Promise<void> {
    await db.delete(playlistPitches).where(eq(playlistPitches.id, id));
  }

  // A/B Tests
  async getABTests(campaignId: number): Promise<ABTest[]> {
    return await db.select().from(abTests).where(eq(abTests.campaignId, campaignId)).orderBy(desc(abTests.createdAt));
  }

  async getABTest(id: number): Promise<ABTest | undefined> {
    const result = await db.select().from(abTests).where(eq(abTests.id, id)).limit(1);
    return result[0];
  }

  async createABTest(test: InsertABTest): Promise<ABTest> {
    const result = await db.insert(abTests).values(test).returning();
    return result[0];
  }

  async updateABTest(id: number, test: Partial<InsertABTest>): Promise<ABTest | undefined> {
    const result = await db.update(abTests).set(test).where(eq(abTests.id, id)).returning();
    return result[0];
  }

  async deleteABTest(id: number): Promise<void> {
    await db.delete(abTests).where(eq(abTests.id, id));
  }
}

export const storage = new DbStorage();
