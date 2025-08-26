import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, Calendar, User, Volume2, VolumeX } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { CommentsSection } from "@/components/CommentsSection";
import { useBackgroundAudio } from "@/hooks/useBackgroundAudio";

export default function Article() {
  const [, params] = useRoute("/article/:id");
  const articleId = params?.id;
  
  const { isPlaying, toggle, setVolume, volume } = useBackgroundAudio(true);

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

  const getCategoryInfo = (cat: string) => {
    switch (cat) {
      case "tech":
        return { title: "Tech", color: "text-red-400" };
      case "finance":
        return { title: "Finance", color: "text-green-400" };
      case "jiu-jitsu":
        return { title: "Jiu-Jitsu", color: "text-blue-400" };
      case "surf":
        return { title: "Surf", color: "text-yellow-400" };
      default:
        return { title: "ChillVibes", color: "text-white" };
    }
  };

  const { title: categoryTitle, color: categoryColor } = getCategoryInfo(article.category);

  return (
    <div className="min-h-screen relative">
      {/* Article Background Image */}
      {article?.imageUrl && (
        <div className="fixed inset-0 z-0">
          <img 
            src={article.imageUrl}
            alt="Article background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50"></div>
        </div>
      )}
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        {/* Navigation and Audio Controls */}
        <div className="flex justify-between items-center mb-8">
          <Link href={`/category/${article.category}`}>
            <Button variant="ghost" className="hover:bg-white/20 text-white backdrop-blur-sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to {categoryTitle}
            </Button>
          </Link>
          
          {/* Ocean Sound Controls */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggle}
              className="hover:bg-white/20 text-white backdrop-blur-sm"
              title={isPlaying ? "Pause ocean sounds" : "Play ocean sounds"}
            >
              {isPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
            {isPlaying && (
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-16 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                title="Adjust ocean sound volume"
              />
            )}
          </div>
        </div>

        {/* Article Header */}
        <header className="mb-8">
          <div className="flex items-center mb-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium bg-white/20 backdrop-blur-sm text-white`}>
              {categoryTitle}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
            {article.title}
          </h1>

          <div className="flex items-center text-gray-200 space-x-6">
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

        {/* Article Content */}
        <div className="mb-12">
          <div className="prose prose-lg max-w-none">
            <div 
              dangerouslySetInnerHTML={{ __html: article.content }}
              className="prose-headings:text-white prose-p:text-white prose-strong:text-white prose-a:text-blue-300 hover:prose-a:text-blue-200 drop-shadow-lg"
            />
          </div>
        </div>

        {/* Author Bio */}
        <div className="mb-12">
          <div className="flex items-start">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mr-4 flex items-center justify-center">
              <span className="text-xl font-bold text-white">
                {article.author.charAt(0)}
              </span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2 drop-shadow-lg">{article.author}</h3>
              <p className="text-gray-200 drop-shadow-lg">
                Contributing writer for ChillVibes community, sharing insights on the balanced lifestyle.
              </p>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-black/30 backdrop-blur-md rounded-2xl shadow-lg p-8">
          <CommentsSection articleId={articleId} />
        </div>
      </div>
    </div>
  );
}
