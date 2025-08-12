import { Link } from "wouter";
import { Article } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const categoryColors = {
    "tech": "bg-red-100 text-red-600",
    "finance": "bg-green-100 text-green-600",
    "jiu-jitsu": "bg-yellow-100 text-yellow-600",
    "surf": "bg-blue-100 text-blue-600",
  };

  const hoverColors = {
    "tech": "group-hover:text-red-600",
    "finance": "group-hover:text-green-600",
    "jiu-jitsu": "group-hover:text-yellow-600",
    "surf": "group-hover:text-blue-600",
  };

  return (
    <Link href={`/article/${article.id}`}>
      <article className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer">
        {article.imageUrl && (
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}
        
        <div className="p-6">
          <div className="flex items-center mb-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              categoryColors[article.category as keyof typeof categoryColors] || "bg-gray-100 text-gray-600"
            }`}>
              {article.category.charAt(0).toUpperCase() + article.category.slice(1).replace('-', '-')}
            </span>
            <span className="text-gray-400 ml-auto text-sm">
              {formatDistanceToNow(new Date(article.createdAt), { addSuffix: true })}
            </span>
          </div>
          <h3 className={`text-xl font-bold text-gray-900 mb-3 transition-colors ${
            hoverColors[article.category as keyof typeof hoverColors] || "group-hover:text-gray-700"
          }`}>
            {article.title}
          </h3>
          <p className="text-gray-600 mb-4">
            {article.excerpt}
          </p>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-200 rounded-full mr-3 flex items-center justify-center">
              <span className="text-xs font-medium text-gray-600">
                {article.author.charAt(0)}
              </span>
            </div>
            <span className="text-gray-700 font-medium text-sm">{article.author}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
