"use client";

import React, { useState } from "react";
import { Satellite, Radio, Layers, ShieldCheck, Activity, Eye, Zap } from "lucide-react";

export const RadarOrbitalSection: React.FC = () => {
  const [selectedBand, setSelectedBand] = useState<"vv" | "vh">("vv");

  return (
    <section id="radar-recon" className="py-24 px-6 max-w-7xl mx-auto relative z-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs uppercase tracking-widest mb-2">
            <Satellite className="w-4 h-4" />
            <span>MODULE 01 • SATELLITE RECONNAISSANCE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Orbital SAR Surface Damping Analysis
          </h2>
        </div>
        <p className="max-w-md text-sm text-white/60 font-sans leading-relaxed">
          Copernicus Sentinel-1C Synthetic Aperture Radar operates through cloud cover and darkness, detecting microscopic surface capillary dampening caused by hydrocarbon slicks.
        </p>
      </div>

      {/* Main Infographic Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Column: Interactive Radar Scan Visualizer (7 Cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-gradient-to-b from-[#091326] to-[#040810] border border-cyan-500/30 p-6 sm:p-8 flex flex-col justify-between shadow-[0_0_50px_rgba(6,182,212,0.12)] relative overflow-hidden">
          {/* Ambient scan beam */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6 font-mono text-xs">
              <div className="flex items-center space-x-2 text-cyan-300">
                <Radio className="w-4 h-4 animate-pulse" />
                <span>SENTINEL-1C C-BAND SAR SWATH</span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedBand("vv")}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                    selectedBand === "vv" ? "bg-cyan-500 text-slate-950" : "bg-white/5 text-white/60"
                  }`}
                >
                  CO-POL (VV)
                </button>
                <button
                  onClick={() => setSelectedBand("vh")}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                    selectedBand === "vh" ? "bg-cyan-500 text-slate-950" : "bg-white/5 text-white/60"
                  }`}
                >
                  CROSS-POL (VH)
                </button>
              </div>
            </div>

            {/* Radar Visual Representation Graphic */}
            <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-[#020611] border border-cyan-500/20 mb-6 flex items-center justify-center">
              <img
                src="/sequence/frame_15.webp"
                alt="SAR Detection Footprint"
                className="w-full h-full object-cover filter brightness-90 contrast-125"
              />

              {/* Polarimetric Overlay Shader */}
              <div className={`absolute inset-0 transition-opacity duration-300 ${
                selectedBand === "vv" ? "bg-cyan-950/20" : "bg-emerald-950/30"
              }`} />

              {/* Animated Radar Scanning Arc Line */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 320">
                {/* Simulated Radar Swath Path */}
                <rect x="60" y="40" width="380" height="240" fill="none" stroke="rgba(56, 189, 248, 0.4)" strokeWidth="1" strokeDasharray="4 4" />
                
                {/* Slick Boundary Contour */}
                <path
                  d="M 120,180 C 160,110 340,90 410,130 C 470,170 460,240 400,270 C 330,300 150,280 120,230 Z"
                  fill="rgba(6, 182, 212, 0.12)"
                  stroke="#38bdf8"
                  strokeWidth="2"
                  strokeDasharray="6 3"
                  className="animate-pulse"
                />

                {/* Target Vessel Crosshairs */}
                <circle cx="280" cy="180" r="16" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
                <circle cx="280" cy="180" r="4" fill="#f59e0b" />
                <text x="305" y="185" fill="#f59e0b" fontSize="10" fontFamily="monospace" fontWeight="bold">TARGET: MV PACIFIC TITAN</text>
              </svg>

              {/* Live Status Pill */}
              <div className="absolute top-4 left-4 flex items-center space-x-2 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-cyan-500/30 text-[11px] font-mono text-cyan-300">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                <span>ANOMALOUS CO-POL DEPRESSION: -12.8 dB</span>
              </div>
            </div>
          </div>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-3 gap-3 font-mono text-xs text-white/70">
            <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5">
              <span className="text-[10px] text-white/40 block">INCIDENCE ANGLE</span>
              <span className="text-sm font-bold text-white mt-0.5 block">34.2°</span>
              <span className="text-[10px] text-cyan-400/80">Swath Width: 250 km</span>
            </div>
            <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5">
              <span className="text-[10px] text-white/40 block">SPATIAL FOOTPRINT</span>
              <span className="text-sm font-bold text-white mt-0.5 block">4.82 km²</span>
              <span className="text-[10px] text-emerald-400">11.4 km Perimeter</span>
            </div>
            <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5">
              <span className="text-[10px] text-white/40 block">ORBIT ALTITUDE</span>
              <span className="text-sm font-bold text-white mt-0.5 block">693 km</span>
              <span className="text-[10px] text-white/50">Sun-Synchronous</span>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Backscatter Spectrum Chart & Metrics (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-6">
          {/* Backscatter Histogram Graphic Card */}
          <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-6 font-mono text-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2 text-cyan-400 font-bold">
                <Activity className="w-4 h-4" />
                <span>RADAR BACKSCATTER SPECTRUM</span>
              </div>
              <span className="text-[10px] text-white/40">CALIBRATED SIGMA-0</span>
            </div>

            {/* Backscatter Spectrum Comparison Bars */}
            <div className="space-y-4 pt-2">
              <div>
                <div className="flex justify-between text-[11px] mb-1.5">
                  <span className="text-white/60">Clean Ocean Background (Roughness):</span>
                  <span className="text-cyan-300 font-bold">-24.4 dB</span>
                </div>
                <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-cyan-400" style={{ width: "75%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1.5">
                  <span className="text-white/60">Hydrocarbon Slick (Capillary Damped):</span>
                  <span className="text-amber-400 font-bold">-12.8 dB (DEPRESSED)</span>
                </div>
                <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-500 to-red-500" style={{ width: "38%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1.5">
                  <span className="text-white/60">Vessel Hull Reflectivity (Double Bounce):</span>
                  <span className="text-emerald-400 font-bold">+18.2 dB (METALLIC)</span>
                </div>
                <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-emerald-400" style={{ width: "95%" }} />
                </div>
              </div>
            </div>

            <p className="mt-4 pt-3 border-t border-white/10 text-[11px] text-white/50 leading-relaxed font-sans">
              Surface oil dampens high-frequency gravity-capillary waves, creating a specular reflection mirror that scatters radar energy away from the satellite receiver, leaving a dark acoustic signature.
            </p>
          </div>

          {/* Satellite Constellation Card */}
          <div className="rounded-2xl bg-gradient-to-br from-cyan-950/40 to-[#070e1b] border border-cyan-500/20 p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Automated Anomaly Segmentation</h3>
                <p className="text-xs text-white/60 font-sans">Convolutional neural network extracts oil polygon masks in under 90 seconds.</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs font-mono text-white/60 pt-3 border-t border-white/10">
              <span>Model: AquaNet-SAR v3.2</span>
              <span className="text-emerald-400 font-bold">F1-Score: 0.962</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
