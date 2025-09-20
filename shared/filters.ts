// Filter normalization and matching helpers
import { 
  INDIAN_STATES, 
  UNION_TERRITORIES,
  STATE_CITIES_MAP, 
  LocationType,
  NATIONWIDE_KEYWORDS,
  MULTI_LOCATION_KEYWORDS,
  QualificationCategory,
  QUALIFICATION_PATTERNS,
  DEPARTMENT_NAMES
} from './taxonomy';
import type { Job } from './schema';

// Normalized location filter result
export interface LocationFilter {
  type: LocationType;
  state?: string;
  originalValue: string;
}

// Normalize location filter from UI value to canonical form
export function normalizeLocationFilter(value: string): LocationFilter {
  const lowerValue = value.toLowerCase();
  
  // Handle sentinel/all values
  if (value === 'all-locations' || lowerValue === 'all locations') {
    return { type: LocationType.ALL, originalValue: value };
  }
  
  // Check if it's a specific state or UT
  const allRegions = [...INDIAN_STATES, ...UNION_TERRITORIES];
  const matchedRegion = allRegions.find(region => 
    region.toLowerCase() === lowerValue
  );
  
  if (matchedRegion) {
    return { 
      type: LocationType.STATE_SPECIFIC, 
      state: matchedRegion,
      originalValue: value 
    };
  }
  
  // Check if it matches nationwide patterns
  if (lowerValue === 'all india' || lowerValue === 'pan india') {
    return { type: LocationType.NATIONWIDE, originalValue: value };
  }
  
  // Default to treating as state-specific for partial matches
  return { type: LocationType.STATE_SPECIFIC, state: value, originalValue: value };
}

// Check if a job matches the location filter
export function jobMatchesLocation(job: Job, filter: LocationFilter): boolean {
  const jobLocation = job.location.toLowerCase();
  
  // If filter is "all", match everything
  if (filter.type === LocationType.ALL) {
    return true;
  }
  
  // Check for nationwide indicators in job location
  const isNationwideJob = NATIONWIDE_KEYWORDS.some(keyword => 
    jobLocation.includes(keyword.toLowerCase())
  );
  
  // Check for multi-location indicators  
  const isMultiLocationJob = MULTI_LOCATION_KEYWORDS.some(keyword =>
    jobLocation.includes(keyword.toLowerCase())
  );
  
  // If user selected a specific state
  if (filter.type === LocationType.STATE_SPECIFIC && filter.state) {
    const selectedState = filter.state.toLowerCase();
    
    // 1. Match if job location contains the exact state name
    if (jobLocation.includes(selectedState)) {
      return true;
    }
    
    // 2. Match if job location contains cities from that state
    const stateCities = STATE_CITIES_MAP[filter.state] || [];
    if (stateCities.some(city => jobLocation.includes(city.toLowerCase()))) {
      return true;
    }
    
    // 3. IMPORTANT: When user selects any state, they should see nationwide/multi-location jobs
    if (isNationwideJob || isMultiLocationJob) {
      return true;
    }
    
    // 4. Match common patterns that should appear for state selections
    if (jobLocation.includes('state-wise') || 
        jobLocation.includes('district-wise') || 
        jobLocation.includes('all india') || 
        jobLocation.includes('pan india') ||
        jobLocation.includes('multiple locations') ||
        jobLocation.includes('various locations') ||
        jobLocation.includes('india') ||
        jobLocation.includes('major cities')) {
      return true;
    }
  }
  
  // If user selected nationwide, match nationwide jobs
  if (filter.type === LocationType.NATIONWIDE) {
    return isNationwideJob;
  }
  
  return false;
}

// Normalize qualification filter
export function normalizeQualificationFilter(value: string): QualificationCategory | undefined {
  const lowerValue = value.toLowerCase();
  
  // Handle sentinel values
  if (value === 'all-qualifications') {
    return undefined;
  }
  
  // Direct mapping for common UI values
  const directMappings: Record<string, QualificationCategory> = {
    '10th': QualificationCategory.CLASS_10,
    '12th': QualificationCategory.CLASS_12, 
    'graduate': QualificationCategory.GRADUATE,
    'postgraduate': QualificationCategory.POSTGRADUATE,
    'diploma': QualificationCategory.DIPLOMA,
    'engineering': QualificationCategory.ENGINEERING
  };
  
  if (directMappings[lowerValue]) {
    return directMappings[lowerValue];
  }
  
  return undefined;
}

