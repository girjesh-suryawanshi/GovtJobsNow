import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold text-white mb-4">GovtJobsNow</h3>
            <p className="text-gray-400 mb-4">
              Your trusted partner for finding government jobs across India. We help job seekers 
              discover the latest opportunities in various government departments and agencies.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-white transition-colors duration-200">All Jobs</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors duration-200">Latest Jobs</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors duration-200">Result</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors duration-200">Admit Card</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors duration-200">Syllabus</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-white transition-colors duration-200">Contact Us</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors duration-200">Help Center</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors duration-200">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors duration-200">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors duration-200">About Us</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            &copy; 2024 GovtJobsNow. All rights reserved. Made with ❤️ for job seekers in India.
          </p>
        </div>
      </div>
    </footer>
  );
}
