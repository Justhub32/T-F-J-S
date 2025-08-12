import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { api } from "@/lib/api";
import ArticleCard from "@/components/article-card";

export default function Category() {
  const [, params] = useRoute("/category/:category");
  const category = params?.category;

  const { data: articles, isLoading } = useQuery({
    queryKey: ["/api/articles", category],
    queryFn: () => api.articles.getAll(category),
    enabled: !!category,
  });

  const getCategoryInfo = (cat: string) => {
    switch (cat) {
      case "tech":
        return { title: "Tech", color: "text-red-500", description: "Innovation and technology" };
      case "finance":
        return { title: "Finance", color: "text-green-500", description: "Markets and money" };
      case "jiu-jitsu":
        return { title: "Jiu-Jitsu", color: "category-jiu-jitsu", description: "Martial arts and mindset" };
      case "surf":
        return { title: "Surf", color: "category-surf", description: "Ocean life and flow" };
      default:
        return { title: "Unknown", color: "text-gray-500", description: "Category not found" };
    }
  };

  const { title: categoryTitle, color: categoryColor, description: categoryDescription } = getCategoryInfo(category || "");

  if (!category) {
    return <div>Category not found</div>;
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
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-ocean/10 to-surf/10"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        {/* Category Header */}
        <div className="text-center mb-12">
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${categoryColor} drop-shadow-lg`}>
            {categoryTitle}
          </h1>
          <p className="text-xl text-white max-w-2xl mx-auto drop-shadow-md">
            {categoryDescription}
          </p>
        </div>

        {/* Articles Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-2xl h-96 animate-pulse"></div>
            ))}
          </div>
        ) : articles && articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-white mb-2 drop-shadow-lg">No articles yet</h3>
            <p className="text-gray-200 drop-shadow-md">
              Be the first to contribute to the {categoryTitle} section!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