// Check if job matches qualification filter
export function jobMatchesQualification(job: Job, category: QualificationCategory): boolean {
  const jobQualification = job.qualification.toLowerCase();
  
  // Special case handling for better matching
  switch (category) {
    case QualificationCategory.CLASS_10:
      return jobQualification.includes('10th') || jobQualification.includes('class 10') || jobQualification.includes('matriculation');
      
    case QualificationCategory.CLASS_12:
      return jobQualification.includes('12th') || jobQualification.includes('class 12') || jobQualification.includes('intermediate');
      
    case QualificationCategory.GRADUATE:
      return jobQualification.includes('graduate') || jobQualification.includes('graduation') || jobQualification.includes('degree') || jobQualification.includes('bachelor');
      
    case QualificationCategory.POSTGRADUATE:
      return jobQualification.includes('post graduate') || jobQualification.includes('postgraduate') || jobQualification.includes('master') || jobQualification.includes('m.') || jobQualification.includes('phd');
      
    case QualificationCategory.DIPLOMA:
      return jobQualification.includes('diploma') || jobQualification.includes('certificate') || jobQualification.includes('polytechnic');
      
    case QualificationCategory.ENGINEERING:
      return jobQualification.includes('b.e.') || jobQualification.includes('b.tech') || jobQualification.includes('engineering') || jobQualification.includes('technical') || jobQualification.includes('be/btech');
  }
  
  // Fallback to regex patterns
  const patterns = QUALIFICATION_PATTERNS[category];
  return patterns ? patterns.some((pattern: RegExp) => pattern.test(jobQualification)) : false;
}

// Normalize department filter (mostly pass-through since departments match)
export function normalizeDepartmentFilter(value: string): string | undefined {
  // Handle sentinel values
  if (value === 'all-departments') {
    return undefined;
  }
  
  return value;
}

// Check if job matches department filter
export function jobMatchesDepartment(job: Job, departmentFilter: string): boolean {
  return job.department.toLowerCase().includes(departmentFilter.toLowerCase());
}

// Main filter matching function
export interface NormalizedFilters {
  location?: LocationFilter;
  department?: string;  
  qualification?: QualificationCategory;
  salaryRange?: string;
  postedDate?: 'today' | 'week' | 'month';
}

export function normalizeFilters(params: any): NormalizedFilters {
  const normalized: NormalizedFilters = {};
  
  if (params.location && params.location !== 'all-locations') {
    normalized.location = normalizeLocationFilter(params.location);
  }
  
  if (params.department && params.department !== 'all-departments') {
    normalized.department = normalizeDepartmentFilter(params.department);
  }
  
  if (params.qualification && params.qualification !== 'all-qualifications') {
    normalized.qualification = normalizeQualificationFilter(params.qualification);
  }
  
  if (params.salaryRange && params.salaryRange !== 'all-salaries') {
    normalized.salaryRange = params.salaryRange;
  }
  
  if (params.postedDate) {
    normalized.postedDate = params.postedDate;
  }
  
  return normalized;
}

export function jobMatchesFilters(job: Job, filters: NormalizedFilters): boolean {
  // DEBUG: Temporary logging to understand what's happening
  if (filters.location || filters.qualification || filters.department) {
    console.log('🔍 Filtering job:', {
      id: job.id.substring(0, 8),
      location: job.location,
      qualification: job.qualification,
      department: job.department,
      filters: {
        location: filters.location ? `${filters.location.type}:${filters.location.state}` : undefined,
        qualification: filters.qualification,
        department: filters.department
      }
    });
  }
  
  // Location filter
  if (filters.location && !jobMatchesLocation(job, filters.location)) {
    // Location filter rejected (logging disabled)
    return false;
  }
  
  // Department filter
  if (filters.department && !jobMatchesDepartment(job, filters.department)) {
    // Department filter rejected (logging disabled)
    return false;
  }
  
  // Qualification filter  
  if (filters.qualification && !jobMatchesQualification(job, filters.qualification)) {
    // Qualification filter rejected (logging disabled)
    return false;
  }
  
  // Salary range filter (keep existing logic for now)
  if (filters.salaryRange) {
    // TODO: Implement salary range matching logic
    // For now, skip this filter
  }
  
  // Job passed all filters (removed logging to prevent spam)
  return true;
}