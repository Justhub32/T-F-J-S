import { nanoid } from "nanoid";

export interface OriginalArticle {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: "tech" | "finance" | "jiu-jitsu" | "surf";
  imageUrl?: string;
  author: string;
  isDraft: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class ContentService {
  constructor() {}

  generateTechArticles(): OriginalArticle[] {
    return [
      {
        id: nanoid(),
        title: "The Future of Decentralized Web: Web3 and Beyond",
        excerpt: "Exploring how blockchain technology is reshaping the internet, from DeFi protocols to decentralized social networks.",
        content: `
          <h2>The Dawn of Web3</h2>
          <p>The internet as we know it is evolving. Web3 represents a fundamental shift from centralized platforms to decentralized protocols that put users in control of their data and digital assets.</p>
          
          <h3>Core Principles of Web3</h3>
          <p><strong>Decentralization:</strong> Instead of relying on central servers, Web3 applications run on distributed networks of nodes, making them more resilient and censorship-resistant.</p>
          
          <p><strong>User Ownership:</strong> Through blockchain technology, users truly own their digital assets, from cryptocurrency to NFTs to their personal data.</p>
          
          <p><strong>Trustless Interactions:</strong> Smart contracts enable automated, trustless transactions without intermediaries.</p>
          
          <h3>Real-World Applications</h3>
          <p>DeFi protocols are already handling billions in transactions, while decentralized social networks like Mastodon and Bluesky are gaining traction as alternatives to traditional platforms.</p>
          
          <p>The transition won't happen overnight, but the infrastructure is being built today. As developers, staying informed about Web3 technologies isn't just about following trends—it's about understanding the future of digital interaction.</p>
        `,
        category: "tech",
        author: "ChillVibes Tech Team",
        isDraft: false,
        isFeatured: Math.random() > 0.7,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: nanoid(),
        title: "AI-Driven Development: Tools That Actually Matter",
        excerpt: "A practical look at AI coding assistants, automated testing, and the tools that are genuinely changing how we build software.",
        content: `
          <h2>Beyond the Hype: AI Tools That Work</h2>
          <p>While everyone's talking about AI replacing developers, the reality is more nuanced. AI tools are becoming powerful assistants that enhance productivity rather than replace human creativity.</p>
          
          <h3>Code Generation and Completion</h3>
          <p>Tools like GitHub Copilot and Tabnine have moved beyond simple autocomplete to understanding context and generating meaningful code blocks. The key is learning when to trust AI suggestions and when to write from scratch.</p>
          
          <h3>Automated Testing and Debugging</h3>
          <p>AI-powered testing tools can generate test cases, identify edge cases you might miss, and even suggest fixes for common bugs. This frees developers to focus on architecture and user experience.</p>
          
          <h3>Documentation and Code Review</h3>
          <p>AI can now generate meaningful documentation from code comments and assist in code reviews by flagging potential issues before human reviewers dive in.</p>
          
          <h3>The Human Element</h3>
          <p>The most successful developers aren't those who avoid AI tools, but those who learn to use them effectively while maintaining their problem-solving skills and creative thinking.</p>
          
          <p>AI is a tool, not a replacement. Master the tools, but never stop thinking like a developer.</p>
        `,
        category: "tech",
        author: "ChillVibes Tech Team",
        isDraft: false,
        isFeatured: Math.random() > 0.7,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: nanoid(),
        title: "Building Resilient Systems: Lessons from Distributed Architecture",
        excerpt: "How to design systems that gracefully handle failures, scale efficiently, and maintain reliability under pressure.",
        content: `
          <h2>The Art of System Resilience</h2>
          <p>In today's always-on world, system downtime isn't just inconvenient—it's costly. Building resilient distributed systems requires thinking beyond happy path scenarios.</p>
          
          <h3>Embrace Failure as Normal</h3>
          <p>Netflix's Chaos Monkey randomly terminates services to test system resilience. This philosophy of "failing fast and failing often" helps identify weaknesses before they become critical issues.</p>
          
          <h3>Circuit Breaker Pattern</h3>
          <p>When a service starts failing, circuit breakers prevent cascade failures by temporarily blocking requests to the failing service, allowing it time to recover.</p>
          
          <h3>Graceful Degradation</h3>
          <p>Instead of complete failure, well-designed systems provide reduced functionality. Think of how Twitter still shows cached tweets when real-time updates fail.</p>
          
          <h3>Monitoring and Observability</h3>
          <p>You can't fix what you can't see. Comprehensive logging, metrics, and distributed tracing are essential for understanding system behavior in production.</p>
          
          <h3>The Mindset Shift</h3>
          <p>Resilient systems aren't about preventing all failures—they're about failing gracefully and recovering quickly. This mindset shift changes how you approach system design from the ground up.</p>
        `,
        category: "tech",
        author: "ChillVibes Tech Team",
        isDraft: false,
        isFeatured: Math.random() > 0.7,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];
  }

  generateFinanceArticles(): OriginalArticle[] {
    return [
      {
        id: nanoid(),
        title: "DeFi Yield Farming: Strategy Beyond the Hype",
        excerpt: "Understanding the risks and rewards of yield farming in decentralized finance, with practical strategies for different risk profiles.",
        content: `
          <h2>Yield Farming: Beyond the Marketing</h2>
          <p>Yield farming promises high returns, but like any investment strategy, it requires understanding the underlying mechanisms and risks.</p>
          
          <h3>How Yield Farming Actually Works</h3>
          <p>At its core, yield farming involves providing liquidity to decentralized exchanges or lending protocols in exchange for rewards. These rewards come from trading fees, governance tokens, or inflation rewards.</p>
          
          <h3>Risk Assessment</h3>
          <p><strong>Impermanent Loss:</strong> When you provide liquidity to a trading pair, price movements can result in less value than simply holding the tokens.</p>
          
          <p><strong>Smart Contract Risk:</strong> Bugs in smart contracts can lead to total loss of funds. Always research the protocol's audit history.</p>
          
          <p><strong>Token Risk:</strong> Governance tokens used as rewards can be highly volatile or become worthless.</p>
          
          <h3>Strategic Approaches</h3>
          <p><strong>Conservative:</strong> Stick to established protocols like Uniswap or Compound with proven track records.</p>
          
          <p><strong>Balanced:</strong> Diversify across multiple protocols and only invest what you can afford to lose.</p>
          
          <p><strong>Aggressive:</strong> Early adoption of new protocols for higher rewards, but with significant risk.</p>
          
          <p>Remember: sustainable yields in traditional finance are 3-7% annually. If a DeFi protocol promises 100% APY, ask why and understand the risks.</p>
        `,
        category: "finance",
        author: "ChillVibes Finance Team",
        isDraft: false,
        isFeatured: Math.random() > 0.7,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: nanoid(),
        title: "Personal Finance in the Digital Age: Beyond Traditional Banking",
        excerpt: "How fintech innovations are changing personal finance management, from neobanks to investment apps to cryptocurrency integration.",
        content: `
          <h2>Rethinking Personal Finance</h2>
          <p>Traditional banking is being disrupted by fintech innovations that offer better user experiences, lower fees, and new capabilities.</p>
          
          <h3>Neobanks and Digital-First Banking</h3>
          <p>Banks like Chime, Revolut, and N26 offer banking without physical branches, often with better mobile experiences and lower fees than traditional banks.</p>
          
          <h3>Automated Investing and Robo-Advisors</h3>
          <p>Apps like Betterment and Wealthfront use algorithms to manage portfolios, making investing accessible to people who previously couldn't afford financial advisors.</p>
          
          <h3>Cryptocurrency Integration</h3>
          <p>Many fintech apps now offer cryptocurrency buying, selling, and yield earning alongside traditional financial services. This integration is making crypto more mainstream.</p>
          
          <h3>Real-Time Financial Insights</h3>
          <p>Modern financial apps provide instant spending categorization, budget tracking, and financial health scores that help users make better money decisions.</p>
          
          <h3>The Balanced Approach</h3>
          <p>While fintech offers compelling benefits, don't abandon proven financial principles: emergency funds, diversified investing, and living below your means remain crucial regardless of the technology you use.</p>
          
          <p>Use technology to enhance your financial discipline, not to enable risky behavior with gamified interfaces.</p>
        `,
        category: "finance",
        author: "ChillVibes Finance Team",
        isDraft: false,
        isFeatured: Math.random() > 0.7,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: nanoid(),
        title: "Investment Psychology: Why Smart People Make Bad Financial Decisions",
        excerpt: "Exploring cognitive biases that affect investment decisions and practical strategies to overcome emotional investing pitfalls.",
        content: `
          <h2>The Mind of an Investor</h2>
          <p>Technical analysis and fundamental research are important, but investment psychology often determines long-term success more than market knowledge.</p>
          
          <h3>Common Cognitive Biases</h3>
          <p><strong>Loss Aversion:</strong> We feel losses more strongly than equivalent gains, leading to holding losing positions too long and selling winners too early.</p>
          
          <p><strong>Confirmation Bias:</strong> We seek information that confirms our existing beliefs and ignore contradictory evidence.</p>
          
          <p><strong>Recency Bias:</strong> We overweight recent events when making decisions, leading to buying high after bull runs and selling low after crashes.</p>
          
          <h3>Practical Strategies</h3>
          <p><strong>Systematic Approaches:</strong> Use dollar-cost averaging and rebalancing schedules to remove emotion from timing decisions.</p>
          
          <p><strong>Pre-Commitment:</strong> Decide your investment strategy during calm periods and stick to it during volatile times.</p>
          
          <p><strong>Diversification:</strong> Spread risk across asset classes, geographies, and time periods to reduce the impact of any single decision.</p>
          
          <h3>The Long Game</h3>
          <p>Successful investing is boring. It's about consistent behavior over decades, not brilliant market timing. Understanding your psychology helps you stay consistent when markets test your resolve.</p>
          
          <p>The best investors aren't the smartest—they're the most disciplined.</p>
        `,
        category: "finance",
        author: "ChillVibes Finance Team",
        isDraft: false,
        isFeatured: Math.random() > 0.7,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];
  }

  generateJiuJitsuArticles(): OriginalArticle[] {
    return [
      {
        id: nanoid(),
        title: "The Mental Game: Building Resilience Through Jiu-Jitsu",
        excerpt: "How the mental challenges of Brazilian Jiu-Jitsu translate to stronger resilience, better problem-solving, and emotional regulation in daily life.",
        content: `
          <h2>More Than Physical Training</h2>
          <p>Brazilian Jiu-Jitsu is often called "physical chess" because it demands strategic thinking under pressure. But the mental benefits extend far beyond the mat.</p>
          
          <h3>Embracing Discomfort</h3>
          <p>BJJ forces you to remain calm while someone is actively trying to submit you. This controlled stress training builds resilience that transfers to work presentations, difficult conversations, and life challenges.</p>
          
          <h3>Problem-Solving Under Pressure</h3>
          <p>Every roll is a series of problems to solve: how to escape this position, how to advance your position, how to set up your next attack. This constant problem-solving sharpens your ability to think clearly under stress.</p>
          
          <h3>Ego Management</h3>
          <p>You'll tap out regularly in BJJ, especially as a beginner. Learning to tap, analyze what went wrong, and try again builds humility and growth mindset that serves you well in professional and personal development.</p>
          
          <h3>Emotional Regulation</h3>
          <p>Panic leads to exhaustion and poor decisions on the mat. BJJ teaches you to recognize emotional escalation and return to calm, controlled breathing and thinking.</p>
          
          <h3>The Flow State</h3>
          <p>Advanced practitioners often describe entering a flow state during rolling—complete presence and responsiveness without overthinking. This mindfulness practice enhances focus and reduces anxiety off the mat.</p>
          
          <p>The physical techniques are just the beginning. The mental skills developed through BJJ create a foundation for handling life's challenges with greater calm and clarity.</p>
        `,
        category: "jiu-jitsu",
        author: "ChillVibes Martial Arts Team",
        isDraft: false,
        isFeatured: Math.random() > 0.7,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: nanoid(),
        title: "Building Your Home Training Routine: BJJ Fundamentals",
        excerpt: "Essential solo drills, mobility work, and strength training that complement your mat time and accelerate your Brazilian Jiu-Jitsu progress.",
        content: `
          <h2>Training Beyond Class Time</h2>
          <p>While live rolling and instruction are irreplaceable, a structured home training routine can significantly accelerate your BJJ development.</p>
          
          <h3>Solo Movement Drills</h3>
          <p><strong>Shrimping:</strong> Practice hip escapes on both sides for 2-3 minutes daily. This fundamental movement is crucial for most escapes.</p>
          
          <p><strong>Technical Stand-ups:</strong> Perfect your base and posture when transitioning from ground to standing.</p>
          
          <p><strong>Forward and Backward Rolls:</strong> Build comfort with inverted positions and improve spatial awareness.</p>
          
          <h3>Mobility and Flexibility</h3>
          <p><strong>Hip Flexors:</strong> Tight hip flexors limit guard retention and passing. Daily stretching improves range of motion for guard work.</p>
          
          <p><strong>Shoulders:</strong> Shoulder mobility is crucial for grips, submissions, and defensive postures.</p>
          
          <p><strong>Neck Strengthening:</strong> Gentle neck exercises help prevent injury and improve comfort when bridging.</p>
          
          <h3>Strength Training</h3>
          <p><strong>Isometric Holds:</strong> Planks, dead hangs, and hollow body holds build the core stability essential for BJJ.</p>
          
          <p><strong>Functional Movement:</strong> Turkish get-ups, bear crawls, and animal movements improve movement quality.</p>
          
          <h3>Mental Training</h3>
          <p><strong>Visualization:</strong> Spend 10-15 minutes mentally rehearsing techniques or scenarios from class.</p>
          
          <p><strong>Study:</strong> Watch instructional videos to understand concepts, but don't rely on them to replace live instruction.</p>
          
          <p>Consistency beats intensity. 15-20 minutes of daily home training will improve your BJJ more than sporadic long sessions.</p>
        `,
        category: "jiu-jitsu",
        author: "ChillVibes Martial Arts Team",
        isDraft: false,
        isFeatured: Math.random() > 0.7,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: nanoid(),
        title: "Competition Mindset: Lessons from the Tournament Circuit",
        excerpt: "How competitive Brazilian Jiu-Jitsu builds character, handles pressure, and develops strategic thinking both on and off the mat.",
        content: `
          <h2>The Forge of Competition</h2>
          <p>Competition isn't for everyone, but the lessons learned from testing your skills under pressure create profound personal growth.</p>
          
          <h3>Preparation and Process</h3>
          <p>Successful competitors focus on process over outcome. You can't control whether you win, but you can control your preparation, technique execution, and mental approach.</p>
          
          <h3>Managing Pre-Competition Nerves</h3>
          <p><strong>Visualization:</strong> Mentally rehearse your matches, including potential challenges and your responses.</p>
          
          <p><strong>Breathing:</strong> Control your breath to manage anxiety. Box breathing (4-4-4-4 count) helps calm the nervous system.</p>
          
          <p><strong>Focus on Fundamentals:</strong> Under pressure, rely on techniques you've drilled thousands of times rather than flashy moves you've hit once.</p>
          
          <h3>Learning from Losses</h3>
          <p>Every loss contains valuable information. Video review helps identify technical errors, but also examine mental lapses, tactical mistakes, and preparation gaps.</p>
          
          <h3>Strategic Thinking</h3>
          <p>Competition forces you to develop game plans, adapt to different opponents, and make quick strategic decisions. These skills translate directly to business strategy and problem-solving.</p>
          
          <h3>The Growth Mindset</h3>
          <p>Competition accelerates learning by providing immediate feedback on your skills. Win or lose, each match teaches something new about your capabilities and areas for improvement.</p>
          
          <p>The confidence built through competition—knowing you can perform under pressure—carries into all areas of life where stakes are high and outcomes matter.</p>
        `,
        category: "jiu-jitsu",
        author: "ChillVibes Martial Arts Team",
        isDraft: false,
        isFeatured: Math.random() > 0.7,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];
  }

  generateSurfArticles(): OriginalArticle[] {
    return [
      {
        id: nanoid(),
        title: "Reading the Ocean: A Surfer's Guide to Wave Forecasting",
        excerpt: "Understanding swell direction, wind patterns, and tidal influences to predict optimal surf conditions and find uncrowded sessions.",
        content: `
          <h2>The Language of Waves</h2>
          <p>Great surfers aren't just skilled on their boards—they're students of oceanography, meteorology, and local knowledge.</p>
          
          <h3>Understanding Swell</h3>
          <p><strong>Swell Period:</strong> Longer period swells (12+ seconds) typically produce cleaner, more powerful waves than short-period wind swell.</p>
          
          <p><strong>Swell Direction:</strong> Know how different swell directions interact with your local breaks. A southwest swell might be perfect for one spot and terrible for another.</p>
          
          <p><strong>Swell Size:</strong> Forecast models show deep water swell size, but local factors like reef depth, bottom contour, and shoreline shape determine actual wave size.</p>
          
          <h3>Wind Patterns</h3>
          <p><strong>Offshore Winds:</strong> Clean up wave faces and hold them up longer, creating ideal surfing conditions.</p>
          
          <p><strong>Onshore Winds:</strong> Create choppy, closed-out conditions, but can sometimes improve very small swells.</p>
          
          <p><strong>Daily Wind Cycles:</strong> Many coastal areas have predictable daily wind patterns based on land and sea temperature differences.</p>
          
          <h3>Tidal Influences</h3>
          <p>Different breaks work better at different tides. Rocky reef breaks might only work at mid to high tide, while beach breaks might prefer lower tides for shape and power.</p>
          
          <h3>Local Knowledge</h3>
          <p>Spend time observing your local breaks in different conditions. Apps and forecasts provide data, but experience teaches you how that data translates to actual surf quality.</p>
          
          <p>The ocean is constantly changing. Developing your ability to read conditions means more good sessions and fewer frustrating paddle-outs.</p>
        `,
        category: "surf",
        author: "ChillVibes Surf Team",
        isDraft: false,
        isFeatured: Math.random() > 0.7,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: nanoid(),
        title: "Surf Fitness: Building Ocean-Ready Strength and Endurance",
        excerpt: "Specific training routines that develop the functional strength, paddle endurance, and flexibility needed for peak surfing performance.",
        content: `
          <h2>Training for the Ocean</h2>
          <p>Surfing demands a unique combination of upper body endurance, core stability, explosive power, and flexibility. Generic fitness doesn't always translate to surf performance.</p>
          
          <h3>Paddle Endurance</h3>
          <p><strong>Swimming:</strong> Nothing replaces actual swimming for paddle fitness. Focus on longer distances with steady effort rather than sprint intervals.</p>
          
          <p><strong>Pull-ups and Variations:</strong> Build the pulling strength needed for powerful paddle strokes. Vary grip width and add pauses to build strength through full range of motion.</p>
          
          <p><strong>Paddleboard Training:</strong> SUP or prone paddleboard sessions directly translate to surf paddle fitness while improving balance.</p>
          
          <h3>Pop-up Power and Agility</h3>
          <p><strong>Burpees:</strong> The classic surf exercise combines the explosive push-up movement with the squat-to-stand motion of the pop-up.</p>
          
          <p><strong>Turkish Get-ups:</strong> Build the complex coordination and strength needed to move efficiently from prone to standing.</p>
          
          <p><strong>Balance Training:</strong> Indo boards, balance balls, and single-leg exercises improve proprioception and stability.</p>
          
          <h3>Flexibility and Mobility</h3>
          <p><strong>Shoulder Mobility:</strong> Surfing demands extreme shoulder range of motion. Daily shoulder stretching prevents injury and improves performance.</p>
          
          <p><strong>Hip Flexibility:</strong> Open hips allow for better stance variety and turning power. Focus on hip flexors, glutes, and IT bands.</p>
          
          <p><strong>Thoracic Spine:</strong> Prolonged paddling can create upper back stiffness. Mobility work keeps your spine healthy and improves paddle stroke efficiency.</p>
          
          <h3>Breath Work</h3>
          <p>Wipeouts happen. Practice breath holds and CO2 tolerance training, but always do breath work safely with supervision.</p>
          
          <p>The ocean will test every aspect of your fitness. Train specifically and consistently to maximize your time on the water.</p>
        `,
        category: "surf",
        author: "ChillVibes Surf Team",
        isDraft: false,
        isFeatured: Math.random() > 0.7,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: nanoid(),
        title: "Sustainable Surfing: Protecting the Oceans We Love",
        excerpt: "How the surf community is leading environmental conservation efforts, from local beach cleanups to supporting ocean protection policies.",
        content: `
          <h2>Guardians of the Ocean</h2>
          <p>Surfers have a unique relationship with the ocean. We witness water quality changes, see plastic pollution firsthand, and depend on healthy marine ecosystems for our passion.</p>
          
          <h3>Individual Actions</h3>
          <p><strong>Eco-Friendly Gear:</strong> Choose surfboards made with sustainable materials, reef-safe sunscreen, and wetsuits from companies with environmental commitments.</p>
          
          <p><strong>Beach Cleanup:</strong> Organize or join regular beach cleanups. Every piece of plastic removed prevents it from harming marine life.</p>
          
          <p><strong>Water Conservation:</strong> Use biodegradable soaps for wetsuit washing and consider installing low-flow shower heads for post-surf rinses.</p>
          
          <h3>Community Initiatives</h3>
          <p><strong>Surfrider Foundation:</strong> Join local chapters working on beach access, water quality monitoring, and plastic pollution reduction.</p>
          
          <p><strong>Ocean Advocacy:</strong> Support organizations fighting climate change, marine protected areas, and sustainable fishing practices.</p>
          
          <p><strong>Education:</strong> Share knowledge about ocean conservation with other surfers, especially younger generations.</p>
          
          <h3>Policy and Systemic Change</h3>
          <p>Individual actions matter, but systemic change requires policy intervention. Support candidates and legislation that prioritize ocean health and climate action.</p>
          
          <h3>The Economics of Conservation</h3>
          <p>Surf tourism generates billions in economic activity. Healthy oceans and consistent waves are economic assets worth protecting through responsible travel and business practices.</p>
          
          <h3>Future Generations</h3>
          <p>The waves we surf today may look very different due to climate change, sea level rise, and ocean acidification. Our actions now determine what future surfers will inherit.</p>
          
          <p>Being a surfer means being an ocean advocate. The stoke we feel riding waves should motivate us to protect the source of that joy.</p>
        `,
        category: "surf",
        author: "ChillVibes Surf Team",
        isDraft: false,
        isFeatured: Math.random() > 0.7,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];
  }

  generateAllOriginalContent(): OriginalArticle[] {
    return [
      ...this.generateTechArticles(),
      ...this.generateFinanceArticles(),
      ...this.generateJiuJitsuArticles(),
      ...this.generateSurfArticles()
    ];
  }
}

export const contentService = new ContentService();