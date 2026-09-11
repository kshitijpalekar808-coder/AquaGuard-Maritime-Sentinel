"use client";

import React, { useState } from "react";
import { Compass, Waves, Navigation, Clock, Activity, ArrowRight, ShieldCheck, MapPin } from "lucide-react";

export const LagrangianDriftSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(2); // 0 = Detection, 1 = Drift, 2 = Release Origin

  const timelineWaypoints = [
    {
      time: "T - 00:00:00 UTC",
      label: "Copernicus S1C SAR Detection",
      coords: "28°42'11\" N, 88°21'35\" W",
      detail: "Anomalous dark backscatter footprint detected across 4.82 km².",
      distance: "0.0 NM",
    },
    {
      time: "T - 04:15:00 UTC",
      label: "Hydrodynamic Surface Dispersion",
      coords: "28°39'22\" N, 88°27'15\" W",
      detail: "Stokes wave drift and surface wind shear transport oil plume northeastward.",
      distance: "8.4 NM",
    },
    {
      time: "T - 06:45:00 UTC",
      label: "MV Pacific Titan Discharge Origin",
      coords: "28°36'12\" N, 88°32'40\" W",
      detail: "Vessel records a sudden 1.8 kn speed drop. Mass center backtrack converges within 0.3 NM.",
      distance: "14.8 NM",
    },
  ];

  return (
    <section id="drift-engine" className="py-24 px-6 max-w-7xl mx-auto relative z-10 border-t border-white/5">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs uppercase tracking-widest mb-2">
            <Compass className="w-4 h-4" />
            <span>MODULE 03 • LAGRANGIAN TRAJECTORY RECONSTRUCTION</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            4D Reverse-Drift Trajectory Solver
          </h2>
        </div>
        <p className="max-w-md text-sm text-white/60 font-sans leading-relaxed">
          Simulating Navier-Stokes fluid equations in reverse time back-tracks the slick&apos;s center of mass along ocean surface currents and windage vectors to pinpoint the exact release coordinates.
        </p>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Column: Interactive Vector Field & Trajectory Map (7 Cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-[#070e1b] border border-cyan-500/30 p-6 sm:p-8 flex flex-col justify-between shadow-[0_0_50px_rgba(6,182,212,0.12)] relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6 font-mono text-xs">
              <div className="flex items-center space-x-2 text-cyan-300">
                <Waves className="w-4 h-4" />
                <span>COUPLED HYDRODYNAMIC VECTOR SOLVER (Δt = -06h 45m)</span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold">
                CONVERGENCE: 98.6%
              </span>
            </div>

            {/* Visual Reverse Trajectory Simulation Map */}
            <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-[#020612] border border-cyan-500/20 mb-6 flex items-center justify-center">
              <img
                src="/sequence/frame_80.webp"
                alt="Lagrangian Trajectory Simulation"
                className="w-full h-full object-cover filter contrast-125 brightness-90"
              />

              {/* SVG Dynamic Trajectory Curve */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 600 360">
                <defs>
                  <linearGradient id="reversePathGrad" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="50%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                </defs>

                {/* Backtrack Vector Curve */}
                <path
                  d="M 440,160 Q 340,220 220,260 T 90,300"
                  fill="none"
                  stroke="url(#reversePathGrad)"
                  strokeWidth="3.5"
                  strokeDasharray="8 4"
                  strokeLinecap="round"
                  style={{ filter: "drop-shadow(0 0 8px rgba(56, 189, 248, 0.7))" }}
                />

                {/* Waypoints */}
                <circle cx="440" cy="160" r="6" fill="#38bdf8" />
                <text x="455" y="165" fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold">T - 00h (DETECTION)</text>

                <circle cx="220" cy="260" r="5" fill="#f59e0b" />
                <text x="235" y="265" fill="#f59e0b" fontSize="9" fontFamily="monospace">T - 04h (DRIFT VECTOR)</text>

                <circle cx="90" cy="300" r="8" fill="#ef4444" className="animate-ping" />
                <circle cx="90" cy="300" r="6" fill="#ef4444" />
                <text x="110" y="305" fill="#ef4444" fontSize="10" fontFamily="monospace" fontWeight="bold">ORIGIN: MV PACIFIC TITAN</text>
              </svg>

              {/* Floating Vector Telemetry Pill */}
              <div className="absolute top-4 left-4 p-2.5 rounded-lg bg-black/80 backdrop-blur-md border border-white/15 text-[11px] font-mono text-white/90">
                <span>NET DRIFT: 1.40 kn @ 042° • STOKES + WINDAGE</span>
              </div>
            </div>
          </div>

          {/* Chronological Waypoint Stepper Tabs */}
          <div className="grid grid-cols-3 gap-2 font-mono text-xs">
            {timelineWaypoints.map((wp, idx) => (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  activeStep === idx
                    ? "bg-cyan-500/20 border-cyan-500/40 text-white"
                    : "bg-white/[0.02] border-white/5 text-white/50 hover:text-white"
                }`}
              >
                <div className="text-[10px] text-cyan-400 font-bold mb-0.5">{wp.time}</div>
                <div className="text-xs font-semibold truncate">{wp.label}</div>
                <div className="text-[10px] text-white/40 mt-1">{wp.distance} Backtrack</div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: AIS Speed Anomaly & Hydrodynamic Matrix (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-6 font-mono text-xs">
          {/* Hydrodynamic Physics Breakdown */}
          <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center space-x-2 text-cyan-400 font-bold">
                <Activity className="w-4 h-4" />
                <span>HYDRODYNAMIC DRIFT MATRIX</span>
              </div>
              <span className="text-[10px] text-white/40">NOAA GFS/HYCOM</span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-white/50">Stokes Wave Drift:</span>
                <span className="text-white font-bold">0.32 kn @ 038° (Wave Height: 1.4m)</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-white/50">Surface Wind Drag (3% rule):</span>
                <span className="text-white font-bold">1.08 kn @ 044° (Wind: 14 kn)</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-white/50">Net Drift Trajectory:</span>
                <span className="text-cyan-300 font-bold">1.40 kn @ 042° NE</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-white/50">Total Backtrack Distance:</span>
                <span className="text-amber-300 font-bold">14.8 NM (27.4 km)</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-white/50">Suspect Proximity Delta:</span>
                <span className="text-emerald-400 font-bold">0.3 NM (HIGH CORRELATION)</span>
              </div>
            </div>
          </div>

          {/* AIS Speed Dip Forensic Chart */}
          <div className="rounded-2xl bg-gradient-to-br from-cyan-950/30 to-[#070e1b] border border-cyan-500/20 p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2 text-white font-bold text-xs">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>VESSEL SPEED ANOMALY AT ORIGIN</span>
              </div>
              <span className="text-[10px] text-red-400 font-bold">-1.8 kn Drop</span>
            </div>
            <p className="text-[11px] text-white/60 font-sans leading-relaxed mb-4">
              At T - 06:45 UTC, MV Pacific Titan slowed from 10.2 kn to 8.4 kn for 18 minutes while altering heading by 6°, characteristic of bilge sludge dumping.
            </p>
            <div className="flex items-center justify-between text-[11px] pt-3 border-t border-white/10 text-white/50">
              <span>AIS IMO: 9482012</span>
              <span className="text-cyan-300 font-bold">Primary Attribution Confirmed</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
