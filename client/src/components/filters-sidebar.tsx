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
        
        {/* Department Filter */}
        <div className="mb-6">
          <Label className="text-sm font-medium text-gray-700 mb-2 block">Department</Label>
          <Select value={filters.department || "all-departments"} onValueChange={(value) => onFilterChange({ department: value })}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-departments">All Departments</SelectItem>
              <SelectItem value="railways">Indian Railways</SelectItem>
              <SelectItem value="defense">Defense</SelectItem>
              <SelectItem value="banking">Banking</SelectItem>
              <SelectItem value="ssc">SSC</SelectItem>
              <SelectItem value="upsc">UPSC</SelectItem>
              <SelectItem value="police">Police</SelectItem>
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
