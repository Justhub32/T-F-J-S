import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { api } from "@/lib/api";
import ArticleCard from "@/components/article-card";

export default function Subcategory() {
  const [, params] = useRoute("/category/:category/:subcategory");
  const category = params?.category;
  const subcategory = params?.subcategory;

  const { data: articles, isLoading } = useQuery({
    queryKey: ["/api/articles", category, subcategory],
    queryFn: () => api.articles.getBySubcategory(category, subcategory),
    enabled: !!(category && subcategory),
  });

  const getSubcategoryInfo = (cat: string, subcat: string) => {
    const subcategoryMap: Record<string, Record<string, any>> = {
      "tech": {
        "ai": { title: "AI & Innovation", description: "Artificial intelligence and cutting-edge technology" },
        "blockchain": { title: "Blockchain", description: "Web3, crypto tech, and decentralized systems" },
        "mobile": { title: "Mobile Apps", description: "Mobile development and app innovations" }
      },
      "finance": {
        "travel-rewards": { title: "Travel Rewards", description: "Credit cards, points, and travel optimization" },
        "crypto": { title: "Crypto & DeFi", description: "Digital currencies and decentralized finance" },
        "markets": { title: "Markets", description: "Trading, investing, and market analysis" }
      },
      "jiu-jitsu": {
        "training": { title: "Training & Mindset", description: "Techniques, philosophy, and mental development" },
        "destinations": { title: "Destinations", description: "Best gyms and training locations worldwide" },
        "competitions": { title: "Competitions", description: "Tournament updates and athlete profiles" }
      },
      "surf": {
        "forecasting": { title: "Forecasting", description: "Wave predictions and surf conditions" },
        "destinations": { title: "Destinations", description: "Epic surf spots and hidden gems" },
        "conservation": { title: "Conservation", description: "Ocean protection and sustainable surfing" },
        "gear": { title: "Gear Reviews", description: "Surfboard and equipment reviews" }
      }
    };

    return subcategoryMap[cat]?.[subcat] || { title: "Unknown", description: "Subcategory not found" };
  };

  const { title: subcategoryTitle, description: subcategoryDescription } = getSubcategoryInfo(category || "", subcategory || "");

  if (!category || !subcategory) {
    return <div>Subcategory not found</div>;
  }

  return (
    <div className="min-h-screen relative">
      {/* Full Page Surf Background Image */}
      <div className="fixed inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1502680390469-be75c86b636f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&h=1200&q=80"
          alt="Background"
          className="w-full h-full object-cover"
        />
        {/* Removed dark overlay for cleaner appearance */}
        <div className="absolute inset-0 bg-gradient-to-r from-ocean/10 to-surf/10"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        {/* Subcategory Header */}
        <div className="text-center mb-12">
          <nav className="text-sm text-gray-300 mb-4">
            <span className="hover:text-white">
              {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
            </span>
            <span className="mx-2">→</span>
            <span className="text-white font-medium">{subcategoryTitle}</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-lg">
            {subcategoryTitle}
          </h1>
          <p className="text-xl text-gray-100 max-w-2xl mx-auto drop-shadow-md">
            {subcategoryDescription}
          </p>
        </div>

        {/* Articles Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl h-96 animate-pulse" />
            ))}
          </div>
        ) : articles && articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <div key={article.id} className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50">
                <ArticleCard article={article} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-white py-16">
            <h3 className="text-2xl font-bold mb-4">No articles found</h3>
            <p className="text-gray-300">Check back soon for fresh content in this subcategory!</p>
          </div>
        )}
      </div>
    </div>
  );
}