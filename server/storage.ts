import { 
  type User, 
  type UpsertUser, 
  type Article, 
  type InsertArticle, 
  type SiteSettings, 
  type InsertSiteSettings,
  type Comment,
  type InsertComment
} from "@shared/schema";
import { DatabaseStorage } from "./databaseStorage";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Article operations
  getArticles(category?: string, excludeDrafts?: boolean): Promise<Article[]>;
  getArticle(id: string): Promise<Article | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: string, article: Partial<InsertArticle>): Promise<Article | undefined>;
  deleteArticle(id: string): Promise<boolean>;
  getFeaturedArticles(limit?: number): Promise<Article[]>;
  
  // Comment operations
  getComments(articleId: string): Promise<Comment[]>;
  createComment(insertComment: InsertComment): Promise<Comment>;
  deleteComment(id: string, userId: string): Promise<boolean>;
  
  // Site settings operations
  getSiteSettings(): Promise<SiteSettings>;
  updateSiteSettings(settings: Partial<InsertSiteSettings>): Promise<SiteSettings>;
}

export const storage = new DatabaseStorage();