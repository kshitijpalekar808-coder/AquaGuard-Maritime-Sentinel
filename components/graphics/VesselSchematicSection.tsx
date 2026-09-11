"use client";

import React, { useState } from "react";
import { Anchor, AlertTriangle, Gauge, Droplets, ShieldAlert, FileText, CheckCircle2, ChevronRight } from "lucide-react";

interface VesselSchematicSectionProps {
  onOpenDossier: () => void;
}

export const VesselSchematicSection: React.FC<VesselSchematicSectionProps> = ({ onOpenDossier }) => {
  const [activeValve, setActiveValve] = useState<"bilge" | "ballast" | "cargo">("bilge");

  return (
    <section id="vessel-forensics" className="py-24 px-6 max-w-7xl mx-auto relative z-10 border-t border-white/5">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 font-mono text-xs uppercase tracking-widest mb-2">
            <Anchor className="w-4 h-4" />
            <span>MODULE 02 • VESSEL FORENSICS & PLUME ANATOMY</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Target Anatomy & Bilge Discharge Source
          </h2>
        </div>
        <p className="max-w-md text-sm text-white/60 font-sans leading-relaxed">
          Optical multi-zoom cross-referencing isolates the starboard bilge pump effluent pipe. Forensic calculations attribute 142 m³ of heavy engine room sludge dumped during an unauthorized bypass event.
        </p>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Column: Technical Vessel Cutaway Graphic (7 Cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-[#070e1b] border border-amber-500/30 p-6 sm:p-8 flex flex-col justify-between shadow-[0_0_50px_rgba(245,158,11,0.12)] relative overflow-hidden">
          <div>
            {/* Header Telemetry */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6 font-mono text-xs">
              <div>
                <span className="text-amber-400 font-bold text-sm block">MV PACIFIC TITAN</span>
                <span className="text-white/50 text-[10px]">IMO 9482012 • GEARLESS BULK CARRIER • LIBERIA</span>
              </div>
              <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold">
                ILLEGAL DISCHARGE FLAG
              </span>
            </div>

            {/* Vessel Cutaway & Discharge Pipe Graphic */}
            <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-[#030712] border border-white/10 mb-6 flex items-center justify-center">
              <img
                src="/sequence/frame_60.webp"
                alt="Bilge Outflow Zoom"
                className="w-full h-full object-cover filter contrast-125"
              />

              {/* Technical Overlay Graphics */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 600 360">
                {/* Pointer lines to Overboard Discharge Valve */}
                <circle cx="295" cy="205" r="22" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 2" className="animate-spin" style={{ animationDuration: "8s" }} />
                <circle cx="295" cy="205" r="4" fill="#ef4444" />
                
                <polyline points="295,205 380,120 540,120" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 2" />
                <rect x="390" y="95" width="180" height="46" rx="6" fill="rgba(0,0,0,0.85)" stroke="#f59e0b" strokeWidth="1" />
                <text x="400" y="112" fill="#f59e0b" fontSize="10" fontFamily="monospace" fontWeight="bold">OVERBOARD BYPASS PIPE</text>
                <text x="400" y="128" fill="#ffffff" fontSize="9" fontFamily="monospace">Outflow: 7.8 m³/min • Starboard</text>
              </svg>

              {/* Callout Badge */}
              <div className="absolute bottom-4 left-4 p-3 rounded-xl bg-black/85 backdrop-blur-md border border-amber-500/30 font-mono text-xs text-white max-w-xs">
                <div className="text-[10px] text-amber-400 font-bold uppercase mb-0.5">EVIDENCE PT #01 • PLUME CORE</div>
                <p className="text-[11px] text-white/80 font-sans">
                  Continuous heavy sludge discharge trailing into starboard wake for 18 min 42 sec.
                </p>
              </div>
            </div>
          </div>

          {/* Technical Vessel Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 font-mono text-xs text-white/70">
            <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5">
              <span className="text-[10px] text-white/40 block">VESSEL DIMENSIONS</span>
              <span className="text-sm font-bold text-white mt-0.5 block">225m × 32m</span>
              <span className="text-[10px] text-white/50">Draught: 11.2 m</span>
            </div>
            <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5">
              <span className="text-[10px] text-white/40 block">TOTAL DISCHARGED</span>
              <span className="text-sm font-bold text-amber-300 mt-0.5 block">142 m³</span>
              <span className="text-[10px] text-amber-400">893 bbl equivalent</span>
            </div>
            <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5">
              <span className="text-[10px] text-white/40 block">SPEED ANOMALY</span>
              <span className="text-sm font-bold text-red-400 mt-0.5 block">-1.8 kn Drop</span>
              <span className="text-[10px] text-white/50">Engine Load Shift</span>
            </div>
          </div>
        </div>

        {/* Right Column: Chemical Spectrometry & MARPOL Violation Card (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-6">
          {/* Chemical Analysis Spectrogram */}
          <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-6 font-mono text-xs">
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2 text-amber-400 font-bold">
                <Droplets className="w-4 h-4" />
                <span>HYDROCARBON SPECTROMETRY</span>
              </div>
              <span className="text-[10px] text-white/40">OPTICAL VIS/NIR</span>
            </div>

            {/* Spectrogram Bar Components */}
            <div className="space-y-3.5 pt-1">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-white/70">Hydrocarbon Fraction Index:</span>
                  <span className="text-amber-400 font-bold">0.94 (Crude / Sludge)</span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-amber-400" style={{ width: "94%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-white/70">Polycyclic Aromatic Density:</span>
                  <span className="text-red-400 font-bold">68.4% (Heavy Fuel Residue)</span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-red-400" style={{ width: "68%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-white/70">Estimated Slick Thickness:</span>
                  <span className="text-white font-bold">120 μm (True Sheen &gt; 50μm)</span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-cyan-400" style={{ width: "80%" }} />
                </div>
              </div>
            </div>

            <div className="mt-5 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-[11px] text-red-300 flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>MARPOL 73/78 Annex I Regulation 15 threshold (&gt;15 ppm oil-in-water) exceeded by a factor of 8,400x.</span>
            </div>
          </div>

          {/* Dossier Trigger Card */}
          <div className="rounded-2xl bg-gradient-to-br from-amber-950/30 to-[#070e1b] border border-amber-500/20 p-6 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-white">Full Forensic Case Record</h4>
              <p className="text-xs text-white/60 font-sans mt-0.5">Inspect vessel transponder timeline and speed deviation logs.</p>
            </div>
            <button
              onClick={onOpenDossier}
              className="flex-shrink-0 flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-mono text-xs uppercase tracking-wider transition-all"
            >
              <span>Dossier</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
