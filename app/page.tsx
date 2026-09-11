"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { FrameScroller } from "@/components/FrameScroller";
import { MaritimeSentinelConsole } from "@/components/MaritimeSentinelConsole";
import { Capabilities } from "@/components/Capabilities";
import { IncidentSnapshot } from "@/components/IncidentSnapshot";
import { Metrics } from "@/components/Metrics";
import { TrustStrip } from "@/components/TrustStrip";
import { Footer } from "@/components/Footer";
import { InvestigationDossier } from "@/components/InvestigationDossier";

export default function LandingPage() {
  const [isDossierOpen, setIsDossierOpen] = useState<boolean>(false);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [currentFrame, setCurrentFrame] = useState<number>(0);

  // Track page scroll progress for navbar
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(Math.max(scrollTop / docHeight, 0), 1) : 0;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleOpenDossier = () => setIsDossierOpen(true);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Fixed Header Navbar */}
      <Navbar
        onOpenDossier={handleOpenDossier}
        audioActive={false}
        toggleAudio={() => {}}
        scrollProgress={scrollProgress}
      />

      {/* ─── SCROLL-DRIVEN FRAME SEQUENCE ─────────────────────────────
          Scroll down → img src switches frame_0.webp → frame_119.webp
          No canvas, no video, no autoplay. Pure scroll = frame change.
      ─────────────────────────────────────────────────────────────── */}
      <FrameScroller
        onOpenDossier={handleOpenDossier}
      />

      {/* ─── ATTACHED OPERATIONAL C4I FORENSIC MODEL CONSOLE ─────────
          Full 10-phase pipeline, 6-panel sensor matrix, tactical map,
          and real AIS Bayesian fleet surveillance.
      ─────────────────────────────────────────────────────────────── */}
      <MaritimeSentinelConsole />

      {/* ─── CONTENT BELOW THE SCROLL SEQUENCE ─── */}
      <main className="relative z-10">
        <TrustStrip />
        <Capabilities />
        <IncidentSnapshot onOpenDossier={handleOpenDossier} />
        <Metrics />
      </main>

      <Footer />

      <InvestigationDossier
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
        currentFrame={currentFrame}
        scrollProgress={scrollProgress}
      />
    </div>
  );
}
