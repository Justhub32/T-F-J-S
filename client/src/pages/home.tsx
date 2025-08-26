import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ChartLine, Waves, Code, DollarSign, Activity } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {

  const { data: siteSettings } = useQuery({
    queryKey: ["/api/settings"],
    queryFn: () => api.settings.get(),
  });

  return (
    <div className="min-h-screen relative">
      {/* Full Page Background Image */}
      <div className="fixed inset-0 z-0">
        <img 
          src={siteSettings?.heroBackgroundUrl || "https://images.unsplash.com/photo-1502680390469-be75c86b636f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&h=1200&q=80"}
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-ocean/10 to-surf/10"></div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 py-20 overflow-hidden">
        
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
            <span className="text-red-400">Tech</span><span className="text-white">+</span><span className="text-green-400">Finance</span>,<br/>
            <span className="inline-block ml-20 md:ml-32 lg:ml-40">
              <span className="text-yellow-400">Jiu-Jitsu</span><span className="text-white">+</span><span className="text-blue-400">Surf</span>
            </span><br/>
            <span className="text-white font-medium text-xl md:text-2xl lg:text-3xl inline-block ml-2 md:ml-4">: a digital lifestyle community spreading chill vibes</span>
          </h1>
          <p className="text-xl text-gray-100 mb-20 max-w-2xl mx-auto drop-shadow-md">
            Where innovation meets zen, and hustle meets flow. Join our community of mindful achievers living the balanced life.
          </p>
        </div>
      </section>

      {/* Category Buttons Section */}
      <section className="relative z-10 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
              <div className="group bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-white/50 hover:border-yellow-300 cursor-pointer hover:bg-white">
                <div className="flex items-center justify-center w-12 h-12 bg-yellow-500 rounded-xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Activity className="text-white w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold category-jiu-jitsu mb-2">Jiu-Jitsu</h3>
                <p className="text-gray-600 text-sm">Martial arts and mindset</p>
              </div>
            </Link>
            
            <Link href="/category/surf">
              <div className="group bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-white/50 hover:border-blue-300 cursor-pointer hover:bg-white">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Waves className="text-white w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold category-surf mb-2">Surf</h3>
                <p className="text-gray-600 text-sm">Ocean life and flow</p>
              </div>
            </Link>
          </div>
        </div>
      </section>



      {/* Newsletter Signup */}
      <section className="relative z-10 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-lg">Stay in the Flow</h2>
          <p className="text-gray-100 text-lg mb-8 drop-shadow-md">Get the latest insights delivered to your inbox. No spam, just chill vibes.</p>
          
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
