import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Waves } from "lucide-react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Tech", href: "/category/tech" },
    { name: "Finance", href: "/category/finance" },
    { name: "Jiu-Jitsu", href: "/category/jiu-jitsu" },
    { name: "Surf", href: "/category/surf" },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-ocean to-surf rounded-lg flex items-center justify-center">
              <Waves className="text-white w-4 h-4" />
            </div>
            <span className="text-xl font-bold text-gray-900">ChillVibes</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`font-medium transition-colors ${
                  location === item.href
                    ? "text-ocean"
                    : "text-gray-700 hover:text-ocean"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/admin"
              className="bg-ocean text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors font-medium"
            >
              Admin
            </Link>
            <button
              className="md:hidden text-gray-700"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100">
          <div className="px-4 py-3 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block py-2 text-gray-700 hover:text-ocean transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
