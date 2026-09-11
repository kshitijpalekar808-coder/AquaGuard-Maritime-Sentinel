"use client";

import React, { useState } from "react";
import { Shield, ArrowRight, Play, Satellite, Radio, Compass, Anchor, ExternalLink, ShieldAlert, CheckCircle2 } from "lucide-react";

interface HeroSectionProps {
  onOpenDossier: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenDossier }) => {
  const [activeTab, setActiveTab] = useState<"optical" | "sar" | "hydro">("sar");

  return (
    <section className="relative pt-32 sm:pt-40 pb-20 px-6 max-w-7xl mx-auto z-10">
      {/* Ambient glowing radial effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Hero Header */}
      <div className="text-center max-w-4xl mx-auto mb-16">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 font-mono text-xs tracking-wider mb-6 shadow-[0_0_25px_rgba(6,182,212,0.2)]">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span>AUTONOMOUS MARITIME FORENSICS • COPERNICUS SENTINEL-1C FUSION</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
          Autonomous Satellite Forensics for{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">
            Maritime Spill Attribution
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-white/70 max-w-3xl mx-auto leading-relaxed font-sans">
          AquaGuard fuses orbital Synthetic Aperture Radar, 4D hydrodynamic Lagrangian reverse-drift modeling, and global AIS transponder intelligence to detect illicit ocean contamination and attribute origin vessels in real time.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onOpenDossier}
            className="w-full sm:w-auto flex items-center justify-center space-x-2.5 px-8 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs uppercase tracking-wider transition-all shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:scale-105"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Examine Live Dossier (AQG-2026)</span>
          </button>

          <a
            href="#radar-recon"
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-7 py-4 rounded-xl bg-white/[0.05] hover:bg-white/10 border border-white/15 hover:border-cyan-500/40 text-white font-mono text-xs uppercase tracking-wider transition-all"
          >
            <span>Explore Forensic Telemetry</span>
            <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
          </a>
        </div>
      </div>

      {/* Hero Visual Dashboard Graphic */}
      <div className="relative rounded-3xl p-1 bg-gradient-to-b from-cyan-500/30 via-white/10 to-transparent shadow-[0_0_80px_rgba(6,182,212,0.15)]">
        <div className="rounded-[22px] bg-[#070e1b] overflow-hidden border border-white/10">
          {/* Dashboard Window Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-black/60 border-b border-white/10 font-mono text-xs">
            <div className="flex items-center space-x-3">
              <div className="flex space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-white/40 hidden sm:inline">|</span>
              <span className="text-white/80 font-bold">AQUAGUARD TACTICAL FORENSIC SUITE</span>
              <span className="text-cyan-400 text-[10px] hidden md:inline">AQG-2026-0910-MX04</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setActiveTab("sar")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeTab === "sar"
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold"
                    : "text-white/50 hover:text-white"
                }`}
              >
                SAR CO-POL
              </button>
              <button
                onClick={() => setActiveTab("optical")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeTab === "optical"
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold"
                    : "text-white/50 hover:text-white"
                }`}
              >
                OPTICAL IR
              </button>
              <button
                onClick={() => setActiveTab("hydro")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeTab === "hydro"
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold"
                    : "text-white/50 hover:text-white"
                }`}
              >
                DRIFT 4D
              </button>
            </div>
          </div>

          {/* Focal Interactive Visual Canvas */}
          <div className="relative aspect-[16/9] min-h-[460px] max-h-[680px] w-full overflow-hidden bg-[#030712]">
            {/* Main Visual Image Background */}
            <img
              src="/sequence/frame_54.webp"
              alt="AquaGuard Maritime Incident Reconstruction"
              className="w-full h-full object-cover select-none filter contrast-125"
            />

            {/* Tactical Grid & Reticle Overlay */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
              <defs>
                <pattern id="hero-grid" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(56, 189, 248, 0.12)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#hero-grid)" />
            </svg>

            {/* Radar Sweep Animated Beam */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent w-48 animate-pulse pointer-events-none transform -skew-x-12" style={{ left: "35%" }} />

            {/* Targeted Bilge Outflow Reticle */}
            <div className="absolute top-[54%] left-[49%] -translate-x-1/2 -translate-y-1/2 z-20">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-amber-400 animate-spin" style={{ animationDuration: "10s" }} />
                <div className="absolute inset-2 rounded-full border border-amber-400/40 animate-ping" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              </div>
            </div>

            {/* Suspect AIS Vessel Tag Overlay */}
            <div className="absolute top-[28%] left-[62%] z-20 p-3 rounded-xl bg-black/80 backdrop-blur-md border border-cyan-500/40 text-xs font-mono text-white shadow-2xl">
              <div className="flex items-center space-x-2 text-[10px] text-cyan-400 font-bold mb-1">
                <Anchor className="w-3.5 h-3.5" />
                <span>PRIMARY TARGET IDENTIFIED</span>
              </div>
              <div className="font-bold text-white text-sm">MV PACIFIC TITAN</div>
              <div className="text-white/60 text-[11px]">IMO 9482012 • Flag: LBR • Speed: 8.4 kn</div>
              <div className="mt-1 text-[10px] text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>ATTRIBUTION CONFIDENCE: 98.6%</span>
              </div>
            </div>

            {/* Left Telemetry Card */}
            <div className="absolute bottom-6 left-6 z-20 p-4 rounded-xl bg-black/85 backdrop-blur-xl border border-white/15 text-white text-xs font-mono max-w-sm">
              <div className="text-[10px] text-cyan-400 uppercase tracking-widest font-bold mb-1">
                SPATIAL RADAR FOOTPRINT
              </div>
              <div className="text-lg font-bold text-white">4.82 km² Hydrocarbon Slick</div>
              <div className="text-[11px] text-white/60 mt-1 leading-relaxed">
                Multi-temporal SAR co-polarization backscatter reveals severe sea surface tension dampening (-12.8 dB) along bulk carrier corridor.
              </div>
            </div>

            {/* Right Telemetry Card */}
            <div className="absolute bottom-6 right-6 z-20 p-4 rounded-xl bg-black/85 backdrop-blur-xl border border-white/15 text-white text-xs font-mono max-w-xs text-right">
              <div className="text-[10px] text-amber-400 uppercase tracking-widest font-bold mb-1">
                EFFLUENT DISCHARGE RATE
              </div>
              <div className="text-lg font-bold text-amber-300">142 m³ (893 bbl)</div>
              <div className="text-[11px] text-white/60 mt-1">
                Bypass duration: 18 min • Viscosity: 380 cSt
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
