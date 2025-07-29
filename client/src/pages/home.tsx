import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ChartLine, Waves } from "lucide-react";
import { api } from "@/lib/api";
import ArticleCard from "@/components/article-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  const { data: featuredArticles, isLoading } = useQuery({
    queryKey: ["/api/articles/featured"],
    queryFn: () => api.articles.getFeatured(3),
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-wave via-white to-sand py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 1200 600" fill="none">
            <path d="M0 300C400 200 600 400 1200 300V600H0V300Z" fill="url(#wave-gradient)"/>
            <defs>
              <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{stopColor: "var(--ocean)"}}/>
                <stop offset="100%" style={{stopColor: "var(--surf)"}}/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            <span className="text-ocean">Tech+Finance</span>, 
            <span className="text-surf"> Jiu-Jitsu+Surf</span>:<br/>
            <span className="text-gray-700 font-medium">a lifestyle digital community<br/>spreading chill vibes</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Where innovation meets zen, and hustle meets flow. Join our community of mindful achievers living the balanced life.
          </p>
          
          {/* Category Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/category/tech-finance">
              <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 w-full sm:w-80 border border-gray-100 hover:border-ocean cursor-pointer">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-ocean to-surf rounded-xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <ChartLine className="text-white w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Tech+Finance</h3>
                <p className="text-gray-600">Innovation, markets, and the future of money</p>
              </div>
            </Link>
            
            <Link href="/category/jiu-jitsu-surf">
              <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 w-full sm:w-80 border border-gray-100 hover:border-surf cursor-pointer">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-surf to-sunset rounded-xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Waves className="text-white w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Jiu-Jitsu+Surf</h3>
                <p className="text-gray-600">Mind, body, and the art of flow</p>
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
