"use client";

import React from "react";
import { Crosshair, ShieldCheck, AlertTriangle, Compass, Navigation, Radio, Activity, Waves, Gauge } from "lucide-react";

interface ForensicGraphicsOverlayProps {
  scrollProgress: number;
  currentFrame: number;
  onOpenDossier: () => void;
}

export const ForensicGraphicsOverlay: React.FC<ForensicGraphicsOverlayProps> = ({
  scrollProgress,
  currentFrame,
  onOpenDossier,
}) => {
  // Compute interpolation factors for each phase
  // Phase 1: Satellite Scan & Slick Boundary (0.15 - 0.45)
  const p1Active = scrollProgress >= 0.15 && scrollProgress < 0.48;
  const p1Factor = Math.min(Math.max((scrollProgress - 0.15) / 0.1, 0), 1);

  // Phase 2: Plume Isolation & Spectrometer Gauge (0.45 - 0.72)
  const p2Active = scrollProgress >= 0.45 && scrollProgress < 0.75;
  const p2Factor = Math.min(Math.max((scrollProgress - 0.45) / 0.1, 0), 1);
  const volumeProgress = Math.min(Math.max((scrollProgress - 0.45) / 0.25, 0), 1);
  const currentVolumeM3 = Math.round(volumeProgress * 142);
  const currentVolumeBbl = Math.round(volumeProgress * 893);

  // Phase 3: Lagrangian Backtrack Trajectory (0.70 - 0.90)
  const p3Active = scrollProgress >= 0.70 && scrollProgress < 0.92;
  const p3Factor = Math.min(Math.max((scrollProgress - 0.70) / 0.1, 0), 1);
  const pathDrawLength = Math.min(Math.max((scrollProgress - 0.70) / 0.18, 0), 1);

  // Phase 4: Containment Cordon & Fleet Cordon (0.85 - 1.0)
  const p4Active = scrollProgress >= 0.85;
  const p4Factor = Math.min(Math.max((scrollProgress - 0.85) / 0.1, 0), 1);

  return (
    <div className="absolute inset-0 pointer-events-none z-25 overflow-hidden font-mono select-none">
      {/* GLOBAL HUD CORNER BRACKETS & RETICLES */}
      <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(56, 189, 248, 0.05)" strokeWidth="1" />
            <circle cx="60" cy="60" r="1" fill="rgba(56, 189, 248, 0.2)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-pattern)" />

        {/* Outer tactical crosshairs */}
        <g stroke="rgba(56, 189, 248, 0.4)" strokeWidth="1.5">
          {/* Top Left */}
          <path d="M 24 60 L 24 24 L 60 24" fill="none" />
          {/* Top Right */}
          <path d="M calc(100% - 60px) 24 L calc(100% - 24px) 24 L calc(100% - 24px) 60" fill="none" />
          {/* Bottom Left */}
          <path d="M 24 calc(100% - 100px) L 24 calc(100% - 24px) L 60 calc(100% - 24px)" fill="none" />
          {/* Bottom Right */}
          <path d="M calc(100% - 60px) calc(100% - 24px) L calc(100% - 24px) calc(100% - 24px) L calc(100% - 24px) calc(100% - 100px)" fill="none" />
        </g>
      </svg>

      {/* ======================================================== */}
      {/* GRAPHIC 1: SATELLITE ORBITAL SCAN & SLICK BOUNDARY (0.15 - 0.45) */}
      {/* ======================================================== */}
      {p1Active && (
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{ opacity: p1Factor }}
        >
          {/* Moving Radar Scan Sweep Beam */}
          <div
            className="absolute left-0 right-0 h-32 bg-gradient-to-b from-cyan-500/0 via-cyan-400/15 to-cyan-500/0 border-b border-cyan-400/40 pointer-events-none"
            style={{
              top: `${((scrollProgress - 0.15) / 0.33) * 80 + 10}%`,
              boxShadow: "0 0 25px rgba(6,182,212,0.3)",
            }}
          >
            <div className="flex items-center justify-between px-8 text-[10px] text-cyan-300 tracking-wider">
              <span>COP-S1C POLARIZATION: VV/VH CO-POL</span>
              <span>AZIMUTH SCAN: 042.8°</span>
            </div>
          </div>

          {/* SVG Animated Polygon Enclosing Oil Slick */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 600" preserveAspectRatio="none">
            {/* Slick Boundary Contour */}
            <path
              d="M 160,340 C 220,180 620,160 760,220 C 880,270 910,410 820,490 C 700,560 310,540 180,460 Z"
              fill="rgba(6, 182, 212, 0.08)"
              stroke="rgba(6, 182, 212, 0.7)"
              strokeWidth="2"
              strokeDasharray="8 6"
              className="animate-pulse"
            />
            {/* Inner Core Density */}
            <path
              d="M 280,350 C 340,240 580,230 680,280 C 760,330 750,440 680,470 C 580,510 320,480 270,410 Z"
              fill="rgba(245, 158, 11, 0.12)"
              stroke="rgba(245, 158, 11, 0.6)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
          </svg>

          {/* Graphical Callout Label on Slick Boundary */}
          <div
            className="absolute p-3 rounded-xl bg-black/85 backdrop-blur-md border border-cyan-500/40 text-cyan-300 text-xs shadow-2xl"
            style={{ top: "28%", right: "12%" }}
          >
            <div className="flex items-center space-x-2 text-[10px] text-cyan-400 font-bold uppercase mb-1">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>SAR HYDROCARBON REFLECTIVITY</span>
            </div>
            <div className="space-y-1 text-[11px] text-white/90">
              <div className="flex justify-between gap-4">
                <span className="text-white/50">Slick Area:</span>
                <span className="font-bold text-cyan-300">4.82 km² (11.4 km perim)</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-white/50">Damping Factor:</span>
                <span className="font-bold text-white">-12.8 dB backscatter</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-white/50">Confidence:</span>
                <span className="font-bold text-emerald-400">98.6% (SAR Match)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* GRAPHIC 2: DISCHARGE OUTFLOW TARGET LOCK & VOLUME GAUGE (0.45 - 0.75) */}
      {/* ======================================================== */}
      {p2Active && (
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{ opacity: p2Factor }}
        >
          {/* Target Reticle Centered on Pipe Outflow */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ top: "54%", left: "49%" }}
          >
            {/* Animated Rotating Radar Circles */}
            <div className="relative w-28 h-28 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-amber-400/60 animate-spin" style={{ animationDuration: "12s" }} />
              <div className="absolute inset-2 rounded-full border border-amber-500/40 animate-pulse" />
              <div className="absolute w-full h-[1px] bg-amber-400/60" />
              <div className="absolute h-full w-[1px] bg-amber-400/60" />
              <div className="w-3 h-3 rounded-full bg-amber-400 animate-ping" />
            </div>

            {/* Pointer line leading to HUD telemetry */}
            <svg className="absolute top-0 left-0 w-80 h-40 overflow-visible pointer-events-none">
              <polyline
                points="0,0 60,-40 180,-40"
                fill="none"
                stroke="rgba(245, 158, 11, 0.8)"
                strokeWidth="2"
                strokeDasharray="4 2"
              />
              <circle cx="180" cy="-40" r="3" fill="#f59e0b" />
            </svg>
          </div>

          {/* DYNAMIC DISCHARGE VOLUME & SPECTROMETER GAUGE */}
          <div
            className="absolute p-4 rounded-2xl bg-black/90 backdrop-blur-xl border border-amber-500/50 text-white text-xs shadow-[0_0_40px_rgba(245,158,11,0.25)] w-80 pointer-events-auto"
            style={{ top: "34%", right: "8%" }}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
              <div className="flex items-center space-x-2 text-amber-400 font-bold text-[11px] uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 animate-pulse" />
                <span>EFFLUENT SPECTROMETRY</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                ACTIVE SPILL
              </span>
            </div>

            {/* Real-time Dynamic Filling Volume Meter */}
            <div className="mb-3">
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-white/60">Discharged Volume:</span>
                <span className="text-amber-300 font-bold text-sm">
                  {currentVolumeM3} m³ <span className="text-white/40 text-[10px]">({currentVolumeBbl} bbl)</span>
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden p-0.5 border border-amber-500/30">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 via-orange-400 to-red-500 transition-all duration-150 shadow-[0_0_10px_rgba(245,158,11,0.8)]"
                  style={{ width: `${Math.max(volumeProgress * 100, 8)}%` }}
                />
              </div>
            </div>

            {/* Chemical Hydrocarbon Spectrum Bars */}
            <div className="space-y-1.5 text-[10px] bg-white/[0.03] p-2.5 rounded-lg border border-white/5">
              <div className="flex justify-between items-center">
                <span className="text-white/50">Viscosity (380 cSt Heavy Fuel):</span>
                <div className="w-24 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-amber-400" style={{ width: "88%" }} />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/50">Aromatics / Sludge Index:</span>
                <div className="w-24 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-red-400" style={{ width: "94%" }} />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/50">Bypass Duration:</span>
                <span className="text-white font-bold">18 min 42 sec</span>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-white/10 flex justify-between items-center text-[10px]">
              <span className="text-white/40">MARPOL ANNEX I VIOLATION</span>
              <button
                onClick={onOpenDossier}
                className="text-cyan-300 hover:text-cyan-200 underline font-sans"
              >
                Inspect Dossier →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* GRAPHIC 3: LAGRANGIAN BACKTRACK VECTOR PATH (0.70 - 0.92) */}
      {/* ======================================================== */}
      {p3Active && (
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{ opacity: p3Factor }}
        >
          {/* SVG Animated Trajectory Vector Path drawing backward in time */}
          <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 1000 600" preserveAspectRatio="none">
            <defs>
              <linearGradient id="driftGradient" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="1" />
                <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="1" />
              </linearGradient>
            </defs>

            {/* Backward Reverse Trajectory Vector Line */}
            <path
              d="M 680,310 Q 520,380 340,430 T 140,490"
              fill="none"
              stroke="url(#driftGradient)"
              strokeWidth="3.5"
              strokeDasharray="600"
              strokeDashoffset={600 * (1 - pathDrawLength)}
              strokeLinecap="round"
              style={{ filter: "drop-shadow(0 0 8px rgba(56, 189, 248, 0.6))" }}
            />

            {/* Waypoint 1: Current Detection */}
            <circle cx="680" cy="310" r="5" fill="#38bdf8" />
            <text x="695" y="315" fill="#38bdf8" fontSize="11" fontWeight="bold">T-00h (DETECTION)</text>

            {/* Waypoint 2: Mid-drift hydrodynamic dispersion */}
            {pathDrawLength > 0.4 && (
              <>
                <circle cx="340" cy="430" r="4" fill="#f59e0b" />
                <text x="355" y="435" fill="#f59e0b" fontSize="10">T-04h (DRIFT 1.4 kn @ 042°)</text>
              </>
            )}

            {/* Waypoint 3: Exact Release Origin Point */}
            {pathDrawLength > 0.85 && (
              <>
                <circle cx="140" cy="490" r="7" fill="#ef4444" className="animate-ping" />
                <circle cx="140" cy="490" r="5" fill="#ef4444" />
                <text x="155" y="495" fill="#ef4444" fontSize="11" fontWeight="bold">
                  ORIGIN (T-06h45m: MV PACIFIC TITAN SPEED DROP)
                </text>
              </>
            )}
          </svg>

          {/* Drift Physics Vector Card */}
          <div
            className="absolute p-4 rounded-2xl bg-black/90 backdrop-blur-xl border border-cyan-500/40 text-white text-xs shadow-2xl w-80 pointer-events-auto"
            style={{ bottom: "20%", left: "6%" }}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2.5">
              <div className="flex items-center space-x-2 text-cyan-400 font-bold text-[11px] uppercase">
                <Compass className="w-4 h-4 text-cyan-400" />
                <span>HYDRODYNAMIC BACKTRACK MATRIX</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold">Δt = -06h 45m</span>
            </div>

            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-white/50">Stokes Wave Drift:</span>
                <span className="text-white">0.32 kn @ 038°</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Surface Wind Drag:</span>
                <span className="text-white">1.08 kn @ 044°</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Net Drift Trajectory:</span>
                <span className="text-cyan-300 font-bold">1.40 kn @ 042°</span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-1.5">
                <span className="text-white/50">Total Reverse Distance:</span>
                <span className="text-amber-300 font-bold">14.8 Nautical Miles</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* GRAPHIC 4: CONTAINMENT FLEET CORDON & RADAR BEACONS (0.85 - 1.0) */}
      {/* ======================================================== */}
      {p4Active && (
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{ opacity: p4Factor }}
        >
          {/* SVG Containment Boom Perimeter Enclosure Graphic */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 600" preserveAspectRatio="none">
            {/* Glowing Containment Boom Line */}
            <path
              d="M 120,280 C 180,120 720,100 860,180 C 960,240 950,440 850,520 C 700,590 260,580 120,440 Z"
              fill="rgba(16, 185, 129, 0.08)"
              stroke="#10b981"
              strokeWidth="3"
              strokeDasharray="6 3"
              style={{ filter: "drop-shadow(0 0 12px rgba(16, 185, 129, 0.8))" }}
            />

            {/* Skimmer Fleet Beacon Position 1 */}
            <circle cx="150" cy="240" r="6" fill="#10b981" />
            <circle cx="150" cy="240" r="14" fill="none" stroke="#10b981" strokeWidth="1" className="animate-ping" />
            <text x="165" y="245" fill="#10b981" fontSize="10" fontWeight="bold">SKIMMER #1 (OCEANGUARD)</text>

            {/* Skimmer Fleet Beacon Position 2 */}
            <circle cx="840" cy="190" r="6" fill="#10b981" />
            <circle cx="840" cy="190" r="14" fill="none" stroke="#10b981" strokeWidth="1" className="animate-ping" />
            <text x="730" y="180" fill="#10b981" fontSize="10" fontWeight="bold">SKIMMER #2</text>

            {/* Skimmer Fleet Beacon Position 3 */}
            <circle cx="820" cy="500" r="6" fill="#10b981" />
            <circle cx="820" cy="500" r="14" fill="none" stroke="#10b981" strokeWidth="1" className="animate-ping" />
            <text x="720" y="525" fill="#10b981" fontSize="10" fontWeight="bold">SKIMMER #3 (RECOVERY 85 bbl/hr)</text>
          </svg>

          {/* Containment Telemetry HUD Badge */}
          <div
            className="absolute p-4 rounded-2xl bg-black/90 backdrop-blur-xl border border-emerald-500/50 text-white text-xs shadow-[0_0_40px_rgba(16,185,129,0.3)] w-80 pointer-events-auto"
            style={{ top: "28%", left: "8%" }}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2.5">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-[11px] uppercase">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>CONTAINMENT ENCLOSURE SEAL</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                100% CORDONED
              </span>
            </div>

            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-white/50">Barrier Perimeter:</span>
                <span className="text-white font-bold">11.4 km High-Tensile Boom</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Active Recovery Fleet:</span>
                <span className="text-emerald-300 font-bold">4 Skimmers + 2 Escort Tugs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Legal Evidence Status:</span>
                <span className="text-white font-bold">Chain of Custody Locked</span>
              </div>
            </div>

            <button
              onClick={onOpenDossier}
              className="mt-3 w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-mono text-xs uppercase tracking-wider transition-all shadow-md"
            >
              Export Forensic Dossier (PDF)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
