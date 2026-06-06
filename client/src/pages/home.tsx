import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Header from "@/components/header";
import SEOHead from "@/components/seo-head";
import FeatureShowcase from "@/components/feature-showcase";
import FiltersSidebar from "@/components/filters-sidebar";
import HorizontalFilterBar from "@/components/horizontal-filter-bar";
import JobCard from "@/components/job-card";
import JobComparison from "@/components/job-comparison";
import JobAlerts from "@/components/job-alerts";
import JobTracker from "@/components/job-tracker";
import FloatingActionMenu from "@/components/floating-action-menu";
import Footer from "@/components/footer";
import UserProfileModal from "@/components/user-profile-modal";
import { useUserProfile } from "@/hooks/use-user-profile";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Grid3X3, List, ChevronLeft, ChevronRight, Bell, Target, Calendar, Sparkles, Filter } from "lucide-react";
import { apiRequest } from "@/lib/api";
import type { Job, SearchJobsParams } from "@/types/job";

// ─── STATIC DATA ──────────────────────────────────────────────────────────────
const CATEGORIES = [
  { icon: '🏛️', name: 'UPSC',       count: '42 Jobs',  dept: 'Union Public Service Commission' },
  { icon: '🚆', name: 'Railway',    count: '186 Jobs', dept: 'Railway Recruitment Board' },
  { icon: '🏦', name: 'Banking',    count: '93 Jobs',  dept: 'Banking Sector' },
  { icon: '⚔️', name: 'Defence',    count: '71 Jobs',  dept: 'Defense Services' },
  { icon: '📋', name: 'SSC',        count: '58 Jobs',  dept: 'Staff Selection Commission' },
  { icon: '🏥', name: 'Medical',    count: '34 Jobs',  dept: 'Healthcare & Medical' },
  { icon: '👮', name: 'Police',     count: '47 Jobs',  dept: 'Police & Security Forces' },
  { icon: '🏫', name: 'Teaching',   count: '120 Jobs', dept: 'Education & Teaching' },
  { icon: '⚙️', name: 'PSU',        count: '29 Jobs',  dept: 'Public Sector Undertaking' },
  { icon: '🌐', name: 'State Govt', count: '208 Jobs', dept: 'State Government' },
];

const QUICK_FILTERS = [
  { label: 'All',          value: '' },
  { label: '10th Pass',    value: '10th' },
  { label: '12th Pass',    value: '12th' },
  { label: 'Graduate',     value: 'graduate' },
  { label: 'Engineering',  value: 'engineering' },
  { label: 'Central Govt', value: 'Central Government' },
  { label: 'State Govt',   value: 'State Government' },
];

const RESULT_ITEMS = [
  { icon: '📋', title: 'SSC CHSL 2024 Final Result — Declared', org: 'Staff Selection Commission', date: '4 June 2026', declared: true },
  { icon: '🏦', title: 'IBPS PO 2025 Main Result — Expected Soon', org: 'IBPS', date: 'June 2026', declared: false },
  { icon: '🚆', title: 'RRB Group D CBT Result 2025 — Declared', org: 'Railway Recruitment Board', date: '1 June 2026', declared: true },
];

