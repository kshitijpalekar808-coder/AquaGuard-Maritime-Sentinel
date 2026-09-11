"use client";

import React from "react";
import { ShieldCheck, Anchor, Layers, Radio, FileText, Download, CheckCircle2, Navigation } from "lucide-react";

interface ContainmentFleetSectionProps {
  onOpenDossier: () => void;
}

export const ContainmentFleetSection: React.FC<ContainmentFleetSectionProps> = ({ onOpenDossier }) => {
  const skimmers = [
    { name: "OCEANGUARD SKIMMER #1", type: "Weir Recovery Skimmer", capacity: "85 bbl/hr", status: "Active Pumping" },
    { name: "OCEANGUARD SKIMMER #2", type: "Brush Belt Skimmer", capacity: "65 bbl/hr", status: "Active Pumping" },
    { name: "PACIFIC RESPONDER TUG", type: "High-Tensile Boom Lead", capacity: "1,200m Cordon", status: "Position Locked" },
    { name: "GULF GUARDIAN TUG", type: "Offshore Barrier Anchor", capacity: "1,400m Cordon", status: "Position Locked" },
  ];

  return (
    <section id="containment-fleet" className="py-24 px-6 max-w-7xl mx-auto relative z-10 border-t border-white/5">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs uppercase tracking-widest mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>MODULE 04 • CONTAINMENT ORCHESTRATION & DISPATCH</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Offshore Boom Cordon & Recovery Fleet
          </h2>
        </div>
        <p className="max-w-md text-sm text-white/60 font-sans leading-relaxed">
          Real-time intercept vectors deploy an 11.4 km high-tensile containment boom to circumscribe the hydrocarbon mass, while recovery skimmers mitigate ecological dispersion.
        </p>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Column: Containment Radar Graphic (7 Cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-[#070e1b] border border-emerald-500/30 p-6 sm:p-8 flex flex-col justify-between shadow-[0_0_50px_rgba(16,185,129,0.12)] relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6 font-mono text-xs">
              <div className="flex items-center space-x-2 text-emerald-300">
                <Radio className="w-4 h-4 animate-pulse" />
                <span>CORDON BARRIER PERIMETER • 11.4 KM DEPLOYED</span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                ENCLOSURE SEAL: 100%
              </span>
            </div>

            {/* Tactical Radar Display with Green Glowing Boom */}
            <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-[#020612] border border-emerald-500/20 mb-6 flex items-center justify-center">
              <img
                src="/sequence/frame_110.webp"
                alt="Containment Fleet Cordon"
                className="w-full h-full object-cover filter contrast-125"
              />

              {/* SVG Glowing Green Containment Perimeter */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 600 360">
                {/* Glowing Containment Line */}
                <path
                  d="M 80,180 C 120,70 460,50 540,110 C 600,160 590,280 520,330 C 430,370 160,360 80,280 Z"
                  fill="rgba(16, 185, 129, 0.08)"
                  stroke="#10b981"
                  strokeWidth="3"
                  strokeDasharray="6 3"
                  style={{ filter: "drop-shadow(0 0 10px rgba(16, 185, 129, 0.8))" }}
                />

                {/* Skimmer Beacons */}
                <circle cx="100" cy="150" r="5" fill="#10b981" />
                <circle cx="100" cy="150" r="12" fill="none" stroke="#10b981" strokeWidth="1" className="animate-ping" />
                <text x="115" y="155" fill="#10b981" fontSize="9" fontFamily="monospace" fontWeight="bold">SKIMMER #1</text>

                <circle cx="530" cy="120" r="5" fill="#10b981" />
                <circle cx="530" cy="120" r="12" fill="none" stroke="#10b981" strokeWidth="1" className="animate-ping" />
                <text x="450" y="115" fill="#10b981" fontSize="9" fontFamily="monospace" fontWeight="bold">SKIMMER #2</text>

                <circle cx="510" cy="310" r="5" fill="#10b981" />
                <circle cx="510" cy="310" r="12" fill="none" stroke="#10b981" strokeWidth="1" className="animate-ping" />
                <text x="440" y="330" fill="#10b981" fontSize="9" fontFamily="monospace" fontWeight="bold">SKIMMER #3</text>
              </svg>

              {/* Status Badge */}
              <div className="absolute top-4 left-4 p-2.5 rounded-lg bg-black/80 backdrop-blur-md border border-emerald-500/30 text-[11px] font-mono text-emerald-300">
                <span>HAZMAT BOOM LOCK: 11.4 KM • 4 SKIMMERS OPERATIONAL</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 font-mono text-xs text-white/70">
            <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5">
              <span className="text-[10px] text-white/40 block">BARRIER EXTENT</span>
              <span className="text-sm font-bold text-white mt-0.5 block">11.4 km</span>
              <span className="text-[10px] text-emerald-400">High-Tensile Ocean</span>
            </div>
            <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5">
              <span className="text-[10px] text-white/40 block">RECOVERY RATE</span>
              <span className="text-sm font-bold text-emerald-300 mt-0.5 block">150 bbl/hr</span>
              <span className="text-[10px] text-white/50">Combined Fleet</span>
            </div>
            <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5">
              <span className="text-[10px] text-white/40 block">EVIDENCE CHAIN</span>
              <span className="text-sm font-bold text-cyan-300 mt-0.5 block">LOCKED</span>
              <span className="text-[10px] text-white/50">UNCLOS / MARPOL</span>
            </div>
          </div>
        </div>

        {/* Right Column: Fleet Unit Roster & Evidence Export (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-6 font-mono text-xs">
          {/* Active Fleet Units Roster */}
          <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                <Navigation className="w-4 h-4" />
                <span>INTERCEPTION FLEET DEPLOYMENT</span>
              </div>
              <span className="text-[10px] text-white/40">SECTOR 04 CORPS</span>
            </div>

            <div className="space-y-3">
              {skimmers.map((unit, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white text-[11px]">{unit.name}</div>
                    <div className="text-[10px] text-white/50">{unit.type} • {unit.capacity}</div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold">
                    {unit.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Dossier & Authority Dispatch Action Card */}
          <div className="rounded-2xl bg-gradient-to-br from-emerald-950/40 to-[#070e1b] border border-emerald-500/30 p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Full Forensic Evidence Dossier</h4>
                <p className="text-xs text-white/60 font-sans">Ready for dispatch to Port State Control and US Coast Guard NRC.</p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={onOpenDossier}
                className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-mono text-xs uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(16,185,129,0.3)] hover:scale-102 flex items-center justify-center space-x-2"
              >
                <FileText className="w-4 h-4" />
                <span>Launch Legal Dossier</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
