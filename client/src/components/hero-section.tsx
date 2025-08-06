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
    <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold mb-4">Find Your Dream Government Job</h2>
        <p className="text-xl text-blue-100 mb-8">Discover the latest government job opportunities across India</p>
        
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
        </div>
      </div>
    </section>
  );
}
