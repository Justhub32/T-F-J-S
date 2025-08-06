import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";
import { 
  articles, 
  siteSettings, 
  comments, 
  authUsers as users,
  type Article, 
  type InsertArticle, 
  type SiteSettings, 
  type InsertSiteSettings,
  type Comment,
  type InsertComment,
  type User,
  type UpsertUser
} from "@shared/schema";
import type { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Article operations
  async getArticles(category?: string, excludeDrafts?: boolean): Promise<Article[]> {
    let query = db.select().from(articles);
    
    const conditions = [];
    if (category) {
      conditions.push(eq(articles.category, category));
    }
    if (excludeDrafts) {
      conditions.push(eq(articles.isDraft, false));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return query.orderBy(desc(articles.createdAt));
  }

  async getArticle(id: string): Promise<Article | undefined> {
    const [article] = await db.select().from(articles).where(eq(articles.id, id));
    return article;
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const [article] = await db
      .insert(articles)
      .values(insertArticle)
      .returning();
    return article;
  }

  async updateArticle(id: string, updates: Partial<InsertArticle>): Promise<Article | undefined> {
    const [article] = await db
      .update(articles)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(articles.id, id))
      .returning();
    return article;
  }

  async deleteArticle(id: string): Promise<boolean> {
    const result = await db.delete(articles).where(eq(articles.id, id));
    return result.count > 0;
  }

  async getFeaturedArticles(limit: number = 3): Promise<Article[]> {
    return db
      .select()
      .from(articles)
      .where(eq(articles.isDraft, false))
      .orderBy(desc(articles.createdAt))
      .limit(limit);
  }

  // Comment operations
  async getComments(articleId: string): Promise<Comment[]> {
    const result = await db
      .select({
        id: comments.id,
        content: comments.content,
        imageUrl: comments.imageUrl,
        createdAt: comments.createdAt,
        updatedAt: comments.updatedAt,
        articleId: comments.articleId,
        userId: comments.userId,
        authorName: sql<string>`COALESCE(${users.firstName} || ' ' || ${users.lastName}, ${users.email})`.as('authorName'),
        authorAvatar: users.profileImageUrl,
      })
      .from(comments)
      .leftJoin(users, eq(comments.userId, users.id))
      .where(eq(comments.articleId, articleId))
      .orderBy(desc(comments.createdAt));
    
    return result;
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const [comment] = await db
      .insert(comments)
      .values(insertComment)
      .returning();
    return comment;
  }

  async deleteComment(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(comments)
      .where(and(eq(comments.id, id), eq(comments.userId, userId)));
    return result.count > 0;
  }

  // Site settings operations
  async getSiteSettings(): Promise<SiteSettings> {
    const [settings] = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.id, "site"));
    
    if (!settings) {
      // Create default settings if none exist
      const [newSettings] = await db
        .insert(siteSettings)
        .values({
          id: "site",
          heroBackgroundUrl: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&h=1200&q=80"
        })
        .returning();
      return newSettings;
    }
    
    return settings;
  }

  async updateSiteSettings(updates: Partial<InsertSiteSettings>): Promise<SiteSettings> {
    const [settings] = await db
      .update(siteSettings)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(siteSettings.id, "site"))
      .returning();
    return settings;
  }
}