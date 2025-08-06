import { nanoid } from "nanoid";

interface NewsArticle {
  title: string;
  description: string;
  content: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

interface NewsAPIResponse {
  articles: NewsArticle[];
  totalResults: number;
  status: string;
}

export interface ProcessedArticle {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: "tech-finance" | "jiu-jitsu-surf";
  imageUrl?: string;
  sourceUrl: string;
  sourceName: string;
  publishedAt: Date;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const NEWS_API_BASE_URL = "https://newsapi.org/v2";

if (!NEWS_API_KEY) {
  console.error("NEWS_API_KEY is required for news fetching");
}

export class NewsService {
  private async fetchFromNewsAPI(query: string, language = "en"): Promise<NewsArticle[]> {
    if (!NEWS_API_KEY) {
      throw new Error("NEWS_API_KEY is not configured");
    }

    const url = new URL(`${NEWS_API_BASE_URL}/everything`);
    url.searchParams.set("q", query);
    url.searchParams.set("language", language);
    url.searchParams.set("sortBy", "publishedAt");
    url.searchParams.set("pageSize", "10");
    url.searchParams.set("apiKey", NEWS_API_KEY);

    try {
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`News API error: ${response.status} ${response.statusText}`);
      }

      const data: NewsAPIResponse = await response.json();
      
      if (data.status !== "ok") {
        throw new Error(`News API returned status: ${data.status}`);
      }

      return data.articles.filter(article => 
        article.title && 
        article.description && 
        article.content &&
        !article.title.includes("[Removed]") &&
        !article.description.includes("[Removed]")
      );
    } catch (error) {
      console.error(`Failed to fetch news for query "${query}":`, error);
      return [];
    }
  }

  private processArticle(article: NewsArticle, category: "tech-finance" | "jiu-jitsu-surf"): ProcessedArticle {
    // Clean up content - remove truncation markers and source attributions
    let content = article.content || article.description || "";
    content = content.replace(/\[\+\d+ chars\]$/, ""); // Remove NewsAPI truncation marker
    content = content.replace(/\[Removed\]/g, ""); // Remove removed markers
    
    // If content is too short, use description as content and create excerpt from title
    if (content.length < 100 && article.description) {
      content = article.description;
    }

    // Create excerpt from first 150 characters
    const excerpt = content.length > 150 
      ? content.substring(0, 150) + "..." 
      : content;

    // Enhance content with source link
    if (content.length < 300) {
      content += `\n\nRead the full article at ${article.source.name}: ${article.url}`;
    }

    return {
      id: nanoid(),
      title: article.title,
      content,
      excerpt,
      category,
      imageUrl: article.urlToImage || undefined,
      sourceUrl: article.url,
      sourceName: article.source.name,
      publishedAt: new Date(article.publishedAt),
      isFeatured: false, // Will be randomly assigned later
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async fetchTechFinanceNews(): Promise<ProcessedArticle[]> {
    const queries = [
      "fintech OR \"financial technology\"",
      "cryptocurrency bitcoin ethereum",
      "startup funding venture capital",
      "AI artificial intelligence finance",
      "blockchain technology finance"
    ];

    const allArticles: ProcessedArticle[] = [];

    for (const query of queries) {
      const articles = await this.fetchFromNewsAPI(query);
      const processed = articles
        .slice(0, 3) // Limit per query to avoid duplicates
        .map(article => this.processArticle(article, "tech-finance"));
      
      allArticles.push(...processed);
      
      // Small delay to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return allArticles;
  }

  async fetchJiuJitsuSurfNews(): Promise<ProcessedArticle[]> {
    const queries = [
      "jiu-jitsu BJJ brazilian jiu-jitsu",
      "surfing surf competition waves",
      "mixed martial arts MMA UFC",
      "surf culture lifestyle surfboard",
      "martial arts training fitness"
    ];

    const allArticles: ProcessedArticle[] = [];

    for (const query of queries) {
      const articles = await this.fetchFromNewsAPI(query);
      const processed = articles
        .slice(0, 3) // Limit per query
        .map(article => this.processArticle(article, "jiu-jitsu-surf"));
      
      allArticles.push(...processed);
      
      // Small delay to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return allArticles;
  }

  async fetchAllNews(): Promise<ProcessedArticle[]> {
    try {
      console.log("Fetching latest news articles...");
      
      const [techFinanceNews, jiuJitsuSurfNews] = await Promise.all([
        this.fetchTechFinanceNews(),
        this.fetchJiuJitsuSurfNews()
      ]);

      const allArticles = [...techFinanceNews, ...jiuJitsuSurfNews];
      
      // Randomly select some articles to be featured
      const shuffled = [...allArticles].sort(() => 0.5 - Math.random());
      shuffled.slice(0, Math.min(4, shuffled.length)).forEach(article => {
        article.isFeatured = true;
      });

      console.log(`Successfully fetched ${allArticles.length} articles`);
      console.log(`Tech/Finance: ${techFinanceNews.length}, Jiu-Jitsu/Surf: ${jiuJitsuSurfNews.length}`);
      
      return allArticles;
    } catch (error) {
      console.error("Error fetching news:", error);
      return [];
    }
  }

  // Helper method to refresh news periodically
  async refreshNewsCache(): Promise<ProcessedArticle[]> {
    console.log("Refreshing news cache...");
    return this.fetchAllNews();
  }
}

export const newsService = new NewsService();