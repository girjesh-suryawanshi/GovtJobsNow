import { useState } from "react";
import { Link } from "wouter";
import { Menu, X, Search, Bell, User, Briefcase, Building2, Calendar, HelpCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AuthModal from "@/components/auth-modal";
import HelpModal from "@/components/help-modal";
import { useUser } from "@/contexts/user-context";

interface HeaderProps {
  onOpenExamCalendar?: () => void;
  onScrollToDepartments?: () => void;
}

export default function Header({ onOpenExamCalendar, onScrollToDepartments }: HeaderProps) {
  const { user, logout, isAuthenticated } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin');
  const [showHelpModal, setShowHelpModal] = useState(false);

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
            <button 
              onClick={onScrollToDepartments}
              className="px-4 py-2 rounded-lg text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 font-medium transition-all duration-200 flex items-center gap-2"
            >
              <Building2 className="h-4 w-4" />
              Departments
            </button>
            <button 
              onClick={onOpenExamCalendar}
              className="px-4 py-2 rounded-lg text-gray-700 hover:text-green-600 hover:bg-green-50 font-medium transition-all duration-200 flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              Exam Calendar
            </button>
            <button 
              onClick={() => setShowHelpModal(true)}
              className="px-4 py-2 rounded-lg text-gray-700 hover:text-orange-600 hover:bg-orange-50 font-medium transition-all duration-200 flex items-center gap-2"
            >
              <HelpCircle className="h-4 w-4" />
              Help Center
            </button>
          </nav>
          
          {/* Right Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                {/* User is logged in */}
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-700">
                    Welcome, <span className="font-medium text-blue-600">{user?.fullName}</span>
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                    onClick={logout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <>
                {/* User is not logged in */}
                <Button
                  variant="outline"
                  size="sm"
                  className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
                  onClick={() => {
                    setAuthMode('signin');
                    setShowAuthModal(true);
                  }}
                >
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
                
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all"
                  onClick={() => {
                    setAuthMode('register');
                    setShowAuthModal(true);
                  }}
                >
                  Register Free
                </Button>
              </>
            )}
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
              <button 
                onClick={() => {
                  onScrollToDepartments?.();
                  setIsMenuOpen(false);
                }}
                className="px-4 py-3 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 font-medium rounded-lg transition-all flex items-center gap-3"
              >
                <Building2 className="h-4 w-4" />
                Departments
              </button>
              <button 
                onClick={() => {
                  onOpenExamCalendar?.();
                  setIsMenuOpen(false);
                }}
                className="px-4 py-3 text-gray-700 hover:text-green-600 hover:bg-green-50 font-medium rounded-lg transition-all flex items-center gap-3"
              >
                <Calendar className="h-4 w-4" />
                Exam Calendar
              </button>
              <button 
                onClick={() => {
                  setShowHelpModal(true);
                  setIsMenuOpen(false);
                }}
                className="px-4 py-3 text-gray-700 hover:text-orange-600 hover:bg-orange-50 font-medium rounded-lg transition-all flex items-center gap-3"
              >
                <HelpCircle className="h-4 w-4" />
                Help Center
              </button>
              
              <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
                {isAuthenticated ? (
                  <>
                    {/* User is logged in - Mobile */}
                    <div className="px-4 py-2 text-sm text-gray-700">
                      Welcome, <span className="font-medium text-blue-600">{user?.fullName}</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start border-red-200 text-red-600 hover:bg-red-50"
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    {/* User is not logged in - Mobile */}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => {
                        setAuthMode('signin');
                        setShowAuthModal(true);
                        setIsMenuOpen(false);
                      }}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Sign In
                    </Button>
                    <Button 
                      size="sm" 
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600"
                      onClick={() => {
                        setAuthMode('register');
                        setShowAuthModal(true);
                        setIsMenuOpen(false);
                      }}
                    >
                      Register Free
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
      />
      
      {/* Help Modal */}
      <HelpModal 
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
      />
    </header>
  );
}
