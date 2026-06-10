import { useState } from "react";
import { Filter, X, MapPin, Building2, GraduationCap, IndianRupee, Calendar } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { SearchJobsParams } from "@/types/job";

interface HorizontalFilterBarProps {
  filters: SearchJobsParams;
  onFilterChange: (filters: Partial<SearchJobsParams>) => void;
  onOpenMobileFilters?: () => void;
}

export default function HorizontalFilterBar({ filters, onFilterChange, onOpenMobileFilters }: HorizontalFilterBarProps) {
  const activeCount = [
    filters.location && filters.location !== "all-locations",
    filters.department && filters.department !== "all-departments",
    filters.qualification && filters.qualification !== "all-qualifications",
    filters.salaryRange && filters.salaryRange !== "all-salaries",
    filters.postedDate,
  ].filter(Boolean).length;

  const handleClear = () => {
    onFilterChange({
      location: "all-locations",
      department: "all-departments",
      qualification: "all-qualifications",
      salaryRange: "all-salaries",
      postedDate: undefined,
    });
  };

  return (
    <div
      id="departments"
      data-testid="filters-sidebar"
      className="flex-wrap lg:flex-nowrap"
      style={{
        background: "#fff",
        border: "1.5px solid var(--gjn-border)",
        borderRadius: "10px",
        padding: "12px 16px",
        marginBottom: "14px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
    >
      {/* Label */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--gjn-blue)", flexShrink: 0 }}>
        <Filter style={{ width: "14px", height: "14px" }} />
        <span style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.3px" }}>Filters</span>
        {activeCount > 0 && (
          <span style={{
            background: "var(--gjn-blue2)", color: "#fff",
            fontSize: "10px", fontWeight: 800, borderRadius: "99px",
            padding: "1px 6px", marginLeft: "2px",
          }}>
            {activeCount}
          </span>
        )}
      </div>

      <div style={{ width: "1px", height: "20px", background: "var(--gjn-border)", flexShrink: 0 }} />

      {/* Location */}
      <div style={{ display: "flex", alignItems: "center", gap: "4px", flex: "1 1 140px", minWidth: "130px", maxWidth: "180px" }}>
        <MapPin style={{ width: "12px", height: "12px", color: "#f97316", flexShrink: 0 }} />
        <Select
          value={filters.location || "all-locations"}
          onValueChange={(v) => onFilterChange({ location: v })}
        >
          <SelectTrigger
            style={{ border: "1px solid var(--gjn-border)", height: "32px", fontSize: "12px", fontWeight: 600, borderRadius: "6px", paddingLeft: "8px" }}
            aria-label="Filter by location"
          >
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-locations">All Locations</SelectItem>
            <SelectItem value="All India">All India</SelectItem>
            <SelectItem value="Pan India">Pan India</SelectItem>
            <SelectItem value="Delhi">Delhi</SelectItem>
            <SelectItem value="Maharashtra">Maharashtra</SelectItem>
            <SelectItem value="Uttar Pradesh">Uttar Pradesh</SelectItem>
            <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
            <SelectItem value="Karnataka">Karnataka</SelectItem>
            <SelectItem value="West Bengal">West Bengal</SelectItem>
            <SelectItem value="Rajasthan">Rajasthan</SelectItem>
            <SelectItem value="Bihar">Bihar</SelectItem>
            <SelectItem value="Gujarat">Gujarat</SelectItem>
            <SelectItem value="Madhya Pradesh">Madhya Pradesh</SelectItem>
            <SelectItem value="Andhra Pradesh">Andhra Pradesh</SelectItem>
            <SelectItem value="Telangana">Telangana</SelectItem>
            <SelectItem value="Kerala">Kerala</SelectItem>
            <SelectItem value="Punjab">Punjab</SelectItem>
            <SelectItem value="Haryana">Haryana</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Department */}
      <div style={{ display: "flex", alignItems: "center", gap: "4px", flex: "1 1 150px", minWidth: "140px", maxWidth: "200px" }}>
        <Building2 style={{ width: "12px", height: "12px", color: "var(--gjn-blue2)", flexShrink: 0 }} />
        <Select
          value={filters.department || "all-departments"}
          onValueChange={(v) => onFilterChange({ department: v })}
        >
          <SelectTrigger
            data-testid="department-filter"
            style={{ border: "1px solid var(--gjn-border)", height: "32px", fontSize: "12px", fontWeight: 600, borderRadius: "6px", paddingLeft: "8px" }}
            aria-label="Filter by department"
          >
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-departments">All Departments</SelectItem>
            <SelectItem value="Staff Selection Commission">SSC</SelectItem>
            <SelectItem value="Union Public Service Commission">UPSC</SelectItem>
            <SelectItem value="Railway Recruitment Board">Railway</SelectItem>
            <SelectItem value="Indian Army">Army</SelectItem>
            <SelectItem value="Indian Navy">Navy</SelectItem>
            <SelectItem value="Indian Air Force">Air Force</SelectItem>
            <SelectItem value="State Bank of India">SBI</SelectItem>
            <SelectItem value="Reserve Bank of India">RBI</SelectItem>
            <SelectItem value="Institute of Banking Personnel Selection">IBPS</SelectItem>
            <SelectItem value="ISRO">ISRO</SelectItem>
            <SelectItem value="DRDO">DRDO</SelectItem>
            <SelectItem value="Educational Institutions">Education</SelectItem>
            <SelectItem value="Forest Department">Forest Dept</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Education */}
      <div style={{ display: "flex", alignItems: "center", gap: "4px", flex: "1 1 140px", minWidth: "130px", maxWidth: "180px" }}>
        <GraduationCap style={{ width: "12px", height: "12px", color: "#9333ea", flexShrink: 0 }} />
        <Select
          value={filters.qualification || "all-qualifications"}
          onValueChange={(v) => onFilterChange({ qualification: v })}
        >
          <SelectTrigger
            style={{ border: "1px solid var(--gjn-border)", height: "32px", fontSize: "12px", fontWeight: 600, borderRadius: "6px", paddingLeft: "8px" }}
            aria-label="Filter by education"
          >
            <SelectValue placeholder="Education" />
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

      {/* Salary */}
      <div style={{ display: "flex", alignItems: "center", gap: "4px", flex: "1 1 150px", minWidth: "140px", maxWidth: "180px" }}>
        <IndianRupee style={{ width: "12px", height: "12px", color: "#16a34a", flexShrink: 0 }} />
        <Select
          value={filters.salaryRange || "all-salaries"}
          onValueChange={(v) => onFilterChange({ salaryRange: v })}
        >
          <SelectTrigger
            style={{ border: "1px solid var(--gjn-border)", height: "32px", fontSize: "12px", fontWeight: 600, borderRadius: "6px", paddingLeft: "8px" }}
            aria-label="Filter by salary"
          >
            <SelectValue placeholder="Salary" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-salaries">All Salaries</SelectItem>
            <SelectItem value="below-20k">Below ₹20K</SelectItem>
            <SelectItem value="20k-30k">₹20K – ₹30K</SelectItem>
            <SelectItem value="30k-50k">₹30K – ₹50K</SelectItem>
            <SelectItem value="50k-75k">₹50K – ₹75K</SelectItem>
            <SelectItem value="75k-100k">₹75K – ₹1L</SelectItem>
            <SelectItem value="above-100k">Above ₹1L</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Posted Date */}
      <div style={{ display: "flex", alignItems: "center", gap: "4px", flex: "1 1 130px", minWidth: "120px", maxWidth: "160px" }}>
        <Calendar style={{ width: "12px", height: "12px", color: "#dc2626", flexShrink: 0 }} />
        <Select
          value={filters.postedDate || "any"}
          onValueChange={(v) => onFilterChange({ postedDate: v === "any" ? undefined : v as any })}
        >
          <SelectTrigger
            style={{ border: "1px solid var(--gjn-border)", height: "32px", fontSize: "12px", fontWeight: 600, borderRadius: "6px", paddingLeft: "8px" }}
            aria-label="Filter by posted date"
          >
            <SelectValue placeholder="Posted" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Clear + Mobile Filter button */}
      <div style={{ display: "flex", gap: "6px", marginLeft: "auto", flexShrink: 0 }}>
        {activeCount > 0 && (
          <button
            onClick={handleClear}
            style={{
              display: "flex", alignItems: "center", gap: "4px",
              fontSize: "11px", fontWeight: 700, color: "var(--gjn-red)",
              background: "#fff1f2", border: "1px solid #fecdd3",
              borderRadius: "6px", padding: "5px 10px", cursor: "pointer",
              transition: "all 0.15s",
            }}
            aria-label="Clear all filters"
          >
            <X style={{ width: "11px", height: "11px" }} />
            Clear
          </button>
        )}
        {/* Mobile-only "More Filters" */}
        <button
          onClick={onOpenMobileFilters}
          className="mobile-only-filter"
          style={{
            display: "none",
            alignItems: "center", gap: "4px",
            fontSize: "11px", fontWeight: 700, color: "var(--gjn-blue2)",
            background: "#eff6ff", border: "1px solid #bfdbfe",
            borderRadius: "6px", padding: "5px 10px", cursor: "pointer",
          }}
          aria-label="Show all filters"
        >
          <Filter style={{ width: "11px", height: "11px" }} />
          All Filters
        </button>
      </div>
    </div>
  );
}
