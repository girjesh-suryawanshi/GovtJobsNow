import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin, Star, Shield, Clock, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-gray-300 py-16 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 pb-8 border-b border-gray-700">
          <div className="text-center">
            <div className="bg-blue-600/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
              <Users className="h-8 w-8 text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-white">10L+</p>
            <p className="text-sm text-gray-400">Active Users</p>
          </div>
          <div className="text-center">
            <div className="bg-green-600/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
              <Star className="h-8 w-8 text-green-400" />
            </div>
            <p className="text-2xl font-bold text-white">75K+</p>
            <p className="text-sm text-gray-400">Jobs Posted</p>
          </div>
          <div className="text-center">
            <div className="bg-orange-600/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
              <Shield className="h-8 w-8 text-orange-400" />
            </div>
            <p className="text-2xl font-bold text-white">100%</p>
            <p className="text-sm text-gray-400">Verified Jobs</p>
          </div>
          <div className="text-center">
            <div className="bg-purple-600/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
              <Clock className="h-8 w-8 text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-white">24/7</p>
            <p className="text-sm text-gray-400">Updates</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-3 rounded-xl shadow-lg">
                <Star className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  GovtJobsNow
                </h3>
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 text-xs mt-1">
                  Trusted Platform
                </Badge>
              </div>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              India's most trusted government job portal. We connect millions of job seekers with 
              authentic opportunities across all government departments and PSUs.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-gray-400">
                <Mail className="h-4 w-4 text-blue-400" />
                <span className="text-sm">support@govtjobsnow.in</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Phone className="h-4 w-4 text-green-400" />
                <span className="text-sm">+91-1800-123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <MapPin className="h-4 w-4 text-red-400" />
                <span className="text-sm">New Delhi, India</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              <a href="#" className="bg-blue-600/20 p-3 rounded-lg text-blue-400 hover:bg-blue-600/30 hover:text-blue-300 transition-all duration-200">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="bg-sky-600/20 p-3 rounded-lg text-sky-400 hover:bg-sky-600/30 hover:text-sky-300 transition-all duration-200">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="bg-blue-700/20 p-3 rounded-lg text-blue-400 hover:bg-blue-700/30 hover:text-blue-300 transition-all duration-200">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="bg-pink-600/20 p-3 rounded-lg text-pink-400 hover:bg-pink-600/30 hover:text-pink-300 transition-all duration-200">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Job Categories */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-blue-400 to-indigo-400 rounded-full"></div>
              Popular Categories
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                  Banking Jobs
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                  Railway Jobs
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                  Defense Jobs
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                  SSC Jobs
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-pink-400 rounded-full"></div>
                  UPSC Jobs
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                  State Government
                </a>
              </li>
            </ul>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-green-400 to-emerald-400 rounded-full"></div>
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-green-400 transition-colors duration-200 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                  Latest Jobs
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-green-400 transition-colors duration-200 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                  Exam Results
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-green-400 transition-colors duration-200 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                  Admit Cards
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-green-400 transition-colors duration-200 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                  Syllabus & Pattern
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-green-400 transition-colors duration-200 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-pink-400 rounded-full"></div>
                  Previous Papers
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-orange-400 to-red-400 rounded-full"></div>
              Help & Support
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-orange-400 transition-colors duration-200 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-orange-400 transition-colors duration-200 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-gray-400 hover:text-orange-400 transition-colors duration-200 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-gray-400 hover:text-orange-400 transition-colors duration-200 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-gray-400 hover:text-orange-400 transition-colors duration-200 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-pink-400 rounded-full"></div>
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              &copy; 2025 GovtJobsNow. All rights reserved. India's most trusted government job portal.
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-400" />
                Secure & Verified
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-400" />
                Updated Daily
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
