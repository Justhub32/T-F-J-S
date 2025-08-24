import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertArticleSchema, insertSiteSettingsSchema, insertCommentSchema } from "@shared/schema";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";
import { ObjectPermission } from "./objectAcl";
import { newsService, type ProcessedArticle } from "./newsService";
import { contentService } from "./contentService";
import { enhancedContentService } from "./enhancedContentService";
import multer from "multer";
import path from "path";
import fs from "fs";

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(process.cwd(), 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed') as any, false);
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Object storage endpoints
  app.get("/public-objects/:filePath(*)", async (req, res) => {
    const filePath = req.params.filePath;
    const objectStorageService = new ObjectStorageService();
    try {
      const file = await objectStorageService.searchPublicObject(filePath);
      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }
      objectStorageService.downloadObject(file, res);
    } catch (error) {
      console.error("Error searching for public object:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/objects/:objectPath(*)", isAuthenticated, async (req: any, res) => {
    const userId = req.user?.claims?.sub;
    const objectStorageService = new ObjectStorageService();
    try {
      const objectFile = await objectStorageService.getObjectEntityFile(
        req.path,
      );
      const canAccess = await objectStorageService.canAccessObjectEntity({
        objectFile,
        userId: userId,
        requestedPermission: ObjectPermission.READ,
      });
      if (!canAccess) {
        return res.sendStatus(401);
      }
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error checking object access:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  // Protected upload endpoint for authenticated users
  app.post("/api/objects/upload", isAuthenticated, async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    const uploadURL = await objectStorageService.getObjectEntityUploadURL();
    res.json({ uploadURL });
  });

  // Public upload endpoint for admin backdrop images
  app.post("/api/objects/upload/public", async (req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      res.json({ uploadURL });
    } catch (error) {
      console.error("Error getting upload URL:", error);
      res.status(500).json({ error: "Failed to get upload URL" });
    }
  });

  // Handle backdrop image ACL and settings update
  app.put("/api/article-backdrops", async (req, res) => {
    if (!req.body.imageURL) {
      return res.status(400).json({ error: "imageURL is required" });
    }

    try {
      const objectStorageService = new ObjectStorageService();
      const objectPath = objectStorageService.normalizeObjectEntityPath(req.body.imageURL);
      
      // For public backdrop images, we'll serve them directly from the public path
      const publicUrl = `/public-objects${objectPath.replace('/objects', '')}`;

      // Update site settings with the new backdrop URL
      await storage.updateSiteSettings({ heroBackgroundUrl: publicUrl });

      res.status(200).json({
        objectPath: objectPath,
        publicUrl: publicUrl,
      });
    } catch (error) {
      console.error("Error setting backdrop image:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/comment-images", isAuthenticated, async (req: any, res) => {
    if (!req.body.imageURL) {
      return res.status(400).json({ error: "imageURL is required" });
    }

    const userId = req.user?.claims?.sub;

    try {
      const objectStorageService = new ObjectStorageService();
      const objectPath = await objectStorageService.trySetObjectEntityAclPolicy(
        req.body.imageURL,
        {
          owner: userId,
          visibility: "public",
        },
      );

      res.status(200).json({
        objectPath: objectPath,
      });
    } catch (error) {
      console.error("Error setting comment image:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  // Serve uploaded images
  app.use('/uploads', (req, res, next) => {
    const filePath = path.join(process.cwd(), 'uploads', req.path);
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({ message: 'Image not found' });
    }
  });

  // Get all articles with optional category and subcategory filters
  app.get("/api/articles", async (req, res) => {
    try {
      const category = req.query.category as string;
      const subcategory = req.query.subcategory as string;
      const articles = await storage.getArticles(category, subcategory);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch articles" });
    }
  });

  // Get featured articles for homepage
  app.get("/api/articles/featured", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 3;
      const articles = await storage.getFeaturedArticles(limit);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured articles" });
    }
  });

  // Get single article by ID
  app.get("/api/articles/:id", async (req, res) => {
    try {
      const article = await storage.getArticle(req.params.id);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch article" });
    }
  });

  // Create new article
  app.post("/api/articles", async (req, res) => {
    try {
      const validatedData = insertArticleSchema.parse(req.body);
      const article = await storage.createArticle(validatedData);
      res.status(201).json(article);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to create article" });
      }
    }
  });

  // Update article
  app.put("/api/articles/:id", async (req, res) => {
    try {
      const updates = insertArticleSchema.partial().parse(req.body);
      const article = await storage.updateArticle(req.params.id, updates);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to update article" });
      }
    }
  });

  // Delete article
  app.delete("/api/articles/:id", async (req, res) => {
    try {
      const success = await storage.deleteArticle(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json({ message: "Article deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete article" });
    }
  });

  // Upload image
  app.post("/api/upload", upload.single('image'), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }
      
      const imageUrl = `/uploads/${req.file.filename}`;
      res.json({ imageUrl });
    } catch (error) {
      res.status(500).json({ message: "Failed to upload image" });
    }
  });

  // Comment endpoints
  // Get comments for an article
  app.get("/api/articles/:articleId/comments", async (req, res) => {
    try {
      const comments = await storage.getComments(req.params.articleId);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  // Create comment (requires authentication)
  app.post("/api/articles/:articleId/comments", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const validatedData = insertCommentSchema.parse({
        ...req.body,
        articleId: req.params.articleId,
        userId: userId,
      });
      const comment = await storage.createComment(validatedData);
      res.status(201).json(comment);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to create comment" });
      }
    }
  });

  // Delete comment (requires authentication and ownership)
  app.delete("/api/comments/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const success = await storage.deleteComment(req.params.id, userId);
      if (!success) {
        return res.status(404).json({ message: "Comment not found or not authorized" });
      }
      res.json({ message: "Comment deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete comment" });
    }
  });

  // Get site settings
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getSiteSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch site settings" });
    }
  });

  // Update site settings
  app.put("/api/settings", async (req, res) => {
    try {
      const updates = insertSiteSettingsSchema.partial().parse(req.body);
      const settings = await storage.updateSiteSettings(updates);
      res.json(settings);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to update site settings" });
      }
    }
  });

  // Object storage endpoints for admin photo uploads
  app.post("/api/objects/upload", isAuthenticated, async (req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      res.json({ uploadURL });
    } catch (error) {
      console.error("Error getting upload URL:", error);
      res.status(500).json({ error: "Failed to get upload URL" });
    }
  });

  app.put("/api/article-backdrops", isAuthenticated, async (req, res) => {
    if (!req.body.imageURL) {
      return res.status(400).json({ error: "imageURL is required" });
    }

    const userId = req.user?.claims?.sub;
    try {
      const objectStorageService = new ObjectStorageService();
      const objectPath = await objectStorageService.trySetObjectEntityAclPolicy(
        req.body.imageURL,
        {
          owner: userId,
          visibility: "public", // Article backdrops should be publicly accessible
        }
      );

      res.status(200).json({
        objectPath: objectPath,
        publicUrl: `${req.protocol}://${req.get('host')}/objects${objectPath}`
      });
    } catch (error) {
      console.error("Error setting article backdrop:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Serve uploaded objects
  app.get("/objects/:objectPath(*)", async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    try {
      const objectFile = await objectStorageService.getObjectEntityFile(
        req.path,
      );
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error accessing object:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  // News synchronization endpoints
  // Manual news sync (for testing and immediate updates)
  app.post("/api/news/sync", async (req: any, res) => {
    try {
      console.log("Manual news sync requested by user:", req.user?.claims?.sub);
      
      // Clear old articles first
      await storage.clearOldNewsArticles();
      
      // Fetch fresh news
      const freshNews = await newsService.fetchAllNews();
      
      if (freshNews.length > 0) {
        // Convert ProcessedArticle to Article format for database
        const articleData = freshNews.map(news => ({
          id: news.id,
          title: news.title,
          content: news.content,
          excerpt: news.excerpt,
          category: news.category,
          imageUrl: news.imageUrl || null,
          author: "ChillVibes Team",
          isDraft: false,
          isFeatured: news.isFeatured,
          createdAt: news.createdAt,
          updatedAt: news.updatedAt,
        }));
        
        await storage.syncNewsArticles(articleData);
        
        res.json({ 
          success: true, 
          message: `Successfully synced ${freshNews.length} news articles`,
          articlesCount: freshNews.length 
        });
      } else {
        res.json({ 
          success: true, 
          message: "No new articles found",
          articlesCount: 0 
        });
      }
    } catch (error) {
      console.error("Manual news sync failed:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to sync news articles",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get news sync status
  app.get("/api/news/status", async (req, res) => {
    try {
      const totalArticles = await storage.getArticles();
      const techCount = await storage.getArticles("tech", true);
      const financeCount = await storage.getArticles("finance", true);
      const jiuJitsuCount = await storage.getArticles("jiu-jitsu", true);
      const surfCount = await storage.getArticles("surf", true);
      const featuredCount = await storage.getFeaturedArticles(10);
      
      res.json({
        totalArticles: totalArticles.length,
        categories: {
          "tech": techCount.length,
          "finance": financeCount.length,
          "jiu-jitsu": jiuJitsuCount.length,
          "surf": surfCount.length,
        },
        featuredCount: featuredCount.length,
        lastSyncTime: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to get news status" });
    }
  });

  // Generate original content endpoint
  app.post("/api/content/generate", async (req, res) => {
    try {
      console.log("Generating original content...");
      
      // Generate daily original articles (2-3 per category)
      const originalArticles = contentService.generateDailyOriginalContent();
      
      if (originalArticles.length > 0) {
        // Convert to article format for database
        const articleData = originalArticles.map(article => ({
          id: article.id,
          title: article.title,
          content: article.content,
          excerpt: article.excerpt,
          category: article.category,
          imageUrl: article.imageUrl || null,
          author: article.author,
          isDraft: false,
          isFeatured: article.isFeatured,
          createdAt: article.createdAt,
          updatedAt: article.updatedAt,
        }));
        
        await storage.syncNewsArticles(articleData);
        
        res.json({ 
          success: true, 
          message: `Successfully generated ${originalArticles.length} original articles`,
          articlesCount: originalArticles.length 
        });
      } else {
        res.json({ 
          success: true, 
          message: "No articles generated",
          articlesCount: 0 
        });
      }
    } catch (error) {
      console.error("Content generation failed:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to generate original content",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  const httpServer = createServer(app);
  
  // Auto-sync content on startup and every 6 hours (mix of original content and news)
  const performContentSync = async () => {
    try {
      console.log("Performing automatic content sync...");
      
      // Clear old articles first
      await storage.clearOldNewsArticles();
      
      // Generate comprehensive content with real-time news integration
      const originalArticles = await enhancedContentService.generateDailyContent();
      
      if (originalArticles.length > 0) {
        // Convert to article format with enhanced fields
        const articleData = originalArticles.map(article => ({
          id: article.id,
          title: article.title,
          content: article.content,
          excerpt: article.excerpt,
          category: article.category,
          subcategory: article.subcategory || null,
          imageUrl: article.imageUrl || null,
          author: article.author,
          isDraft: false,
          isFeatured: article.isFeatured,
          isRealtime: article.isRealtime,
          sourceUrl: article.sourceUrl || null,
          tags: article.tags || null,
          createdAt: article.createdAt,
          updatedAt: article.updatedAt,
        }));
        
        await storage.syncNewsArticles(articleData);
        console.log(`Automatic content sync completed: ${originalArticles.length} comprehensive articles with real-time integration`);
      } else {
        console.log("Automatic content sync: No new content found");
      }
    } catch (error) {
      console.error("Automatic content sync failed:", error);
    }
  };

  // Initial content sync on startup (delayed to allow server to start)
  setTimeout(() => {
    performContentSync();
  }, 5000); // 5 second delay

  // Schedule automatic content sync every 6 hours
  const sixHours = 6 * 60 * 60 * 1000;
  setInterval(performContentSync, sixHours);
  
  console.log("Content auto-sync scheduled: every 6 hours (comprehensive lifestyle media with real-time updates)");

  return httpServer;
}
