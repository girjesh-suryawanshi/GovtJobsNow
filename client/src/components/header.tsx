import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Bell, User, LogOut, Download, Menu, X, HelpCircle } from "lucide-react";
import AuthModal from "@/components/auth-modal";
import HelpModal from "@/components/help-modal";
import { useUser } from "@/contexts/user-context";
import { usePWA } from "@/contexts/pwa-context";

interface HeaderProps {
  onScrollToDepartments?: () => void;
  onSearch?: (query: string) => void;
}

const NAV_LINKS = [
  { href: "/", label: "🏠 Home", active: true },
  { href: "/blog", label: "📚 Blog" },
  { href: "/jobs/ssc", label: "📋 SSC Jobs" },
  { href: "/jobs/railway", label: "🚆 Railway Jobs" },
  { href: "/editorial-policy", label: "🛡️ Editorial Policy" },
  { href: "/verification-policy", label: "✔️ Verification Policy" },
  { href: "/privacy-policy", label: "🔒 Privacy Policy" },
  { href: "/terms-of-service", label: "📜 Terms" },
  { href: "/disclaimer", label: "⚠️ Disclaimer" },
  { href: "/about-us", label: "ℹ️ About Us" },
  { href: "/contact", label: "📞 Contact" },
];




export default function Header({ onScrollToDepartments, onSearch }: HeaderProps) {
  const { user, logout, isAuthenticated } = useUser();
  const [location] = useLocation();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin');
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const { isInstallable, installApp, isInstalled } = usePWA();

  const isMobileOrDesktop = /iPhone|iPad|iPod|Android|Windows|Mac|Linux/i.test(navigator.userAgent);
  const shouldShowInstall = (isInstallable || isMobileOrDesktop) && !isInstalled;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchValue);
  };

  // Close mobile menu on route change
  useEffect(() => { setIsMobileMenuOpen(false); }, [location]);

  return (
    <>
      <header className="gjn-header">
        {/* ─── TOP BAR ─── */}
        <div className="gjn-header-top">
          <div className="gjn-header-inner">
            {/* Logo */}
            <Link href="/" className="gjn-logo">
              Govt<span>Job</span>Now
            </Link>

            {/* Search */}
            <form className="gjn-search" onSubmit={handleSearch}>
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search jobs, exams, admit cards… e.g. SSC GD 2026"
                aria-label="Search government jobs"
              />
              <button type="submit" aria-label="Search">🔍</button>
            </form>

            {/* Actions (hidden on small screens via CSS) */}
            <div className="gjn-header-actions flex items-center gap-2">
              {shouldShowInstall && (
                <button
                  className="gjn-btn-alert"
                  onClick={installApp}
                  title="Install the app"
                >
                  <Download className="inline h-3 w-3 mr-1" />
                  Install App
                </button>
              )}
              <button
                className="gjn-btn-alert"
                onClick={() => {
                  setAuthMode('signin');
                  setShowAuthModal(true);
                }}
                aria-label="Get Job Alerts"
              >
                🔔 Get Alerts
              </button>

              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <span className="text-white text-xs font-semibold hidden lg:block">
                    Hi, {user?.fullName?.split(' ')[0]}
                  </span>
                  <button
                    className="gjn-btn-alert"
                    style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)' }}
                    onClick={logout}
                  >
                    <LogOut className="inline h-3 w-3 mr-1" />
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  className="gjn-btn-alert"
                  style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)' }}
                  onClick={() => {
                    setAuthMode('register');
                    setShowAuthModal(true);
                  }}
                >
                  <User className="inline h-3 w-3 mr-1" />
                  Register Free
                </button>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden text-white p-1 ml-auto"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* ─── NAV BAR ─── */}
        <nav className="gjn-nav-bar" aria-label="Main navigation">
          <div className="gjn-nav-inner">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href + link.label}
                href={link.href}
                className={location === link.href && link.label.includes('Home') ? 'active' : ''}
              >
                {link.label}
              </Link>
            ))}
            {/* <button
              onClick={onScrollToDepartments}
              style={{
                color: 'rgba(255,255,255,0.85)', background: 'none', border: 'none',
                padding: '9px 16px', fontSize: '12px', fontWeight: '600',
                cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '5px',
                borderBottom: '3px solid transparent',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#f59e0b'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.85)'; }}
            >
              🏢 Departments
            </button> */}
            <button
              onClick={() => setShowHelpModal(true)}
              style={{
                color: 'rgba(255,255,255,0.85)', background: 'none', border: 'none',
                padding: '9px 16px', fontSize: '12px', fontWeight: '600',
                cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '5px',
                borderBottom: '3px solid transparent',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#f59e0b'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.85)'; }}
            >
              ❓ Help
            </button>
          </div>
        </nav>

        {/* ─── MOBILE DROPDOWN MENU ─── */}
        {isMobileMenuOpen && (
          <div
            style={{
              background: '#162f8a', borderTop: '1px solid rgba(255,255,255,0.1)',
              padding: '8px 0',
            }}
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href + link.label}
                href={link.href}
                style={{
                  display: 'block', padding: '10px 20px',
                  color: 'rgba(255,255,255,0.85)', textDecoration: 'none',
                  fontSize: '13px', fontWeight: '600',
                  borderLeft: '3px solid transparent',
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* ─── MOBILE BOTTOM NAV ─── */}
      <nav className="gjn-mobile-nav" aria-label="Mobile navigation">
        <div className="gjn-mobile-nav-inner">
          <Link href="/" className={location === '/' ? 'active' : ''}>
            <span className="ico">🏠</span>Home
          </Link>
          <Link href="/" className="">
            <span className="ico">📋</span>Jobs
          </Link>
          <Link href="/exams">
            <span className="ico">📅</span>Exams
          </Link>
          <Link href="/blog">
            <span className="ico">📚</span>Blog
          </Link>
          <button
            onClick={() => { setAuthMode('signin'); setShowAuthModal(true); }}
            style={{
              flex: 1, textAlign: 'center', color: 'rgba(255,255,255,0.7)',
              background: 'none', border: 'none', padding: '10px 4px',
              fontSize: '10px', fontWeight: '600', display: 'flex',
              flexDirection: 'column', alignItems: 'center', gap: '2px', cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: '18px' }}>🔔</span>Alerts
          </button>
        </div>
      </nav>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
      />
      <HelpModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
      />
    </>
  );
}
