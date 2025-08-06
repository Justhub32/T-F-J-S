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
        return { title: "Jiu-Jitsu", color: "text-blue-500", description: "Martial arts and mindset" };
      case "surf":
        return { title: "Surf", color: "text-yellow-500", description: "Ocean life and flow" };
      default:
        return { title: "Unknown", color: "text-gray-500", description: "Category not found" };
    }
  };

  const { title: categoryTitle, color: categoryColor, description: categoryDescription } = getCategoryInfo(category || "");

  if (!category) {
    return <div>Category not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Category Header */}
        <div className="text-center mb-12">
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${categoryColor}`}>
            {categoryTitle}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
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
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles yet</h3>
            <p className="text-gray-600">
              Be the first to contribute to the {categoryTitle} section!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
