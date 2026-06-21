import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import verionLogo from '../verion_updated.jpeg';
import methodBg from '../minimal_black_bg.png';
import ragImage from "./rag.jpg";
import aiImage from "./ai.jpg";
import llmImage from "./llm.jpg";
import InfoImage from "./info_extraction.jpg";
import anonymousImage from "./anonymous.jpg";
import generationImage from "./generation.jpg";

import {
  ArrowRight,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Bot,
  ShieldCheck,
  Search,
  CheckCircle2,
  Menu,
  X,
  Plus,
  Minus,
  Sparkles,
  Clock,
  TrendingUp,
  Database,
  Cpu,
  Layers,
  Lock,
  Globe,
  FileText
} from 'lucide-react';

const SERVICES_DATA = [
  {
    category: "01. SMART GENERATION",
    title: "Smart Content Generation",
    description: "Generate highly engaging, brand-specific product titles, rich body descriptions, categorized product tags, and catalog metadata at scale.",
    linkText: "Learn about Content Gen",
    linkUrl: "#method"
  },
  {
    category: "02. SEARCH ENGINE OPTIMIZATION",
    title: "SEO Optimization",
    description: "Boost organic discoverability automatically. Our SEO agent analyzes high-volume search query patterns, structures meta tags, and places semantic keywords naturally.",
    linkText: "Explore SEO Capabilities",
    linkUrl: "#cases"
  },
  {
    category: "03. PRIVACY & SECURITY",
    title: "Privacy Protection",
    description: "Safeguard your enterprise IP. The Privacy Agent automatically scans and scrubs wholesale margins, supplier identifiers, proprietary data, and PII before processing.",
    linkText: "View Privacy Safeguards",
    linkUrl: "#method"
  },
  {
    category: "04. QUALITY VERIFICATION",
    title: "Quality Validation",
    description: "Multi-point check validation. Grammatical validation, reading accessibility scanning, catalog layout alignment, and brand guidelines verification before publish.",
    linkText: "Explore Quality Checking",
    linkUrl: "/dashboard"
  },
  {
    category: "05. MULTI-PLATFORM ADAPTERS",
    title: "Multi-Platform Support",
    description: "Publish drafts in one click. Fully synchronized API integration for Shopify, WooCommerce, AliExpress, and custom JSON/headless endpoint integrations.",
    linkText: "Check Integrations",
    linkUrl: "/dashboard"
  }
];

const CASE_STUDIES = [
  {
    tag: "Global Pharmaceuticals",
    title: "Enterprise-Scale RAG",
    desc: "Estimated 30-40% reduction in time to find relevant information and generate compliance reports.",
    bg: ragImage
  },
  {
    tag: "Manufacturing & Logistics",
    title: "AI Platform Engineering",
    desc: "Increased test coverage (0% -> 80%) dramatically improves system reliability and supply chain visibility.",
    bg: aiImage
  },
  {
    tag: "Life Sciences",
    title: "AI Information Extraction",
    desc: "Ensured continued compliance with regulatory constraints on patient consent workflows.",
    bg: InfoImage
  },
  {
    tag: "Information Technology",
    title: "LLM Fine-Tuning & Adaptation",
    desc: "Achieved an F1 score of 92%, significantly outperforming traditional LLM baselines.",
    bg: llmImage
  },
  {
    tag: "E-Commerce AI",
    title: "Autonomous Content Generation",
    desc: "Develops AI agents that automatically generate, evaluate, and optimize product descriptions, advertisements, and promotional campaigns to maximize customer engagement and conversion rates.",
    bg: generationImage
  },
  {
    tag: "Agentic AI",
    title: "Intelligent E-Commerce Optimization",
    desc: "Empowers autonomous AI agents to understand products, create compelling marketing content, and continuously optimize promotional strategies using multimodal insights and predictive analytics.",
    bg: anonymousImage
  }
];

const DASHBOARD_PRODUCTS = [
  {
    title: "Men's Running Shoes",
    seo: 96,
    status: "Optimized",
    badge: "bg-emerald-500/20 text-emerald-400",
    logs: [
      { color: "text-zinc-500", text: "> Initializing SEO optimization agent..." },
      { color: "text-sky-300 font-semibold", text: '> [SEO Agent] Keywords: "lightweight", "running shoes", "marathon training"' },
      { color: "text-zinc-500", text: "> Sanitizing vendor details..." },
      { color: "text-emerald-400 font-semibold", text: "> [Privacy Guard] Redacted wholesale cost $12.50 → [SAFE]" },
      { color: "text-zinc-500", text: "> Validating grammatical quality index..." },
      { color: "text-white font-semibold", text: "> [Validator Agent] Flesch Reading Ease: 72.8 (Optimal)" },
    ],
    before: { title: "Men's Running Shoes", desc: "Good running shoes for men." },
    after: { title: "Lightweight Men's Running Shoes for Daily Training & Marathon Prep", desc: "Engineered for comfort with breathable mesh, responsive cushioning, and durable outsole technology." },
  },
  {
    title: "Leather Hiking Boots",
    seo: 94,
    status: "Optimized",
    badge: "bg-emerald-500/20 text-emerald-400",
    logs: [
      { color: "text-zinc-500", text: "> Importing product spec from catalog..." },
      { color: "text-sky-300 font-semibold", text: '> [SEO Agent] Keywords: "leather hiking boots", "waterproof", "trail-ready"' },
      { color: "text-zinc-500", text: "> Running brand voice alignment check..." },
      { color: "text-violet-300 font-semibold", text: "> [Content Gen] Generated 3 title variants. Selecting highest-scoring..." },
      { color: "text-emerald-400 font-semibold", text: "> [Privacy Guard] No sensitive fields detected." },
      { color: "text-white font-semibold", text: "> [Validator Agent] Grammar OK. Readability score: 68.4 (Good)" },
    ],
    before: { title: "Leather Hiking Boots", desc: "Durable boots for hiking." },
    after: { title: "Premium Waterproof Leather Hiking Boots – Built for Every Trail", desc: "Full-grain leather upper with waterproof lining, aggressive lug outsole, and ankle support for all-terrain confidence." },
  },
  {
    title: "Waterproof Dome Tent",
    seo: 42,
    status: "Pending",
    badge: "bg-yellow-500/20 text-yellow-400",
    logs: [
      { color: "text-zinc-500", text: "> Low SEO score detected (42%) — triggering full rewrite..." },
      { color: "text-yellow-300 font-semibold", text: '> [SEO Agent] Missing keywords: "camping tent", "2-person", "3-season"' },
      { color: "text-zinc-500", text: "> Analyzing competitor listings for keyword gaps..." },
      { color: "text-violet-300 font-semibold", text: "> [Content Gen] Drafting enriched description with USPs..." },
      { color: "text-zinc-500", text: "> Checking for brand guideline compliance..." },
      { color: "text-amber-400 font-semibold", text: "> [Validator Agent] Warning: Title too generic — regenerating..." },
    ],
    before: { title: "Waterproof Dome Tent", desc: "Good tent for outdoor use." },
    after: { title: "2-Person Waterproof Dome Camping Tent – 3-Season Ultralight Shelter", desc: "Ripstop nylon shell with 3000mm hydrostatic rating, dual vestibules, and fast-pitch pole system for solo or duo campers." },
  },
  {
    title: "Wireless Charging Pad",
    seo: 89,
    status: "Optimized",
    badge: "bg-emerald-500/20 text-emerald-400",
    logs: [
      { color: "text-zinc-500", text: "> Parsing product spec sheet..." },
      { color: "text-sky-300 font-semibold", text: '> [SEO Agent] Keywords: "wireless charger", "Qi compatible", "15W fast charge"' },
      { color: "text-emerald-400 font-semibold", text: "> [Privacy Guard] Redacted supplier margin $4.20 → [SAFE]" },
      { color: "text-violet-300 font-semibold", text: "> [Content Gen] Highlighting key feature: multi-device support..." },
      { color: "text-zinc-500", text: "> Running final quality audit..." },
      { color: "text-white font-semibold", text: "> [Validator Agent] All checks passed. Listing ready to publish." },
    ],
    before: { title: "Wireless Charging Pad", desc: "Charges phones wirelessly." },
    after: { title: "15W Qi Wireless Charging Pad – Fast Charge for iPhone, Samsung & AirPods", desc: "Universal Qi-certified pad delivers up to 15W fast charging for all compatible devices with LED status indicator and non-slip base." },
  },
];

// ── Interactive Dashboard Component ──
type DashboardProduct = {
  title: string;
  seo: number;
  status: string;
  badge: string;
  logs: { color: string; text: string }[];
  before: { title: string; desc: string };
  after: { title: string; desc: string };
};

