import { type User, type InsertUser, type Article, type InsertArticle } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getArticles(category?: string, excludeDrafts?: boolean): Promise<Article[]>;
  getArticle(id: string): Promise<Article | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: string, article: Partial<InsertArticle>): Promise<Article | undefined>;
  deleteArticle(id: string): Promise<boolean>;
  getFeaturedArticles(limit?: number): Promise<Article[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private articles: Map<string, Article>;

  constructor() {
    this.users = new Map();
    this.articles = new Map();
    
    // Add some initial articles for demo
    this.seedArticles();
  }

  private seedArticles() {
    const sampleArticles: InsertArticle[] = [
      {
        title: "The Future of AI in Software Development",
        content: `<p>Artificial Intelligence is revolutionizing how we write, test, and deploy code. From GitHub Copilot to advanced debugging tools, AI is becoming an indispensable partner in the development process.</p>

<h2>Key AI Tools for Developers</h2>

<ul>
<li><strong>Code Generation:</strong> AI can write boilerplate code, suggest completions, and even architect entire functions.</li>
<li><strong>Bug Detection:</strong> Advanced static analysis powered by machine learning can catch issues before they reach production.</li>
<li><strong>Test Automation:</strong> AI can generate comprehensive test suites and identify edge cases automatically.</li>
</ul>

<p>The future belongs to developers who can effectively collaborate with AI tools while maintaining their creative problem-solving edge.</p>`,
        excerpt: "How AI is transforming software development and what developers need to know to stay ahead.",
        category: "tech",
        imageUrl: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        author: "Alex Rivera",
        isDraft: false,
      },
      {
        title: "DeFi Investment Strategies for 2024",
        content: `<p>Decentralized Finance continues to evolve with new opportunities and risks. Understanding the landscape is crucial for making informed investment decisions.</p>

<h2>Risk Management in DeFi</h2>

<ul>
<li><strong>Diversification:</strong> Never put all your funds in a single protocol or token.</li>
<li><strong>Due Diligence:</strong> Research team backgrounds, audit reports, and tokenomics before investing.</li>
<li><strong>Start Small:</strong> Test protocols with small amounts before committing significant capital.</li>
</ul>

<h2>Emerging Opportunities</h2>

<p>Real World Assets (RWAs) and AI-powered protocols are creating new investment categories that bridge traditional and digital finance.</p>`,
        excerpt: "Navigate the evolving DeFi landscape with smart strategies and risk management techniques.",
        category: "finance",
        imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        author: "Maya Chen",
        isDraft: false,
      },
      {
        title: "Guard Retention: The Foundation of Defense",
        content: `<p>In Brazilian Jiu-Jitsu, maintaining guard is often the difference between victory and defeat. Your guard is your shield, your sword, and your pathway to victory all rolled into one.</p>

<h2>Essential Guard Retention Concepts</h2>

<ul>
<li><strong>Hip Movement:</strong> Your hips are the engine of guard retention. Learn to move them efficiently and explosively.</li>
<li><strong>Frame Management:</strong> Proper frames prevent your opponent from settling their weight and advancing position.</li>
<li><strong>Grip Fighting:</strong> Control your opponent's grips to limit their attacking options.</li>
</ul>

<h2>Drilling for Success</h2>

<p>Consistent drilling of guard retention movements builds the muscle memory needed to execute under pressure. Practice daily for maximum improvement.</p>`,
        excerpt: "Master the fundamentals of guard retention to improve your defensive game in Brazilian Jiu-Jitsu.",
        category: "jiu-jitsu",
        imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        author: "Jordan Blake",
        isDraft: false,
      },
      {
        title: "Reading Waves: A Beginner's Guide to Surf Forecasting",
        content: `<p>Understanding wave forecasts is essential for any surfer looking to maximize their time in the water. Learning to read the signs can mean the difference between an epic session and a wasted trip.</p>

<h2>Key Forecast Elements</h2>

<ul>
<li><strong>Swell Direction:</strong> The angle at which waves approach the beach affects how they break.</li>
<li><strong>Wave Period:</strong> Longer periods generally mean more powerful, organized waves.</li>
<li><strong>Wind Conditions:</strong> Offshore winds groom wave faces, while onshore winds create choppy conditions.</li>
</ul>

<h2>Reading the Water</h2>

<p>Once you're at the beach, observe the patterns. Look for sets, identify channels, and watch how waves break across different sections of the reef or sandbar.</p>`,
        excerpt: "Learn to read wave forecasts and ocean conditions to find the best surf sessions.",
        category: "surf",
        imageUrl: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        author: "Ocean Walker",
        isDraft: false,
      }
    ];

    sampleArticles.forEach(article => {
      const id = randomUUID();
      const fullArticle: Article = {
        ...article,
        id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.articles.set(id, fullArticle);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getArticles(category?: string, excludeDrafts: boolean = true): Promise<Article[]> {
    let articles = Array.from(this.articles.values());
    
    if (excludeDrafts) {
      articles = articles.filter(article => !article.isDraft);
    }
    
    if (category) {
      articles = articles.filter(article => article.category === category);
    }
    
    return articles.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getArticle(id: string): Promise<Article | undefined> {
    return this.articles.get(id);
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const id = randomUUID();
    const now = new Date();
    const article: Article = {
      ...insertArticle,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.articles.set(id, article);
    return article;
  }

  async updateArticle(id: string, updates: Partial<InsertArticle>): Promise<Article | undefined> {
    const article = this.articles.get(id);
    if (!article) return undefined;

    const updatedArticle: Article = {
      ...article,
      ...updates,
      updatedAt: new Date(),
    };
    
    this.articles.set(id, updatedArticle);
    return updatedArticle;
  }

  async deleteArticle(id: string): Promise<boolean> {
    return this.articles.delete(id);
  }

  async getFeaturedArticles(limit: number = 3): Promise<Article[]> {
    const articles = await this.getArticles();
    return articles.slice(0, limit);
  }
}

export const storage = new MemStorage();
