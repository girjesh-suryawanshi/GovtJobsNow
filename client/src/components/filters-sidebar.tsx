import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import type { SearchJobsParams } from "@/types/job";

interface FiltersSidebarProps {
  filters: SearchJobsParams;
  onFilterChange: (filters: Partial<SearchJobsParams>) => void;
}

export default function FiltersSidebar({ filters, onFilterChange }: FiltersSidebarProps) {
  const handleClearFilters = () => {
    onFilterChange({
      department: "all-departments",
      location: "all-locations",
      qualification: "all-qualifications",
      postedDate: undefined,
    });
  };

  return (
    <aside className="lg:w-1/4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Filters</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        </div>
        
        {/* Location Filter - First Priority */}
        <div className="mb-6">
          <Label className="text-sm font-medium text-gray-700 mb-2 block">Location</Label>
          <Select value={filters.location || "all-locations"} onValueChange={(value) => onFilterChange({ location: value })}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-locations">All Locations</SelectItem>
              <SelectItem value="All India">All India</SelectItem>
              <SelectItem value="Pan India">Pan India</SelectItem>
              
              {/* Indian States */}
              <SelectItem value="Andhra Pradesh">Andhra Pradesh</SelectItem>
              <SelectItem value="Arunachal Pradesh">Arunachal Pradesh</SelectItem>
              <SelectItem value="Assam">Assam</SelectItem>
              <SelectItem value="Bihar">Bihar</SelectItem>
              <SelectItem value="Chhattisgarh">Chhattisgarh</SelectItem>
              <SelectItem value="Goa">Goa</SelectItem>
              <SelectItem value="Gujarat">Gujarat</SelectItem>
              <SelectItem value="Haryana">Haryana</SelectItem>
              <SelectItem value="Himachal Pradesh">Himachal Pradesh</SelectItem>
              <SelectItem value="Jharkhand">Jharkhand</SelectItem>
              <SelectItem value="Karnataka">Karnataka</SelectItem>
              <SelectItem value="Kerala">Kerala</SelectItem>
              <SelectItem value="Madhya Pradesh">Madhya Pradesh</SelectItem>
              <SelectItem value="Maharashtra">Maharashtra</SelectItem>
              <SelectItem value="Manipur">Manipur</SelectItem>
              <SelectItem value="Meghalaya">Meghalaya</SelectItem>
              <SelectItem value="Mizoram">Mizoram</SelectItem>
              <SelectItem value="Nagaland">Nagaland</SelectItem>
              <SelectItem value="Odisha">Odisha</SelectItem>
              <SelectItem value="Punjab">Punjab</SelectItem>
              <SelectItem value="Rajasthan">Rajasthan</SelectItem>
              <SelectItem value="Sikkim">Sikkim</SelectItem>
              <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
              <SelectItem value="Telangana">Telangana</SelectItem>
              <SelectItem value="Tripura">Tripura</SelectItem>
              <SelectItem value="Uttar Pradesh">Uttar Pradesh</SelectItem>
              <SelectItem value="Uttarakhand">Uttarakhand</SelectItem>
              <SelectItem value="West Bengal">West Bengal</SelectItem>
              
              {/* Union Territories */}
              <SelectItem value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</SelectItem>
              <SelectItem value="Chandigarh">Chandigarh</SelectItem>
              <SelectItem value="Dadra and Nagar Haveli">Dadra and Nagar Haveli</SelectItem>
              <SelectItem value="Daman and Diu">Daman and Diu</SelectItem>
              <SelectItem value="Delhi">Delhi</SelectItem>
              <SelectItem value="Jammu and Kashmir">Jammu and Kashmir</SelectItem>
              <SelectItem value="Ladakh">Ladakh</SelectItem>
              <SelectItem value="Lakshadweep">Lakshadweep</SelectItem>
              <SelectItem value="Puducherry">Puducherry</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Department Filter */}
        <div className="mb-6">
          <Label className="text-sm font-medium text-gray-700 mb-2 block">Department</Label>
          <Select value={filters.department || "all-departments"} onValueChange={(value) => onFilterChange({ department: value })}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-departments">All Departments</SelectItem>
              
              {/* Government Departments */}
              <SelectItem value="Staff Selection Commission">Staff Selection Commission (SSC)</SelectItem>
              <SelectItem value="Union Public Service Commission">Union Public Service Commission (UPSC)</SelectItem>
              <SelectItem value="Railway Recruitment Board">Railway Recruitment Board</SelectItem>
              <SelectItem value="Indian Army">Indian Army</SelectItem>
              <SelectItem value="Indian Navy">Indian Navy</SelectItem>
              <SelectItem value="Indian Air Force">Indian Air Force</SelectItem>
              <SelectItem value="ISRO">ISRO</SelectItem>
              <SelectItem value="DRDO">DRDO</SelectItem>
              <SelectItem value="National Informatics Centre">National Informatics Centre</SelectItem>
              
              {/* Banking */}
              <SelectItem value="State Bank of India">State Bank of India (SBI)</SelectItem>
              <SelectItem value="Punjab National Bank">Punjab National Bank (PNB)</SelectItem>
              <SelectItem value="Canara Bank">Canara Bank</SelectItem>
              <SelectItem value="Union Bank">Union Bank of India</SelectItem>
              <SelectItem value="Reserve Bank of India">Reserve Bank of India (RBI)</SelectItem>
              <SelectItem value="Institute of Banking Personnel Selection">IBPS</SelectItem>
              
              {/* State Governments */}
              <SelectItem value="Delhi Government">Delhi Government</SelectItem>
              <SelectItem value="Maharashtra Government">Maharashtra Government</SelectItem>
              <SelectItem value="Tamil Nadu Government">Tamil Nadu Government</SelectItem>
              <SelectItem value="Karnataka Government">Karnataka Government</SelectItem>
              <SelectItem value="Uttar Pradesh Government">Uttar Pradesh Government</SelectItem>
              
              {/* Other Categories */}
              <SelectItem value="Educational Institutions">Educational Institutions</SelectItem>
              <SelectItem value="Forest Department">Forest Department</SelectItem>
              <SelectItem value="Government Offices">Government Offices</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Qualification Filter */}
        <div className="mb-6">
          <Label className="text-sm font-medium text-gray-700 mb-2 block">Qualification</Label>
          <Select value={filters.qualification || "all-qualifications"} onValueChange={(value) => onFilterChange({ qualification: value })}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Qualifications" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-qualifications">All Qualifications</SelectItem>
              <SelectItem value="10th">10th Pass</SelectItem>
              <SelectItem value="12th">12th Pass</SelectItem>
              <SelectItem value="graduate">Graduate</SelectItem>
              <SelectItem value="postgraduate">Post Graduate</SelectItem>
              <SelectItem value="diploma">Diploma</SelectItem>
              <SelectItem value="engineering">B.E./B.Tech</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Posted Date Filter */}
        <div className="mb-6">
          <Label className="text-sm font-medium text-gray-700 mb-2 block">Posted Date</Label>
          <RadioGroup 
            value={filters.postedDate} 
            onValueChange={(value) => onFilterChange({ postedDate: value as any })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="today" id="today" />
              <Label htmlFor="today" className="text-sm text-gray-600">Today</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="week" id="week" />
              <Label htmlFor="week" className="text-sm text-gray-600">This Week</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="month" id="month" />
              <Label htmlFor="month" className="text-sm text-gray-600">This Month</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </aside>
  );
}
