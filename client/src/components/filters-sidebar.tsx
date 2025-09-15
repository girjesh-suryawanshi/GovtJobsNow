import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, MapPin, Building2, GraduationCap, IndianRupee, Calendar, Filter } from "lucide-react";
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
      salaryRange: "all-salaries",
      postedDate: undefined,
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.location && filters.location !== "all-locations") count++;
    if (filters.department && filters.department !== "all-departments") count++;
    if (filters.qualification && filters.qualification !== "all-qualifications") count++;
    if (filters.salaryRange && filters.salaryRange !== "all-salaries") count++;
    if (filters.postedDate) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <aside 
      id="departments"
      data-testid="filters-sidebar"
      className="lg:w-1/4 space-y-4"
    >
      {/* Header Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg text-blue-900">Job Filters</CardTitle>
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  {activeFiltersCount}
                </Badge>
              )}
            </div>
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                Clear All
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>
      {/* Location Filter - Priority */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-orange-600" />
            <CardTitle className="text-sm font-medium text-gray-900">Location</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Select value={filters.location || "all-locations"} onValueChange={(value) => onFilterChange({ location: value })}>
            <SelectTrigger className="w-full border-gray-200 focus:border-orange-500 focus:ring-orange-500">
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
        </CardContent>
      </Card>

      {/* Department Filter */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-blue-600" />
            <CardTitle className="text-sm font-medium text-gray-900">Department</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Select 
            value={filters.department || "all-departments"} 
            onValueChange={(value) => onFilterChange({ department: value })}
          >
            <SelectTrigger 
              data-testid="department-filter"
              className="w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            >
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
        </CardContent>
      </Card>

      {/* Qualification Filter */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-purple-600" />
            <CardTitle className="text-sm font-medium text-gray-900">Education</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Select value={filters.qualification || "all-qualifications"} onValueChange={(value) => onFilterChange({ qualification: value })}>
            <SelectTrigger className="w-full border-gray-200 focus:border-purple-500 focus:ring-purple-500">
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
        </CardContent>
      </Card>

      {/* Salary Range Filter */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <IndianRupee className="h-4 w-4 text-green-600" />
            <CardTitle className="text-sm font-medium text-gray-900">Salary Range</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Select value={filters.salaryRange || "all-salaries"} onValueChange={(value) => onFilterChange({ salaryRange: value })}>
            <SelectTrigger className="w-full border-gray-200 focus:border-green-500 focus:ring-green-500">
              <SelectValue placeholder="All Salary Ranges" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-salaries">All Salary Ranges</SelectItem>
              <SelectItem value="below-20k">Below ₹20,000</SelectItem>
              <SelectItem value="20k-30k">₹20,000 - ₹30,000</SelectItem>
              <SelectItem value="30k-50k">₹30,000 - ₹50,000</SelectItem>
              <SelectItem value="50k-75k">₹50,000 - ₹75,000</SelectItem>
              <SelectItem value="75k-100k">₹75,000 - ₹1,00,000</SelectItem>
              <SelectItem value="above-100k">Above ₹1,00,000</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Posted Date Filter */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-red-600" />
            <CardTitle className="text-sm font-medium text-gray-900">Posted Date</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <RadioGroup 
            value={filters.postedDate} 
            onValueChange={(value) => onFilterChange({ postedDate: value as any })}
            className="space-y-3"
          >
            <div className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 transition-colors">
              <RadioGroupItem value="today" id="today" className="text-red-600 focus:ring-red-500" />
              <Label htmlFor="today" className="text-sm text-gray-700 cursor-pointer flex-1">Today</Label>
            </div>
            <div className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 transition-colors">
              <RadioGroupItem value="week" id="week" className="text-red-600 focus:ring-red-500" />
              <Label htmlFor="week" className="text-sm text-gray-700 cursor-pointer flex-1">This Week</Label>
            </div>
            <div className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 transition-colors">
              <RadioGroupItem value="month" id="month" className="text-red-600 focus:ring-red-500" />
              <Label htmlFor="month" className="text-sm text-gray-700 cursor-pointer flex-1">This Month</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
    </aside>
  );
}