const InteractiveDashboard = ({ products }: { products: DashboardProduct[] }) => {
  const [activeProduct, setActiveProduct] = useState(0);
  const [logKey, setLogKey] = useState(0);
  const p = products[activeProduct];

  const handleSelect = (idx: number) => {
    setActiveProduct(idx);
    setLogKey(k => k + 1);
  };

  const seoBarColor = (seo: number) =>
    seo >= 80 ? 'bg-emerald-400' : seo >= 60 ? 'bg-yellow-400' : 'bg-red-400';

  return (
    <div className="grid lg:grid-cols-12 gap-6 items-stretch">

      {/* ── Left: Console (col-span-7) ── */}
      <div className="lg:col-span-7 rounded-3xl border border-white/10 bg-zinc-900/50 flex flex-col shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-matrix opacity-10 pointer-events-none" />

        {/* Window chrome */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-3 z-10">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <span className="text-[11px] font-mono text-zinc-500 ml-3">console.verion.ai</span>
          </div>
          <span className="px-3 py-1 rounded border border-zinc-700/40 text-zinc-300 font-mono text-[10px] tracking-wider uppercase font-bold animate-pulse">
            Live Swarm Monitor
          </span>
        </div>

        <div className="grid md:grid-cols-12 gap-4 flex-1 p-4 z-10">

          {/* Product Catalog Column */}
          <div className="md:col-span-5 bg-zinc-950/60 rounded-2xl border border-white/5 p-4 flex flex-col gap-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1 block">Store Catalog</span>
            {products.map((prod, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                className={`w-full text-left p-3 rounded-xl border flex flex-col gap-1.5 cursor-pointer transition-all duration-300 group
                  ${activeProduct === idx
                    ? 'bg-zinc-800 border-zinc-600 shadow-[0_0_0_1px_rgba(255,255,255,0.05)]'
                    : 'bg-zinc-900/40 border-zinc-800/50 hover:bg-zinc-800/60 hover:border-zinc-700'
                  }`}
              >
                <div className="flex justify-between items-start">
                  <span className={`font-semibold text-xs truncate max-w-[130px] transition-colors ${activeProduct === idx ? 'text-white' : 'text-zinc-300 group-hover:text-white'}`}>
                    {prod.title}
                  </span>
                  <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold shrink-0 ${prod.badge}`}>{prod.status}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1 rounded-full bg-zinc-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${seoBarColor(prod.seo)}`}
                      style={{ width: `${prod.seo}%` }}
                    />
                  </div>
                  <span className="font-mono text-[9px] text-zinc-400 shrink-0">{prod.seo}%</span>
                </div>
              </button>
            ))}
          </div>

          {/* Agent Log Stream */}
          <div key={logKey} className="md:col-span-7 bg-zinc-950/80 rounded-2xl border border-white/5 p-4 flex flex-col font-mono text-[10px] gap-2 justify-between">
            <div>
              <div className="flex justify-between border-b border-zinc-900 pb-2 mb-3">
                <span className="text-zinc-500">// active_agent_stream</span>
                <span className="text-zinc-300 font-bold">{new Date().toLocaleTimeString('en-US', { hour12: false })}</span>
              </div>
              <div className="space-y-2 leading-relaxed">
                {p.logs.map((log, i) => (
                  <p
                    key={i}
                    className={log.color}
                    style={{
                      animationName: 'fadeSlideIn',
                      animationDuration: '0.4s',
                      animationTimingFunction: 'ease-out',
                      animationFillMode: 'both',
                      animationDelay: `${i * 120}ms`,
                    }}
                  >
                    {log.text}
                  </p>
                ))}
              </div>
            </div>
            <div className="pt-2 border-t border-zinc-900 flex justify-between items-center mt-2">
              <span className="text-zinc-500">Processing: {p.title}</span>
              <span className={`font-bold animate-pulse font-sans ${p.status === 'Pending' ? 'text-yellow-400' : 'text-emerald-400'}`}>
                {p.status === 'Pending' ? 'Optimizing...' : 'Draft Synced ✓'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right: Before & After Panel (col-span-5) ── */}
      <div className="lg:col-span-5 rounded-3xl border border-white/5 bg-zinc-900/30 p-6 md:p-8 flex flex-col gap-6 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/2 rounded-full blur-3xl pointer-events-none" />

        <div>
          <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase block mb-1">Outcome Comparison</span>
          <h3 className="text-xl font-medium">Before &amp; After Listing</h3>
        </div>

        {/* Before */}
        <div className="p-5 bg-zinc-950/60 rounded-2xl border border-red-500/10 hover:border-red-500/30 transition-all duration-300 relative">
          <span className="absolute -top-2.5 left-4 bg-red-500/20 text-red-400 border border-red-500/30 text-[9px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full font-bold">
            Before
          </span>
          <div className="space-y-2 mt-1">
            <h4 className="font-semibold text-sm text-zinc-300 leading-snug">Title: {p.before.title}</h4>
            <p className="text-xs text-zinc-500 font-light leading-relaxed">{p.before.desc}</p>
          </div>
        </div>

        {/* After */}
        <div className="p-5 bg-zinc-950/60 rounded-2xl border border-emerald-500/10 hover:border-emerald-500/30 transition-all duration-300 relative flex-1">
          <span className="absolute -top-2.5 left-4 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full font-bold">
            After — AI Optimized
          </span>
          <div className="space-y-2.5 mt-1">
            <h4 className="font-semibold text-sm text-white leading-snug">Title: {p.after.title}</h4>
            <p className="text-xs text-zinc-300 font-light leading-relaxed">{p.after.desc}</p>
          </div>
        </div>

        {/* SEO Score indicator */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">SEO Score</span>
          <div className="flex-1 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${seoBarColor(p.seo)}`}
              style={{ width: `${p.seo}%` }}
            />
          </div>
          <span className={`font-mono text-xs font-bold ${seoBarColor(p.seo).replace('bg-', 'text-')}`}>{p.seo}%</span>
        </div>
      </div>

      {/* Inline keyframe for log line animation */}
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};



const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [activeCaseStudy, setActiveCaseStudy] = useState<number | null>(null);
  const [showAllCases, setShowAllCases] = useState(false);
  const [activeChallenge, setActiveChallenge] = useState<number | null>(null);
  const [activeFaqTab, setActiveFaqTab] = useState("All Questions");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [currentService, setCurrentService] = useState(0);
  const [servicesVisible, setServicesVisible] = useState(false);
  const [methodVisible, setMethodVisible] = useState(false);
  const servicesRef = useRef<HTMLElement>(null);
  const methodRef = useRef<HTMLElement>(null);

  const [solutionVisible, setSolutionVisible] = useState(false);
  const [processVisible, setProcessVisible] = useState(false);
  const [benefitsVisible, setBenefitsVisible] = useState(false);
  const [stackVisible, setStackVisible] = useState(false);
  const [testimonialsVisible, setTestimonialsVisible] = useState(false);

  const solutionRef = useRef<HTMLElement>(null);
  const processRef = useRef<HTMLElement>(null);
  const benefitsRef = useRef<HTMLElement>(null);
  const stackRef = useRef<HTMLElement>(null);
  const testimonialsRef = useRef<HTMLElement>(null);

  // ── Loader States ──
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStage, setLoadingStage] = useState("Initializing Swarm...");
  const [showLoader, setShowLoader] = useState(true);
  const [fadeLoader, setFadeLoader] = useState(false);

  // ── Loader Effect ──
  useEffect(() => {
    let timer: any;
    const updateProgress = () => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setFadeLoader(true);
            setTimeout(() => {
              setShowLoader(false);
            }, 800);
          }, 500);
          return 100;
        }

        const step = Math.floor(Math.random() * 8) + 3;
        const next = Math.min(prev + step, 100);

        if (next < 20) {
          setLoadingStage("Initializing Multi-Agent Swarm...");
        } else if (next < 45) {
          setLoadingStage("Deploying Privacy Guard Filters...");
        } else if (next < 68) {
          setLoadingStage("Activating Multimodal Vision Agents...");
        } else if (next < 88) {
          setLoadingStage("Optimizing SEO Ranking Indices...");
        } else {
          setLoadingStage("Synchronizing Store Sync Adapters...");
        }

        return next;
      });
    };

    timer = setInterval(updateProgress, 100);
    return () => clearInterval(timer);
  }, []);

  // ── Services Section Scroll Observer ──
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setServicesVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (servicesRef.current) observer.observe(servicesRef.current);
    return () => observer.disconnect();
  }, []);

  // ── Method Section Scroll Observer ──
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMethodVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (methodRef.current) observer.observe(methodRef.current);
    return () => observer.disconnect();
  }, []);

  // ── Solution Section Scroll Observer ──
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSolutionVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (solutionRef.current) observer.observe(solutionRef.current);
    return () => observer.disconnect();
  }, []);

  // ── Process Section Scroll Observer ──
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setProcessVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (processRef.current) observer.observe(processRef.current);
    return () => observer.disconnect();
  }, []);

  // ── Benefits Section Scroll Observer ──
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setBenefitsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (benefitsRef.current) observer.observe(benefitsRef.current);
    return () => observer.disconnect();
  }, []);

  // ── Stack Section Scroll Observer ──
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStackVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (stackRef.current) observer.observe(stackRef.current);
    return () => observer.disconnect();
  }, []);

  // ── Testimonials Section Scroll Observer ──
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTestimonialsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (testimonialsRef.current) observer.observe(testimonialsRef.current);
    return () => observer.disconnect();
  }, []);

  const renderLoaderRing = (dots: number, radius: number, animateClass: string) => {
    return (
      <div
        className={`absolute rounded-full border border-dashed border-zinc-800/10 flex items-center justify-center ${animateClass}`}
        style={{ width: radius * 2, height: radius * 2 }}
      >
        {Array.from({ length: dots }).map((_, i) => {
          const angle = (i * 360) / dots;
          const x = radius + radius * Math.cos((angle * Math.PI) / 180) - 2;
          const y = radius + radius * Math.sin((angle * Math.PI) / 180) - 2;

          // Trailing fade effect: dots scale and opacity varies by position
          const opacity = 0.08 + 0.92 * (i / dots);
          const scale = 0.6 + 0.6 * (i / dots);

          return (
            <div
              key={i}
              className="absolute w-1 h-1 md:w-1.2 md:h-1.2 rounded-full bg-zinc-50 shadow-[0_0_8px_rgba(255,255,255,0.7)]"
              style={{
                left: x,
                top: y,
                opacity: opacity,
                transform: `scale(${scale})`,
              }}
            />
          );
        })}
      </div>
    );
  };

  const handleNextService = () => {
    setCurrentService((prev) => (prev + 1) % SERVICES_DATA.length);
  };

  const handlePrevService = () => {
    setCurrentService((prev) => (prev - 1 + SERVICES_DATA.length) % SERVICES_DATA.length);
  };

  const renderServiceVisual = (index: number) => {
    switch (index) {
      case 0:
        return (
          <div className="flex-1 flex flex-col justify-between h-full font-mono text-xs">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
              <span className="text-zinc-500">privacy_agent_log.txt</span>
              <span className="flex items-center gap-1 text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
                <ShieldCheck className="w-3 h-3" /> Secure
              </span>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto text-zinc-400 select-none">
              <div className="space-y-1">
                <p className="text-zinc-600">// Processing raw vendor invoice...</p>
                <p>Supplier: <span className="bg-zinc-950 text-zinc-200 px-1.5 py-0.5 rounded border border-zinc-600/30 font-bold">[REDACTED: Sourcing Ltd]</span></p>
                <p>Wholesale Price: <span className="bg-zinc-950 text-zinc-200 px-1.5 py-0.5 rounded border border-zinc-600/30 font-bold">[REDACTED: $11.40]</span></p>
              </div>
              <div className="space-y-1 mt-2">
                <p className="text-zinc-600">// Scrubbing customer records...</p>
                <p>Shipping Details: <span className="bg-zinc-950 text-zinc-200 px-1.5 py-0.5 rounded border border-zinc-600/30 font-bold">[REDACTED: PII Removed]</span></p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-800 flex justify-between items-center text-zinc-500 text-[10px]">
              <span>System Output Sanitized</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> 100% Secure
              </span>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="flex-1 flex flex-col justify-between h-full text-sm">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
              <span className="font-mono text-xs text-zinc-500">vision_agent_scan.img</span>
              <span className="flex items-center gap-1 text-zinc-300 bg-zinc-700/20 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
                <Bot className="w-3 h-3" /> Image Scan
              </span>
            </div>
            <div className="flex-1 flex gap-4 items-center justify-center">
              <div className="relative w-32 h-32 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-zinc-700/20 to-zinc-900/20" />
                <span className="text-3xl animate-bounce">👟</span>
                <div className="absolute left-0 right-0 h-0.5 bg-zinc-1000/50 shadow-[0_0_10px_#a855f7] animate-pulse top-1/2" />
              </div>
              <div className="flex-1 space-y-2 font-mono text-[11px] text-zinc-400">
                <div className="flex justify-between items-center bg-zinc-900/50 p-1.5 rounded border border-zinc-800">
                  <span className="text-zinc-500">Color</span>
                  <span className="text-white font-medium">Crimson Red</span>
                </div>
                <div className="flex justify-between items-center bg-zinc-900/50 p-1.5 rounded border border-zinc-800">
                  <span className="text-zinc-500">Material</span>
                  <span className="text-white font-medium">Mesh / Leather</span>
                </div>
                <div className="flex justify-between items-center bg-zinc-900/50 p-1.5 rounded border border-zinc-800">
                  <span className="text-zinc-500">Brand Logo</span>
                  <span className="text-emerald-400 font-medium">Detected (✓)</span>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-800 flex justify-between items-center text-zinc-500 text-[10px]">
              <span>Attributes Extracted</span>
              <span className="text-zinc-300 font-bold">Confidence 98%</span>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="flex-1 flex flex-col justify-between h-full text-sm">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
              <span className="font-mono text-xs text-zinc-500">seo_optimizer_score.json</span>
              <span className="flex items-center gap-1 text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
                <Search className="w-3 h-3" /> SEO Optimized
              </span>
            </div>
            <div className="flex-1 space-y-4">
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 space-y-1">
                <div className="flex items-center gap-1 text-xs text-zinc-500">
                  <span>google.com</span>
                  <span>›</span>
                  <span>products</span>
                </div>
                <h5 className="text-zinc-300 font-medium text-xs hover:underline cursor-pointer">
                  Crimson Red Running Shoes | Premium Lightweight Mesh
                </h5>
                <p className="text-[11px] text-zinc-500 leading-relaxed line-clamp-2">
                  Shop our Crimson Red Running Shoes. Featuring lightweight breathable mesh, durable sole grip, and custom comfort support. Order now!
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {["#runningshoes", "#crimsonred", "#lightweight", "#meshshoes"].map((kw, idx) => (
                  <span key={idx} className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-800 flex justify-between items-center text-zinc-500 text-[10px]">
              <span>SEO Health Index</span>
              <span className="text-amber-400 font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" /> Score: 98/100
              </span>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="flex-1 flex flex-col justify-between h-full text-xs">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
              <div className="flex gap-2">
                <span className="px-2 py-0.5 rounded bg-zinc-1000/10 border border-zinc-600/20 text-zinc-300 font-medium">Shopify</span>
                <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-500">Instagram</span>
                <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-500">WhatsApp</span>
              </div>
              <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Adapters Ready</span>
            </div>
            <div className="flex-1 flex flex-col justify-center bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-4 space-y-2 select-none">
              <p className="font-semibold text-zinc-200">🛒 Title: Crimson Red Lightweight Running Shoes</p>
              <p className="text-zinc-400 leading-relaxed line-clamp-3">
                Elevate your daily running routine with these high-performance Crimson Red shoes. Engineered with breathable mesh upper, secure non-slip traction soles, and reinforced heel cup for optimal support.
              </p>
              <div className="flex gap-4 text-[10px] text-zinc-500 mt-2 font-mono">
                <span>Words: 34</span>
                <span>Readability: Grade A</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-800 flex justify-between items-center text-zinc-500 text-[10px]">
              <span>Platform Customization</span>
              <span className="text-zinc-300 font-bold">4 Channels Active</span>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="flex-1 flex flex-col justify-between h-full text-xs font-mono">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
              <span>api_sync_service.log</span>
              <span className="flex items-center gap-1 text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
                <CheckCircle2 className="w-3 h-3" /> Connected
              </span>
            </div>
            <div className="flex-1 flex flex-col justify-center items-center text-center space-y-3 my-2">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xl shadow-lg">
                  🛍️
                </div>
                <div className="absolute -bottom-1 -right-1 w-4.5 h-4.5 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[9px] border-2 border-zinc-950 font-bold">
                  ✓
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-zinc-200 text-xs font-semibold">Publishing Draft to Store</p>
                <p className="text-zinc-500 text-[9px]">Destination: your-store.myshopify.com</p>
              </div>
              <div className="w-full max-w-[160px] h-1 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-zinc-700 to-emerald-400 rounded-full w-full animate-pulse" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-800 flex justify-between items-center text-zinc-500 text-[10px]">
              <span>Shopify Sync State</span>
              <span className="text-emerald-400 font-bold">Synced Successfully</span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const faqs = [
    {
      category: "General Questions",
      question: "What makes Verion AI's approach different?",
      answer: "Unlike generic LLM wrappers, Verion AI utilizes a multi-agent swarm architecture. We have specialized agents for content extraction, SEO optimization, privacy sanitization, and quality validation. This ensures highly accurate, brand-safe e-commerce content at scale."
    },
    {
      category: "Getting Started",
      question: "How do we know if AI is right for our store?",
      answer: "If you have a large product catalog and struggle to maintain consistent, high-quality, SEO-optimized descriptions, AI is a perfect fit. We offer a Readiness Assessment to identify your highest-impact use cases."
    },
    {
      category: "Implementation",
      question: "What happens during the onboarding process?",
      answer: "We connect directly to your Shopify or e-commerce platform. Our team configures the privacy guards and brand voice guidelines. Within days, we generate a small batch of prototype listings for your approval before scaling up."
    },
    {
      category: "Results",
      question: "How do you measure success?",
      answer: "We track core e-commerce metrics: organic traffic lift (via SEO improvements), conversion rate changes on updated listings, and the sheer volume of hours saved by automating manual content entry."
    }
  ];

  const faqTabs = ["All Questions", "General Questions", "Getting Started", "Implementation", "Results"];
  const filteredFaqs = activeFaqTab === "All Questions" ? faqs : faqs.filter(f => f.category === activeFaqTab);

  const toggleCard = (index: number) => {
    setActiveCard(activeCard === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-primary/30 relative">

      {/* ── Premium Landing Loader Overlay ── */}
      {showLoader && (
        <div
          className={`fixed inset-0 z-50 bg-[#020204] flex flex-col items-center justify-center transition-all duration-800 ease-in-out ${fadeLoader ? 'opacity-0 pointer-events-none scale-105 blur-sm' : 'opacity-100'
            }`}
        >
          <div className="relative w-80 h-80 flex items-center justify-center">
            {/* Inner Glow Background */}
            <div className="absolute w-44 h-44 rounded-full bg-zinc-1000/5 blur-[80px]" />

            {/* Concentric Rotating Dotted Rings */}
            {renderLoaderRing(16, 60, "animate-spin-slow")}
            {renderLoaderRing(24, 85, "animate-spin-reverse-medium")}
            {renderLoaderRing(32, 110, "animate-spin-medium")}
            {renderLoaderRing(40, 135, "animate-spin-reverse-slow")}

            {/* Central Glowing Logo (Verion AI) */}
            <div className="relative z-10 w-32 h-32 flex items-center justify-center rounded-full border border-zinc-600/20 backdrop-blur-md shadow-[0_0_40px_rgba(168,85,247,0.25)] overflow-hidden bg-black">
              <img
                src={verionLogo}
                alt="Verion AI Logo"
                className="w-full h-full object-cover scale-[1.6] mix-blend-screen drop-shadow-[0_0_20px_rgba(168,85,247,0.8)] animate-pulse"
              />
            </div>
          </div>

          {/* Progress & Stage Description */}
          <div className="mt-8 text-center space-y-2.5 z-10 select-none">
            <p className="text-zinc-500 font-mono tracking-widest text-[10px] uppercase">
              {loadingStage}
            </p>
            <p className="text-white font-sans text-sm tracking-wider font-light">
              Getting Ready In <span className="font-mono text-zinc-300 font-semibold">{loadingProgress}%</span>
            </p>
          </div>
        </div>
      )}

      {/* ── Main Landing Page Content Wrapper ── */}
      <div
        className={showLoader ? `transition-all duration-1000 ease-out ${fadeLoader ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-99 pointer-events-none'}` : ''}
      >


        {/* ── Navbar ── */}
        <nav className="sticky top-0 w-full z-50 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-900">
          <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-black flex items-center justify-center border border-zinc-800">
                <img
                  src={verionLogo}
                  alt="Verion AI Logo"
                  className="w-full h-full object-cover scale-[1.8] mix-blend-screen"
                />
              </div>
              <span className="text-xl tracking-tight font-medium text-white">
                Verion AI
              </span>
            </div>

            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400 ml-auto">
              <a href="#" className="hover:text-white transition-colors">Home</a>
              <a href="#problem" className="hover:text-white transition-colors">Problem</a>
              <a href="#solution" className="hover:text-white transition-colors">Solution</a>
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
              <a href="#tech" className="hover:text-white transition-colors">Technology</a>
              <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            </div>

            <button className="md:hidden text-white cursor-pointer relative z-50 p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu Drawer */}
          <div className={`absolute top-full left-0 right-0 bg-zinc-950/95 backdrop-blur-xl border-b border-zinc-900 shadow-2xl transition-all duration-300 md:hidden overflow-hidden ${mobileMenuOpen ? 'max-h-[500px] opacity-100 py-8 px-6' : 'max-h-0 opacity-0 pointer-events-none'}`} style={{ zIndex: 40 }}>
            <div className="flex flex-col items-center justify-center gap-6 text-lg font-medium text-zinc-300">
              <a href="#" onClick={() => setMobileMenuOpen(false)} className="hover:text-white transition-colors block">Home</a>
              <a href="#problem" onClick={() => setMobileMenuOpen(false)} className="hover:text-white transition-colors block">Problem</a>
              <a href="#solution" onClick={() => setMobileMenuOpen(false)} className="hover:text-white transition-colors block">Solution</a>
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="hover:text-white transition-colors block">Features</a>
              <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="hover:text-white transition-colors block">How It Works</a>
              <a href="#tech" onClick={() => setMobileMenuOpen(false)} className="hover:text-white transition-colors block">Technology</a>
              <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="hover:text-white transition-colors block">FAQ</a>
            </div>
          </div>
        </nav>

        <main>

          {/* ── Hero Section (Dark) ── */}
          <section className="relative min-h-screen pt-32 pb-24 px-6 flex flex-col justify-center items-center overflow-hidden bg-zinc-950">
            {/* Animated drifting dots layer 1 — larger, primary drift */}
            <div className="absolute inset-0 z-0 opacity-40 bg-dots-animated animate-[zoom-through_10s_ease-in_infinite]" />
            {/* Animated drifting dots layer 2 — smaller, counter drift for depth */}
            <div className="absolute inset-0 z-0 opacity-20 bg-dots-animated-slow" />

            <div className="relative z-10 max-w-5xl mx-auto text-center">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/15 text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400 mb-6 bg-white/5 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500 shadow-[0_0_6px_#3b82f6]"></span>
                </span>
                Agentic AI
              </span>
              <h1 className="text-4xl md:text-7xl font-semibold tracking-tight leading-[1.1] mb-6 max-w-4xl mx-auto bg-gradient-to-b from-white to-zinc-300 bg-clip-text text-transparent">
                Engineered AI Agents for Autonomous E-commerce Content Operations
              </h1>

              <p className="text-lg md:text-xl text-zinc-400 mb-10 max-w-3xl mx-auto font-light leading-relaxed">
                Precision-built multi-agent swarms that generate, optimize, validate, and deploy product content — engineered for scale, accuracy, and zero manual intervention.
              </p>

              <div className="flex flex-wrap justify-center items-center gap-4 mb-16">
                <Link to="/dashboard" className="px-8 py-4 rounded-full bg-white text-zinc-950 font-semibold text-sm hover:bg-zinc-200 transition-all shadow-lg active:scale-95 flex items-center gap-2">
                  Get Started <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>


          </section>

          {/* ── Integrations / Logo Bar ── */}
          <section className="py-12 bg-[#faf9f6] border-t border-b border-zinc-200 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
              <p className="text-center text-[10px] font-mono tracking-widest text-zinc-500 uppercase mb-8">
                Seamless API Integrations
              </p>
              <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                <div className="flex items-center gap-2 text-zinc-950 font-medium tracking-wide">
                  <span className="text-emerald-500 text-lg">🛒</span> Shopify
                </div>
                <div className="flex items-center gap-2 text-zinc-950 font-medium tracking-wide">
                  <span className="text-zinc-500 text-lg">🛍️</span> WooCommerce
                </div>
                <div className="flex items-center gap-2 text-zinc-950 font-medium tracking-wide">
                  <span className="text-red-500 text-lg">📦</span> AliExpress
                </div>
                <div className="flex items-center gap-2 text-zinc-950 font-medium tracking-wide">
                  <span className="text-zinc-500 text-lg">⚡</span> Headless APIs
                </div>
              </div>
            </div>
          </section>

          {/* ── Problem Section (Dark) ── */}
          <section id="problem" className="py-20 px-6 bg-zinc-950 text-white relative border-b border-zinc-900">
            <div className="max-w-7xl mx-auto">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-zinc-300 font-medium mb-3 block text-sm font-mono uppercase tracking-widest">The Challenge</span>
                <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-4">
                  Challenges Store Owners Face
                </h2>
                <p className="text-base text-zinc-400 font-light">
                  Managing an e-commerce catalog is tedious, error-prone, and holds back growth. Click to see details.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    title: "Poor Product Descriptions",
                    desc: "Sourcing manufacturers write technical, uninspired descriptions that fail to pitch the product value or address buyers' needs.",
                    icon: <FileText className="w-6 h-6 text-zinc-300" />
                  },
                  {
                    title: "Low Conversion Rates",
                    desc: "Weak copywriting and lack of structured metadata fail to capture visitor interest, resulting in high bounce rates.",
                    icon: <TrendingUp className="w-6 h-6 text-zinc-300" />
                  },
                  {
                    title: "SEO Visibility Deficits",
                    desc: "Missing target keyword optimizations, poor alt texts, and lack of structured titles mean you lose organic search traffic to competitors.",
                    icon: <Search className="w-6 h-6 text-zinc-300" />
                  },
                  {
                    title: "Inconsistent Brand Voice",
                    desc: "When multiple teammates or simple scripts edit listings, tone and structure vary widely, confusing your target audience.",
                    icon: <Layers className="w-6 h-6 text-zinc-300" />
                  },
                  {
                    title: "Manual Overhead & Hours",
                    desc: "Manually copywriting and formatting hundreds of draft products takes hours of valuable time that should be spent scaling growth.",
                    icon: <Clock className="w-6 h-6 text-zinc-300" />
                  },
                  {
                    title: "Data & Privacy Leakage",
                    desc: "Plugging store logs and wholesale prices directly into generic public LLMs risks leaking proprietary supplier IP and pricing structures.",
                    icon: <Lock className="w-6 h-6 text-zinc-300" />
                  }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className={`rounded-3xl border overflow-hidden p-6 text-white flex flex-col shadow-xl cursor-pointer group transition-all duration-500 ease-out active:scale-[0.98] ${activeChallenge === idx
                      ? 'bg-black/60 backdrop-blur-xl border-zinc-600/30 shadow-[0_25px_50px_rgba(0,0,0,0.12)]'
                      : 'border-white/5 bg-dot-matrix-thick hover:-translate-y-2 hover:border-zinc-600/20 hover:shadow-[0_20px_40px_rgba(255,255,255,0.03)]'
                      }`}
                    onClick={() => setActiveChallenge(activeChallenge === idx ? null : idx)}
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-zinc-1000/10 border border-zinc-600/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        {item.icon}
                      </div>
                      <Maximize2 className={`w-4 h-4 text-zinc-500 transition-all duration-500 group-hover:text-white ${activeChallenge === idx ? 'text-white rotate-180 scale-110' : ''}`} />
                    </div>
                    <h3 className="text-xl font-medium tracking-tight mb-2 text-white">{item.title}</h3>
                    <div className={`grid transition-all duration-500 ease-in-out ${activeChallenge === idx ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0'}`}>
                      <div className="overflow-hidden">
                        <p className="text-zinc-300 text-sm leading-relaxed font-light tracking-wide pt-1">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Solution Section ── */}
          <section id="solution" ref={solutionRef} className="py-12 px-6 text-zinc-950 relative bg-[#faf9f6] overflow-hidden">
            <div className="max-w-7xl mx-auto relative z-10">
              {/* Header */}
              <div className={`mb-8 transition-all duration-700 ease-out ${solutionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                <span className="text-zinc-500 font-medium mb-2 block text-xs font-mono uppercase tracking-widest">The Solution</span>
                <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-zinc-950 mb-1">Multi-Agent AI Platform</h2>
                <p className="text-sm text-zinc-500 font-light max-w-xl">Specialized agents collaborate to generate, optimize, validate, and publish your product content automatically.</p>
              </div>

              {/* Agent Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                  { name: "Content Generator", role: "Description Writer", stage: "Drafting", desc: "Creates rich product titles, bullet points, and descriptions from raw specs. It analyzes brand guidelines to ensure tone consistency and automatically highlights key selling features for maximum customer engagement.", icon: <FileText className="w-5 h-5 text-violet-600" /> },
                  { name: "SEO Agent", role: "Discoverability", stage: "Optimization", desc: "Embeds target keywords and optimizes page titles and meta tags for search. It continuously monitors search trends and algorithm updates, ensuring your products consistently rank on the first page.", icon: <Search className="w-5 h-5 text-sky-600" /> },
                  { name: "Privacy Agent", role: "Security Guard", stage: "Sanitization", desc: "Redacts supplier names, margin data, and PII before any content goes live. This ensures compliance with global data protection regulations while protecting your proprietary wholesale information.", icon: <Lock className="w-5 h-5 text-emerald-600" /> },
                  { name: "Validator Agent", role: "Quality Auditor", stage: "Auditing", desc: "Checks grammar, readability, and brand compliance across all drafts. It flags inconsistencies, prevents hallucinatory claims, and guarantees that published listings meet enterprise quality standards.", icon: <CheckCircle2 className="w-5 h-5 text-amber-600" /> },
                  { name: "Manager Agent", role: "Coordinator", stage: "Delivery", desc: "Orchestrates the pipeline and routes approved content for one-click publishing. It handles task delegation between agents, manages API rate limits, and provides real-time progress tracking.", icon: <Cpu className="w-5 h-5 text-orange-600" /> }
                ].map((agent, aIdx) => (
                  <div
                    key={aIdx}
                    className={`rounded-2xl border overflow-hidden p-4 flex flex-col shadow-sm cursor-pointer group transition-all duration-500 ease-out active:scale-[0.97] ${activeChallenge === (aIdx + 100)
                      ? 'bg-white border-zinc-400 shadow-[0_12px_28px_rgba(0,0,0,0.10)]'
                      : 'border-zinc-200 bg-white hover:-translate-y-1 hover:border-zinc-400 hover:shadow-md'
                      } ${solutionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
                    style={{ transitionDelay: solutionVisible ? `${200 + aIdx * 100}ms` : '0ms' }}
                    onClick={() => setActiveChallenge(activeChallenge === (aIdx + 100) ? null : (aIdx + 100))}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="w-9 h-9 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-zinc-200 transition-all duration-300">
                        {agent.icon}
                      </div>
                      <Maximize2 className={`w-3 h-3 text-zinc-400 transition-all duration-300 group-hover:text-zinc-600 ${activeChallenge === (aIdx + 100) ? 'text-zinc-600 rotate-180' : ''}`} />
                    </div>
                    <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-400 mb-0.5">{agent.stage}</span>
                    <h4 className="text-xs font-semibold text-zinc-950 leading-tight mb-0.5">{agent.name}</h4>
                    <p className="text-[10px] text-zinc-500 font-mono">{agent.role}</p>
                    <div className={`grid transition-all duration-400 ease-in-out ${activeChallenge === (aIdx + 100) ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0'}`}>
                      <div className="overflow-hidden">
                        <p className="text-sm text-zinc-600 leading-relaxed pt-3 border-t border-zinc-200">{agent.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── How It Works (Dark) ── */}
          <section id="how-it-works" ref={processRef} className="py-12 px-6 bg-zinc-900 text-white relative border-b border-zinc-800">
            <div className="max-w-7xl mx-auto">
              <div className={`mb-8 transition-all duration-700 ease-out ${processVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                <span className="text-zinc-500 font-medium mb-1 block text-xs font-mono uppercase tracking-widest">The Process</span>
                <h2 className="text-2xl md:text-3xl font-medium tracking-tight mb-1">Simple 5-Step Workflow</h2>
                <p className="text-sm text-zinc-400 font-light">How Verion AI optimizes your store listings end-to-end.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                  { step: "01", title: "Connect Store", desc: "Integrate Shopify, WooCommerce, or headless APIs in just one click. Securely authenticate your store to allow seamless synchronization of your product catalog and inventory data without technical overhead." },
                  { step: "02", title: "Import Listings", desc: "Select specific products, categories, or entire collections to optimize. Our platform instantly pulls raw specifications, existing descriptions, and metadata into the workspace for AI analysis." },
                  { step: "03", title: "Choose Goals", desc: "Configure your desired brand voice, target audience, and primary SEO objectives. Set rules for formatting, keyword density, and tone to align perfectly with your marketing strategy." },
                  { step: "04", title: "AI Swarm Run", desc: "A swarm of specialized agents generates, optimizes, and validates the content in parallel. You can monitor the live pipeline as agents collaborate to produce high-converting copy in seconds." },
                  { step: "05", title: "Approve & Go Live", desc: "Review the finalized content in our intuitive dashboard. With a single click, approve the optimized listings and automatically push the synchronized updates back to your live storefront." }
                ].map((item, stepIdx) => (
                  <div
                    key={stepIdx}
                    className={`flex flex-col gap-2 p-4 rounded-2xl border cursor-pointer transition-all duration-500 ease-out group ${activeChallenge === (stepIdx + 200)
                      ? 'border-zinc-700/60 bg-zinc-800/80'
                      : 'border-white/5 bg-zinc-800/40 hover:border-zinc-700/40 hover:bg-zinc-800/60'
                      } ${processVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
                      }`}
                    style={{ transitionDelay: processVisible ? `${200 + stepIdx * 100}ms` : '0ms' }}
                    onClick={() => setActiveChallenge(activeChallenge === (stepIdx + 200) ? null : (stepIdx + 200))}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="font-mono text-xs font-bold text-zinc-500 group-hover:text-zinc-400 transition-colors">{item.step}</span>
                      <Maximize2 className={`w-3 h-3 text-zinc-600 transition-all duration-400 group-hover:text-zinc-400 ${activeChallenge === (stepIdx + 200) ? 'text-white rotate-180' : ''}`} />
                    </div>
                    <h3 className="text-xs font-semibold text-white leading-tight">{item.title}</h3>
                    <div className={`grid transition-all duration-400 ease-in-out ${activeChallenge === (stepIdx + 200) ? 'grid-rows-[1fr] opacity-100 mt-3' : 'grid-rows-[0fr] opacity-0'}`}>
                      <div className="overflow-hidden">
                        <p className="text-zinc-400 text-sm leading-relaxed font-normal pt-3 border-t border-white/10">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Features Section (Light) ── */}
          <section id="features" ref={servicesRef} className="py-20 px-8 text-zinc-950 relative bg-[#faf9f6] border-t border-zinc-200">
            <div className="max-w-7xl mx-auto relative z-10">

              {/* Section header */}
              <div className={`mb-16 transition-all duration-700 ease-out ${servicesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`}>
                <span className="text-zinc-500 font-medium block text-lg mb-1">Features &amp; Capabilities</span>
                <h2 className="text-3xl md:text-4xl font-semibold text-zinc-900 mt-2 mb-3">Everything You Need, Built In</h2>
                <p className="text-zinc-500 text-base max-w-xl">Each capability is a dedicated AI agent — working in parallel to maximize every listing's potential.</p>
              </div>

              {/* ── Carousel Preview Strip ── */}
              <div className={`rounded-3xl border border-zinc-200 bg-white shadow-sm overflow-hidden transition-all duration-700 ease-out delay-[500ms] ${servicesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <div className="grid lg:grid-cols-2 gap-0 items-stretch">

                  {/* Visual Preview (Dark Card) */}
                  <div className="relative min-h-[380px] bg-zinc-900 p-6 md:p-8 flex flex-col justify-between overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/10 via-zinc-900/40 to-transparent pointer-events-none" />
                    <div className="absolute inset-0 bg-dot-matrix opacity-10 pointer-events-none" />
                    <div className="relative z-10 w-full h-full flex flex-col">
                      {renderServiceVisual(currentService)}
                    </div>
                  </div>

                  {/* Service Details */}
                  <div className="flex flex-col justify-center p-8 md:p-10 min-h-[380px]">
                    <span className="text-[10px] uppercase tracking-widest font-mono text-zinc-400 font-bold mb-3 block transition-all duration-300">
                      {SERVICES_DATA[currentService].category}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-semibold mb-4 text-zinc-950 transition-all duration-300">
                      {SERVICES_DATA[currentService].title}
                    </h3>
                    <p className="text-base text-zinc-500 leading-relaxed mb-10 min-h-[80px] transition-all duration-300">
                      {SERVICES_DATA[currentService].description}
                    </p>

                    {/* Controls */}
                    <div className="flex items-center justify-between">
                      {/* Dot indicators */}
                      <div className="flex gap-2 items-center">
                        {SERVICES_DATA.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentService(idx)}
                            aria-label={`Go to feature ${idx + 1}`}
                            className={`rounded-full transition-all duration-300 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-zinc-400
                              ${currentService === idx
                                ? 'w-6 h-2.5 bg-zinc-900'
                                : 'w-2.5 h-2.5 bg-zinc-200 hover:bg-zinc-400 hover:scale-110'
                              }`}
                          />
                        ))}
                      </div>

                      {/* Prev / Next */}
                      <div className="flex gap-3">
                        <button
                          onClick={handlePrevService}
                          aria-label="Previous feature"
                          className="group/btn relative w-12 h-12 rounded-full border border-zinc-200 flex items-center justify-center
                            overflow-hidden cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-zinc-400
                            transition-all duration-300 hover:border-zinc-900 active:scale-90"
                        >
                          <span className="absolute inset-0 bg-zinc-900 scale-0 group-hover/btn:scale-100 rounded-full transition-transform duration-300 ease-out" />
                          <ChevronLeft className="relative z-10 w-5 h-5 text-zinc-500 group-hover/btn:text-white transition-colors duration-200" />
                        </button>
                        <button
                          onClick={handleNextService}
                          aria-label="Next feature"
                          className="group/btn relative w-12 h-12 rounded-full border border-zinc-200 flex items-center justify-center
                            overflow-hidden cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-zinc-400
                            transition-all duration-300 hover:border-zinc-900 active:scale-90"
                        >
                          <span className="absolute inset-0 bg-zinc-900 scale-0 group-hover/btn:scale-100 rounded-full transition-transform duration-300 ease-out" />
                          <ChevronRight className="relative z-10 w-5 h-5 text-zinc-500 group-hover/btn:text-white transition-colors duration-200" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`mt-12 pt-8 border-t border-zinc-200 flex items-center gap-4 transition-all duration-700 ease-out delay-[700ms] ${servicesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <span className="text-zinc-500 font-light">See how our agents work together</span>
                <Link
                  to="/dashboard"
                  className="group/link font-medium flex items-center gap-1.5 text-zinc-600 hover:text-zinc-950 transition-colors duration-200"
                >
                  Try the Agent Pipeline
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                </Link>
              </div>
            </div>
          </section>

          {/* ── Dashboard Preview & Before vs After (Dark) ── */}
          <section id="preview" className="py-16 px-6 bg-zinc-950 text-white relative border-b border-zinc-900">
            <div className="max-w-7xl mx-auto">
              <div className="text-center max-w-3xl mx-auto mb-12">
                <span className="text-zinc-400 font-medium mb-3 block text-sm font-mono uppercase tracking-widest">Platform Demo</span>
                <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-4">Interactive Dashboard Preview</h2>
                <p className="text-base text-zinc-400 font-light">
                  Click any product to see the AI swarm process it — live logs, before &amp; after outcome update instantly.
                </p>
              </div>

              <InteractiveDashboard products={DASHBOARD_PRODUCTS} />
            </div>
          </section>

          {/* ── 3-Phase Method (Light) ── */}
          <section
            id="method"
            ref={methodRef}
            className="py-32 px-6 text-zinc-950 relative bg-[#faf9f6] border-y border-zinc-200"
          >
            <div className="max-w-7xl mx-auto relative z-10">
              <div className="grid lg:grid-cols-12 gap-16">

                {/* Left Column Wrapper — full height track for sticky */}
                <div className="lg:col-span-5">
                  {/* Sticky container — NO transforms here, transforms break position:sticky */}
                  <div className="lg:sticky lg:top-32">
                    <span className={`text-zinc-500 font-medium mb-6 block text-lg transition-all duration-700 ease-out ${methodVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                      Our 3-Phase Delivery Approach
                    </span>
                    <h2 className={`text-4xl md:text-5xl font-medium tracking-tight leading-[1.1] mb-6 text-zinc-950 transition-all duration-700 ease-out delay-100 ${methodVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                      Structured 3-Phase AI Method
                    </h2>
                    <p className={`text-lg text-zinc-600 leading-relaxed transition-all duration-700 ease-out delay-200 ${methodVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                      AI delivers value only when linked to real outcomes. We pinpoint where AI truly helps, validate it fast, and scale what works. Our approach is direct: prove value quickly, then industrialize.
                    </p>
                  </div>
                </div>

                {/* Right Column: Stacked Cards */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                  {[
                    {
                      num: "01",
                      title: "Content Extraction & Privacy",
                      desc: "Three seconds to cut through the noise. We identify high-impact product details, assess feasibility across data, and build a sanitized prompt that protects your supplier IP.",
                    },
                    {
                      num: "02",
                      title: "SEO & Platform Optimization",
                      desc: "Agents specialized in Shopify, Amazon, or WooCommerce rewrite your listings to target exact search intent, vastly improving organic discoverability.",
                    },
                    {
                      num: "03",
                      title: "Quality & Validation",
                      desc: "A final managerial agent cross-references output against your brand guidelines, ensuring grammatical perfection and structural consistency before pushing live.",
                    }
                  ].map((card, i) => (
                    <div
                      key={i}
                      className={`rounded-3xl border overflow-hidden p-8 md:p-12 flex flex-col cursor-pointer group transition-all duration-500 ease-out active:scale-[0.98] ${activeCard === i
                        ? 'bg-zinc-900 border-zinc-700 shadow-2xl'
                        : 'border-zinc-800 bg-zinc-900/90 hover:-translate-y-2 hover:border-zinc-600 hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)]'
                        } ${methodVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
                      style={{ transitionDelay: methodVisible ? `${200 + i * 200}ms` : '0ms' }}
                      onClick={() => toggleCard(i)}
                    >
                      <div className="flex justify-between items-start mb-14">
                        <span className={`text-xs font-mono uppercase tracking-[0.2em] transition-all duration-300 ${activeCard === i ? 'text-zinc-400' : 'text-zinc-600 group-hover:text-zinc-400'}`}>{card.num}</span>
                        <Maximize2 className={`w-4 h-4 transition-all duration-500 ease-out ${activeCard === i ? 'text-white rotate-180 scale-110' : 'text-zinc-600 group-hover:text-zinc-400'}`} />
                      </div>
                      <h4 className={`text-xl md:text-2xl font-semibold tracking-tight mb-2 transition-all duration-300 ${activeCard === i ? 'text-white' : 'text-zinc-200 group-hover:text-white'}`}>{card.title}</h4>
                      <div className={`grid transition-all duration-500 ease-in-out ${activeCard === i ? 'grid-rows-[1fr] opacity-100 mt-5' : 'grid-rows-[0fr] opacity-0 mt-0'}`}>
                        <div className="overflow-hidden">
                          <p className="text-zinc-400 leading-relaxed text-sm font-normal pt-4 border-t border-white/10">
                            {card.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── Case Studies (Carousel) ── */}
          <section id="cases" className="py-32 bg-zinc-950 text-white overflow-hidden border-t border-zinc-900">
            <div className="max-w-7xl mx-auto px-6 mb-12">
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-zinc-500 font-medium mb-4 block text-lg">Case Studies</span>
                  <h2 className="text-4xl md:text-5xl font-medium tracking-tight">
                    Proven Outcomes <br />from Real Projects
                  </h2>
                </div>
                <button
                  onClick={() => setShowAllCases(!showAllCases)}
                  className="btn-pill-dark bg-white text-zinc-950 border-white hover:bg-zinc-200 flex items-center transition-all duration-300 active:scale-95"
                >
                  {showAllCases ? "Show Carousel" : "All Case Studies"}
                  <ArrowRight className={`w-4 h-4 ml-2 transition-transform duration-300 ${showAllCases ? 'rotate-90' : ''}`} />
                </button>
              </div>
            </div>

            {/* Horizontal Scroll Container or Grid View */}
            {showAllCases ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6 lg:px-12 max-w-7xl mx-auto transition-all duration-500 ease-in-out">
                {CASE_STUDIES.map((study, i) => (
                  <div
                    key={i}
                    className="relative w-full h-[500px] rounded-3xl overflow-hidden cursor-pointer group"
                    onClick={() => setActiveCaseStudy(activeCaseStudy === i ? null : i)}
                  >
                    {/* Background Image with Zoom Effect */}
                    <div
                      className={`absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out ${activeCaseStudy === i ? 'scale-110' : 'scale-100 group-hover:scale-[1.03]'}`}
                      style={{ backgroundImage: `url(${study.bg})` }}
                    ></div>

                    {/* Dark Overlay for text readability */}
                    <div className={`absolute inset-0 bg-black transition-opacity duration-700 ${activeCaseStudy === i ? 'opacity-70' : 'opacity-40'}`}></div>

                    {/* Dot Matrix Overlay */}
                    <div className="absolute inset-0 bg-dot-matrix opacity-30 mix-blend-overlay pointer-events-none"></div>

                    {/* Content */}
                    <div className="absolute inset-0 p-8 flex flex-col justify-between z-10 pointer-events-none">
                      {/* Top Tag */}
                      <div className="flex items-center gap-2">
                        <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium border border-white/20">
                          AI
                        </span>
                        <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium border border-white/20">
                          {study.tag}
                        </span>
                      </div>

                      {/* Bottom Text */}
                      <div>
                        <h3 className="text-2xl font-medium mb-2">{study.title}</h3>
                        <div className={`grid transition-all duration-500 ease-in-out pointer-events-auto ${activeCaseStudy === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                          <div className="overflow-hidden">
                            <p className="text-zinc-300 text-sm md:text-base leading-relaxed pt-2">
                              {study.desc}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex gap-6 overflow-x-auto pb-12 px-6 lg:px-12 snap-x snap-mandatory hide-scrollbar max-w-[100vw] transition-all duration-500 ease-in-out">
                {CASE_STUDIES.map((study, i) => (
                  <div
                    key={i}
                    className="relative min-w-[320px] md:min-w-[400px] h-[500px] rounded-3xl overflow-hidden shrink-0 snap-center cursor-pointer group"
                    onClick={() => setActiveCaseStudy(activeCaseStudy === i ? null : i)}
                  >
                    {/* Background Image with Zoom Effect */}
                    <div
                      className={`absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out ${activeCaseStudy === i ? 'scale-110' : 'scale-100 group-hover:scale-[1.03]'}`}
                      style={{ backgroundImage: `url(${study.bg})` }}
                    ></div>

                    {/* Dark Overlay for text readability */}
                    <div className={`absolute inset-0 bg-black transition-opacity duration-700 ${activeCaseStudy === i ? 'opacity-70' : 'opacity-40'}`}></div>

                    {/* Dot Matrix Overlay */}
                    <div className="absolute inset-0 bg-dot-matrix opacity-30 mix-blend-overlay pointer-events-none"></div>

                    {/* Content */}
                    <div className="absolute inset-0 p-8 flex flex-col justify-between z-10 pointer-events-none">
                      {/* Top Tag */}
                      <div className="flex items-center gap-2">
                        <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium border border-white/20">
                          AI
                        </span>
                        <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium border border-white/20">
                          {study.tag}
                        </span>
                      </div>

                      {/* Bottom Text */}
                      <div>
                        <h3 className="text-2xl font-medium mb-2">{study.title}</h3>
                        <div className={`grid transition-all duration-500 ease-in-out pointer-events-auto ${activeCaseStudy === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                          <div className="overflow-hidden">
                            <p className="text-zinc-300 text-sm md:text-base leading-relaxed pt-2">
                              {study.desc}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ── Benefits Section ── */}
          <section ref={benefitsRef} className="py-10 px-6 text-zinc-950 relative bg-[#faf9f6] border-b border-zinc-200">
            <div className="max-w-7xl mx-auto relative z-10">
              <div className={`mb-7 transition-all duration-700 ease-out ${benefitsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                <span className="text-zinc-500 font-medium mb-1 block text-xs font-mono uppercase tracking-widest">Platform ROI</span>
                <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-zinc-950 mb-1">Key Benefits</h2>
                <p className="text-sm text-zinc-500 font-light">How automation changes e-commerce management.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                  { title: "Save 90% of Time", desc: "Automate content generation in seconds. Eliminate the tedious manual labor of writing product descriptions, allowing your merchandising team to focus on strategic growth initiatives and curation.", metric: "90%" },
                  { title: "+35% Conversions", desc: "Consistent, engaging listings that convert. By highlighting key features and using persuasive, benefit-driven language, our AI directly improves customer trust and add-to-cart rates.", metric: "+35%" },
                  { title: "2x Search Traffic", desc: "Keyword-optimized titles and meta tags. The SEO agent ensures your products match high-intent search queries, driving more organic traffic and reducing reliance on paid ad spend.", metric: "2×" },
                  { title: "Brand Consistency", desc: "Validator enforces tone and voice rules. Whether you have ten products or ten thousand, every single listing will sound like it was written by your best in-house copywriter.", metric: "100%" },
                  { title: "Infinite Scale", desc: "Batch push thousands of drafts in one click. Our robust architecture handles massive catalog updates simultaneously, making seasonal transitions and new inventory launches effortless.", metric: "∞" }
                ].map((item, bIdx) => (
                  <div
                    key={bIdx}
                    className={`p-4 rounded-2xl border shadow-sm flex flex-col cursor-pointer group transition-all duration-500 ease-out active:scale-[0.97] ${activeChallenge === (bIdx + 300)
                      ? 'bg-white/85 border-zinc-500 shadow-[0_12px_28px_rgba(0,0,0,0.10)]'
                      : 'bg-white/80 border-zinc-200 hover:border-zinc-500 hover:shadow-md'
                      } ${benefitsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
                      }`}
                    style={{ transitionDelay: benefitsVisible ? `${200 + bIdx * 100}ms` : '0ms' }}
                    onClick={() => setActiveChallenge(activeChallenge === (bIdx + 300) ? null : (bIdx + 300))}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-mono text-2xl font-bold text-zinc-950">{item.metric}</span>
                      <Maximize2 className={`w-3 h-3 text-zinc-500 transition-all duration-400 mt-1.5 group-hover:text-zinc-500 ${activeChallenge === (bIdx + 300) ? 'text-zinc-600 rotate-180' : ''}`} />
                    </div>
                    <h3 className="text-xs font-semibold text-zinc-950 leading-tight">{item.title}</h3>
                    <div className={`grid transition-all duration-400 ease-in-out ${activeChallenge === (bIdx + 300) ? 'grid-rows-[1fr] opacity-100 mt-3' : 'grid-rows-[0fr] opacity-0'}`}>
                      <div className="overflow-hidden">
                        <p className="text-zinc-600 text-sm leading-relaxed font-normal pt-3 border-t border-zinc-200">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Technology Section (Dark) ── */}
          <section id="tech" ref={stackRef} className="py-12 px-6 bg-zinc-950 text-white relative border-b border-zinc-900">
            <div className="max-w-7xl mx-auto">
              <div className={`mb-8 transition-all duration-700 ease-out ${stackVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                <span className="text-zinc-500 font-medium mb-1 block text-xs font-mono uppercase tracking-widest">Our Stack</span>
                <h2 className="text-2xl md:text-3xl font-medium tracking-tight mb-1">Engineered With Modern Tech</h2>
                <p className="text-sm text-zinc-500 font-light">High-performance backend orchestrating a secure multi-agent system.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {[
                  { title: "Multi-Agent Swarm", desc: "Built on LangGraph and Celery, our architecture enables specialized AI agents to collaborate, debate, and refine outputs asynchronously for maximum reasoning capability.", icon: <Bot className="w-4 h-4 text-zinc-400" /> },
                  { title: "FastAPI", desc: "A highly performant Python API backend that ensures rapid data processing, type safety, and seamless communication between the user dashboard and the AI worker nodes.", icon: <Cpu className="w-4 h-4 text-zinc-400" /> },
                  { title: "Celery + Redis", desc: "Robust async task queue handling thousands of concurrent generation jobs, ensuring the system remains responsive even during massive catalog synchronization events.", icon: <Layers className="w-4 h-4 text-zinc-400" /> },
                  { title: "ChromaDB", desc: "Advanced vector database for semantic search and retrieval-augmented generation (RAG), giving agents instant context regarding your past products and brand voice.", icon: <Database className="w-4 h-4 text-zinc-400" /> },
                  { title: "GPT-4o / Claude", desc: "Integrating state-of-the-art foundation models via secure API gateways, providing unparalleled language understanding, reasoning, and creative generation.", icon: <Sparkles className="w-4 h-4 text-zinc-400" /> },
                  { title: "Secure OAuth", desc: "Enterprise-grade authentication with AES encryption and HTTPS tokens, guaranteeing that your proprietary store data and supplier information remain strictly confidential.", icon: <ShieldCheck className="w-4 h-4 text-zinc-400" /> }
                ].map((item, tIdx) => (
                  <div
                    key={tIdx}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all duration-500 ease-out flex flex-col gap-2 ${activeChallenge === (tIdx + 400)
                      ? 'border-zinc-700/60 bg-zinc-900/60'
                      : 'border-white/5 bg-zinc-900/40 hover:border-zinc-700/40 hover:bg-zinc-900/60'
                      } ${stackVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
                      }`}
                    style={{ transitionDelay: stackVisible ? `${200 + tIdx * 100}ms` : '0ms' }}
                    onClick={() => setActiveChallenge(activeChallenge === (tIdx + 400) ? null : (tIdx + 400))}
                  >
                    <div className="flex justify-between items-center w-full">
                      <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700/50 flex items-center justify-center shrink-0">
                        {item.icon}
                      </div>
                      <Maximize2 className={`w-3 h-3 text-zinc-650 transition-all duration-400 group-hover:text-zinc-455 ${activeChallenge === (tIdx + 400) ? 'text-white rotate-180' : ''}`} />
                    </div>
                    <h3 className="text-xs font-semibold text-white leading-tight">{item.title}</h3>
                    <div className={`grid transition-all duration-400 ease-in-out ${activeChallenge === (tIdx + 400) ? 'grid-rows-[1fr] opacity-100 mt-3' : 'grid-rows-[0fr] opacity-0'}`}>
                      <div className="overflow-hidden">
                        <p className="text-zinc-400 text-sm leading-relaxed font-normal pt-3 border-t border-white/10">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Testimonials Section (Dark) ── */}
          <section ref={testimonialsRef} className="py-12 px-6 text-zinc-950 relative bg-[#faf9f6] border-b border-zinc-200">
            <div className="max-w-7xl mx-auto relative z-10">
              <div className={`mb-8 transition-all duration-700 ease-out ${testimonialsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                <span className="text-zinc-500 font-medium mb-1 block text-xs font-mono uppercase tracking-widest">Testimonials</span>
                <h2 className="text-2xl md:text-3xl font-medium tracking-tight mb-1">What Operators Say</h2>
                <p className="text-sm text-zinc-500 font-light">Teams using Verion AI to scale their content workflow.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { quote: "Our copywriting workload was cut by 80% almost overnight. We're now syncing hundreds of seasonal descriptions directly into Shopify without any delays. The automated quality checks are an absolute lifesaver for our small team.", author: "Sarah Jenkins", title: "Director of Merchandising, LuxWear Co." },
                  { quote: "Verion AI improved our organic discoverability incredibly fast. The dedicated SEO agent optimized all our legacy titles and meta descriptions. Within weeks, we saw a massive surge in non-branded search traffic and higher checkout rates.", author: "David Chen", title: "Founder, PeakTrail Outdoor Gear" },
                  { quote: "The translation and localization agent handled our multi-lingual storefronts in minutes instead of the usual days. It provided clean, accurate, and culturally appropriate localization that resonated perfectly with our European markets.", author: "Elena Rostova", title: "Head of Growth, Novis Brands" },
                  { quote: "Verion keeps our content style completely consistent across a massive catalog. We simply set our formatting guidelines and tone preferences once, and let the agent swarm handle the rest. It's like having an army of senior copywriters.", author: "Marcus Vance", title: "Operations Lead, Modus Group" }
                ].map((t, idx) => (
                  <div
                    key={idx}
                    className={`p-5 rounded-2xl border cursor-pointer flex flex-col gap-4 transition-all duration-500 ease-out group ${activeChallenge === (idx + 500)
                      ? 'border-zinc-500 bg-white/85 shadow-[0_12px_28px_rgba(0,0,0,0.25)]'
                      : 'border-zinc-200 bg-white/80 hover:border-zinc-700/30'
                      } ${testimonialsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
                      }`}
                    style={{ transitionDelay: testimonialsVisible ? `${200 + idx * 100}ms` : '0ms' }}
                    onClick={() => setActiveChallenge(activeChallenge === (idx + 500) ? null : (idx + 500))}
                  >
                    <div className="flex justify-between items-start w-full">
                      <div className="flex-1">
                        <h4 className="text-xs font-semibold text-zinc-950">{t.author}</h4>
                        <p className="text-[10px] text-zinc-600 font-mono mt-0.5">{t.title}</p>
                      </div>
                      <Maximize2 className={`w-3 h-3 text-zinc-650 transition-all duration-400 mt-1 group-hover:text-zinc-450 ${activeChallenge === (idx + 500) ? 'text-zinc-950 rotate-180' : ''}`} />
                    </div>
                    <div className={`grid transition-all duration-400 ease-in-out ${activeChallenge === (idx + 500) ? 'grid-rows-[1fr] opacity-100 mt-3' : 'grid-rows-[0fr] opacity-0'}`}>
                      <div className="overflow-hidden">
                        <p className="text-zinc-600 text-[15px] leading-relaxed font-normal pt-4 border-t border-zinc-200 italic">"{t.quote}"</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
          {/* ── FAQ Section (Dark) ── */}
          <section id="faq" className="py-20 px-6 bg-zinc-950 text-white border-t border-zinc-900">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-medium text-center mb-12 tracking-tight text-white">
                Frequently Asked<br />Questions
              </h2>

              {/* Filter Tabs */}
              <div className="flex flex-wrap justify-center gap-3 mb-16">
                {faqTabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => { setActiveFaqTab(tab); setActiveFaq(null); }}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${activeFaqTab === tab
                      ? 'bg-white text-zinc-950'
                      : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* FAQ List */}
              <div className="border-t border-zinc-800">
                {filteredFaqs.map((faq, i) => (
                  <div key={i} className="border-b border-zinc-800">
                    <button
                      className="w-full py-6 flex justify-between items-center text-left focus:outline-none group"
                      onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                    >
                      <span className="text-lg md:text-xl font-medium text-zinc-400 group-hover:text-white transition-colors">
                        {faq.question}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 ml-4 transition-transform duration-300">
                        {activeFaq === i ? (
                          <Minus className="w-4 h-4 text-zinc-950" />
                        ) : (
                          <Plus className="w-4 h-4 text-zinc-950" />
                        )}
                      </div>
                    </button>
                    <div className={`grid transition-all duration-300 ease-in-out ${activeFaq === i ? 'grid-rows-[1fr] opacity-100 pb-6' : 'grid-rows-[0fr] opacity-0'}`}>
                      <div className="overflow-hidden">
                        <p className="text-zinc-500 leading-relaxed max-w-3xl">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-16 text-zinc-500">
                <p>Have more questions?</p>
                <p>Contact our team anytime - we're here 24/7.</p>
              </div>
            </div>
          </section>

          {/* ── Final CTA (Light) ── */}
          <section className="py-20 px-6 bg-[#faf9f6] border-t border-zinc-200 text-center relative">
            <div className="max-w-4xl mx-auto z-10 relative">
              <h2 className="text-4xl md:text-6xl font-medium mb-6 leading-[1.1] text-zinc-950">
                Ready to transform your <span className="text-zinc-600">e-commerce content?</span>
              </h2>
              <p className="text-zinc-500 text-lg md:text-xl font-light mb-12 max-w-2xl mx-auto">
                Connect your store and let AI handle the optimization automatically.
              </p>
              <div className="flex flex-wrap justify-center items-center gap-4">
                <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="px-8 py-4 rounded-full bg-zinc-950 text-white font-semibold text-sm hover:bg-zinc-800 transition-all shadow-lg active:scale-95 cursor-pointer">
                  Return to Top
                </button>
              </div>
            </div>
          </section>

        </main>

        {/* ── Footer ── */}
        <footer className="bg-zinc-950 border-t border-zinc-900 py-10 px-6">
          <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-black flex items-center justify-center border border-zinc-800">
                  <img
                    src={verionLogo}
                    alt="Verion AI Logo"
                    className="w-full h-full object-cover scale-[1.8] mix-blend-screen"
                  />
                </div>
                <span className="text-lg tracking-tight font-medium">Verion AI</span>
              </div>
              <p className="text-zinc-500 max-w-xs text-base leading-relaxed">
                Engineered for value. Built for impact. The multi-agent platform for modern e-commerce.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-6">Platform</h4>
              <ul className="space-y-4 text-base text-zinc-500">
                <li><a href="#problem" className="hover:text-white transition-colors">Problem</a></li>
                <li><a href="#solution" className="hover:text-white transition-colors">Solution</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-6">Company</h4>
              <ul className="space-y-4 text-base text-zinc-500">
                <li><a href="#tech" className="hover:text-white transition-colors">Technology</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
                <li><Link to="/dashboard" className="hover:text-white transition-colors">Launch Console</Link></li>
              </ul>
            </div>
          </div>
          <div className=" mx-auto mt-16 pt-6 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-center gap-4 text-sm text-zinc-600 text-center">
            <p>© {new Date().getFullYear()} Verion AI. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;


