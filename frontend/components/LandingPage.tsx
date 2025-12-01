import React, { useEffect, useRef, useState } from "react";
import aiLLM from '../AI LLM.jpg';
import dataAnalytics from '../data-analytics.jpg';
import nocode from '../nocode.jpg';
import ashiuao from '../ashiuao.jpg';
import ethicalHacking from '../ethicalhacking.jpg';
import fullstack from '../fullstack.jpg';

import { GoogleLogin } from '@react-oauth/google';
import { signInWithGoogle } from '../services/authService';
import { CourseTrack } from "../types";

/* --------------------- brand --------------------- */
const BRAND = {
  accentA: "#FF5722",
  accentB: "#FF1E56",
  accentY: "#FFC306",
  ink: "#0b0f1a",
  line: "#E5E7EB",
};
// The reddish-orange color from the user's screenshot
const ACCENT_COLOR = "#FF5722";
const GRAD = `linear-gradient(135deg, ${BRAND.accentA}, ${BRAND.accentB})`;
const CHIP =
  "inline-flex items-center gap-2 text-xs text-slate-700 px-3 py-1 rounded-full border border-gray-200 bg-white";

// --- LOGO ---
// To replace the logo, simply change the URL in the line below.
const LOGO_URL = "https://image2url.com/images/1762859802432-99ab7a34-86b4-4395-a7e4-831fe8fc2dbf.png";

/* --------------------- tiny SVG icon set --------------------- */
interface IconProps {
  name: string;
  className?: string;
  stroke?: string;
  fill?: string;
}

