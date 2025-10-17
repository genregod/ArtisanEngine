import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import {
  insertReleaseSchema, insertCampaignSchema, insertContentCalendarSchema,
  insertSocialPostSchema, insertTemplateSchema, insertAssetSchema,
  insertAnalyticsSchema, insertPlaylistPitchSchema, insertABTestSchema
} from "@shared/schema";
import { z } from "zod";
import OpenAI from "openai";

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup Replit Auth
  await setupAuth(app);

  // Middleware to attach database user to request
  const attachUser = async (req: any, res: Response, next: Function) => {
    try {
      const replitId = req.user.claims.sub;
      const user = await storage.getUserByReplitId(replitId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      req.dbUser = user;
      next();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  // Auth endpoint to get current user
  app.get('/api/auth/user', isAuthenticated, attachUser, async (req: any, res) => {
    res.json(req.dbUser);
  });

  // Helper to get user from request
  const requireUser = [isAuthenticated, attachUser];

  // ===== RELEASES =====
  app.get("/api/releases", requireUser, async (req: any, res: Response) => {
    try {
      const releases = await storage.getReleases(req.dbUser.id);
      res.json(releases);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/releases/:id", requireUser, async (req: Request, res: Response) => {
    try {
      const release = await storage.getRelease(parseInt(req.params.id));
      if (!release) return res.status(404).json({ error: "Release not found" });
      res.json(release);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/releases", requireUser, async (req: any, res: Response) => {
    try {
      const data = insertReleaseSchema.parse({ ...req.body, userId: req.dbUser.id });
      const release = await storage.createRelease(data);
      res.status(201).json(release);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/releases/:id", requireUser, async (req: Request, res: Response) => {
    try {
      const release = await storage.updateRelease(parseInt(req.params.id), req.body);
      if (!release) return res.status(404).json({ error: "Release not found" });
      res.json(release);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/releases/:id", requireUser, async (req: Request, res: Response) => {
    try {
      await storage.deleteRelease(parseInt(req.params.id));
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ===== CAMPAIGNS =====
  app.get("/api/campaigns", requireUser, async (req: Request, res: Response) => {
    try {
      const releaseId = req.query.releaseId ? parseInt(req.query.releaseId as string) : undefined;
      const campaigns = await storage.getCampaigns(releaseId);
      res.json(campaigns);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/campaigns", requireUser, async (req: Request, res: Response) => {
    try {
      const data = insertCampaignSchema.parse(req.body);
      const campaign = await storage.createCampaign(data);
      res.status(201).json(campaign);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/campaigns/:id", requireUser, async (req: Request, res: Response) => {
    try {
      const campaign = await storage.updateCampaign(parseInt(req.params.id), req.body);
      if (!campaign) return res.status(404).json({ error: "Campaign not found" });
      res.json(campaign);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/campaigns/:id", requireUser, async (req: Request, res: Response) => {
    try {
      await storage.deleteCampaign(parseInt(req.params.id));
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ===== CONTENT CALENDAR =====
  app.get("/api/content-calendar", requireUser, async (req: Request, res: Response) => {
    try {
      const campaignId = req.query.campaignId ? parseInt(req.query.campaignId as string) : undefined;
      const items = await storage.getContentCalendar(campaignId);
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/content-calendar", requireUser, async (req: Request, res: Response) => {
    try {
      const data = insertContentCalendarSchema.parse(req.body);
      const item = await storage.createContentItem(data);
      res.status(201).json(item);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/content-calendar/:id", requireUser, async (req: Request, res: Response) => {
    try {
      const item = await storage.updateContentItem(parseInt(req.params.id), req.body);
      if (!item) return res.status(404).json({ error: "Content item not found" });
      res.json(item);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/content-calendar/:id", requireUser, async (req: Request, res: Response) => {
    try {
      await storage.deleteContentItem(parseInt(req.params.id));
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ===== SOCIAL POSTS =====
  app.get("/api/social-posts", requireUser, async (req: Request, res: Response) => {
    try {
      const contentId = req.query.contentId ? parseInt(req.query.contentId as string) : undefined;
      const posts = await storage.getSocialPosts(contentId);
      res.json(posts);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/social-posts", requireUser, async (req: Request, res: Response) => {
    try {
      const data = insertSocialPostSchema.parse(req.body);
      const post = await storage.createSocialPost(data);
      res.status(201).json(post);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/social-posts/:id", requireUser, async (req: Request, res: Response) => {
    try {
      const post = await storage.updateSocialPost(parseInt(req.params.id), req.body);
      if (!post) return res.status(404).json({ error: "Social post not found" });
      res.json(post);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/social-posts/:id", requireUser, async (req: Request, res: Response) => {
    try {
      await storage.deleteSocialPost(parseInt(req.params.id));
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ===== TEMPLATES =====
  app.get("/api/templates", requireUser, async (req: Request, res: Response) => {
    try {
      const category = req.query.category as string | undefined;
      const templates = await storage.getTemplates(category);
      res.json(templates);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/templates", requireUser, async (req: Request, res: Response) => {
    try {
      const data = insertTemplateSchema.parse(req.body);
      const template = await storage.createTemplate(data);
      res.status(201).json(template);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/templates/:id", requireUser, async (req: Request, res: Response) => {
    try {
      const template = await storage.updateTemplate(parseInt(req.params.id), req.body);
      if (!template) return res.status(404).json({ error: "Template not found" });
      res.json(template);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/templates/:id", requireUser, async (req: Request, res: Response) => {
    try {
      await storage.deleteTemplate(parseInt(req.params.id));
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ===== ASSETS =====
  app.get("/api/assets", requireUser, async (req: any, res: Response) => {
    try {
      const releaseId = req.query.releaseId ? parseInt(req.query.releaseId as string) : undefined;
      const assets = await storage.getAssets(req.dbUser.id, releaseId);
      res.json(assets);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/assets", requireUser, async (req: any, res: Response) => {
    try {
      const data = insertAssetSchema.parse({ ...req.body, userId: req.dbUser.id });
      const asset = await storage.createAsset(data);
      res.status(201).json(asset);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/assets/:id", requireUser, async (req: Request, res: Response) => {
    try {
      await storage.deleteAsset(parseInt(req.params.id));
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ===== ANALYTICS =====
  app.get("/api/analytics/:releaseId", requireUser, async (req: Request, res: Response) => {
    try {
      const releaseId = parseInt(req.params.releaseId);
      const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
      const analytics = await storage.getAnalytics(releaseId, startDate, endDate);
      res.json(analytics);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/analytics", requireUser, async (req: Request, res: Response) => {
    try {
      const data = insertAnalyticsSchema.parse(req.body);
      const analytics = await storage.createAnalytics(data);
      res.status(201).json(analytics);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // ===== PLAYLIST PITCHES =====
  app.get("/api/playlist-pitches/:releaseId", requireUser, async (req: Request, res: Response) => {
    try {
      const releaseId = parseInt(req.params.releaseId);
      const pitches = await storage.getPlaylistPitches(releaseId);
      res.json(pitches);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/playlist-pitches", requireUser, async (req: Request, res: Response) => {
    try {
      const data = insertPlaylistPitchSchema.parse(req.body);
      const pitch = await storage.createPlaylistPitch(data);
      res.status(201).json(pitch);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/playlist-pitches/:id", requireUser, async (req: Request, res: Response) => {
    try {
      const pitch = await storage.updatePlaylistPitch(parseInt(req.params.id), req.body);
      if (!pitch) return res.status(404).json({ error: "Playlist pitch not found" });
      res.json(pitch);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/playlist-pitches/:id", requireUser, async (req: Request, res: Response) => {
    try {
      await storage.deletePlaylistPitch(parseInt(req.params.id));
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ===== A/B TESTS =====
  app.get("/api/ab-tests/:campaignId", requireUser, async (req: Request, res: Response) => {
    try {
      const campaignId = parseInt(req.params.campaignId);
      const tests = await storage.getABTests(campaignId);
      res.json(tests);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/ab-tests", requireUser, async (req: Request, res: Response) => {
    try {
      const data = insertABTestSchema.parse(req.body);
      const test = await storage.createABTest(data);
      res.status(201).json(test);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/ab-tests/:id", requireUser, async (req: Request, res: Response) => {
    try {
      const test = await storage.updateABTest(parseInt(req.params.id), req.body);
      if (!test) return res.status(404).json({ error: "A/B test not found" });
      res.json(test);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // ===== AI CAPTION GENERATOR =====
  app.post("/api/generate-caption", requireUser, async (req: Request, res: Response) => {
    try {
      if (!openai) {
        return res.status(503).json({ error: "OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables." });
      }

      const { songTitle, artist, story, platform, type, mood } = req.body;

      const prompt = `Generate a compelling ${platform} ${type} caption for the song "${songTitle}" by ${artist}.
      
      Song context: ${story || 'A personal journey of struggle and redemption'}
      Mood: ${mood || 'emotional, raw, authentic'}
      Platform: ${platform}
      
      Requirements:
      - Keep it authentic and emotional
      - Include relevant hashtags for ${platform}
      - Make it shareable and engaging
      - Use the artist funnel approach (awareness/engagement/conversion)
      - Maximum 2200 characters for Instagram, 150 for Twitter, 300 for TikTok
      
      Return only the caption text, no explanations.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
      });

      const caption = completion.choices[0].message.content;
      res.json({ caption });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ===== ONE-CLICK CAMPAIGN GENERATOR =====
  app.post("/api/generate-campaign", requireUser, async (req: Request, res: Response) => {
    try {
      const { releaseId, strategy, duration } = req.body;
      
      const release = await storage.getRelease(releaseId);
      if (!release) return res.status(404).json({ error: "Release not found" });

      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + (duration || 30));

      // Create campaign
      const campaign = await storage.createCampaign({
        releaseId,
        name: `${strategy} Campaign - ${release.title}`,
        strategy: strategy || "waterfall",
        phase: "awareness",
        startDate,
        endDate,
        goals: {
          streams: 10000,
          saves: 500,
          followers: 200,
          engagement: 1000
        },
        status: "active"
      });

      // Generate content calendar based on strategy
      const contentWeeks = [
        { theme: "The Story Behind", day: 2 },
        { theme: "The Echo", day: 9 },
        { theme: "The Response", day: 16 },
        { theme: "The Deep Dive", day: 23 }
      ];

      const contentItems = [];
      for (const week of contentWeeks) {
        const scheduledDate = new Date(startDate);
        scheduledDate.setDate(scheduledDate.getDate() + week.day);

        const item = await storage.createContentItem({
          campaignId: campaign.id,
          weekTheme: week.theme,
          title: `${week.theme} - ${release.title}`,
          description: `Auto-generated content for ${week.theme} week`,
          scheduledDate,
          platforms: ["tiktok", "instagram", "youtube"],
          contentType: "video",
          status: "draft"
        });
        contentItems.push(item);
      }

      res.status(201).json({ campaign, contentItems });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
