import { AdUnit } from "./ad-unit";

export function PortalSidebar() {
  return (
    <div className="flex flex-col gap-4">
      {/* STICKY AD */}
      <AdUnit type="sidebar-large">
        <span>📌 Sticky Sidebar Ad</span>
        <span>300×600 · Half Page</span>
        <span className="text-[10px] opacity-70">Sticky scroll = 40–60% more viewability</span>
      </AdUnit>

      {/* JOB ALERT BOX */}
      <div className="bg-gradient-to-br from-[var(--blue)] to-[var(--blue2)] rounded-[10px] p-4 text-center text-white">
        <h3 className="font-[Syne] text-[15px] font-extrabold mb-1.5">🔔 Free Job Alerts</h3>
        <p className="text-[11px] opacity-85 mb-3">Get instant WhatsApp/Email alerts for jobs matching your qualification</p>
        <input 
          className="w-full p-[8px_10px] rounded-md border-none text-[13px] mb-2 outline-none font-[Noto_Sans] text-black" 
          type="text" 
          placeholder="Your Email or WhatsApp" 
        />
        <button className="w-full bg-[var(--amber)] text-white border-none rounded-md p-[9px] font-bold text-[13px] cursor-pointer hover:opacity-90">
          Subscribe Free →
        </button>
      </div>

      {/* TRENDING */}
      <div className="bg-[var(--card)] rounded-[10px] border-[1.5px] border-[var(--border)] overflow-hidden">
        <div className="bg-[var(--blue)] text-white p-[10px_14px] font-[Syne] text-[13px] font-bold tracking-[.3px]">
          🔥 Trending Searches
        </div>
        <div className="p-0">
          <a className="flex items-center gap-2.5 p-[10px_14px] border-b border-[var(--border)] no-underline text-[var(--text)] transition-colors hover:bg-[var(--bg)]" href="#">
            <span className="text-[11px] font-extrabold text-[var(--blue2)] min-w-[18px]">01</span>
            <span className="text-[12px] font-semibold flex-1">RRB NTPC 2025 Apply Online</span>
            <span className="text-[10px] font-bold text-[var(--green)] bg-[#dcfce7] rounded px-[5px] py-[1px]">Hot</span>
          </a>
          <a className="flex items-center gap-2.5 p-[10px_14px] border-b border-[var(--border)] no-underline text-[var(--text)] transition-colors hover:bg-[var(--bg)]" href="#">
            <span className="text-[11px] font-extrabold text-[var(--blue2)] min-w-[18px]">02</span>
            <span className="text-[12px] font-semibold flex-1">SSC CGL 2026 Syllabus</span>
          </a>
          <a className="flex items-center gap-2.5 p-[10px_14px] border-b border-[var(--border)] no-underline text-[var(--text)] transition-colors hover:bg-[var(--bg)]" href="#">
            <span className="text-[11px] font-extrabold text-[var(--blue2)] min-w-[18px]">03</span>
            <span className="text-[12px] font-semibold flex-1">SBI PO Admit Card 2026</span>
            <span className="text-[10px] font-bold text-[var(--green)] bg-[#dcfce7] rounded px-[5px] py-[1px]">New</span>
          </a>
          <a className="flex items-center gap-2.5 p-[10px_14px] border-b border-[var(--border)] no-underline text-[var(--text)] transition-colors hover:bg-[var(--bg)]" href="#">
            <span className="text-[11px] font-extrabold text-[var(--blue2)] min-w-[18px]">04</span>
            <span className="text-[12px] font-semibold flex-1">UPSC Prelims 2026 Answer Key</span>
          </a>
          <a className="flex items-center gap-2.5 p-[10px_14px] no-underline text-[var(--text)] transition-colors hover:bg-[var(--bg)]" href="#">
            <span className="text-[11px] font-extrabold text-[var(--blue2)] min-w-[18px]">05</span>
            <span className="text-[12px] font-semibold flex-1">Army Agniveer Recruitment 2026</span>
          </a>
        </div>
      </div>

      {/* UPCOMING EXAMS */}
      <div className="bg-[var(--card)] rounded-[10px] border-[1.5px] border-[var(--border)] overflow-hidden">
        <div className="bg-[var(--blue)] text-white p-[10px_14px] font-[Syne] text-[13px] font-bold tracking-[.3px]">
          📅 Upcoming Exam Dates
        </div>
        <div className="p-0">
          <a className="flex items-center gap-2.5 p-[10px_14px] border-b border-[var(--border)] no-underline text-[var(--text)] transition-colors hover:bg-[var(--bg)]" href="#">
            <span className="text-[11px] font-extrabold text-[var(--red)] min-w-[18px]">08</span>
            <span className="text-[12px] font-semibold flex-1">RRB NTPC CBT-1 · Jun</span>
          </a>
          <a className="flex items-center gap-2.5 p-[10px_14px] border-b border-[var(--border)] no-underline text-[var(--text)] transition-colors hover:bg-[var(--bg)]" href="#">
            <span className="text-[11px] font-extrabold text-[var(--red)] min-w-[18px]">15</span>
            <span className="text-[12px] font-semibold flex-1">IBPS RRB PO · Jun</span>
          </a>
          <a className="flex items-center gap-2.5 p-[10px_14px] border-b border-[var(--border)] no-underline text-[var(--text)] transition-colors hover:bg-[var(--bg)]" href="#">
            <span className="text-[11px] font-extrabold text-[var(--blue2)] min-w-[18px]">22</span>
            <span className="text-[12px] font-semibold flex-1">SSC CGL Tier-1 · Jul</span>
          </a>
          <a className="flex items-center gap-2.5 p-[10px_14px] no-underline text-[var(--text)] transition-colors hover:bg-[var(--bg)]" href="#">
            <span className="text-[11px] font-extrabold text-[var(--blue2)] min-w-[18px]">01</span>
            <span className="text-[12px] font-semibold flex-1">UPSC Mains · Sep</span>
          </a>
        </div>
      </div>

      {/* SECOND SIDEBAR AD */}
      <AdUnit type="sidebar-med">
        <span>📌 Sidebar Ad #2</span>
        <span>300×250 · Medium Rectangle</span>
        <span className="text-[10px] opacity-70">High fill rate on desktop</span>
      </AdUnit>

    </div>
  );
}
