import { Link } from "wouter";
import { Waves } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 text-gray-700 dark:text-gray-300 py-16 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-ocean to-surf rounded-lg flex items-center justify-center">
                <Waves className="text-white w-4 h-4" />
              </div>
              <span className="text-xl font-bold">ChillVibes</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
              Building a community where innovation meets zen, and hustle meets flow. Join thousands living the balanced life.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-ocean transition-colors">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-ocean transition-colors">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-ocean transition-colors">
                <i className="fab fa-youtube"></i>
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-ocean transition-colors">
                <i className="fab fa-discord"></i>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4">Categories</h4>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li>
                <Link href="/category/tech" className="hover:text-ocean transition-colors">
                  Tech
                </Link>
              </li>
              <li>
                <Link href="/category/finance" className="hover:text-ocean transition-colors">
                  Finance
                </Link>
              </li>
              <li>
                <Link href="/category/jiu-jitsu" className="category-jiu-jitsu hover:opacity-80 transition-opacity">
                  Jiu-Jitsu
                </Link>
              </li>
              <li>
                <Link href="/category/surf" className="category-surf hover:opacity-80 transition-opacity">
                  Surf
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Community</h4>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li><a href="#" className="hover:text-ocean transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-ocean transition-colors">Contributors</a></li>
              <li><a href="#" className="hover:text-ocean transition-colors">Newsletter</a></li>
              <li><a href="#" className="hover:text-ocean transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-300 dark:border-gray-600 mt-12 pt-8 text-center text-gray-600 dark:text-gray-400">
          <p>&copy; 2024 ChillVibes Community. All rights reserved. Built with ❤️ for the balanced lifestyle.</p>
        </div>
      </div>
    </footer>
  );
}
