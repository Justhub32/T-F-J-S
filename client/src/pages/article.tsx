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
  
  const { isPlaying, toggle, setVolume, volume } = useBackgroundAudio();

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
      {/* Enhanced Article Background with Parallax Effect */}
      {article?.imageUrl && (
        <div className="fixed inset-0 z-0">
          <div className="parallax-container">
            <img 
              src={article.imageUrl}
              alt="Article background"
              className="w-full h-full object-cover scale-110 parallax-image"
            />
          </div>
          
          {/* Multi-layer visual enhancement */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-teal-900/30"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/40"></div>
          
          {/* Dynamic overlay patterns */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-500/10"></div>
            <div className="absolute bottom-0 right-0 w-3/4 h-3/4 bg-gradient-to-tl from-emerald-500/8 via-transparent to-transparent"></div>
          </div>
          
          {/* Animated floating elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="floating-element floating-element-1"></div>
            <div className="floating-element floating-element-2"></div>
            <div className="floating-element floating-element-3"></div>
          </div>
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
              title={isPlaying ? "Pause ocean waves" : "Play ocean waves"}
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
                title="Adjust ocean wave volume"
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
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight enhanced-title">
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

        {/* Enhanced Article Content with Premium Typography */}
        <article className="mb-12">
          <div className="content-container relative">
            {/* Excerpt/Lead paragraph if available */}
            {article.excerpt && (
              <div className="lead-paragraph mb-8 p-6 bg-gradient-to-r from-black/60 via-black/40 to-black/60 backdrop-blur-lg rounded-2xl border-2 border-white/40 shadow-2xl">
                <p className="text-xl md:text-2xl text-white leading-relaxed font-medium italic" style={{ textShadow: '5px 5px 15px rgba(0,0,0,1), 3px 3px 8px rgba(0,0,0,1), 0 0 10px rgba(0,0,0,0.9)' }}>
                  "{article.excerpt}"
                </p>
              </div>
            )}
            
            {/* Main content with enhanced typography */}
            <div className="prose prose-xl max-w-none enhanced-article-prose">
              <div 
                dangerouslySetInnerHTML={{ __html: article.content }}
                className="prose-headings:text-white prose-p:text-white prose-strong:text-white prose-em:text-blue-200 prose-a:text-cyan-300 hover:prose-a:text-cyan-200 prose-blockquote:text-gray-200 prose-code:text-green-300 content-text"
              />
            </div>
            
            {/* Reading progress indicator */}
            <div className="reading-progress-container mt-8">
              <div className="flex items-center justify-between text-sm text-gray-300">
                <span>Reading time: ~{Math.ceil(article.content.replace(/<[^>]*>/g, '').split(' ').length / 200)} min</span>
                <span>Published {new Date(article.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            
            {/* Content enhancement overlays */}
            <div className="content-backdrop absolute inset-0 -z-10"></div>
          </div>
        </article>

        {/* Enhanced Author Bio */}
        <div className="mb-12 author-bio-container relative">
          <div className="p-6 bg-gradient-to-r from-white/15 via-white/10 to-white/15 backdrop-blur-md rounded-xl border border-white/30 shadow-2xl">
            <div className="author-bio-glow absolute inset-0 rounded-xl opacity-30"></div>
            <div className="flex items-start relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-white/30 to-white/20 backdrop-blur-sm rounded-full mr-4 flex items-center justify-center shadow-lg border border-white/20">
                <span className="text-xl font-bold text-white drop-shadow-lg">
                  {article.author.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2 drop-shadow-lg">{article.author}</h3>
                <p className="text-gray-200 drop-shadow-lg leading-relaxed">
                  Contributing writer for ChillVibes community, sharing insights on the balanced lifestyle of tech, finance, jiu-jitsu, and surf culture.
                </p>
              </div>
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
