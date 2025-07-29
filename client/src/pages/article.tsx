import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function Article() {
  const [, params] = useRoute("/article/:id");
  const articleId = params?.id;

  const { data: article, isLoading, error } = useQuery({
    queryKey: ["/api/articles", articleId],
    queryFn: () => api.articles.getById(articleId!),
    enabled: !!articleId,
  });

  if (!articleId) {
    return <div>Article ID not found</div>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-gray-200 rounded-lg h-8 w-32 mb-8 animate-pulse"></div>
          <div className="bg-gray-200 rounded-lg h-96 mb-8 animate-pulse"></div>
          <div className="space-y-4">
            <div className="bg-gray-200 rounded h-4 animate-pulse"></div>
            <div className="bg-gray-200 rounded h-4 animate-pulse"></div>
            <div className="bg-gray-200 rounded h-4 w-3/4 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article not found</h1>
          <p className="text-gray-600 mb-8">The article you're looking for doesn't exist.</p>
          <Link href="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const categoryColor = article.category === "tech-finance" ? "text-ocean" : "text-surf";
  const categoryBg = article.category === "tech-finance" ? "bg-ocean/10" : "bg-surf/10";
  const categoryTitle = article.category === "tech-finance" ? "Tech+Finance" : "Jiu-Jitsu+Surf";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Back Button */}
        <Link href={`/category/${article.category}`}>
          <Button variant="ghost" className="mb-8 hover:bg-gray-100">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to {categoryTitle}
          </Button>
        </Link>

        {/* Article Header */}
        <header className="mb-8">
          <div className="flex items-center mb-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${categoryBg} ${categoryColor}`}>
              {categoryTitle}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {article.title}
          </h1>

          <div className="flex items-center text-gray-600 space-x-6">
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{formatDistanceToNow(new Date(article.createdAt), { addSuffix: true })}</span>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {article.imageUrl && (
          <div className="mb-8">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-96 object-cover rounded-2xl shadow-lg"
            />
          </div>
        )}

        {/* Article Content */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-12">
          <div className="prose prose-lg max-w-none">
            <div 
              dangerouslySetInnerHTML={{ __html: article.content }}
              className="prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-a:text-ocean hover:prose-a:text-teal-600"
            />
          </div>
        </div>

        {/* Author Bio */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="flex items-start">
            <div className="w-16 h-16 bg-gray-200 rounded-full mr-4 flex items-center justify-center">
              <span className="text-xl font-bold text-gray-600">
                {article.author.charAt(0)}
              </span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{article.author}</h3>
              <p className="text-gray-600">
                Contributing writer for ChillVibes community, sharing insights on the balanced lifestyle.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
