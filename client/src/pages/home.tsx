import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ChartLine, Waves, Code, DollarSign, Activity } from "lucide-react";
import { api } from "@/lib/api";
import ArticleCard from "@/components/article-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  const { data: featuredArticles, isLoading } = useQuery({
    queryKey: ["/api/articles/featured"],
    queryFn: () => api.articles.getFeatured(3),
  });

  const { data: siteSettings } = useQuery({
    queryKey: ["/api/settings"],
    queryFn: () => api.settings.get(),
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Dynamic Background Image */}
        <div className="absolute inset-0">
          <img 
            src={siteSettings?.heroBackgroundUrl || "https://images.unsplash.com/photo-1502680390469-be75c86b636f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&h=1200&q=80"}
            alt="Hero background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-ocean/20 to-surf/20"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
            <span className="text-red-400">Tech</span><span className="text-white">+</span><span className="text-green-400">Finance</span>,<br/>
            <span className="text-blue-400">Jiu-Jitsu</span><span className="text-white">+</span><span className="text-yellow-400">Surf</span><br/>
            <span className="text-white font-medium text-xl md:text-2xl lg:text-3xl">: a digital lifestyle community spreading chill vibes</span>
          </h1>
          <p className="text-xl text-gray-100 mb-12 max-w-2xl mx-auto drop-shadow-md">
            Where innovation meets zen, and hustle meets flow. Join our community of mindful achievers living the balanced life.
          </p>
          
          {/* Category Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Link href="/category/tech">
              <div className="group bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-white/50 hover:border-red-300 cursor-pointer hover:bg-white">
                <div className="flex items-center justify-center w-12 h-12 bg-red-500 rounded-xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Code className="text-white w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Tech</h3>
                <p className="text-gray-600 text-sm">Innovation and technology</p>
              </div>
            </Link>
            
            <Link href="/category/finance">
              <div className="group bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-white/50 hover:border-green-300 cursor-pointer hover:bg-white">
                <div className="flex items-center justify-center w-12 h-12 bg-green-500 rounded-xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <DollarSign className="text-white w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Finance</h3>
                <p className="text-gray-600 text-sm">Markets and money</p>
              </div>
            </Link>
            
            <Link href="/category/jiu-jitsu">
              <div className="group bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-white/50 hover:border-blue-300 cursor-pointer hover:bg-white">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Activity className="text-white w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Jiu-Jitsu</h3>
                <p className="text-gray-600 text-sm">Martial arts and mindset</p>
              </div>
            </Link>
            
            <Link href="/category/surf">
              <div className="group bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-white/50 hover:border-yellow-300 cursor-pointer hover:bg-white">
                <div className="flex items-center justify-center w-12 h-12 bg-yellow-500 rounded-xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Waves className="text-white w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Surf</h3>
                <p className="text-gray-600 text-sm">Ocean life and flow</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest from the Community</h2>
            <p className="text-gray-600 text-lg">Fresh insights on living the balanced life</p>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-2xl h-96 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredArticles?.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link href="/category/tech-finance">
              <Button className="bg-gradient-to-r from-ocean to-surf text-white px-8 py-3 rounded-lg hover:from-teal-600 hover:to-cyan-600 transition-all duration-300 font-medium shadow-lg hover:shadow-xl">
                Explore More Stories
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-gradient-to-r from-wave to-sand">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Stay in the Flow</h2>
          <p className="text-gray-600 text-lg mb-8">Get the latest insights delivered to your inbox. No spam, just chill vibes.</p>
          
          <div className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border-gray-200 focus:border-ocean focus:ring-2 focus:ring-ocean/20"
              />
              <Button className="bg-ocean text-white px-6 py-3 rounded-lg hover:bg-teal-600 transition-colors font-medium whitespace-nowrap">
                Join Community
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
