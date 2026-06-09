import { Link } from "wouter";
import { 
  BellRing, TrendingUp, Calendar, MapPin, 
  FileText, CheckCircle2, ChevronRight, Share2, 
  Search, ShieldCheck, Target, Download, ExternalLink
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AdUnit } from "@/components/ad-unit";
import { useQuery } from "@tanstack/react-query";
import { Job, Exam } from "@shared/schema";

export function JobSidebar({ className = "", job }: { className?: string, job?: any }) {
  const { data: trendingJobs = [] } = useQuery<Job[]>({
    queryKey: ["/api/jobs/trending"],
    queryFn: () => fetch("/api/jobs/trending").then((res) => res.json()),
  });

  const { data: allExams = [] } = useQuery<Exam[]>({
    queryKey: ["/api/exams"],
    queryFn: () => fetch("/api/exams").then((res) => res.json()),
  });

  // Process and sort upcoming exams (limit to 4)
  const upcomingExams = allExams
    .filter((exam) => {
      if (!exam.examDate) return false;
      const date = new Date(exam.examDate);
      return date >= new Date(new Date().setHours(0, 0, 0, 0)); // Only future/today dates
    })
    .sort((a, b) => new Date(a.examDate!).getTime() - new Date(b.examDate!).getTime())
    .slice(0, 4);

  return (
    <aside className={`w-full ${className}`}>
      <div className="sticky top-6 flex flex-col gap-6">
        
        {/* SIDEBAR SECTION 1: Top Advertisement Block (300x600) */}
        <AdUnit slot="job-sidebar-top" className="bg-gray-50 border-[1.5px] border-gray-100 rounded-[20px] shadow-sm w-full" label="Advertisement" />

        {/* NEW SIDEBAR SECTION 0: Application Status (Only shown if job exists) */}
        {job && (
          <div className="bg-white border-[1.5px] border-gray-100 rounded-[20px] p-6 flex flex-col gap-5 shadow-sm w-full">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Application Status</h3>
            
            <div className="flex flex-col gap-4">
              <button 
                className="w-full h-[52px] rounded-xl text-[15px] font-bold bg-[var(--gjn-blue2)] text-white hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center gap-2"
                onClick={() => window.open(job.sourceUrl || '#', '_blank')}
              >
                Apply Online <ExternalLink className="h-4 w-4" />
              </button>
              
              <button 
                className="w-full h-[52px] rounded-xl text-[15px] font-bold bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                onClick={() => window.open(job.notificationFileUrl || job.sourceUrl || '#', '_blank')}
              >
                Official Notification <ExternalLink className="h-4 w-4" />
              </button>
              
              <button 
                className="w-full h-12 rounded-xl text-sm font-bold bg-white text-[var(--gjn-blue2)] hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: job.title,
                      url: window.location.href,
                    }).catch(console.error);
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Link copied to clipboard!");
                  }
                }}
              >
                <Share2 className="h-4 w-4" /> Share Openings
              </button>
            </div>

            <hr className="border-gray-100 my-1" />
            
            <div className="flex flex-col gap-2">
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Registration Deadline</h3>
              <div className="bg-red-400/80 text-white rounded-xl py-4 px-4 font-black text-xl text-center shadow-sm">
                {job.deadline || "Check Notice"}
              </div>
            </div>

            <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-5 mt-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-orange-500 mb-1.5">Note</p>
              <p className="text-xs font-bold text-orange-800/80 leading-relaxed">
                Always verify details on the official government portal before making any payment.
              </p>
            </div>
          </div>
        )}

        {/* SIDEBAR SECTION 2: Free Job Alert Card */}
        <div className="bg-gradient-to-br from-blue-900 to-[var(--gjn-blue)] rounded-[20px] p-6 text-white shadow-sm relative overflow-hidden w-full">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-xl">
                <BellRing className="h-6 w-6 text-amber-300" />
              </div>
              <h3 className="text-xl font-syne font-bold">🚀 Free Job Alerts</h3>
            </div>
            <p className="text-blue-100 text-sm font-medium leading-relaxed mb-6">
              Get Instant WhatsApp, Email alerts for jobs matching your qualification.
            </p>
            <button className="w-full h-12 rounded-xl bg-amber-400 hover:bg-amber-500 text-blue-950 font-bold flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-amber-400/20">
              Subscribe Free <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* SIDEBAR SECTION 3: Trending Searches */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm w-full">
          <div className="bg-[#1c3f94] px-4 py-3.5 flex items-center gap-2">
            <span className="text-[18px]">🔥</span>
            <h3 className="text-[16px] font-bold text-white whitespace-nowrap tracking-wide">
              Trending Searches
            </h3>
          </div>
          <div className="flex flex-col">
            {trendingJobs.slice(0, 5).map((tJob, i, arr) => (
              <Link href={`/job/${tJob.slug}`} key={tJob.id}>
                <a className={`flex items-center gap-4 px-4 py-3.5 hover:bg-gray-50 transition-colors ${i !== arr.length - 1 ? 'border-b border-gray-100' : ''}`}>
                  <span className="text-[14px] font-bold text-blue-600 w-5 text-center shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="flex-1 text-[14px] font-bold text-gray-900 truncate">
                    {tJob.title}
                  </span>
                  {i < 2 && (
                    <span className="px-2 py-0.5 rounded bg-[#dcfce7] text-[#166534] text-[12px] font-semibold shrink-0">
                      Hot
                    </span>
                  )}
                </a>
              </Link>
            ))}
            {trendingJobs.length === 0 && (
              <div className="px-4 py-6 text-center text-sm text-gray-500 font-medium">Loading trending jobs...</div>
            )}
          </div>
        </div>

        {/* SIDEBAR SECTION 4: Upcoming Exam Dates */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm w-full">
          <div className="bg-[#1c3f94] px-4 py-3.5 flex items-center gap-2">
            <Calendar className="h-[18px] w-[18px] text-white/80" />
            <h3 className="text-[16px] font-bold text-white whitespace-nowrap tracking-wide">
              Upcoming Exam Dates
            </h3>
          </div>
          <div className="flex flex-col">
            {upcomingExams.map((exam, i, arr) => {
              const date = new Date(exam.examDate!);
              const day = String(date.getDate()).padStart(2, '0');
              const month = date.toLocaleDateString('en-US', { month: 'short' });
              const isVerySoon = (date.getTime() - new Date().getTime()) < (14 * 24 * 60 * 60 * 1000); // within 14 days
              
              return (
                <Link href={`/exam/${exam.slug}`} key={exam.id}>
                  <a className={`flex items-center gap-4 px-4 py-3.5 hover:bg-gray-50 transition-colors ${i !== arr.length - 1 ? 'border-b border-gray-100' : ''}`}>
                    <span className={`text-[14px] font-bold w-5 text-center shrink-0 ${isVerySoon ? 'text-red-600' : 'text-blue-600'}`}>
                      {day}
                    </span>
                    <span className="flex-1 text-[14px] font-bold text-gray-900 truncate">
                      {exam.title} • {month}
                    </span>
                  </a>
                </Link>
              );
            })}
            {upcomingExams.length === 0 && (
              <div className="px-4 py-6 text-center text-sm text-gray-500 font-medium">No upcoming exams found.</div>
            )}
          </div>
        </div>

        {/* SIDEBAR SECTION 5: Second Advertisement (300x250) */}
        <AdUnit slot="job-sidebar-middle" className="bg-gray-50 border-[1.5px] border-gray-100 rounded-[20px] shadow-sm w-full" label="Advertisement" />

        {/* SIDEBAR SECTION 6: Quick Tools */}
        <div className="bg-white border-[1.5px] border-gray-100 rounded-[20px] p-6 shadow-sm w-full">
          <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4">Quick Tools</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Track Application", icon: <Target className="h-4 w-4" />, color: "text-blue-500", bg: "bg-blue-50" },
              { label: "Exam Calendar", icon: <Calendar className="h-4 w-4" />, color: "text-purple-500", bg: "bg-purple-50" },
              { label: "Latest Results", icon: <CheckCircle2 className="h-4 w-4" />, color: "text-green-500", bg: "bg-green-50" },
              { label: "Admit Cards", icon: <FileText className="h-4 w-4" />, color: "text-amber-500", bg: "bg-amber-50" },
              { label: "Syllabus", icon: <Search className="h-4 w-4" />, color: "text-rose-500", bg: "bg-rose-50" },
              { label: "Answer Keys", icon: <ShieldCheck className="h-4 w-4" />, color: "text-teal-500", bg: "bg-teal-50" },
            ].map((tool, i) => (
              <a href="#" key={i} className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-gray-100 hover:border-gray-300 hover:shadow-sm transition-all text-center group bg-white">
                <div className={`p-2 rounded-lg ${tool.bg} ${tool.color} group-hover:scale-110 transition-transform`}>
                  {tool.icon}
                </div>
                <span className="text-[11px] font-bold text-gray-700 leading-tight">{tool.label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* SIDEBAR SECTION 7: Popular Job Categories */}
        <div className="bg-white border-[1.5px] border-gray-100 rounded-[20px] p-6 shadow-sm w-full">
          <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4">Popular Categories</h3>
          <div className="flex flex-wrap gap-2">
            {[
              "SSC Jobs", "Railway Jobs", "Bank Jobs", 
              "UPSC Jobs", "Teaching Jobs", "Defence Jobs", 
              "State Govt Jobs", "Police Jobs"
            ].map((cat, i) => (
              <a href={`#${cat.replace(/\s+/g, '-').toLowerCase()}`} key={i}>
                <Badge className="bg-gray-100 text-gray-700 hover:bg-[var(--gjn-blue)] hover:text-white border-none rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer">
                  {cat}
                </Badge>
              </a>
            ))}
          </div>
        </div>

        {/* SIDEBAR SECTION 8: Important Links */}
        <div className="bg-white border-[1.5px] border-gray-100 rounded-[20px] p-6 shadow-sm w-full">
          <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4">Important Links</h3>
          <div className="flex flex-col gap-2">
            {[
              "Latest Jobs", "Latest Results", "Latest Admit Cards", 
              "Exam Calendar", "Government Schemes", "Current Affairs"
            ].map((link, i) => (
              <a href="#" key={i} className="flex items-center gap-2 py-2 text-sm font-medium text-gray-600 hover:text-[var(--gjn-blue)] hover:translate-x-1 transition-all">
                <ChevronRight className="h-4 w-4 opacity-50" />
                {link}
              </a>
            ))}
          </div>
        </div>

      </div>
    </aside>
  );
}
