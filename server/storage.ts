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
        title: "The Zen of DeFi: Finding Balance in Crypto Trading",
        content: `<p>In the fast-paced world of decentralized finance, it's easy to get caught up in the endless cycle of charts, trades, and market movements. But what if I told you that the ancient principles of mindfulness could transform your approach to crypto trading?</p>

<p>The concept of flow state, familiar to surfers and martial artists, applies perfectly to DeFi. When you're truly present in the moment, aware of market conditions without being overwhelmed by them, you make better decisions.</p>

<h2>The Mindful Trader's Toolkit</h2>

<p>Here are some key principles that have transformed my trading approach:</p>

<ul>
<li><strong>Breath Awareness:</strong> Before making any trade, take three deep breaths. This creates space between impulse and action.</li>
<li><strong>Position Sizing Meditation:</strong> Never risk more than you can afford to lose with complete peace of mind.</li>
<li><strong>Emotion Observation:</strong> Notice FOMO and fear without being controlled by them.</li>
</ul>

<p>The goal isn't to eliminate emotions but to observe them like waves - they come and go, but you remain anchored.</p>`,
        excerpt: "How mindfulness principles can transform your approach to decentralized finance and reduce trading stress.",
        category: "tech-finance",
        imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        author: "Alex Rivera",
        isDraft: false,
      },
      {
        title: "Flow State: From Waves to Mats",
        content: `<p>There's something magical that happens when you catch the perfect wave or execute a flawless submission - time seems to slow down, your mind becomes crystal clear, and everything flows effortlessly. This is what psychologists call the flow state.</p>

<p>Both surfing and jiu-jitsu offer unique pathways to achieving this optimal experience, and the lessons from one directly enhance the other.</p>

<h2>The Ocean as Teacher</h2>

<p>Surfing teaches you to read energy - the subtle shifts in water, wind, and wave formation. This same sensitivity applies to rolling on the mats:</p>

<ul>
<li><strong>Timing over Force:</strong> Just as you don't fight the wave but move with it, effective grappling uses your opponent's energy against them.</li>
<li><strong>Present Moment Awareness:</strong> Both activities demand complete presence - one wandering thought and you're either tumbling or tapping out.</li>
<li><strong>Adaptive Flow:</strong> No two waves are alike, and no two rolls follow the same pattern. Adaptability is key.</li>
</ul>

<h2>Training the Flow State</h2>

<p>Here's how to cultivate flow in both disciplines:</p>

<p><strong>Pre-session Ritual:</strong> Whether heading to the beach or the dojo, start with intentional breathing and mental preparation.</p>

<p><strong>Progressive Challenge:</strong> Flow emerges when skill level matches challenge. Gradually increase difficulty as you improve.</p>

<p><strong>Release Attachment:</strong> Don't chase the perfect wave or submission. Stay open to what emerges naturally.</p>`,
        excerpt: "The surprising parallels between catching the perfect wave and executing a flawless submission.",
        category: "jiu-jitsu-surf",
        imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        author: "Maya Chen",
        isDraft: false,
      },
      {
        title: "Remote Work Revolution: Building Your Digital Nomad Portfolio",
        content: `<p>The pandemic accelerated a trend that was already building momentum: the shift toward location-independent work. But building a truly sustainable digital nomad lifestyle requires more than just a laptop and WiFi.</p>

<p>It's about creating multiple income streams that provide both financial security and the freedom to chase perfect waves or find the best training partners around the world.</p>

<h2>The Three Pillars Strategy</h2>

<p>My approach centers on three core pillars:</p>

<h3>1. Service-Based Income</h3>
<ul>
<li>Consulting in your area of expertise</li>
<li>Freelance work with recurring clients</li>
<li>Digital marketing services</li>
</ul>

<h3>2. Product-Based Revenue</h3>
<ul>
<li>Online courses and digital products</li>
<li>SaaS applications</li>
<li>E-commerce with dropshipping or print-on-demand</li>
</ul>

<h3>3. Investment Income</h3>
<ul>
<li>Dividend-paying stocks</li>
<li>REITs for real estate exposure</li>
<li>Cryptocurrency staking and DeFi protocols</li>
</ul>

<h2>Location Strategy</h2>

<p>Not all destinations are created equal for the digital nomad lifestyle. Consider these factors:</p>

<p><strong>Cost of Living vs Quality of Life:</strong> Southeast Asia offers incredible value, while Europe provides cultural richness at a premium.</p>

<p><strong>Internet Infrastructure:</strong> Reliable high-speed internet isn't negotiable for serious remote work.</p>

<p><strong>Time Zone Alignment:</strong> Consider overlap with your clients' working hours.</p>

<p><strong>Community:</strong> Co-working spaces and nomad communities provide essential networking and social connections.</p>`,
        excerpt: "Strategies for creating location-independent income streams while maintaining work-life balance.",
        category: "tech-finance",
        imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        author: "Jordan Blake",
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
