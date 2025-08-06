import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface HeroSectionProps {
  onSearch: (query: string) => void;
  onLocationChange: (location: string) => void;
}

export default function HeroSection({ onSearch, onLocationChange }: HeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("all-locations");

  const handleSearch = () => {
    onSearch(searchQuery);
    onLocationChange(location === "all-locations" ? "" : location);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Trust Indicators */}
        <div className="flex flex-wrap justify-center items-center gap-6 mb-6 opacity-90">
          <div className="flex items-center gap-2 text-sm font-medium text-blue-100">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Live Updates</span>
          </div>
          <div className="text-sm text-blue-200">•</div>
          <div className="text-sm font-medium text-blue-100">25+ Govt Sources</div>
          <div className="text-sm text-blue-200">•</div>
          <div className="text-sm font-medium text-blue-100">200+ Active Jobs</div>
          <div className="text-sm text-blue-200">•</div>
          <div className="text-sm font-medium text-blue-100">Updated 4x Daily</div>
        </div>

        <h2 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
          India's Most Trusted
          <span className="text-yellow-300 block md:inline md:ml-3">Government Job Portal</span>
        </h2>
        <p className="text-xl md:text-2xl text-blue-100 mb-2 max-w-4xl mx-auto font-light">
          Get ahead of millions with intelligent alerts, application tracking, and exam scheduling
        </p>
        <p className="text-lg text-blue-200 mb-8 max-w-3xl mx-auto">
          Comprehensive platform aggregating opportunities from SSC, UPSC, Banking, Railway & 20+ more sources
        </p>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Search jobs by title, department, or keyword..."
                    className="pl-10 h-12 text-gray-900"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                </div>
              </div>
              
              <div className="md:w-48">
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger className="h-12 text-gray-900">
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-locations">All Locations</SelectItem>
                    <SelectItem value="delhi">Delhi</SelectItem>
                    <SelectItem value="mumbai">Mumbai</SelectItem>
                    <SelectItem value="bangalore">Bangalore</SelectItem>
                    <SelectItem value="chennai">Chennai</SelectItem>
                    <SelectItem value="kolkata">Kolkata</SelectItem>
                    <SelectItem value="hyderabad">Hyderabad</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                className="bg-red-600 hover:bg-red-700 h-12 px-8 font-semibold"
                onClick={handleSearch}
              >
                <Search className="h-4 w-4 mr-2" />
                Search Jobs
              </Button>
            </div>
          </div>
          
          {/* Key Features Preview */}
          <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full border border-white/20">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span className="font-medium">Smart Alerts</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full border border-white/20">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="font-medium">Application Tracking</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full border border-white/20">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span className="font-medium">Exam Calendar</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full border border-white/20">
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              <span className="font-medium">Job Comparison</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
