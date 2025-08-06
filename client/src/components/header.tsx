import { useState } from "react";
import { Link } from "wouter";
import { Menu, X, Search, Bell, User, Briefcase, Building2, Calendar, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link href="/">
              <div className="flex-shrink-0 cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg shadow-md group-hover:shadow-lg transition-shadow">
                    <Briefcase className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      GovtJobsNow
                    </h1>
                    <p className="text-xs text-gray-500 font-medium">India's #1 Government Job Portal</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
          
          {/* Navigation Menu */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link href="/" className="px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium transition-all duration-200 flex items-center gap-2">
              <Search className="h-4 w-4" />
              Browse Jobs
            </Link>
            <a href="#" className="px-4 py-2 rounded-lg text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 font-medium transition-all duration-200 flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Departments
            </a>
            <a href="#" className="px-4 py-2 rounded-lg text-gray-700 hover:text-green-600 hover:bg-green-50 font-medium transition-all duration-200 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Exam Calendar
            </a>
            <a href="#" className="px-4 py-2 rounded-lg text-gray-700 hover:text-orange-600 hover:bg-orange-50 font-medium transition-all duration-200 flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              Help Center
            </a>
          </nav>
          
          {/* Right Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 relative"
            >
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-red-500 text-white text-xs">
                3
              </Badge>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
            >
              <User className="h-4 w-4 mr-2" />
              Sign In
            </Button>
            
            <Button
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all"
            >
              Register Free
            </Button>
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-gray-600 hover:text-blue-600 hover:bg-blue-50"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4 bg-gray-50">
            <nav className="flex flex-col space-y-2">
              <Link href="/" className="px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium rounded-lg transition-all flex items-center gap-3">
                <Search className="h-4 w-4" />
                Browse Jobs
              </Link>
              <a href="#" className="px-4 py-3 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 font-medium rounded-lg transition-all flex items-center gap-3">
                <Building2 className="h-4 w-4" />
                Departments
              </a>
              <a href="#" className="px-4 py-3 text-gray-700 hover:text-green-600 hover:bg-green-50 font-medium rounded-lg transition-all flex items-center gap-3">
                <Calendar className="h-4 w-4" />
                Exam Calendar
              </a>
              <a href="#" className="px-4 py-3 text-gray-700 hover:text-orange-600 hover:bg-orange-50 font-medium rounded-lg transition-all flex items-center gap-3">
                <HelpCircle className="h-4 w-4" />
                Help Center
              </a>
              
              <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
                <Button size="sm" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600">
                  Register Free
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
