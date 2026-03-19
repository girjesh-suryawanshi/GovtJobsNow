import { useState } from "react";
import { Link } from "wouter";
import { Menu, X, Search, Bell, User, Briefcase, Building2, Calendar, HelpCircle, LogOut, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import AuthModal from "@/components/auth-modal";
import HelpModal from "@/components/help-modal";
import { useUser } from "@/contexts/user-context";
import { usePWA } from "@/contexts/pwa-context";
import { Download } from "lucide-react";

interface HeaderProps {
  onScrollToDepartments?: () => void;
}

export default function Header({ onScrollToDepartments }: HeaderProps) {
  const { user, logout, isAuthenticated } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin');
  const [showHelpModal, setShowHelpModal] = useState(false);
  const { isInstallable, installApp, isInstalled } = usePWA();
  
  // High-visibility fallback for all mobile/desktop users
  const isMobileOrDesktop = /iPhone|iPad|iPod|Android|Windows|Mac|Linux/i.test(navigator.userAgent);
  const shouldShowInstall = (isInstallable || isMobileOrDesktop) && !isInstalled;

  return (
    <header className="bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
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
            <Link href="/" className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 font-medium transition-all duration-300 flex items-center gap-2">
              <Search className="h-4 w-4" />
              Browse Jobs
            </Link>
            <button
              onClick={onScrollToDepartments}
              className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950 font-medium transition-all duration-300 flex items-center gap-2"
            >
              <Building2 className="h-4 w-4" />
              Departments
            </button>
            <Link
              href="/exams"
              className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-950 font-medium transition-all duration-300 flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              Exam Calendar
            </Link>
            <Link
              href="/about-us"
              className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950 font-medium transition-all duration-300 flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              About Us
            </Link>
            <button
              onClick={() => setShowHelpModal(true)}
              className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950 font-medium transition-all duration-300 flex items-center gap-2"
            >
              <HelpCircle className="h-4 w-4" />
              Help Center
            </button>
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <ThemeToggle />
            {shouldShowInstall && (
              <Button
                variant="outline"
                size="sm"
                className="border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950 animate-pulse-subtle"
                onClick={installApp}
              >
                <Download className="h-4 w-4 mr-2" />
                Install App
              </Button>
            )}
            {isAuthenticated ? (
              <>
                {/* User is logged in */}
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Welcome, <span className="font-medium text-blue-600 dark:text-blue-400">{user?.fullName}</span>
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
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
                  className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950"
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

          {/* Mobile Right Actions */}
          <div className="flex lg:hidden items-center space-x-2">
            {shouldShowInstall && (
              <Button
                variant="ghost"
                size="icon"
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 animate-pulse-subtle"
                onClick={installApp}
                title="Install App"
              >
                <Download className="h-5 w-5" />
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-600 hover:text-blue-600 hover:bg-blue-50"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 dark:border-gray-700 py-4 bg-gray-50 dark:bg-gray-800">
            <nav className="flex flex-col space-y-2">
              <Link href="/" className="px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 font-medium rounded-lg transition-all duration-300 flex items-center gap-3">
                <Search className="h-4 w-4" />
                Browse Jobs
              </Link>
              <button
                onClick={() => {
                  onScrollToDepartments?.();
                  setIsMenuOpen(false);
                }}
                className="px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950 font-medium rounded-lg transition-all duration-300 flex items-center gap-3"
              >
                <Building2 className="h-4 w-4" />
                Departments
              </button>
              <Link
                href="/exams"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-950 font-medium rounded-lg transition-all duration-300 flex items-center gap-3"
              >
                <Calendar className="h-4 w-4" />
                Exam Calendar
              </Link>
              <button
                onClick={() => {
                  setShowHelpModal(true);
                  setIsMenuOpen(false);
                }}
                className="px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950 font-medium rounded-lg transition-all duration-300 flex items-center gap-3"
              >
                <HelpCircle className="h-4 w-4" />
                Help Center
              </button>

              <div className="px-4 py-2 flex flex-col gap-2">
                <ThemeToggle />
                {shouldShowInstall && (
                  <Button
                    variant="outline"
                    className="w-full justify-start border-blue-200 text-blue-600 hover:bg-blue-50"
                    onClick={() => {
                      installApp();
                      setIsMenuOpen(false);
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Install Official App
                  </Button>
                )}
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4 space-y-2">
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
