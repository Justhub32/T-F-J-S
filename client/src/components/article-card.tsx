import { Link } from "wouter";
import { Article } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

// Jiu-jitsu cover images
import jiujitsuCover1 from "@assets/generated_images/Jiu-jitsu_competition_cover_photo_81aa2f4f.png";
import jiujitsuCover2 from "@assets/generated_images/Jiu-jitsu_instruction_cover_photo_87e9f438.png";
import jiujitsuCover3 from "@assets/generated_images/Championship_victory_cover_photo_bc411842.png";
import jiujitsuCover4 from "@assets/generated_images/Training_session_cover_photo_484e2d2e.png";

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

  // Array of jiu-jitsu cover images
  const jiujitsuCovers = [jiujitsuCover1, jiujitsuCover2, jiujitsuCover3, jiujitsuCover4];
  
  // Function to get a consistent cover image for each jiu-jitsu article
  const getJiujitsuCover = (articleId: string) => {
    const hash = articleId.split('').reduce((a, b) => {
      a = ((a << 7) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    const index = Math.abs(hash) % jiujitsuCovers.length;
    return jiujitsuCovers[index];
  };

  // Determine which image to show
  const displayImage = article.category === "jiu-jitsu" 
    ? getJiujitsuCover(article.id)
    : article.imageUrl;

  return (
    <Link href={`/article/${article.id}`}>
      <article className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer">
        {(displayImage || article.category === "jiu-jitsu") && (
          <img
            src={displayImage || ""}
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
