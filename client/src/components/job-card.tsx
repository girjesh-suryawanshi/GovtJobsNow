import { useState } from "react";
import { Bookmark, Share2, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import OrganizationLogo from "@/components/organization-logo";
import { useToast } from "@/hooks/use-toast";
import type { Job } from "@/types/job";
import { useUserProfile } from "@/hooks/use-user-profile";
import { checkEligibility } from "@/lib/eligibility-utils";
import SocialShare from "@/components/social-share";

interface JobCardProps {
  job: Job;
  onClick: () => void;
  onCompare?: () => void;
  onTrack?: () => void;
  isComparing?: boolean;
}

export default function JobCard({ job, onClick, onCompare, onTrack, isComparing = false }: JobCardProps) {
  const [isSaved, setIsSaved] = useState(false);
  const { profile } = useUserProfile();
  const { toast } = useToast();

  const eligibility = checkEligibility(job, profile);
  const showEligibility = profile !== null;

  // ─── Deadline helpers ───────────────────────────────────────────
  const getDaysLeft = (deadline: string) => {
    const d = new Date(deadline);
    if (isNaN(d.getTime())) return null;
    const diff = Math.ceil((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const daysLeft = getDaysLeft(job.deadline);
  const isExpired = daysLeft !== null && daysLeft <= 0;
  const isUrgent  = daysLeft !== null && daysLeft > 0 && daysLeft <= 3;

  // ─── Border accent logic ─────────────────────────────────────────
  const cardBorderClass =
    isExpired               ? "border-std" :
    isUrgent                ? "border-hot"  :
    daysLeft !== null && daysLeft <= 7 ? "border-feat" : "border-new";

  // ─── Badges ─────────────────────────────────────────────────────
  const badgeEl = isExpired ? (
    <span className="gjn-badge gjn-badge-exp">Closed</span>
  ) : isUrgent ? (
    <>
      <span className="gjn-badge gjn-badge-hot">🔥 Hot</span>
      <span className="gjn-badge gjn-badge-last">Last {daysLeft}d</span>
    </>
  ) : daysLeft !== null && daysLeft <= 7 ? (
    <span className="gjn-badge gjn-badge-feat">⭐ Featured</span>
  ) : (
    <span className="gjn-badge gjn-badge-new">✅ New</span>
  );

  // ─── Eligibility strip color ─────────────────────────────────────
  const eligStyle = eligibility.isEligible
    ? { background: '#f0fdf4', borderColor: '#bbf7d0', color: '#15803d' }
    : { background: '#fff1f2', borderColor: '#fecdd3', color: '#be123c' };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
    toast({ title: isSaved ? "Removed from Watchlist" : "Saved to Watchlist", description: job.title });
  };

  return (
    <div
      className={`gjn-job-card animate-fade-up ${cardBorderClass}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      aria-label={`View details for ${job.title}`}
    >
      {/* ─── TOP ROW ─── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <div className="org-icon">
          <OrganizationLogo
            department={job.department}
            recruitingOrganization={job.recruitingOrganization}
            className="h-7 w-7"
          />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Badge row */}
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '5px', flexWrap: 'wrap' }}>
            {badgeEl}
          </div>

          {/* Title */}
          <h3
            className="line-clamp-2"
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: '14px', fontWeight: 700,
              color: 'var(--gjn-text)', lineHeight: '1.35', marginBottom: '2px',
            }}
          >
            {job.title}
          </h3>

          {/* Org / location */}
          <p style={{ fontSize: '12px', color: 'var(--gjn-muted)', marginBottom: '7px' }}>
            {job.department} • {job.location}
          </p>

          {/* Meta chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {job.positions && (
              <span className="meta-chip">👥 {job.positions} Posts</span>
            )}
            <span className="meta-chip">🎓 {job.qualification}</span>
            <span className="meta-chip">📍 {job.location}</span>
            {job.salary && (
              <span className="meta-chip">💰 {job.salary}</span>
            )}
          </div>
        </div>
      </div>

      {/* ─── ELIGIBILITY STRIP ─── */}
      {showEligibility && (
        <div
          style={{
            marginTop: '10px', padding: '6px 10px', borderRadius: '6px',
            border: '1px solid', ...eligStyle,
            fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px',
          }}
        >
          {eligibility.isEligible ? '✅' : '❌'}
          {eligibility.isEligible ? 'You are eligible for this position' : eligibility.reason || 'You may not meet all criteria'}
        </div>
      )}

      {/* ─── FOOTER BAR ─── */}
      <div className="card-footer-bar">
        <span className={`deadline-text ${isExpired ? 'expired' : ''}`}>
          ⏰ {isExpired ? 'Closed' : `Last Date: ${job.deadline}`}
        </span>

        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {/* Save */}
          <button
            onClick={handleSave}
            title={isSaved ? 'Remove from watchlist' : 'Save job'}
            style={{
              background: 'transparent', border: '1.5px solid var(--gjn-border)',
              borderRadius: '6px', padding: '5px 9px', cursor: 'pointer',
              fontSize: '14px', lineHeight: 1,
              color: isSaved ? '#f59e0b' : 'var(--gjn-muted)',
              borderColor: isSaved ? '#f59e0b' : undefined,
              transition: 'all 0.15s',
            }}
            aria-label="Save job"
          >
            {isSaved ? '🔔' : '🔔'}
          </button>

          {/* Share */}
          <SocialShare
            url={`${window.location.origin}/job/${job.slug || job.id}`}
            title={job.title}
            trigger={
              <button
                onClick={(e) => e.stopPropagation()}
                style={{
                  background: 'transparent', border: '1.5px solid var(--gjn-border)',
                  borderRadius: '6px', padding: '5px 9px', cursor: 'pointer',
                  fontSize: '13px', color: 'var(--gjn-muted)', transition: 'all 0.15s',
                }}
                aria-label="Share job"
              >
                <Share2 className="h-3.5 w-3.5" />
              </button>
            }
          />

          {/* Track */}
          {onTrack && (
            <button
              onClick={(e) => { e.stopPropagation(); onTrack(); }}
              style={{
                background: 'transparent', border: '1.5px solid var(--gjn-border)',
                borderRadius: '6px', padding: '5px 9px', cursor: 'pointer',
                fontSize: '12px', fontWeight: 600, color: 'var(--gjn-muted)',
                transition: 'all 0.15s',
              }}
              title="Track Application"
              aria-label="Track application"
            >
              <Target className="h-3.5 w-3.5" />
            </button>
          )}

          {/* View Details CTA */}
          <button
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            disabled={isExpired}
            style={{
              background: isExpired ? '#94a3b8' : 'var(--gjn-blue2)',
              color: '#fff', border: 'none', borderRadius: '6px',
              padding: '7px 16px', fontSize: '12px', fontWeight: 700,
              cursor: isExpired ? 'not-allowed' : 'pointer',
              transition: 'background 0.15s', whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => { if (!isExpired) e.currentTarget.style.background = 'var(--gjn-blue)'; }}
            onMouseLeave={(e) => { if (!isExpired) e.currentTarget.style.background = 'var(--gjn-blue2)'; }}
          >
            {isExpired ? 'Closed' : 'View Details →'}
          </button>
        </div>
      </div>
    </div>
  );
}