const Icon: React.FC<IconProps> = ({ name, className = "w-5 h-5", stroke = "currentColor", fill = "none" }) => {
  // Fix: Use 'as const' to assert literal types for SVG properties and prevent type errors.
  const base = { fill, stroke, strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (name) {
    case "badge-check":
      return (<svg viewBox="0 0 24 24" className={className}><path {...base} d="m9 12 2 2 4-4"/><path {...base} d="M12 2l2.5 2.5L17 5l.5 2.5L20 10l-2.5 2 .5 2.5-1.5 2-2.5.5L12 20l-2.5-2.5L7 18l-.5-2.5L4 12l2.5-2L6 7.5 7.5 6 10 4.5 12 2Z"/></svg>);
    case "shield-check":
      return (<svg viewBox="0 0 24 24" className={className}><path {...base} d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3Z"/><path {...base} d="m9 12 2 2 4-4"/></svg>);
    case "rocket":
      return (<svg viewBox="0 0 24 24" className={className}><path {...base} d="M14 4c3 1 6 4 6 8-2 1-4 2-6 4-2 2-3 4-4 6-4 0-7-3-8-6 2-2 4-4 6-6 2-2 3-4 6-6Z"/><path {...base} d="M5 19c1-3 3-5 5-7"/></svg>);
    case "laptop":
      return (<svg viewBox="0 0 24 24" className={className}><rect {...base} x="3" y="4" width="18" height="12" rx="2"/><path {...base} d="M2 18h20"/></svg>);
    case "clipboard-check":
      return (<svg viewBox="0 0 24 24" className={className}><rect {...base} x="7" y="3" width="10" height="4" rx="2"/><rect {...base} x="4" y="7" width="16" height="14" rx="2"/><path {...base} d="m9 14 2 2 4-4"/></svg>);
    case "flag":
      return (<svg viewBox="0 0 24 24" className={className}><path {...base} d="M4 4v16M4 4h10l-1 3h7v7h-9l1-3H4Z"/></svg>);
    case "check":
      return (<svg viewBox="0 0 24 24" className={className}><path {...base} d="m5 13 4 4L19 7"/></svg>);
    case "zap":
      return (<svg viewBox="0 0 24 24" className={className}><path {...base} d="M13 2 3 14h7l-1 8 10-12h-7l1-8z"/></svg>);
    case "lock":
      return (<svg viewBox="0 0 24 24" className={className}><rect {...base} x="4" y="11" width="16" height="9" rx="2"/><path {...base} d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>);
    case "camera":
      return (<svg viewBox="0 0 24 24" className={className}><path {...base} d="M3 8h4l2-3h6l2 3h4v11H3V8Z"/><circle {...base} cx="12" cy="13" r="3.5"/></svg>);
    case "star":
      return (<svg viewBox="0 0 24 24" className={className}><path {...base} d="m12 3 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 18.8 6.2 21l1.1-6.5L2.6 9.8l6.5-.9L12 3Z"/></svg>);
    case "twitter":
      return (<svg viewBox="0 0 24 24" className={className}><path {...base} d="M22 5.9c-.7.3-1.4.5-2.2.6.8-.5 1.3-1.2 1.6-2.1-.8.5-1.6.8-2.5 1-1.5-1.6-4.3-.9-5.1 1.3-.3.8-.2 1.7.2 2.4-3.2-.2-6-1.7-7.9-4.2-.9 1.6-.4 3.6 1.1 4.6-.6 0-1.2-.2-1.7-.5 0 1.8 1.2 3.4 3 3.8-.5.1-1 .2-1.5.1.4 1.5 1.9 2.6 3.5 2.6-1.3 1-3 1.6-4.7 1.6H3c1.7 1.1 3.7 1.7 5.7 1.7 6.8 0 10.9-5.7 10.6-11 0-.1 0-.3 0-.4.8-.6 1.4-1.2 1.7-1.9Z"/></svg>);
    case "github":
      return (<svg viewBox="0 0 24 24" className={className}><path {...base} d="M9 19c-4 1.5-4-2-6-2m12 4v-3.9c0-1 .1-1.5-.5-2 1.7-.2 3.5-.8 3.5-3.8a3 3 0 0 0-.8-2.2 3 3 0 0 0-.1-2.2s-1.3-.4-4.1 1.6c-1.3-.4-2.7-.4-4 0C6.5 5.5 5.2 5.9 5.2 5.9a3 3 0 0 0-.1 2.2 3 3 0 0 0-.8 2.2c0 3 1.8 3.5 3.5 3.8-.4.4-.6.9-.5 2V21"/></svg>);
    case "linkedin":
      return (<svg viewBox="0 0 24 24" className={className}><rect {...base} x="3" y="3" width="18" height="18" rx="2"/><path {...base} d="M8 11v6M8 7h0M12 17v-6a3 3 0 0 1 6 0v6"/></svg>);
    case "arrow-up":
      return (<svg viewBox="0 0 24 24" className={className}><path {...base} d="M12 19V5M5 12l7-7 7 7"/></svg>);
    case "phone":
      return (<svg viewBox="0 0 24 24" className={className}><path {...base} d="M22 16.92v2a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.09 3.18 2 2 0 0 1 4.1 1h2a2 2 0 0 1 2 1.72c.12.9.32 1.78.6 2.63a2 2 0 0 1-.45 2.11L7.1 8.9a16 16 0 0 0 6 6l1.44-1.14a2 2 0 0 1 2.11-.45c.85.28 1.73.48 2.63.6A2 2 0 0 1 22 16.92Z"/></svg>);
    case "mail":
      return (<svg viewBox="0 0 24 24" className={className}><rect {...base} x="3" y="5" width="18" height="14" rx="2"/><path {...base} d="m3 7 9 6 9-6"/></svg>);
    case "map-pin":
      return (<svg viewBox="0 0 24 24" className={className}><path {...base} d="M12 22s7-4.35 7-11a7 7 0 1 0-14 0c0 6.65 7 11 7 11Z"/><circle {...base} cx="12" cy="11" r="3"/></svg>);
    default:
      return null;
  }
}

/* --------------------- effects --------------------- */
function useSmoothScroll() {
  useEffect(() => {
    const prev = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "smooth";
    return () => { document.documentElement.style.scrollBehavior = prev; };
  }, []);
}
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.remove("opacity-0", "translate-y-4");
          e.target.classList.add("opacity-100", "translate-y-0");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach((el) => {
      el.classList.add("opacity-0","translate-y-4","transition-all","duration-700","ease-out");
      io.observe(el);
    });
    return () => io.disconnect();
  }, []);
}

