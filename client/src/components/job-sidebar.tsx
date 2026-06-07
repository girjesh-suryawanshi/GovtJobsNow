import { Link } from "wouter";
import { 
  BellRing, TrendingUp, Calendar, MapPin, 
  FileText, CheckCircle2, ChevronRight, Share2, 
  Search, ShieldCheck, Target, Download 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function JobSidebar({ className = "" }: { className?: string }) {
  return (
    <aside className={`w-full ${className}`}>
      <div className="sticky top-6 flex flex-col gap-6">
        
        {/* SIDEBAR SECTION 1: Top Advertisement Block (300x600) */}
        <div className="bg-gray-50 border border-gray-200 rounded-[20px] p-4 flex flex-col items-center justify-center text-center shadow-sm h-[600px] overflow-hidden">
          <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Advertisement</p>
          <div className="w-full h-full border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-gray-100/50">
            <span className="text-gray-400 font-medium text-sm">300 × 600<br/>Sticky Sidebar</span>
          </div>
        </div>

        {/* SIDEBAR SECTION 2: Free Job Alert Card */}
        <div className="bg-gradient-to-br from-blue-900 to-[var(--gjn-blue)] rounded-[20px] p-6 text-white shadow-xl shadow-blue-900/20 relative overflow-hidden">
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
        <div className="bg-white border border-gray-100 rounded-[20px] p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
            <div className="p-1.5 bg-red-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-red-500" />
            </div>
            <h3 className="text-lg font-syne font-bold text-gray-900">🔥 Trending Searches</h3>
          </div>
          <div className="flex flex-col gap-4">
            {[
              { id: "01", text: "SSC MTS 2027 Apply Online", badge: "HOT", color: "bg-red-500" },
              { id: "02", text: "SSC CGL 2027 Syllabus", badge: "NEW", color: "bg-blue-500" },
              { id: "03", text: "SBI PO Admit Card 2026", badge: "", color: "" },
              { id: "04", text: "UPSC Prelims 2027 Answer Key", badge: "TRENDING", color: "bg-amber-500" },
              { id: "05", text: "Army Agniveer Recruitment", badge: "", color: "" },
            ].map((item, i) => (
              <a href="#" key={i} className="flex items-start gap-3 group">
                <span className="text-sm font-black text-gray-300 group-hover:text-[var(--gjn-blue)] transition-colors">{item.id}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700 group-hover:text-[var(--gjn-blue)] transition-colors leading-tight">
                    {item.text}
                  </p>
                  {item.badge && (
                    <span className={`inline-block mt-1.5 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest text-white ${item.color}`}>
                      {item.badge}
                    </span>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* SIDEBAR SECTION 4: Upcoming Exam Dates */}
        <div className="bg-white border border-gray-100 rounded-[20px] p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
            <div className="p-1.5 bg-purple-50 rounded-lg">
              <Calendar className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-syne font-bold text-gray-900">📅 Upcoming Exam Dates</h3>
          </div>
          <div className="flex flex-col gap-3">
            {[
              { exam: "IBPS RRB Clerk", date: "Jun" },
              { exam: "SSC CGL Tier 1", date: "Jul" },
              { exam: "UPSC CDS", date: "Aug" },
              { exam: "JEE Main", date: "Sep" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 cursor-pointer">
                <span className="text-sm font-medium text-gray-800">{item.exam}</span>
                <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 border-none rounded-lg px-2.5 py-1 text-xs font-bold">
                  {item.date}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* SIDEBAR SECTION 5: Second Advertisement (300x250) */}
        <div className="bg-gray-50 border border-gray-200 rounded-[20px] p-4 flex flex-col items-center justify-center text-center shadow-sm h-[250px] overflow-hidden">
          <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Advertisement</p>
          <div className="w-full h-full border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-gray-100/50">
            <span className="text-gray-400 font-medium text-sm">300 × 250<br/>Medium Rectangle</span>
          </div>
        </div>

        {/* SIDEBAR SECTION 6: Quick Tools */}
        <div className="bg-white border border-gray-100 rounded-[20px] p-6 shadow-sm">
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
        <div className="bg-white border border-gray-100 rounded-[20px] p-6 shadow-sm">
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
        <div className="bg-white border border-gray-100 rounded-[20px] p-6 shadow-sm">
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
