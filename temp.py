import re

def generate_home_tsx():
    # Read the original file
    with open('client/src/pages/home.tsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the start of the return statement
    return_index = content.find('  return (')
    
    if return_index == -1:
        print("Could not find 'return ('")
        return

    top_part = content[:return_index]
    
    # We need to add `getJobTheme` helper function to the top part (after imports)
    imports_end = top_part.rfind('import')
    imports_end = top_part.find('\n', imports_end) + 1
    
    theme_helper = """
// Helper to determine icon and color based on department or title
function getJobTheme(job: Job) {
  const text = (job.department + " " + job.title).toLowerCase();
  if (text.includes("railway") || text.includes("rrb")) return { icon: "🚆", color: "var(--red)", bg: "#fee2e2", txt: "var(--red)" };
  if (text.includes("bank") || text.includes("sbi") || text.includes("ibps")) return { icon: "🏦", color: "var(--green)", bg: "#dcfce7", txt: "var(--green)" };
  if (text.includes("upsc") || text.includes("civil")) return { icon: "🏛️", color: "var(--amber)", bg: "#fef3c7", txt: "#b45309" };
  if (text.includes("defence") || text.includes("army") || text.includes("navy")) return { icon: "⚔️", color: "var(--green)", bg: "#dcfce7", txt: "var(--green)" };
  if (text.includes("police") || text.includes("ssc")) return { icon: "👮", color: "var(--blue2)", bg: "#e0f2fe", txt: "var(--blue2)" };
  if (text.includes("medical") || text.includes("aiims") || text.includes("health")) return { icon: "🏥", color: "var(--blue)", bg: "#e0e7ff", txt: "var(--blue)" };
  return { icon: "🏛️", color: "var(--blue2)", bg: "#e0f2fe", txt: "var(--blue2)" };
}
"""
    top_part = top_part[:imports_end] + theme_helper + top_part[imports_end:]

    # Add activeTab and activeFilter state to the component
    home_start = top_part.find('export default function Home() {')
    home_start = top_part.find('\n', home_start) + 1
    
    new_state = """
  const [activeTab, setActiveTab] = useState("latest");
  const [activeFilter, setActiveFilter] = useState("All");
  const [timeStr, setTimeStr] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const intv = setInterval(updateTime, 60000);
    return () => clearInterval(intv);
  }, []);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'latest') handleFilterChange({ sortBy: 'latest' });
    if (tab === 'upcoming') handleFilterChange({ sortBy: 'deadline' });
  };

  const handlePillClick = (f: string) => {
    setActiveFilter(f);
    if (f === 'All') {
      handleFilterChange({ qualification: 'all-qualifications', search: '' });
    } else if (['10th Pass', '12th Pass', 'Graduate', 'Engineering'].includes(f)) {
      handleFilterChange({ qualification: f.toLowerCase() });
    } else {
      handleFilterChange({ search: f, qualification: 'all-qualifications' });
    }
  };
"""
    top_part = top_part[:home_start] + new_state + top_part[home_start:]


    new_ui = """  return (
    <div className="bg-[var(--bg)] min-h-screen font-sans">
      <SEOHead
        title="GovtJobNow - Official Job Portal"
        description="Find the latest government jobs, exam calendars, syllabus, and admit cards on GovtJobsNow. 100% verified opportunities."
      />
      
      {/* ═══ STICKY HEADER ═══ */}
      <header className="sticky top-0 z-[100] bg-[var(--blue)] shadow-[0_2px_12px_rgba(26,63,168,.35)]">
        <div className="flex items-center gap-3 py-2.5 px-4 max-w-[1280px] mx-auto">
          <a className="font-['Syne'] text-[22px] font-extrabold text-white whitespace-nowrap no-underline tracking-[-.5px] cursor-pointer" onClick={() => setLocation('/')}>
            Govt<span className="text-[var(--amber)]">Job</span>Now
          </a>
          <div className="flex-1 flex items-center bg-white rounded-lg overflow-hidden border-2 border-transparent transition-colors focus-within:border-[var(--amber)]">
            <input 
              type="text" 
              placeholder="Search jobs, exams, admit cards… e.g. SSC GD 2026" 
              className="flex-1 border-none outline-none py-[9px] px-3 text-sm font-['Noto_Sans']"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch(searchQuery);
              }}
            />
            <button 
              className="bg-[var(--amber)] border-none py-[9px] px-4 cursor-pointer font-semibold text-white text-[15px]"
              onClick={() => handleSearch(searchQuery)}
            >
              🔍
            </button>
          </div>
          <div className="hidden sm:flex gap-2 items-center">
            <button 
              className="bg-[var(--amber)] text-white border-none rounded-md py-2 px-3.5 cursor-pointer font-semibold text-[13px] whitespace-nowrap"
              onClick={() => setShowJobAlerts(true)}
            >
              🔔 Get Alerts
            </button>
          </div>
        </div>
        <nav className="bg-[#162f8a] border-t border-white/10">
          <div className="max-w-[1280px] mx-auto flex gap-0 overflow-x-auto scrollbar-hide">
            <a className="text-white/85 no-underline py-[9px] px-4 whitespace-nowrap text-[13px] font-semibold border-b-[3px] border-transparent hover:text-[var(--amber)] hover:bg-white/5 cursor-pointer" onClick={() => setLocation('/')}>🏠 Home</a>
            <a className="text-white/85 no-underline py-[9px] px-4 whitespace-nowrap text-[13px] font-semibold border-b-[3px] border-transparent hover:text-[var(--amber)] hover:bg-white/5 cursor-pointer" onClick={() => setLocation('/jobs')}>📋 Latest Jobs</a>
            <a className="text-white/85 no-underline py-[9px] px-4 whitespace-nowrap text-[13px] font-semibold border-b-[3px] border-transparent hover:text-[var(--amber)] hover:bg-white/5 cursor-pointer" onClick={() => setLocation('/exams')}>📅 Exam Calendar</a>
          </div>
        </nav>
      </header>

      {/* ═══ ATF LEADERBOARD AD ═══ */}
      <div className="max-w-[1280px] mx-auto mt-3 px-4">
        <AdUnit type="leaderboard" className="bg-[#fef9ee] border border-dashed border-[#e5d89a] rounded-lg h-[90px] flex items-center justify-center text-[#a08c3a] text-[11px] font-semibold relative">
          <span>📢 Leaderboard Ad — 728×90 · Above The Fold · Highest CPM Zone</span>
        </AdUnit>
      </div>

      {/* ═══ MAIN PAGE ═══ */}
      <div className="max-w-[1280px] mx-auto px-4 py-4 pb-20 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">
        
        {/* ═══ MAIN COLUMN ═══ */}
        <div className="min-w-0">

          {/* TRUST BAR */}
          <div className="bg-gradient-to-br from-[#1a3fa8] to-[#2563eb] rounded-[10px] py-3 px-5 flex flex-wrap gap-4 items-center mb-4 text-white">
            <div className="flex items-center gap-1.5 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse"></span> Live Updates
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold">
              <span className="text-base">✅</span> 1,24,800+ Verified Jobs
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold">
              <span className="text-base">🔒</span> Official Sources Only
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold">
              <span className="text-base">🕐</span> Last Updated: Today {timeStr}
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold hidden sm:flex">
              <span className="text-base">📰</span> Google News Approved
            </div>
          </div>

          {/* CATEGORY GRID */}
          <div className="font-['Syne'] text-base font-extrabold text-[var(--blue)] mb-3 flex items-center gap-2 after:content-[''] after:flex-1 after:h-[2px] after:bg-gradient-to-r after:from-[var(--blue2)] after:to-transparent after:rounded-sm">
            Browse by Category
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5 mb-5">
            {[
              { i: "🏛️", n: "UPSC", c: "42" },
              { i: "🚆", n: "Railway", c: "186" },
              { i: "🏦", n: "Banking", c: "93" },
              { i: "⚔️", n: "Defence", c: "71" },
              { i: "📋", n: "SSC", c: "58" },
              { i: "🏥", n: "Medical", c: "34" },
              { i: "👮", n: "Police", c: "47" },
              { i: "🏫", n: "Teaching", c: "120" },
              { i: "⚙️", n: "PSU", c: "29" },
              { i: "🌐", n: "State Govt", c: "208" },
            ].map((cat) => (
              <a key={cat.n} onClick={() => handleFilterChange({ search: cat.n })} className="bg-white rounded-[10px] border-[1.5px] border-[var(--border)] py-[14px] px-2 text-center cursor-pointer transition-all hover:border-[var(--blue2)] hover:shadow-[0_4px_16px_rgba(37,99,235,0.15)] hover:-translate-y-0.5 no-underline text-[var(--text)]">
                <div className="text-[26px] mb-1">{cat.i}</div>
                <div className="text-[11px] font-bold text-[var(--blue)]">{cat.n}</div>
                <div className="text-[10px] text-[var(--muted)] bg-[var(--bg)] rounded-full px-1.5 py-[1px] mt-1 inline-block">{cat.c} Jobs</div>
              </a>
            ))}
          </div>

          {/* TABS + FILTER */}
          <div className="flex gap-0 border-b-2 border-[var(--border)] mb-3.5">
            {[
              { id: 'latest', label: '🔥 Latest Jobs' },
              { id: 'upcoming', label: '📅 Upcoming Exams' },
              { id: 'results', label: '📊 Results' },
            ].map(tab => (
              <div 
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`py-2 px-4 text-[13px] font-bold cursor-pointer border-b-3 mb-[-2px] transition-all ${
                  activeTab === tab.id ? 'text-[var(--blue2)] border-[var(--blue2)]' : 'text-[var(--muted)] border-transparent'
                }`}
              >
                {tab.label}
              </div>
            ))}
          </div>
          <div className="flex gap-1.5 flex-wrap mb-3.5">
            {['All', '10th Pass', '12th Pass', 'Graduate', 'Engineering', 'Central Govt', 'State Govt'].map(f => (
              <button 
                key={f}
                onClick={() => handlePillClick(f)}
                className={`border-[1.5px] rounded-full py-[5px] px-3.5 text-xs font-semibold cursor-pointer transition-all ${
                  activeFilter === f 
                    ? 'bg-[var(--blue2)] text-white border-[var(--blue2)]' 
                    : 'bg-white text-[var(--muted)] border-[var(--border)] hover:bg-[var(--blue2)] hover:text-white hover:border-[var(--blue2)]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* JOB CARDS */}
          {isLoading ? (
             <div className="space-y-4">
               {[...Array(5)].map((_, i) => (
                 <div key={i} className="bg-white rounded-[10px] border-[1.5px] border-[var(--border)] p-4 animate-pulse">
                   <div className="h-6 bg-gray-200 rounded w-1/2 mb-3"></div>
                   <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                   <div className="h-4 bg-gray-200 rounded w-full"></div>
                 </div>
               ))}
             </div>
          ) : jobsData?.jobs?.length ? (
            jobsData.jobs.map((job, idx) => {
              const theme = getJobTheme(job);
              return (
                <div key={job.id}>
                  {idx > 0 && idx % 3 === 0 && (
                    <AdUnit type="infeed" className="bg-[#fef9ee] border border-dashed border-[#e5d89a] rounded-lg h-[100px] mb-2.5 flex items-center justify-center text-[#a08c3a] text-[11px] font-semibold">
                      <span>🎯 In-Feed Native Ad</span>
                    </AdUnit>
                  )}
                  <div className="bg-white rounded-[10px] border-[1.5px] border-[var(--border)] border-l-4 p-3.5 mb-2.5 transition-all hover:shadow-[0_4px_20px_rgba(37,99,235,0.12)] hover:border-y-[var(--blue2)] hover:border-r-[var(--blue2)]" style={{ borderLeftColor: theme.color }}>
                    <div className="flex items-start gap-3">
                      <div className="w-[42px] h-[42px] rounded-lg bg-[var(--bg)] border-[1.5px] border-[var(--border)] flex items-center justify-center text-[20px] shrink-0">
                        {theme.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex gap-1.5 items-center mb-1">
                          {idx === 0 && <span className="text-[10px] font-bold rounded px-1.5 py-[2px] uppercase tracking-[.4px] bg-[#fee2e2] text-[var(--red)]">🔥 Hot</span>}
                          <span className="text-[10px] font-bold rounded px-1.5 py-[2px] uppercase tracking-[.4px]" style={{ backgroundColor: theme.bg, color: theme.txt }}>✅ Active</span>
                        </div>
                        <div className="font-['Syne'] text-sm font-bold text-[var(--text)] mb-0.5 leading-[1.3] truncate whitespace-normal line-clamp-2">{job.title}</div>
                        <div className="text-xs text-[var(--muted)] mb-1.5">{job.department} • {job.location || 'All India'}</div>
                        <div className="flex flex-wrap gap-2.5 items-center">
                          {job.positions && <span className="flex items-center gap-1 text-[11px] text-[var(--muted)] font-semibold">👥 {job.positions} Posts</span>}
                          <span className="flex items-center gap-1 text-[11px] text-[var(--muted)] font-semibold">🎓 {job.qualification}</span>
                          <span className="flex items-center gap-1 text-[11px] text-[var(--muted)] font-semibold">📍 {job.location}</span>
                          {job.salary && <span className="flex items-center gap-1 text-[11px] text-[var(--muted)] font-semibold">💰 {job.salary}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-[var(--border)]">
                      <span className="text-[11px] font-bold text-[var(--red)] flex items-center gap-1">⏰ Last Date: {job.deadline}</span>
                      <div className="flex gap-2">
                        <button className="bg-transparent text-[var(--muted)] border-[1.5px] border-[var(--border)] rounded-md py-[7px] px-2.5 text-sm cursor-pointer transition-colors hover:border-[var(--amber)] hover:text-[var(--amber)]" onClick={(e) => { e.stopPropagation(); setJobToTrack(job); setShowJobTracker(true); }}>
                          🔔
                        </button>
                        <button className="bg-[var(--blue2)] text-white border-none rounded-md px-4 py-[7px] text-xs font-bold cursor-pointer transition-colors hover:bg-[var(--blue)]" onClick={() => setSelectedJob(job)}>
                          View Details →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
             <div className="bg-white rounded-lg border border-[var(--border)] p-12 text-center my-5">
               <p className="text-[var(--muted)] text-lg font-semibold">No jobs found matching your criteria</p>
               <p className="text-[var(--muted)]/70 mt-2 text-sm">Try adjusting your search or filters</p>
             </div>
          )}

          {/* RESULTS SECTION */}
          <div className="mt-6">
            <div className="font-['Syne'] text-base font-extrabold text-[var(--blue)] mb-3 flex items-center gap-2 after:content-[''] after:flex-1 after:h-[2px] after:bg-gradient-to-r after:from-[var(--blue2)] after:to-transparent after:rounded-sm">
              📊 Recent Results & Merit Lists
            </div>
            
            <div className="bg-white rounded-[10px] border-[1.5px] border-[var(--border)] p-3 px-4 mb-2.5 flex items-center gap-3">
              <span className="text-[22px]">📋</span>
              <div className="flex-1">
                <div className="text-[13px] font-bold">SSC CHSL 2024 Final Result — Declared</div>
                <div className="text-[11px] text-[var(--muted)] mt-0.5">Staff Selection Commission • 4 June 2026</div>
              </div>
              <span className="text-[10px] font-bold px-2 py-[3px] rounded bg-[#dcfce7] text-[var(--green)]">✅ Declared</span>
            </div>
            
            <div className="bg-white rounded-[10px] border-[1.5px] border-[var(--border)] p-3 px-4 mb-2.5 flex items-center gap-3">
              <span className="text-[22px]">🏦</span>
              <div className="flex-1">
                <div className="text-[13px] font-bold">IBPS PO 2025 Main Result — Expected Soon</div>
                <div className="text-[11px] text-[var(--muted)] mt-0.5">Institute of Banking Personnel Selection • June 2026</div>
              </div>
              <span className="text-[10px] font-bold px-2 py-[3px] rounded bg-[#fef3c7] text-[#92400e]">⏳ Expected</span>
            </div>
            
            <div className="bg-white rounded-[10px] border-[1.5px] border-[var(--border)] p-3 px-4 mb-2.5 flex items-center gap-3">
              <span className="text-[22px]">🚆</span>
              <div className="flex-1">
                <div className="text-[13px] font-bold">RRB Group D CBT Result 2025 — Declared</div>
                <div className="text-[11px] text-[var(--muted)] mt-0.5">Railway Recruitment Board • 1 June 2026</div>
              </div>
              <span className="text-[10px] font-bold px-2 py-[3px] rounded bg-[#dcfce7] text-[var(--green)]">✅ Declared</span>
            </div>
          </div>
          
        </div>

        {/* ═══ SIDEBAR ═══ */}
        <div className="hidden lg:flex flex-col gap-4">
          <AdUnit type="sidebar" className="bg-[#fef9ee] border border-dashed border-[#e5d89a] rounded-lg h-[600px] flex items-center justify-center text-[#a08c3a] text-[11px] font-semibold">
            <span>📌 Sticky Sidebar Ad (300×600)</span>
          </AdUnit>

          <div className="bg-gradient-to-br from-[#1a3fa8] to-[#2563eb] rounded-[10px] p-4 text-center text-white">
            <h3 className="font-['Syne'] text-[15px] font-extrabold mb-1.5">🔔 Free Job Alerts</h3>
            <p className="text-[11px] opacity-85 mb-3">Get instant WhatsApp/Email alerts for jobs matching your qualification</p>
            <input className="w-full p-2 rounded-md border-none text-[13px] mb-2 outline-none font-sans text-black" type="text" placeholder="Your Email or WhatsApp" />
            <button className="w-full bg-[var(--amber)] text-white border-none rounded-md py-[9px] font-bold text-[13px] cursor-pointer" onClick={() => setShowJobAlerts(true)}>Subscribe Free →</button>
          </div>

          <div className="bg-white rounded-[10px] border-[1.5px] border-[var(--border)] overflow-hidden">
            <div className="bg-[var(--blue)] text-white py-2.5 px-3.5 font-['Syne'] text-[13px] font-bold tracking-[.3px]">🔥 Trending Searches</div>
            <div className="flex flex-col">
              <a className="flex items-center gap-2.5 py-2.5 px-3.5 border-b border-[var(--border)] hover:bg-[var(--bg)] cursor-pointer">
                <span className="text-[11px] font-extrabold text-[var(--blue2)] min-w-[18px]">01</span>
                <span className="text-xs font-semibold flex-1">RRB NTPC 2025 Apply Online</span>
                <span className="text-[10px] font-bold text-[var(--green)] bg-[#dcfce7] rounded px-1.5 py-[1px]">Hot</span>
              </a>
              <a className="flex items-center gap-2.5 py-2.5 px-3.5 border-b border-[var(--border)] hover:bg-[var(--bg)] cursor-pointer">
                <span className="text-[11px] font-extrabold text-[var(--blue2)] min-w-[18px]">02</span>
                <span className="text-xs font-semibold flex-1">SSC CGL 2026 Syllabus</span>
              </a>
              <a className="flex items-center gap-2.5 py-2.5 px-3.5 border-b border-[var(--border)] hover:bg-[var(--bg)] cursor-pointer">
                <span className="text-[11px] font-extrabold text-[var(--blue2)] min-w-[18px]">03</span>
                <span className="text-xs font-semibold flex-1">SBI PO Admit Card 2026</span>
                <span className="text-[10px] font-bold text-[var(--green)] bg-[#dcfce7] rounded px-1.5 py-[1px]">New</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE BOTTOM NAV */}
      <nav className="lg:hidden fixed bottom-[56px] left-0 right-0 bg-[var(--blue)] z-[190]">
        <div className="flex justify-around">
          <a onClick={() => setLocation('/')} className="flex-1 text-center text-[var(--amber)] no-underline p-[10px_4px] text-[10px] font-semibold flex flex-col items-center gap-0.5 cursor-pointer">
            <span className="text-lg">🏠</span>Home
          </a>
          <a onClick={() => setLocation('/jobs')} className="flex-1 text-center text-white/70 no-underline p-[10px_4px] text-[10px] font-semibold flex flex-col items-center gap-0.5 transition-colors hover:text-[var(--amber)] cursor-pointer">
            <span className="text-lg">📋</span>Jobs
          </a>
          <a onClick={() => setLocation('/exams')} className="flex-1 text-center text-white/70 no-underline p-[10px_4px] text-[10px] font-semibold flex flex-col items-center gap-0.5 transition-colors hover:text-[var(--amber)] cursor-pointer">
            <span className="text-lg">📄</span>Admit
          </a>
          <a onClick={() => setShowJobAlerts(true)} className="flex-1 text-center text-white/70 no-underline p-[10px_4px] text-[10px] font-semibold flex flex-col items-center gap-0.5 transition-colors hover:text-[var(--amber)] cursor-pointer">
            <span className="text-lg">🔔</span>Alerts
          </a>
        </div>
      </nav>

      {/* MODALS AND BACKGROUND LOGIC */}
      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          isOpen={!!selectedJob}
          onClose={() => setSelectedJob(null)}
          onTrack={() => {
             setJobToTrack(selectedJob);
             setShowJobTracker(true);
          }}
        />
      )}
      
      {showComparison && compareJobs.length > 0 && (
        <JobComparison
          jobs={compareJobs}
          onRemove={(jobId) => {
            const newCompareJobs = compareJobs.filter(j => j.id !== jobId);
            setCompareJobs(newCompareJobs);
            if (newCompareJobs.length === 0) {
              setShowComparison(false);
            }
          }}
          onClose={() => {
            setShowComparison(false);
            setCompareJobs([]);
          }}
        />
      )}
      
      <JobAlerts
        isOpen={showJobAlerts}
        onClose={() => setShowJobAlerts(false)}
      />
      
      <JobTracker
        isOpen={showJobTracker}
        onClose={() => {
          setShowJobTracker(false);
          setJobToTrack(undefined);
        }}
        jobToAdd={jobToTrack}
      />
      
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onSave={saveProfile}
        initialProfile={profile}
      />
    </div>
  );
}
"""
    
    final_content = top_part + new_ui
    with open('client/src/pages/home.tsx', 'w', encoding='utf-8') as f:
        f.write(final_content)
    
    print("Successfully replaced home.tsx keeping Modals")

generate_home_tsx()