/* --------------------- helpers --------------------- */
const onImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => { e.currentTarget.style.display = 'none'; };

/* --------------------- embedded images / data --------------------- */
const HERO_SLIDES = [
  { img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=60", chip: "Team-ready skills" },
  { img: "https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&w=800&q=60", chip: "Real projects" },
  { img: "https://image2url.com/images/1762865361431-8fe2be66-2132-4264-8dbd-4586e6077096.jpg", chip: "Secure proctoring" },
];

const CERT_SLIDES = [
  { title: "Quick environment check", caption: "One-click camera & mic verification with privacy-first design.", img: "https://image2url.com/images/1762862342848-3e6b6c79-1b05-4ed0-b8da-78fad1bc8416.jpg", icon: "camera" },
  { title: "Stable connection", caption: "Instant online/offline detection and exam-safe reconnection.", img: "https://image2url.com/images/1762863763580-037cf001-aa1e-4cab-bc94-47bf7ddf637c.jpg", icon: "shield-check" },
  { title: "Verified submission", caption: "Auto-scored, attempt-limited, and flagged for manual review.", img: "https://image2url.com/images/1762864130746-c37a8b6c-b674-4ce3-8f48-20c497e356d6.png", icon: "clipboard-check" },
];

const PROJECTS = [
  { img: "https://images.unsplash.com/photo-1541462608143-67571c6738dd?auto=format&fit=crop&w=800&q=60", title: "SaaS Landing", pts: ["Next.js + Tailwind", "Auth + billing", "SEO score 95+"] },
  { img: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&w=800&q=60", title: "Data Pipeline", pts: ["Airflow DAGs", "S3 → Redshift", "dbt tests"] },
  { img: "https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?auto=format&fit=crop&w=800&q=60", title: "Serverless API", pts: ["API Gateway", "Lambda + DynamoDB", "IaC with CDK"] },
];

const TESTIMONIALS = [
  { name: "Aanya K.", role: "Frontend Developer", quote: "I loved how the courses were free but the certification actually meant something.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" },
  { name: "Raghav S.", role: "SRE", quote: "Proctoring was painless compared to other platforms. Review was quick and fair.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" },
  { name: "Neha P.", role: "Data Analyst", quote: "Short videos + labs = perfect flow. The certification helped me land an interview.", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100&q=80" },
];

const LOGOS = [
  "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
  "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
  "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
  "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg",
  "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
  "https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_Bélo.svg",
  "https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png",
  "https://upload.wikimedia.org/wikipedia/commons/7/76/Slack_Icon.png",
  "https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg",
  "https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg",
];

/* --------------------- small components --------------------- */
interface HeaderProps {
  title: string;
  subtitle?: string;
  cta?: { href: string; label: string };
}
function Header({ title, subtitle, cta }: HeaderProps) {
  return (
    <div className="mb-10 text-center">
      <div className={`${CHIP} mx-auto mb-3`}>
        <Icon name="badge-check" className="w-4 h-4" /> Orivon Academy
      </div>
      <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{title}</h2>
      {subtitle && <p className="text-slate-600 max-w-2xl mx-auto mt-2">{subtitle}</p>}
      {cta && (
        <a href={cta.href} className="inline-block mt-4 text-sm text-slate-600 hover:text-slate-900">
          {cta.label}
        </a>
      )}
    </div>
  );
}
const GradientCard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="rounded-2xl p-[1px]" style={{ background: `linear-gradient(135deg, rgba(255,87,34,.4), rgba(255,30,86,.4))` }}>
      <div className="rounded-2xl bg-white border border-gray-200 p-6">{children}</div>
    </div>
  );
};

/* ============================================================= */
/*                          COMPONENT                             */
/* ============================================================= */
const LandingPage: React.FC<{ 
  onLoginRequest: () => void; 
  courses: CourseTrack[]; 
  onSeeAllCourses: () => void; 
  activeRole: 'student' | 'admin' | null;
  onGoToDashboard: () => void;
  onGoToAuth?: () => void;
}> = ({ onLoginRequest, courses, onSeeAllCourses, activeRole, onGoToDashboard, onGoToAuth }) => {
  useSmoothScroll();
  useReveal();

  const [heroIdx, setHeroIdx] = useState(0);
  const [showTop, setShowTop] = useState(false);

  const heroTimer = useRef<number | null>(null);
  
  const handleCTAClick = () => {
      if (activeRole) {
        onGoToDashboard();
      } else {
        if (onGoToAuth) onGoToAuth();
        else onLoginRequest();
      }
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.querySelector(targetId);
    if (element) {
        const headerOffset = 64; // Corresponds to h-16 (16 * 4px) for the sticky header
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
  };

  /* autoplay hero */
  useEffect(() => {
    if (heroTimer.current) clearInterval(heroTimer.current);
    heroTimer.current = window.setInterval(() => setHeroIdx((i) => (i + 1) % HERO_SLIDES.length), 4200);
    return () => {
      if (heroTimer.current) clearInterval(heroTimer.current);
    };
  }, []);

  /* show back-to-top only after scrolling */
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const hero = HERO_SLIDES[heroIdx];

  const handleGoogleSuccess = async (resp: any) => {
    const idToken = resp?.credential;
    if (!idToken) return;
    try {
      const data = await signInWithGoogle(idToken);
      // backend may return `access_token` or `token` depending on implementation
      const token = data?.token || data?.access_token || data?.accessToken;
      const user = data?.user || data?.user_info || data?.profile;

      if (!token || !user) {
        console.error('Unexpected auth response', data);
        alert('Login failed: unexpected response from server');
        return;
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Redirect according to role stored in the user record (server authoritative)
      const role = (user.role || '').toLowerCase();
      if (role === 'admin') {
        window.location.href = '/admin-dashboard';
      } else {
        window.location.href = '/dashboard';
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Login error:', err);
      alert('Login failed');
    }
  };

  return (
    <div className="bg-white text-slate-900">
      {/* local keyframes for marquee + subtle section divider + band backgrounds */}
      <style>{`
        @keyframes logoMarquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .logo-track { width: max-content; animation: logoMarquee 28s linear infinite; }
        .section-divider { background: radial-gradient(600px 200px at 0% 50%, rgba(255,87,34,.10), transparent 60%), radial-gradient(600px 200px at 100% 50%, rgba(255,30,86,.10), transparent 60%); }

        /* Subtle band tints */
        .band-light { background: linear-gradient(180deg, #ffffff 0%, #fafafa 100%); }
        .band-mid   { background: linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%); }
      `}</style>

      {/* NAV */}
<header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-gray-100">
  <div className="max-w-7xl mx-auto h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
    {/* Logo + Links */}
    <div className="flex items-center gap-8">
      <a href="/" onClick={(e)=>e.preventDefault()} className="flex items-center gap-2" aria-label="Orivon home">
        <img src={LOGO_URL} alt="Orivon" className="w-7 h-7" loading="eager" />
        <span className="font-semibold tracking-tight text-gray-900 text-lg">Orivon Academy</span>
      </a>
      <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600">
        <a href="#tracks" onClick={(e) => handleNavClick(e, '#tracks')} className="hover:text-slate-900 transition-colors">Tracks</a>
        <a href="#how" onClick={(e) => handleNavClick(e, '#how')} className="hover:text-slate-900 transition-colors">How it works</a>
        <a href="#features" onClick={(e) => handleNavClick(e, '#features')} className="hover:text-slate-900 transition-colors">Why Orivon</a>
        <a href="#cert" onClick={(e) => handleNavClick(e, '#cert')} className="hover:text-slate-900 transition-colors">Certification</a>
        <a href="#faq" onClick={(e) => handleNavClick(e, '#faq')} className="hover:text-slate-900 transition-colors">FAQ</a>
      </nav>
    </div>

    {/* Sign in Button */}
    <div className="flex items-center">
      {activeRole ? (
        <button
          onClick={handleCTAClick}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-gray-100 text-gray-800 text-sm font-medium hover:bg-gray-200 transition-all border border-gray-300"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="w-4 h-4"
          />
          Go to Dashboard
        </button>
      ) : (
        <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => console.log('Google Login Failed')} />
      )}
    </div>
  </div>
</header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url('https://image2url.com/images/1762862342848-3e6b6c79-1b05-4ed0-b8da-78fad1bc8416.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        ></div>
        {/* Lightening Overlay */}
        <div className="absolute inset-0 z-10 bg-white/80"></div>

        {/* Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-16">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7" data-reveal>
              <span className={CHIP}>
                <Icon name="badge-check" className="w-4 h-4" />
                Industry-ready learning
              </span>
              <h1 className="mt-4 text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.05]">
                Build real skills. <br /> Earn verified <span className="text-amber-500">certifications</span>.
              </h1>
              <p className="mt-5 text-lg text-slate-600 max-w-2xl">
                1000+ learners are already mastering in-demand skills through Orivon Academy.
                Free learning, real certifications, and a chance to showcase your expertise to recruiters.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button 
                  onClick={handleCTAClick}
                  className="rounded-full px-6 py-3 font-semibold text-white transition-colors" 
                  style={{ backgroundColor: ACCENT_COLOR }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#E64A19'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = ACCENT_COLOR}
                >
                  {/* {activeRole ? 'Go to Dashboard' : 'Get started'} */}
                </button>
                {/* <button onClick={onSeeAllCourses} className="rounded-full px-6 py-3 font-semibold text-slate-800 border border-gray-300 hover:bg-gray-100">
                  See tracks
                </button> */}
              </div>
            </div>

            {/* slideshow panel */}
            <div className="lg:col-span-5" data-reveal>
              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="relative rounded-xl overflow-hidden border border-gray-200">
                  <img key={hero.img} src={hero.img} alt={hero.chip} className="w-full h-64 object-cover transition-opacity duration-700" loading="eager" onError={onImgError} />
                  <div className="absolute bottom-3 left-3 text-xs bg-white/85 backdrop-blur px-2.5 py-1.5 rounded-full border border-gray-200 flex items-center gap-2">
                    <Icon name="rocket" className="w-4 h-4" />
                    {hero.chip}
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 mt-3">
                  {HERO_SLIDES.map((_, i) => (
                    <button key={i} aria-label={`slide ${i + 1}`} onClick={() => setHeroIdx(i)} className={`w-2.5 h-2.5 rounded-full ${i === heroIdx ? "bg-slate-900" : "bg-gray-300"}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUSTED logos — continuous marquee (light) */}
      <section className="border-t" style={{ borderColor: BRAND.line }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="text-center text-sm text-slate-500 mb-5">Trusted by learners from</div>
          <div className="overflow-hidden relative">
            <div className="logo-track flex items-center gap-12 pr-12">
              {[...LOGOS, ...LOGOS].filter(Boolean).map((src, i) => (
                <div key={`${src}-${i}`} className="flex items-center justify-center shrink-0">
                  <img src={src} className="h-8 object-contain opacity-80" loading="lazy" alt="Partner logo" onError={(e)=>{e.currentTarget.style.display='none';}} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Divider (subtle gradient) */}
      <div className="h-6 section-divider" />

      {/* TRACKS (light) */}
      <section id="tracks" className="band-light max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white">
        <Header title="Popular tracks" subtitle="Pick your lane. Each track bundles focused videos, labs, and a certification." />
        <div className="grid lg:grid-cols-3 gap-6">
          {courses.map((t, i) => (
            <div key={t.title} className="rounded-3xl overflow-hidden border border-gray-200 bg-white hover:shadow-md transition" data-reveal>
              <div className="relative">
                {(() => {
                  const FALLBACK_IMAGES = [aiLLM, dataAnalytics, nocode, ashiuao, ethicalHacking, fullstack];
                  const src = t.img ? t.img : (FALLBACK_IMAGES[i] || dataAnalytics);
                  return (<img src={src} alt={t.title} className="w-full h-48 object-cover" loading="lazy" onError={onImgError} />);
                })()}
                <span className="absolute top-3 left-3 text-xs px-2 py-1 rounded-full bg-white/90 border border-gray-200 text-slate-700">
                  {t.badge}
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold">{t.title}</h3>
                <p className="text-sm text-slate-600 mt-1">{t.desc}</p>
                {/* <button onClick={handleCTAClick} className="mt-4 rounded-xl px-4 py-2.5 font-semibold text-white" style={{ background: GRAD }}>
                   {activeRole ? 'Go to Course' : 'Start learning'}
                </button> */}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS (light gray) */}
      <section id="how" className="band-mid border-t bg-slate-50" style={{ borderColor: BRAND.line }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Header title="How it works" subtitle="Four simple stages from learning to verified credential." />
          <div className="grid lg:grid-cols-2 gap-10">
            {/* timeline left */}
            <div className="space-y-6">
              {[
                { title: "Learn by doing", desc: "Concise videos, readable notes, and guided labs with keyboard-friendly player.", icon: "laptop" },
                { title: "Practice often", desc: "Low-stress quizzes sprinkled in to solidify concepts and spot gaps early.", icon: "clipboard-check" },
                { title: "Proctor check", desc: "Quick camera/mic verification, online status, and attempt limit.", icon: "shield-check" },
                { title: "Get certified", desc: "Auto-score + human review for trust. Digital credential you can share.", icon: "flag" },
              ].map((step, i) => (
                <div key={step.title} className="flex items-start gap-4">
                  <div className="shrink-0 w-11 h-11 rounded-full grid place-items-center text-white font-semibold" style={{ background: GRAD }}>
                    {i + 1}
                  </div>
                  <div className="rounded-2xl border border-gray-200 bg-white p-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full p-2 border border-gray-200 bg-white">
                        <Icon name={step.icon} className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold">{step.title}</div>
                        <div className="text-sm text-slate-600">{step.desc}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* progress board right */}
            <div className="rounded-3xl border border-gray-200 bg-white p-6 lg:p-8 shadow-sm">
              <div className="text-sm font-semibold mb-4">Progress Board</div>
              <div className="space-y-5">
                <div className="rounded-2xl border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Score: </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">On track</span>
                  </div>
                  <div className="mt-3 h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-2 rounded-full" style={{ width: "72%", background: GRAD }} />
                  </div>
                  <div className="mt-2 text-xs text-slate-500">72% Pass </div>
                </div>
                <div className="rounded-2xl border border-gray-200 p-4">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full p-1.5 border border-gray-200 bg-white">
                      <Icon name="clipboard-check" className="w-4 h-4" />
                    </span>
                    <div className="font-medium">Proctoring exam</div>
                  </div>
                  <ul className="mt-3 text-sm text-slate-600 space-y-1.5">
                    <li>• Internet Connection</li>
                    <li>• Auto Generated certificates</li>
                    <li>• Realeted Questions</li>
                  </ul>
                </div>
                <div>
                  {/* <button onClick={handleCTAClick} className="mt-4 rounded-xl px-4 py-2.5 font-semibold text-white" style={{ background: GRAD }}>
                    {activeRole ? 'Continue' : 'Continue learning'}
                  </button> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY ORIVON (light) */}
      <section id="features" className="band-light max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white">
        <Header title="Why Orivon" subtitle="Crafted UI, focused content, and a fair but secure exam experience." />
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: "laptop", title: "Clean player", desc: "Bookmarks, transcripts, and shortcuts. Zero clutter so you stay in flow." },
            { icon: "shield-check", title: "Proctored & fair", desc: "Camera check, attempt limits, and under-review protection against retakes." },
            { icon: "zap", title: "Speed-to-skill", desc: "Tracks are intentionally short and build towards deployable projects." },
          ].map((f) => (
            <GradientCard key={f.title}>
              <Icon name={f.icon} className="w-6 h-6 mb-3 text-slate-700" />
              <div className="font-semibold mb-1">{f.title}</div>
              <div className="text-sm text-slate-600">{f.desc}</div>
            </GradientCard>
          ))}
        </div>
      </section>

      {/* CERT PREVIEW (light gray) */}
      <section id="cert" className="band-mid border-t bg-slate-50" style={{ borderColor: BRAND.line }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Header title="Certification Preview" subtitle="A quick, privacy-first flow before your exam begins." />
          <div className="grid md:grid-cols-3 gap-6">
            {CERT_SLIDES.map((slide) => (
              <div key={slide.title} className="rounded-2xl border border-gray-200 bg-white p-6 text-center" data-reveal>
                <img src={slide.img} className="w-full h-40 object-cover rounded-xl mb-4" alt={slide.title} onError={onImgError} />
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Icon name={slide.icon as any} className="w-5 h-5 text-slate-700" />
                  <h3 className="font-semibold text-lg">{slide.title}</h3>
                </div>
                <p className="text-sm text-slate-600">{slide.caption}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <button
              onClick={handleCTAClick}
              className="rounded-full px-6 py-3 font-semibold text-white transition-colors"
              style={{ backgroundColor: ACCENT_COLOR }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#E64A19'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = ACCENT_COLOR}
            >
              {/* {activeRole ? 'Start Your First Exam' : 'Get Started'} */}
            </button>
          </div>
        </div>
      </section>

      {/* Outcomes (DARK) */}
      <section id="outcomes" className="border-t" style={{ borderColor: BRAND.line, background: BRAND.ink }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-slate-100">
          <Header title="Outcomes & Portfolio" subtitle="Ship 3 projects per track and showcase measurable results." />
          <div className="grid md:grid-cols-3 gap-6">
            {PROJECTS.map((p) => (
              <div key={p.title} className="rounded-3xl overflow-hidden bg-white/5 border border-white/10" data-reveal>
                <img src={p.img} alt={p.title} className="w-full h-44 object-cover" loading="lazy" onError={onImgError} />
                <div className="p-5">
                  <div className="font-semibold">{p.title}</div>
                  <ul className="mt-2 text-sm text-slate-300 space-y-1">
                    {p.pts.map((x) => (<li key={x} className="flex items-center gap-2"><Icon name="check" className="w-4 h-4" /><span>{x}</span></li>))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS (light) */}
      <section id="testimonials" className="band-light max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white">
        <Header title="What learners say" subtitle="Short, honest notes from recent learners." />
        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="rounded-2xl border border-gray-200 bg-white p-6" data-reveal>
              <div className="flex items-center gap-3">
                <img src={t.avatar} className="w-10 h-10 rounded-full object-cover" alt={`${t.name} avatar`} loading="lazy" onError={onImgError} />
                <div>
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-xs text-slate-500">{t.role}</div>
                </div>
                <div className="ml-auto flex text-amber-500" aria-label="5 star rating">
                  {Array.from({ length: 5 }).map((_, i) => (<Icon key={i} name="star" className="w-4 h-4" />))}
                </div>
              </div>
              <blockquote className="text-slate-700 mt-3">“{t.quote}”</blockquote>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA (light gray) */}
      <section className="band-mid border-t bg-slate-50" style={{ borderColor: BRAND.line }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h3 className="text-3xl font-bold mb-3">Ready to move faster?</h3>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Join Orivon and start learning in minutes. When you’re ready, sit the secure, proctored exam and earn a credential you’ll be proud to share.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button onClick={handleCTAClick} className="rounded-full px-6 py-3 font-semibold text-white" style={{ background: GRAD }}>
               {/* {activeRole ? 'Go to Dashboard' : 'Get started'} */}
            </button>
            <button onClick={handleCTAClick} className="rounded-full px-6 py-3 font-semibold border border-gray-200 hover:bg-gray-50">
               {activeRole ? 'View Courses' : 'Sign in'}
            </button>
          </div>
        </div>
      </section>

      {/* FAQ (light) */}
      <section id="faq" className="band-mid border-t bg-slate-50" style={{ borderColor: BRAND.line }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Header title="FAQs" />
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { q: "Do I need to install anything?", a: "No. The player runs in your browser. Exams only need camera & mic permission." },
              { q: "Can I retake the certification?", a: "You’ll see attempt limits. After submitting once, it shows “Under review” until results are processed." },
              { q: "Do you support teams?", a: "Yes. Volume access and progress visibility for managers is available." },
              { q: "Refunds?", a: "If something breaks on our end, we’ll make it right. Reach out from your dashboard." },
            ].map((item) => (
              <div key={item.q} className="rounded-2xl border border-gray-200 bg-white p-5">
                <div className="font-semibold">{item.q}</div>
                <div className="text-sm text-slate-600 mt-1">{item.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER with Contact Info (DARK) */}
      <footer className="border-t bg-[#0f1624] text-slate-100" style={{ borderColor: BRAND.line }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid md:grid-cols-4 gap-10">
          {/* Brand + blurb */}
          <div>
            <div className="flex items-center gap-2">
              <img src={LOGO_URL} className="w-8 h-8" alt="Orivon" loading="lazy" />
              <span className="text-xl font-semibold">Orivon Technologies</span>
            </div>
            <p className="text-sm text-slate-300 mt-3">
              Transforming ideas into scalable AI-driven solutions for businesses of all sizes.
            </p>
            <a
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 transition mt-5"
              href="https://www.linkedin.com/company/orivon-technologies" target="_blank" rel="noreferrer" aria-label="LinkedIn"
            >
              <Icon name="linkedin" className="w-5 h-5" />
            </a>
          </div>

          {/* Column 2 — Tracks & Certifications → Sign in */}
          <div>
            <div className="text-lg font-semibold mb-3">Tracks &amp; Certifications</div>
            <ul className="space-y-2 text-sm text-slate-300">
              {[
                "Full-Stack Essentials",
                "AWS Foundations",
                "Data Engineering",
                "See all tracks",
                "Sample certificate",
              ].map((label) => (
                <li key={label}>
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); handleCTAClick(); }}
                    className="hover:text-white"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Resources → lead nowhere */}
          <div>
            <div className="text-lg font-semibold mb-3">Resources</div>
            <ul className="space-y-2 text-sm text-slate-300">
              {["Exam guide", "Proctoring policy", "Study roadmap", "Cheat sheets", "Help center"].map((label) => (
                <li key={label}>
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="cursor-default text-slate-300 hover:text-slate-300"
                    aria-disabled="true"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <div className="text-lg font-semibold mb-3">Contact Info</div>
            <ul className="space-y-4 text-slate-300 text-sm">
              <li className="flex gap-3 items-start">
                <span className="mt-0.5"><Icon name="phone" className="w-5 h-5" /></span>
                <span>+91 8169203093</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="mt-0.5"><Icon name="mail" className="w-5 h-5" /></span>
                <span>contact@orivontechnologies.com</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="mt-0.5"><Icon name="map-pin" className="w-5 h-5" /></span>
                <span>
                  Hiranandani Estate<br />
                  Thane (West), Maharashtra – 400607<br />
                  India
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-xs text-slate-400 flex items-center gap-4">
            <span>© {new Date().getFullYear()} Orivon Technologies. All rights reserved.</span>
          </div>
        </div>
      </footer>

      {/* Scroll-to-top (appears after scrolling) */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-5 right-5 rounded-full w-11 h-11 grid place-items-center border border-gray-200 bg-white hover:bg-gray-50 shadow-sm"
          title="Back to top"
          aria-label="Back to top"
        >
          <Icon name="arrow-up" className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

export default LandingPage;