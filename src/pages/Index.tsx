import { useState, useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import ValidationLayers from "@/components/ValidationLayers";
import ArchitectureSection from "@/components/ArchitectureSection";
import MetricsSection from "@/components/MetricsSection";
import RoadmapSection from "@/components/RoadmapSection";
import SummarySection from "@/components/SummarySection";
import NavigationDots from "@/components/NavigationDots";

const sectionIds = ["hero", "problem", "validation", "architecture", "metrics", "roadmap", "summary"];

const Index = () => {
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
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

  return (
    <div className="bg-background min-h-screen overflow-x-hidden">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,_#0f172a,_#020617,_#000000)] -z-10" />
      <NavigationDots activeSection={activeSection} />

      <div id="hero"><HeroSection /></div>
      <div id="problem"><ProblemSection /></div>
      <div id="validation"><ValidationLayers /></div>
      <div id="architecture"><ArchitectureSection /></div>
      <div id="metrics"><MetricsSection /></div>
      <div id="roadmap"><RoadmapSection /></div>
      <div id="summary"><SummarySection /></div>
    </div>
  );
};

export default Index;