export default function Home() {
  const [searchParams, setSearchParams] = useState<SearchJobsParams>({
    search: "",
    department: "all-departments",
    location: "all-locations",
    qualification: "all-qualifications",
    salaryRange: "all-salaries",
    postedDate: undefined,
    sortBy: "latest",
    page: 1,
    limit: 10,
  });
  

  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [compareJobs, setCompareJobs] = useState<Job[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [showJobAlerts, setShowJobAlerts] = useState(false);
  const [showJobTracker, setShowJobTracker] = useState(false);
  const [jobToTrack, setJobToTrack] = useState<Job | undefined>(undefined);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const { profile, saveProfile } = useUserProfile();

  const { data: jobsData, isLoading, error } = useQuery({
    queryKey: ["/api/jobs", searchParams],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          // Convert "all-*" values to empty strings for API
          if (typeof value === "string" && value.startsWith("all-")) {
            return; // Skip "all-*" values - don't send them to backend
          }
          params.set(key, value.toString());
        }
      });
      const response = await apiRequest("GET", `/api/jobs?${params}`);
      const data = await response.json() as { jobs: Job[]; total: number };
      return data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds for fresh jobs
  });

  // URL query parameter synchronization
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const updates: Partial<SearchJobsParams> = {};
    
    if (params.has('search')) updates.search = params.get('search')!;
    if (params.has('department')) updates.department = params.get('department')!;
    if (params.has('jobCategory')) updates.jobCategory = params.get('jobCategory')!;
    if (params.has('location')) updates.location = params.get('location')!;
    if (params.has('qualification')) updates.qualification = params.get('qualification')!;
    if (params.has('salaryRange')) updates.salaryRange = params.get('salaryRange')!;
    if (params.has('postedDate')) updates.postedDate = params.get('postedDate') as any;
    if (params.has('sortBy')) updates.sortBy = params.get('sortBy') as any;
    
    if (Object.keys(updates).length > 0) {
      setSearchParams(prev => ({ ...prev, ...updates }));
    }
  }, [window.location.search]);

  const handleSearch = (query: string) => {
    handleFilterChange({ search: query });
  };

  const handleAdvancedSearch = (searchTerms: string[]) => {
    const combinedSearch = searchTerms.join(' OR ');
    setSearchParams(prev => ({ ...prev, search: combinedSearch, page: 1 }));
  };

  const handleCompareJob = (job: Job) => {
    if (compareJobs.find(j => j.id === job.id)) {
      const newCompareJobs = compareJobs.filter(j => j.id !== job.id);
      setCompareJobs(newCompareJobs);
      if (newCompareJobs.length === 0) {
        setShowComparison(false);
      }
    } else if (compareJobs.length < 3) {
      setCompareJobs([...compareJobs, job]);
    }
  };

  const handleFilterChange = (filters: Partial<SearchJobsParams>) => {
    setSearchParams(prev => {
      const next = { ...prev, ...filters, page: 1 };
      
      // Update URL search parameters
      const params = new URLSearchParams();
      Object.entries(next).forEach(([key, value]) => {
        if (value !== undefined && value !== "" && value !== 0) {
          if (typeof value === "string" && value.startsWith("all-")) return;
          if (key === 'page' && value === 1) return;
          if (key === 'limit' && value === 10) return;
          params.set(key, value.toString());
        }
      });
      
      const newRelativePathQuery = window.location.pathname + '?' + params.toString();
      window.history.pushState(null, '', newRelativePathQuery);
      
      return next;
    });
  };

  const handlePageChange = (page: number) => {
    setSearchParams(prev => {
      const next = { ...prev, page };
      // Also sync URL on page change
      const params = new URLSearchParams(window.location.search);
      params.set('page', page.toString());
      window.history.pushState(null, '', window.location.pathname + '?' + params.toString());
      return next;
    });
  };

  const handleScrollToDepartments = () => {
    // Scroll to filters section and highlight department filter
    const filtersSection = document.querySelector('[data-testid="filters-sidebar"]');
    if (filtersSection) {
      filtersSection.scrollIntoView({ behavior: 'smooth' });
      
      // Highlight the department filter after scrolling
      setTimeout(() => {
        const departmentFilter = filtersSection.querySelector('[data-testid="department-filter"]');
        if (departmentFilter) {
          departmentFilter.classList.add('ring-2', 'ring-blue-500', 'ring-offset-2');
          setTimeout(() => {
            departmentFilter.classList.remove('ring-2', 'ring-blue-500', 'ring-offset-2');
          }, 3000);
        }
      }, 500);
    }
  };

  // Handle hash-based navigation (e.g., /#departments from job detail page)
  useEffect(() => {
    if (window.location.hash === '#departments') {
      // Small delay to ensure page is fully loaded
      setTimeout(() => {
        handleScrollToDepartments();
      }, 100);
    }
  }, []);

  const totalPages = Math.ceil((jobsData?.total || 0) / searchParams.limit!);

  const [activeTab, setActiveTab] = useState<'jobs' | 'exams' | 'results'>('jobs');
  const [quickFilter, setQuickFilter] = useState('');

  // Apply quick-filter pill to qualification search
  const handleQuickFilter = (value: string) => {
    setQuickFilter(value);
    if (value === '') {
      handleFilterChange({ qualification: 'all-qualifications', jobCategory: undefined });
    } else if (value === 'Central Government' || value === 'State Government') {
      handleFilterChange({ jobCategory: value, qualification: 'all-qualifications' });
    } else {
      handleFilterChange({ qualification: value, jobCategory: undefined });
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--gjn-bg)' }}>
      <SEOHead
        title="GovtJobNow - Latest Government Jobs, Sarkari Naukri 2025 | 3900+ Govt Jobs"
        description="Find latest government jobs, sarkari naukri notifications 2025. Browse 3900+ verified govt jobs from SSC, Railway, Banking, UPSC, Defence, PSU. Apply for central & state government jobs online."
        keywords="government jobs, sarkari naukri, govt jobs 2025, SSC jobs, railway jobs, banking jobs, UPSC jobs, latest govt jobs, central government jobs, state government jobs, sarkari result, govt job portal, indian government jobs, sarkari naukri 2025"
        url="https://govtjobnow.com"
      />
      <Header
        onScrollToDepartments={handleScrollToDepartments}
        onSearch={handleSearch}
      />

      {/* ─── ATF LEADERBOARD AD ─── */}
      <div style={{ maxWidth: '1280px', margin: '12px auto 0', padding: '0 16px' }}>
        <div className="ad-unit ad-leaderboard">
          <span>📢 Advertisement — Above The Fold</span>
        </div>
      </div>

      {/* ─── MAIN PAGE WRAP ─── */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '16px 16px 100px' }} className="main-page-grid">
        {/* ══════════════ LEFT / MAIN COLUMN ══════════════ */}
        <div style={{ minWidth: 0 }}>

          {/* ─── TRUST BAR ─── */}
          <div className="trust-bar">
            <div className="trust-item"><span className="live-dot" />&nbsp;Live Updates</div>
            <div className="trust-item">✅ 1,24,800+ Verified Jobs</div>
            <div className="trust-item">🔒 Official Sources Only</div>
            <div className="trust-item" id="last-updated">🕐 Last Updated: Today</div>
            <div className="trust-item">📰 Google News Approved</div>
          </div>

          {/* ─── CATEGORY GRID ─── */}
          <p className="section-title-bar">Browse by Category</p>
          <div className="cat-grid">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                className="cat-card"
                onClick={() => handleFilterChange({ department: cat.dept, page: 1 })}
                aria-label={`Browse ${cat.name} jobs`}
              >
                <div className="cat-icon">{cat.icon}</div>
                <div className="cat-name">{cat.name}</div>
                <div className="cat-count">{cat.count}</div>
              </button>
            ))}
          </div>

          {/* ─── AI ELIGIBILITY BANNER (profile setup) ─── */}
          {!profile && (
            <div
              style={{
                background: 'linear-gradient(135deg, #1a3fa8 0%, #2563eb 100%)',
                borderRadius: '10px', padding: '16px 20px', marginBottom: '16px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px',
                color: '#fff',
              }}
            >
              <div>
                <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '15px', marginBottom: '4px' }}>
                  <Sparkles className="inline h-4 w-4 mr-1 text-yellow-300" />
                  See Jobs You Are Eligible For!
                </p>
                <p style={{ fontSize: '12px', opacity: 0.85 }}>
                  Set up your profile once — we'll instantly match age, qualification & category.
                </p>
              </div>
              <button
                onClick={() => setIsProfileModalOpen(true)}
                style={{
                  background: '#f59e0b', color: '#fff', border: 'none',
                  borderRadius: '8px', padding: '9px 18px',
                  fontWeight: 700, fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap',
                }}
              >
                Set Up Matcher →
              </button>
            </div>
          )}

          {profile && (
            <div
              style={{
                background: '#fff', borderRadius: '10px', border: '1.5px solid var(--gjn-border)',
                padding: '12px 16px', marginBottom: '16px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Target className="h-5 w-5" style={{ color: 'var(--gjn-blue2)' }} />
                <div>
                  <p style={{ fontSize: '13px', fontWeight: 600 }}>Matching for your profile</p>
                  <p style={{ fontSize: '11px', color: 'var(--gjn-muted)' }}>{profile.qualification} • {profile.category} • Born {profile.dob}</p>
                </div>
              </div>
              <button
                onClick={() => setIsProfileModalOpen(true)}
                style={{ fontSize: '12px', fontWeight: 600, color: 'var(--gjn-blue2)', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Edit Profile
              </button>
            </div>
          )}
      
          {/* ─── TABS ─── */}
          <div className="gjn-tabs">
            <div className={`gjn-tab ${activeTab === 'jobs' ? 'active' : ''}`} onClick={() => setActiveTab('jobs')}>🔥 Latest Jobs</div>
            <div className={`gjn-tab ${activeTab === 'exams' ? 'active' : ''}`} onClick={() => { setActiveTab('exams'); window.location.href = '/exams'; }}>📅 Upcoming Exams</div>
            <div className={`gjn-tab ${activeTab === 'results' ? 'active' : ''}`} onClick={() => setActiveTab('results')}>📊 Results</div>
          </div>

          {/* ─── QUICK FILTER PILLS ─── */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
            {QUICK_FILTERS.map((f) => (
              <button
                key={f.label}
                className={`filter-pill ${quickFilter === f.value ? 'active' : ''}`}
                onClick={() => handleQuickFilter(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* ─── MOBILE FILTER TOGGLE ─── */}
          <div style={{ display: 'none' }} className="mobile-filter-btn" id="mobile-filter-btn">
            <Button variant="outline" onClick={() => setIsMobileFiltersOpen(true)} className="w-full flex items-center justify-center gap-2" style={{ marginBottom: '12px' }}>
              <Filter className="h-4 w-4" /> Show Filters
            </Button>
          </div>

          {/* ─── HORIZONTAL FILTER BAR ─── */}
          <HorizontalFilterBar
            filters={searchParams}
            onFilterChange={handleFilterChange}
            onOpenMobileFilters={() => setIsMobileFiltersOpen(true)}
          />

          {/* ─── JOBS HEADER BAR ─── */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: '16px', fontWeight: 800, color: 'var(--gjn-blue)' }}>
                Latest Government Jobs
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--gjn-muted)' }}>
                Showing {jobsData?.jobs?.length || 0} of {jobsData?.total || 0} jobs
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {compareJobs.length > 0 && (
                <button
                  onClick={() => setShowComparison(true)}
                  style={{ background: 'var(--gjn-blue2)', color: '#fff', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Compare ({compareJobs.length}/3)
                </button>
              )}
              <Select value={searchParams.sortBy} onValueChange={(value) => handleFilterChange({ sortBy: value as any })}>
                <SelectTrigger style={{ width: '140px', fontSize: '12px', height: '34px' }}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Latest First</SelectItem>
                  <SelectItem value="deadline">By Deadline</SelectItem>
                  <SelectItem value="title">Title A–Z</SelectItem>
                  <SelectItem value="department">Department</SelectItem>
                </SelectContent>
              </Select>
              <ToggleGroup type="single" value={viewMode} onValueChange={(v) => v && setViewMode(v as 'grid' | 'list')} data-testid="toggle-view">
                <ToggleGroupItem value="list" aria-label="List view" className="h-8 w-8" data-testid="button-list-view"><List className="h-4 w-4" /></ToggleGroupItem>
                <ToggleGroupItem value="grid" aria-label="Grid view" className="h-8 w-8" data-testid="button-grid-view"><Grid3X3 className="h-4 w-4" /></ToggleGroupItem>
              </ToggleGroup>
              <button onClick={() => setShowJobAlerts(true)} style={{ background: 'none', border: '1.5px solid var(--gjn-border)', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', fontSize: '13px' }} title="Job Alerts"><Bell className="h-4 w-4" /></button>
              <button onClick={() => setIsMobileFiltersOpen(true)} style={{ background: 'none', border: '1.5px solid var(--gjn-border)', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', fontSize: '13px', display: 'none' }} className="mobile-only-filter" title="Filters"><Filter className="h-4 w-4" /></button>
            </div>
          </div>

          {isLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[...Array(5)].map((_, i) => (
                    <div key={i} style={{ background: '#fff', borderRadius: '10px', border: '1.5px solid var(--gjn-border)', padding: '16px' }}>
                      <div className="skeleton" style={{ height: '16px', width: '65%', marginBottom: '10px' }} />
                      <div className="skeleton" style={{ height: '12px', width: '40%', marginBottom: '8px' }} />
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <div className="skeleton" style={{ height: '11px', width: '80px' }} />
                        <div className="skeleton" style={{ height: '11px', width: '80px' }} />
                        <div className="skeleton" style={{ height: '11px', width: '100px' }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : jobsData?.jobs?.length ? (
                <>
                  <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 gap-4' : ''}>
                    {jobsData.jobs.map((job, idx) => (
                      <>
                        <JobCard
                          key={job.id}
                          job={job}
                          onCompare={() => handleCompareJob(job)}
                          onTrack={() => { setJobToTrack(job); setShowJobTracker(true); }}
                          isComparing={compareJobs.some(j => j.id === job.id)}
                        />
                        {/* In-feed ad every 5 cards */}
                        {(idx + 1) % 5 === 0 && (
                          <div key={`ad-${idx}`} className="ad-unit ad-infeed">
                            <span>🎯 Advertisement</span>
                          </div>
                        )}
                      </>
                    ))}
                  </div>

                  {/* Pagination */}
                  <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center', gap: '6px' }}>
                    <Button variant="outline" size="icon" onClick={() => handlePageChange(searchParams.page! - 1)} disabled={searchParams.page === 1}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      const page = i + 1;
                      return (
                        <Button key={page} variant={searchParams.page === page ? 'default' : 'outline'} size="sm" onClick={() => handlePageChange(page)}>
                          {page}
                        </Button>
                      );
                    })}
                    {totalPages > 5 && (
                      <><span style={{ padding: '0 4px', lineHeight: '2' }}>…</span>
                        <Button variant="outline" size="sm" onClick={() => handlePageChange(totalPages)}>{totalPages}</Button>
                      </>
                    )}
                    <Button variant="outline" size="icon" onClick={() => handlePageChange(searchParams.page! + 1)} disabled={searchParams.page === totalPages}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Recent Results section */}
                  {activeTab === 'results' || (
                    <div style={{ marginTop: '28px' }}>
                      <p className="section-title-bar">📊 Recent Results & Merit Lists</p>
                      {RESULT_ITEMS.map((r, i) => (
                        <div key={i} style={{ background: '#fff', borderRadius: '10px', border: '1.5px solid var(--gjn-border)', padding: '12px 16px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '22px' }}>{r.icon}</span>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontSize: '13px', fontWeight: 700 }}>{r.title}</p>
                            <p style={{ fontSize: '11px', color: 'var(--gjn-muted)', marginTop: '2px' }}>{r.org} • {r.date}</p>
                          </div>
                          <span style={{ fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', background: r.declared ? '#dcfce7' : '#fef3c7', color: r.declared ? '#15803d' : '#92400e' }}>
                            {r.declared ? '✅ Declared' : '⏳ Expected'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div style={{ background: '#fff', borderRadius: '10px', border: '1.5px solid var(--gjn-border)', padding: '48px', textAlign: 'center' }}>
                  <p style={{ fontSize: '15px', color: 'var(--gjn-muted)' }}>No jobs found matching your criteria</p>
                  <p style={{ fontSize: '12px', color: 'var(--gjn-muted)', marginTop: '6px' }}>Try adjusting your search or filters</p>
                </div>
              )}

        </div>{/* end main col */}

        {/* ══════════════ RIGHT SIDEBAR ══════════════ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }} className="home-sidebar">

          {/* Sticky Sidebar Ad */}
          <div className="ad-unit ad-sidebar" style={{ marginBottom: '16px' }}>
            <span>📌 Advertisement</span>
            <span style={{ fontSize: '10px', opacity: 0.7 }}>300×600 · Sticky sidebar</span>
          </div>

          {/* Job Alert Box */}
          <div style={{ background: 'linear-gradient(135deg, #1a3fa8, #2563eb)', borderRadius: '10px', padding: '16px', textAlign: 'center', color: '#fff', marginBottom: '16px' }}>
            <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: '15px', fontWeight: 800, marginBottom: '6px' }}>🔔 Free Job Alerts</h3>
            <p style={{ fontSize: '11px', opacity: 0.85, marginBottom: '12px' }}>Get instant WhatsApp / Email alerts for jobs matching your qualification</p>
            <Button onClick={() => setShowJobAlerts(true)} style={{ width: '100%', background: '#f59e0b', color: '#fff', border: 'none', borderRadius: '6px', padding: '9px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
              Subscribe Free →
            </Button>
          </div>

          {/* Trending Searches sidebar card */}
          <div className="gjn-sidebar-card">
            <div className="gjn-sidebar-head">🔥 Trending Searches</div>
            {["RRB NTPC 2025 Apply Online", "SSC CGL 2026 Syllabus", "SBI PO Admit Card 2026", "UPSC Prelims 2026 Answer Key", "Army Agniveer Recruitment"].map((t, i) => (
              <button
                key={i}
                className="gjn-sidebar-item"
                style={{ width: '100%', textAlign: 'left', cursor: 'pointer', background: 'none', border: 'none' }}
                onClick={() => handleFilterChange({ search: t, page: 1 })}
              >
                <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--gjn-blue2)', minWidth: '20px' }}>0{i+1}</span>
                <span style={{ fontSize: '12px', fontWeight: 600, flex: 1 }}>{t}</span>
                {i === 0 && <span style={{ fontSize: '10px', fontWeight: 700, color: '#15803d', background: '#dcfce7', borderRadius: '4px', padding: '1px 5px' }}>Hot</span>}
                {i === 2 && <span style={{ fontSize: '10px', fontWeight: 700, color: '#15803d', background: '#dcfce7', borderRadius: '4px', padding: '1px 5px' }}>New</span>}
              </button>
            ))}
          </div>

          {/* Upcoming Exams sidebar card */}
          <div className="gjn-sidebar-card" style={{ marginTop: '0' }}>
            <div className="gjn-sidebar-head">📅 Upcoming Exam Dates</div>
            {[{d:'08',l:'RRB NTPC CBT-1 · Jun',hot:true},{d:'15',l:'IBPS RRB PO · Jun',hot:true},{d:'22',l:'SSC CGL Tier-1 · Jul'},{d:'01',l:'UPSC Mains · Sep'}].map((ex, i) => (
              <Link key={i} href="/exams" className="gjn-sidebar-item">
                <span style={{ fontSize: '11px', fontWeight: 800, color: ex.hot ? 'var(--gjn-red)' : 'var(--gjn-blue2)', minWidth: '20px' }}>{ex.d}</span>
                <span style={{ fontSize: '12px', fontWeight: 600, flex: 1 }}>{ex.l}</span>
              </Link>
            ))}
          </div>

          {/* Sidebar Ad #2 */}
          <div className="ad-unit" style={{ width: '100%', height: '250px', marginTop: '16px' }}>
            <span>📌 Advertisement</span>
            <span style={{ fontSize: '10px', opacity: 0.7 }}>300×250 · Medium Rectangle</span>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
            <Button variant="outline" onClick={() => setShowJobTracker(true)} className="w-full flex items-center justify-center gap-2" style={{ fontSize: '12px' }}>
              <Target className="h-4 w-4" /> Track Applications
            </Button>
            <Button variant="outline" onClick={() => { window.location.href = '/exams'; }} className="w-full flex items-center justify-center gap-2" style={{ fontSize: '12px' }}>
              <Calendar className="h-4 w-4" /> Exam Calendar
            </Button>
          </div>

        </div>{/* end sidebar */}
      </div>{/* end main-page-grid */}

      {/* Sidebar layout for mobile — show filters as a sheet */}
      <FiltersSidebar
        filters={searchParams}
        onFilterChange={handleFilterChange}
        isOpen={isMobileFiltersOpen}
        onToggle={() => setIsMobileFiltersOpen(false)}
      />



      {showComparison && compareJobs.length > 0 && (
        <JobComparison
          jobs={compareJobs}
          onRemove={(jobId) => {
            const newJobs = compareJobs.filter(j => j.id !== jobId);
            setCompareJobs(newJobs);
            if (newJobs.length === 0) setShowComparison(false);
          }}
          onClose={() => { setShowComparison(false); setCompareJobs([]); }}
        />
      )}

      <JobAlerts isOpen={showJobAlerts} onClose={() => setShowJobAlerts(false)} />

      <JobTracker
        isOpen={showJobTracker}
        onClose={() => { setShowJobTracker(false); setJobToTrack(undefined); }}
        jobToAdd={jobToTrack}
      />

      <FloatingActionMenu
        onOpenJobAlerts={() => setShowJobAlerts(true)}
        onOpenJobTracker={() => setShowJobTracker(true)}
        onOpenExamCalendar={() => window.location.href = '/exams'}
      />

      <FeatureShowcase />
      <Footer onFilterChange={handleFilterChange} />

      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onSave={saveProfile}
        initialProfile={profile}
      />

      {/* ─── Live timestamp updater ─── */}
      <script dangerouslySetInnerHTML={{ __html: `
        (function(){
          var el = document.getElementById('last-updated');
          function update() {
            if (!el) return;
            var t = new Date().toLocaleTimeString('en-IN', {hour:'2-digit',minute:'2-digit'});
            el.innerHTML = '\u{1F550} Last Updated: Today ' + t;
          }
          update(); setInterval(update, 60000);
        })();
      `}} />
    </div>
  );
}
