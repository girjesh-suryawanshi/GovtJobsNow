import { useState } from "react";
import { Link } from "wouter";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/">
              <div className="flex-shrink-0 cursor-pointer">
                <h1 className="text-2xl font-bold text-blue-600">GovtJobsNow</h1>
                <p className="text-xs text-gray-600">Find Government Jobs in India</p>
              </div>
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
              Jobs
            </Link>
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
              About
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
              Contact
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
              Help
            </a>
          </nav>
          
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-4">
              <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">
                Jobs
              </Link>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">About</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Contact</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Help</a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
