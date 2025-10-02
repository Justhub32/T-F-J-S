import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, Calendar, User, Volume2, VolumeX } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { CommentsSection } from "@/components/CommentsSection";
import { useBackgroundAudio } from "@/hooks/useBackgroundAudio";
import jiujitsuBg1 from "@assets/generated_images/Jiu-jitsu_training_background_26446023.png";
import jiujitsuBg2 from "@assets/generated_images/IBJJF_tournament_competition_background_500eecc8.png";
import jiujitsuBg3 from "@assets/generated_images/Traditional_academy_training_background_8ea2cd6f.png";
import jiujitsuBg4 from "@assets/generated_images/Championship_podium_ceremony_background_d9b7471a.png";
import jiujitsuBg5 from "@assets/generated_images/Technical_guard_position_background_68ab40d8.png";

// Jiu-jitsu cover images
import jiujitsuCover1 from "@assets/generated_images/Jiu-jitsu_competition_cover_photo_81aa2f4f.png";
import jiujitsuCover2 from "@assets/generated_images/Jiu-jitsu_instruction_cover_photo_87e9f438.png";
import jiujitsuCover3 from "@assets/generated_images/Championship_victory_cover_photo_bc411842.png";
import jiujitsuCover4 from "@assets/generated_images/Training_session_cover_photo_484e2d2e.png";

// Surfing background images
import surfBg1 from "@assets/generated_images/Ocean_surfing_waves_background_b972c499.png";
import surfBg2 from "@assets/generated_images/Beach_sunset_waves_background_9a90e60c.png";
import surfBg3 from "@assets/generated_images/Underwater_ocean_light_background_82da04c1.png";
import surfBg4 from "@assets/generated_images/Aerial_ocean_view_background_a4eee5b2.png";

export default function Article() {
  const [, params] = useRoute("/article/:id");
  const articleId = params?.id;
  
  const { isPlaying, toggle, setVolume, volume } = useBackgroundAudio();

  // Array of jiu-jitsu background images
  const jiujitsuBackgrounds = [jiujitsuBg1, jiujitsuBg2, jiujitsuBg3, jiujitsuBg4, jiujitsuBg5];
  
  // Array of surfing background images
  const surfBackgrounds = [surfBg1, surfBg2, surfBg3, surfBg4];
  
  // Array of jiu-jitsu cover images
  const jiujitsuCovers = [jiujitsuCover1, jiujitsuCover2, jiujitsuCover3, jiujitsuCover4];
  
  // Function to get a consistent background for jiu-jitsu articles
  const getJiujitsuBackground = (articleId: string) => {
    const hash = articleId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    const index = Math.abs(hash) % jiujitsuBackgrounds.length;
    return jiujitsuBackgrounds[index];
  };

  // Function to get a consistent surfing background for non-jiu-jitsu articles
  const getSurfBackground = (articleId: string) => {
    const hash = articleId.split('').reduce((a, b) => {
      a = ((a << 3) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    const index = Math.abs(hash) % surfBackgrounds.length;
    return surfBackgrounds[index];
  };

  // Function to get a consistent cover image for each jiu-jitsu article
  const getJiujitsuCover = (articleId: string) => {
    // Use article ID to create a consistent but distributed selection for covers
    const hash = articleId.split('').reduce((a, b) => {
      a = ((a << 7) - a) + b.charCodeAt(0); // Different hash for covers
      return a & a;
    }, 0);
    const index = Math.abs(hash) % jiujitsuCovers.length;
    return jiujitsuCovers[index];
  };

  const { data: article, isLoading, error } = useQuery({
    queryKey: ["/api/articles", articleId],
    queryFn: () => api.articles.getById(articleId!),
    enabled: !!articleId,
  });

  const { data: siteSettings } = useQuery({
    queryKey: ["/api/settings"],
    queryFn: () => api.settings.get(),
  });

  // Helper function to get text size multiplier
  const getTextSizeMultiplier = (textSize: string) => {
    switch (textSize) {
      case 'small': return 0.85;
      case 'large': return 1.15;
      case 'extra-large': return 1.3;
      default: return 1; // medium
    }
  };

  // Get custom text styles
  const customTextStyles = {
    color: siteSettings?.textColor || '#ffffff',
    fontSize: `${getTextSizeMultiplier(siteSettings?.textSize || 'medium')}em`,
  };

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
      {/* Background Image with Text Readability */}
      <div className="fixed inset-0 z-0">
        <img 
          src={article.category === "jiu-jitsu" ? getJiujitsuBackground(articleId!) : getSurfBackground(articleId!)}
          alt="Article background"
          className="w-full h-full object-cover parallax-image"
        />
        {/* Enhanced overlay for better text readability while preserving background visibility */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]"></div>
      </div>
      
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
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight enhanced-title" style={{ textShadow: '3px 3px 10px rgba(0,0,0,0.9), 2px 2px 6px rgba(0,0,0,0.7), 0 0 8px rgba(0,0,0,0.5)' }}>
            {article.title}
          </h1>

          <div className="flex items-center text-gray-200 space-x-6" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.8), 0 0 3px rgba(0,0,0,0.6)' }}>
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
              <div className="lead-paragraph mb-8 p-6 bg-transparent backdrop-blur-none rounded-2xl border-none shadow-none">
                <p className="text-xl md:text-2xl text-white leading-relaxed font-medium italic" style={{ 
                  textShadow: '5px 5px 15px rgba(0,0,0,1), 3px 3px 8px rgba(0,0,0,1), 0 0 10px rgba(0,0,0,0.9)',
                  color: customTextStyles.color,
                  fontSize: `calc(1.25rem * ${getTextSizeMultiplier(siteSettings?.textSize || 'medium')})`
                }}>
                  "{article.excerpt}"
                </p>
              </div>
            )}
            
            {/* Main content with enhanced typography and text shadows for visibility */}
            <div className="prose prose-xl max-w-none enhanced-article-prose">
              <div 
                dangerouslySetInnerHTML={{ __html: article.content }}
                className="prose-headings:text-white prose-p:text-white prose-strong:text-white prose-em:text-blue-200 prose-a:text-cyan-300 hover:prose-a:text-cyan-200 prose-blockquote:text-gray-200 prose-code:text-green-300 content-text"
                style={{ 
                  textShadow: '2px 2px 8px rgba(0,0,0,0.8), 1px 1px 4px rgba(0,0,0,0.6), 0 0 6px rgba(0,0,0,0.4)',
                  letterSpacing: '0.01em',
                  color: customTextStyles.color,
                  fontSize: customTextStyles.fontSize,
                  '--custom-text-color': customTextStyles.color,
                  '--custom-text-size-multiplier': getTextSizeMultiplier(siteSettings?.textSize || 'medium').toString(),
                } as React.CSSProperties & { [key: string]: string }}
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
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-8 border border-white/20">
          <CommentsSection articleId={articleId} />
        </div>
      </div>
    </div>
  );
}
