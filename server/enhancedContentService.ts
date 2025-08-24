import { nanoid } from "nanoid";

export interface OriginalArticle {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: "tech" | "finance" | "jiu-jitsu" | "surf";
  subcategory?: string;
  imageUrl?: string;
  author: string;
  isDraft: boolean;
  isFeatured: boolean;
  isRealtime: boolean;
  sourceUrl?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export class EnhancedContentService {
  private surfBackgrounds = [
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&h=1200&q=80", // Surfer with laptop
    "https://images.unsplash.com/photo-1502680390469-be75c86b636f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&h=1200&q=80", // Ocean waves
    "https://images.unsplash.com/photo-1505142468610-359e7d316be0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&h=1200&q=80", // Surfboard on sand
    "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&h=1200&q=80", // Surf break
    "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&h=1200&q=80", // Beach lifestyle
  ];

  constructor() {}

  // Generate real-time news using external API (when available)
  async fetchRealtimeNews(): Promise<OriginalArticle[]> {
    if (!process.env.NEWS_API_KEY) {
      return [];
    }

    try {
      const categories = ['technology', 'business', 'sports'];
      const realtimeArticles: OriginalArticle[] = [];

      for (const apiCategory of categories) {
        const response = await fetch(
          `https://newsapi.org/v2/top-headlines?category=${apiCategory}&country=us&apiKey=${process.env.NEWS_API_KEY}&pageSize=5`
        );

        if (!response.ok) continue;

        const data = await response.json();
        
        for (const article of data.articles.slice(0, 2)) {
          if (!article.title || !article.description) continue;

          const mappedCategory = this.mapApiCategoryToOur(apiCategory, article.title);
          const subcategory = this.detectSubcategory(mappedCategory, article.title, article.description);

          realtimeArticles.push({
            id: nanoid(),
            title: article.title,
            excerpt: article.description,
            content: this.generateExpandedContent(article.title, article.description, article.content),
            category: mappedCategory,
            subcategory,
            imageUrl: this.surfBackgrounds[Math.floor(Math.random() * this.surfBackgrounds.length)],
            author: "ChillVibes News",
            isDraft: false,
            isFeatured: Math.random() > 0.8,
            isRealtime: true,
            sourceUrl: article.url,
            tags: this.generateTags(mappedCategory, article.title),
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      }

      return realtimeArticles;
    } catch (error) {
      console.error('Error fetching real-time news:', error);
      return [];
    }
  }

  private mapApiCategoryToOur(apiCategory: string, title: string): "tech" | "finance" | "jiu-jitsu" | "surf" {
    const lowerTitle = title.toLowerCase();
    
    if (lowerTitle.includes('crypto') || lowerTitle.includes('bitcoin') || 
        lowerTitle.includes('finance') || lowerTitle.includes('stock') ||
        lowerTitle.includes('bank') || lowerTitle.includes('trading')) {
      return 'finance';
    }
    
    if (lowerTitle.includes('surf') || lowerTitle.includes('wave') || 
        lowerTitle.includes('ocean') || lowerTitle.includes('beach')) {
      return 'surf';
    }
    
    if (lowerTitle.includes('martial') || lowerTitle.includes('jiu-jitsu') || 
        lowerTitle.includes('bjj') || lowerTitle.includes('mma')) {
      return 'jiu-jitsu';
    }
    
    return 'tech'; // Default for technology category
  }

  private detectSubcategory(category: string, title: string, description: string): string | undefined {
    const text = (title + ' ' + description).toLowerCase();
    
    switch (category) {
      case 'tech':
        if (text.includes('ai') || text.includes('artificial intelligence')) return 'ai';
        if (text.includes('crypto') || text.includes('blockchain')) return 'blockchain';
        if (text.includes('app') || text.includes('mobile')) return 'mobile';
        return 'innovation';
        
      case 'finance':
        if (text.includes('crypto') || text.includes('bitcoin')) return 'crypto';
        if (text.includes('credit card') || text.includes('rewards')) return 'travel-rewards';
        if (text.includes('hotel') || text.includes('airline')) return 'travel';
        return 'markets';
        
      case 'jiu-jitsu':
        if (text.includes('competition') || text.includes('tournament')) return 'competitions';
        if (text.includes('gym') || text.includes('academy')) return 'gyms';
        if (text.includes('athlete') || text.includes('fighter')) return 'athletes';
        return 'training';
        
      case 'surf':
        if (text.includes('competition') || text.includes('championship')) return 'competitions';
        if (text.includes('destination') || text.includes('spot')) return 'destinations';
        if (text.includes('board') || text.includes('gear')) return 'gear';
        return 'forecasts';
        
      default:
        return undefined;
    }
  }

  private generateTags(category: string, title: string): string[] {
    const commonTags = ['lifestyle', 'chill-vibes'];
    const text = title.toLowerCase();
    
    switch (category) {
      case 'tech':
        if (text.includes('ai')) commonTags.push('artificial-intelligence');
        if (text.includes('crypto')) commonTags.push('cryptocurrency', 'blockchain');
        if (text.includes('app')) commonTags.push('mobile', 'apps');
        commonTags.push('technology', 'innovation');
        break;
        
      case 'finance':
        if (text.includes('crypto')) commonTags.push('cryptocurrency');
        if (text.includes('credit card')) commonTags.push('travel-rewards', 'points');
        if (text.includes('stock')) commonTags.push('markets', 'trading');
        commonTags.push('finance', 'money');
        break;
        
      case 'jiu-jitsu':
        commonTags.push('martial-arts', 'bjj', 'training', 'mindset');
        break;
        
      case 'surf':
        commonTags.push('surfing', 'ocean', 'waves', 'adventure');
        break;
    }
    
    return commonTags;
  }

  private generateExpandedContent(title: string, excerpt: string, originalContent?: string): string {
    const intro = `<h2>${title}</h2><p>${excerpt}</p>`;
    
    if (originalContent && originalContent.length > 200) {
      return intro + `<div class="content-body">${originalContent}</div>`;
    }
    
    // Generate lifestyle-focused content expansion
    const lifestyleContent = `
      <h3>ChillVibes Perspective</h3>
      <p>At ChillVibes, we believe this story reflects the intersection of innovation and lifestyle. Whether you're catching waves at dawn or analyzing market trends over coffee, staying informed is part of living the balanced life.</p>
      
      <h3>Community Impact</h3>
      <p>This development resonates with our community's focus on mindful achievement and conscious living. It's about finding opportunities that align with both personal growth and lifestyle values.</p>
      
      <p><em>Stay tuned for more updates as this story develops, and share your thoughts in the comments below.</em></p>
    `;
    
    return intro + lifestyleContent;
  }

  // Enhanced original content with subcategories
  generateComprehensiveOriginalContent(): OriginalArticle[] {
    return [
      ...this.generateTechArticles(),
      ...this.generateFinanceArticles(), 
      ...this.generateJiuJitsuArticles(),
      ...this.generateSurfArticles()
    ];
  }

  private generateTechArticles(): OriginalArticle[] {
    return [
      {
        id: nanoid(),
        title: "Web3 Gaming: The Future of Digital Ownership",
        excerpt: "How blockchain technology is revolutionizing gaming economies and player ownership.",
        subcategory: "blockchain",
        content: `
          <h2>The Gaming Revolution</h2>
          <p>Web3 gaming represents a fundamental shift from traditional gaming models to player-owned economies where digital assets have real value.</p>
          
          <h3>True Digital Ownership</h3>
          <p>Unlike traditional games where items are locked to platforms, Web3 games use NFTs to represent in-game assets that players truly own and can trade across different games and platforms.</p>
          
          <h3>Play-to-Earn Economics</h3>
          <p>Players can now earn cryptocurrency and valuable NFTs through gameplay, creating new economic opportunities in virtual worlds.</p>
          
          <p>The intersection of gaming and lifestyle is becoming more apparent as virtual worlds offer spaces for both entertainment and entrepreneurship.</p>
        `,
        imageUrl: this.surfBackgrounds[0],
        category: "tech",
        author: "ChillVibes Tech Team",
        isDraft: false,
        isFeatured: Math.random() > 0.7,
        isRealtime: false,
        tags: ["web3", "gaming", "blockchain", "nft"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: nanoid(),
        title: "AI-Powered Personal Finance: Your Digital Money Coach",
        excerpt: "How artificial intelligence is making sophisticated financial planning accessible to everyone.",
        subcategory: "ai",
        content: `
          <h2>Smart Money Management</h2>
          <p>AI is democratizing financial planning, bringing sophisticated analysis and personalized recommendations to everyday money management.</p>
          
          <h3>Automated Insights</h3>
          <p>Modern AI apps analyze spending patterns, identify savings opportunities, and provide personalized investment recommendations based on your lifestyle and goals.</p>
          
          <h3>Real-Time Optimization</h3>
          <p>From credit score monitoring to investment rebalancing, AI systems work 24/7 to optimize your financial health while you focus on living your best life.</p>
        `,
        imageUrl: this.surfBackgrounds[1],
        category: "tech",
        author: "ChillVibes Tech Team",
        isDraft: false,
        isFeatured: Math.random() > 0.7,
        isRealtime: false,
        tags: ["ai", "fintech", "personal-finance", "automation"],
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];
  }

  private generateFinanceArticles(): OriginalArticle[] {
    return [
      {
        id: nanoid(),
        title: "Ultimate Travel Rewards Cards for Adventure Seekers",
        excerpt: "The best credit cards for earning points on surf trips, ski adventures, and lifestyle purchases.",
        subcategory: "travel-rewards",
        content: `
          <h2>Maximize Your Adventure Budget</h2>
          <p>For the ChillVibes community, travel isn't just about destinations—it's about experiences. The right credit cards can turn everyday spending into epic adventures.</p>
          
          <h3>Top Adventure-Focused Cards</h3>
          <p><strong>Chase Sapphire Reserve:</strong> 3x points on travel and dining, plus premium travel benefits perfect for surf and ski trips.</p>
          <p><strong>American Express Gold:</strong> 4x points on dining and supermarkets, ideal for fueling adventure lifestyles.</p>
          
          <h3>Point Optimization Strategies</h3>
          <p>Transfer points to airline partners for international surf destinations, or use points for hotel stays near world-class waves and mountain slopes.</p>
        `,
        imageUrl: this.surfBackgrounds[2],
        category: "finance",
        author: "ChillVibes Finance Team",
        isDraft: false,
        isFeatured: Math.random() > 0.7,
        isRealtime: false,
        tags: ["travel-rewards", "credit-cards", "points", "travel"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: nanoid(),
        title: "DeFi Yield Farming: Passive Income for Digital Nomads",
        excerpt: "How decentralized finance protocols can generate passive income while you travel and pursue adventures.",
        subcategory: "crypto",
        content: `
          <h2>Earning While Exploring</h2>
          <p>DeFi has opened new possibilities for location-independent income generation, perfect for the adventure-focused lifestyle.</p>
          
          <h3>Stablecoin Strategies</h3>
          <p>Yield farming with stablecoins offers lower volatility while still generating meaningful returns—ideal for funding extended surf trips or mountain seasons.</p>
          
          <h3>Risk Management</h3>
          <p>Diversification across protocols and understanding smart contract risks are crucial for sustainable DeFi strategies.</p>
        `,
        imageUrl: this.surfBackgrounds[3],
        category: "finance",
        author: "ChillVibes Finance Team",
        isDraft: false,
        isFeatured: Math.random() > 0.7,
        isRealtime: false,
        tags: ["defi", "cryptocurrency", "passive-income", "yield-farming"],
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];
  }

  private generateJiuJitsuArticles(): OriginalArticle[] {
    return [
      {
        id: nanoid(),
        title: "Mental Flow States: From Jiu-Jitsu Mats to Life Success",
        excerpt: "How martial arts training develops the mindset for peak performance in all areas of life.",
        subcategory: "mindset",
        content: `
          <h2>The Art of Mental Resilience</h2>
          <p>Jiu-Jitsu teaches more than physical techniques—it develops mental frameworks that translate to success in business, relationships, and personal growth.</p>
          
          <h3>Embracing Discomfort</h3>
          <p>Regular training in uncomfortable positions builds tolerance for challenge and uncertainty, essential skills for entrepreneurship and innovation.</p>
          
          <h3>Problem-Solving Under Pressure</h3>
          <p>Every roll is a chess match requiring real-time problem-solving while managing physical and mental pressure—skills that directly transfer to high-stakes decision making.</p>
          
          <h3>Ego Management</h3>
          <p>Being humbled on the mats regularly teaches the importance of beginner's mind and continuous learning, crucial for personal and professional development.</p>
        `,
        imageUrl: this.surfBackgrounds[4],
        category: "jiu-jitsu",
        author: "ChillVibes Jiu-Jitsu Team",
        isDraft: false,
        isFeatured: Math.random() > 0.7,
        isRealtime: false,
        tags: ["mindset", "flow-state", "mental-training", "performance"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: nanoid(),
        title: "Top Jiu-Jitsu Destinations: Training Around the World",
        excerpt: "Epic academies and training camps in surf towns and mountain destinations worldwide.",
        subcategory: "destinations",
        content: `
          <h2>Train Where Paradise Meets Performance</h2>
          <p>Combine your passion for jiu-jitsu with incredible destinations. These academies offer world-class training in lifestyle-focused locations.</p>
          
          <h3>Costa Rica: Dominical BJJ</h3>
          <p>Morning training sessions followed by world-class surfing. This academy perfectly embodies the ChillVibes lifestyle of balancing intense training with natural beauty.</p>
          
          <h3>Brazil: Rio de Janeiro</h3>
          <p>Train at the source with legendary instructors, then enjoy the beach culture and vibrant lifestyle that Brazil offers.</p>
          
          <h3>Portugal: Lisbon and Ericeira</h3>
          <p>Europe's growing jiu-jitsu scene meets incredible surf breaks and affordable living costs.</p>
        `,
        imageUrl: this.surfBackgrounds[0],
        category: "jiu-jitsu",
        author: "ChillVibes Jiu-Jitsu Team",
        isDraft: false,
        isFeatured: Math.random() > 0.7,
        isRealtime: false,
        tags: ["travel", "training-destinations", "lifestyle", "academies"],
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];
  }

  private generateSurfArticles(): OriginalArticle[] {
    return [
      {
        id: nanoid(),
        title: "Sustainable Surfing: Ocean Conservation Meets Wave Riding",
        excerpt: "How the surf community is leading environmental conservation efforts while pursuing their passion.",
        subcategory: "conservation",
        content: `
          <h2>Protecting Our Playground</h2>
          <p>Surfers have always been ocean guardians, and today's community is pioneering innovative conservation efforts to protect the waves and waters we love.</p>
          
          <h3>Eco-Friendly Surfboard Innovation</h3>
          <p>From recycled foam cores to bio-based resins, surfboard manufacturers are developing sustainable alternatives to traditional toxic materials.</p>
          
          <h3>Beach Cleanup Technology</h3>
          <p>Apps now coordinate cleanup efforts, track pollution data, and gamify environmental action, making conservation accessible and engaging for the next generation.</p>
          
          <h3>Carbon-Neutral Surf Travel</h3>
          <p>Surf tourism is evolving with carbon offset programs and eco-lodges that minimize environmental impact while maximizing stoke.</p>
        `,
        imageUrl: this.surfBackgrounds[1],
        category: "surf",
        author: "ChillVibes Surf Team",
        isDraft: false,
        isFeatured: Math.random() > 0.7,
        isRealtime: false,
        tags: ["conservation", "sustainability", "environment", "eco-surfing"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: nanoid(),
        title: "AI Wave Forecasting: The Future of Surf Prediction",
        excerpt: "How machine learning is revolutionizing surf forecasting accuracy and helping surfers score perfect sessions.",
        subcategory: "forecasting",
        content: `
          <h2>Precision Wave Prediction</h2>
          <p>Artificial intelligence is transforming surf forecasting from educated guessing to precise science, helping surfers optimize their time in the water.</p>
          
          <h3>Machine Learning Models</h3>
          <p>AI systems analyze vast datasets including wind patterns, swell directions, tidal influences, and bathymetry to predict wave quality with unprecedented accuracy.</p>
          
          <h3>Real-Time Optimization</h3>
          <p>Smart algorithms now provide hour-by-hour predictions, helping surfers time their sessions for optimal conditions and avoid blown-out or flat periods.</p>
          
          <h3>Crowd Prediction</h3>
          <p>Advanced models even predict lineup crowds, helping surfers find less crowded alternatives for better sessions.</p>
        `,
        imageUrl: this.surfBackgrounds[2],
        category: "surf",
        author: "ChillVibes Surf Team",
        isDraft: false,
        isFeatured: Math.random() > 0.7,
        isRealtime: false,
        tags: ["forecasting", "ai", "wave-prediction", "technology"],
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];
  }

  // Comprehensive content generation combining both original and real-time
  async generateDailyContent(): Promise<OriginalArticle[]> {
    try {
      const [originalContent, realtimeContent] = await Promise.all([
        Promise.resolve(this.generateComprehensiveOriginalContent()),
        this.fetchRealtimeNews()
      ]);

      // Combine and balance content (2-3 articles per category)
      const allContent = [...originalContent, ...realtimeContent];
      
      // Ensure balanced distribution
      const balancedContent: OriginalArticle[] = [];
      const categories = ['tech', 'finance', 'jiu-jitsu', 'surf'] as const;
      
      categories.forEach(category => {
        const categoryArticles = allContent.filter(a => a.category === category);
        // Take 2-3 random articles per category
        const count = Math.max(2, Math.min(3, categoryArticles.length));
        balancedContent.push(...categoryArticles.slice(0, count));
      });

      return balancedContent;
    } catch (error) {
      console.error('Error generating daily content:', error);
      // Fallback to original content only
      return this.generateComprehensiveOriginalContent();
    }
  }
}

export const enhancedContentService = new EnhancedContentService();