import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown, Maximize, Minimize } from "lucide-react";
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import ValidationLayers from "@/components/ValidationLayers";
import WorkflowSlide from "@/components/workflow/WorkflowSlide";
import ArchitectureSection from "@/components/ArchitectureSection";
import GovernanceSection from "@/components/GovernanceSection";
import MetricsSection from "@/components/MetricsSection";
import RoadmapSection from "@/components/RoadmapSection";
import SummarySection from "@/components/SummarySection";
import NavigationDots from "@/components/NavigationDots";

const sectionIds = ["hero", "problem", "validation", "workflow", "architecture", "governance", "metrics", "roadmap", "summary"];
const sectionLabels: Record<string, string> = {
  hero: "Home",
  problem: "Friction",
  validation: "Synthesis",
  workflow: "Workflow",
  architecture: "Architecture",
  governance: "Governance",
  metrics: "Impact",
  roadmap: "Roadmap",
  summary: "Summary",
};

const DRAG_THRESHOLD = 60;

const Index = () => {
  const [activeSection, setActiveSection] = useState("hero");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [heroKey, setHeroKey] = useState(0);
  const dragStartY = useRef<number | null>(null);
  const isDragging = useRef(false);
  const isNavigating = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
            isNavigating.current = false;
          }
        });
      },
      { threshold: 0.3 }
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const currentIndex = sectionIds.indexOf(activeSection);

  const goTo = useCallback((direction: "prev" | "next") => {
    if (isNavigating.current) return;
    const idx = sectionIds.indexOf(activeSection);
    const target = direction === "prev" ? idx - 1 : idx + 1;
    if (target >= 0 && target < sectionIds.length) {
      isNavigating.current = true;
      document.getElementById(sectionIds[target])?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [activeSection]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        document.getElementById("hero")?.scrollIntoView({ behavior: "instant", block: "start" });
        setHeroKey((k) => k + 1);
      });
    } else {
      document.exitFullscreen();
    }
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        goTo("next");
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        goTo("prev");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goTo]);

  // PDF-style pan/drag scrolling
  useEffect(() => {
    let startY = 0;
    let scrollStart = 0;
    let dragging = false;
    const getContainer = () => document.getElementById("presentation-container");

    const onDown = (e: MouseEvent) => {
      dragging = true;
      startY = e.clientY;
      scrollStart = window.scrollY;
      const c = getContainer();
      if (c) c.style.scrollSnapType = "none";
    };

    const onMove = (e: MouseEvent) => {
      if (!dragging) return;
      e.preventDefault();
      const delta = startY - e.clientY;
      window.scrollTo({ top: scrollStart + delta, behavior: "instant" as ScrollBehavior });
    };

    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      const c = getContainer();
      if (c) c.style.scrollSnapType = "";
    };

    // Touch pan
    const onTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      scrollStart = window.scrollY;
      const c = getContainer();
      if (c) c.style.scrollSnapType = "none";
    };

    const onTouchMove = (e: TouchEvent) => {
      const delta = startY - e.touches[0].clientY;
      window.scrollTo({ top: scrollStart + delta, behavior: "instant" as ScrollBehavior });
    };

    const onTouchEnd = () => {
      document.body.style.scrollSnapType = "";
    };

    window.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove, { passive: false });
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  return (
    <div id="presentation-container" className="bg-background min-h-screen overflow-x-hidden snap-y snap-mandatory select-none cursor-grab active:cursor-grabbing">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,_#0f172a,_#020617,_#000000)] -z-10" />
      <NavigationDots activeSection={activeSection} />

      <div id="hero" className="min-h-screen snap-start snap-always"><HeroSection key={heroKey} /></div>
      <div id="problem" className="min-h-screen snap-start snap-always"><ProblemSection /></div>
      <div id="validation" className="min-h-screen snap-start snap-always"><ValidationLayers /></div>
      <div id="workflow" className="min-h-screen snap-start snap-always"><WorkflowSlide /></div>
      <div id="architecture" className="min-h-screen snap-start snap-always"><ArchitectureSection /></div>
      <div id="governance" className="min-h-screen snap-start snap-always"><GovernanceSection /></div>
      <div id="metrics" className="min-h-screen snap-start snap-always"><MetricsSection /></div>
      <div id="roadmap" className="min-h-screen snap-start snap-always"><RoadmapSection /></div>
      <div id="summary" className="min-h-screen snap-start snap-always"><SummarySection /></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.6 }}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2"
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={activeSection}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mr-1 hidden sm:inline"
          >
            {currentIndex + 1}/{sectionIds.length} · {sectionLabels[activeSection]}
          </motion.span>
        </AnimatePresence>

        <button
          onClick={() => goTo("prev")}
          disabled={currentIndex === 0}
          className="w-9 h-9 rounded-lg bg-card/80 backdrop-blur-sm border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronUp className="w-4 h-4" />
        </button>

        <button
          onClick={() => goTo("next")}
          disabled={currentIndex === sectionIds.length - 1}
          className="w-9 h-9 rounded-lg bg-card/80 backdrop-blur-sm border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronDown className="w-4 h-4" />
        </button>

        <button
          onClick={toggleFullscreen}
          className="w-9 h-9 rounded-lg bg-card/80 backdrop-blur-sm border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
        >
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </button>
      </motion.div>
    </div>
  );
};

export default Index;
