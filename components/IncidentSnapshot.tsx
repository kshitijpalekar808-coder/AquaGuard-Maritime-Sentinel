"use client";

import React from "react";
import { ShieldAlert, FileText, CheckCircle2, AlertTriangle, ArrowRight, Anchor, Clock, MapPin, Gauge } from "lucide-react";

interface IncidentSnapshotProps {
  onOpenDossier: () => void;
}

export const IncidentSnapshot: React.FC<IncidentSnapshotProps> = ({ onOpenDossier }) => {
  return (
    <section id="incident" className="py-20 px-6 max-w-7xl mx-auto relative z-10">
      <div className="relative rounded-3xl p-8 sm:p-12 bg-gradient-to-b from-[#091326]/90 to-[#040810]/95 border border-cyan-500/30 shadow-[0_0_60px_rgba(6,182,212,0.15)] overflow-hidden">
        {/* Glow ambient effects */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 pb-8 border-b border-white/10">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-mono text-xs">
                <ShieldAlert className="w-3.5 h-3.5" />
                ACTIVE INVESTIGATION DOSSIER
              </span>
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-white/5 text-white/60 border border-white/10">
                REF: AQG-2026-0910-MX04
              </span>
              <span className="flex items-center gap-1 text-xs font-mono text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                ATTRIBUTION CONFIRMED (98.6%)
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">
              Gulf of Mexico Sector 04 Spill Attributed to Bulk Carrier
            </h2>
            <p className="mt-2 text-sm text-white/70 max-w-2xl font-sans">
              Copernicus Sentinel-1C SAR pass detected a 4.82 km² hydrocarbon plume. Lagrangian hydrodynamic backtracking and AIS transponder analysis identified illicit bilge discharge by MV Pacific Titan.
            </p>
          </div>

          <button
            onClick={onOpenDossier}
            className="flex-shrink-0 flex items-center space-x-2.5 px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:scale-105"
          >
            <FileText className="w-4 h-4" />
            <span>Examine Full Dossier</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Incident Telemetry Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 font-mono text-xs">
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
            <div className="flex items-center space-x-2 text-cyan-400 mb-2">
              <Anchor className="w-4 h-4" />
              <span className="text-[10px] uppercase text-white/50">Primary Target</span>
            </div>
            <span className="text-sm sm:text-base font-bold text-white block truncate">MV PACIFIC TITAN</span>
            <span className="text-[11px] text-white/50 block mt-0.5">IMO 9482012 • Flag: LBR</span>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
            <div className="flex items-center space-x-2 text-cyan-400 mb-2">
              <Gauge className="w-4 h-4" />
              <span className="text-[10px] uppercase text-white/50">Estimated Discharge</span>
            </div>
            <span className="text-sm sm:text-base font-bold text-white block">142 m³ / 893 bbl</span>
            <span className="text-[11px] text-white/50 block mt-0.5">Spatial Footprint: 4.82 km²</span>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
            <div className="flex items-center space-x-2 text-cyan-400 mb-2">
              <Clock className="w-4 h-4" />
              <span className="text-[10px] uppercase text-white/50">Release Timestamp</span>
            </div>
            <span className="text-sm sm:text-base font-bold text-white block">T - 06h 45m UTC</span>
            <span className="text-[11px] text-amber-400/90 block mt-0.5">Speed anomaly: -1.8 kn</span>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
            <div className="flex items-center space-x-2 text-cyan-400 mb-2">
              <MapPin className="w-4 h-4" />
              <span className="text-[10px] uppercase text-white/50">Backtrack Vector</span>
            </div>
            <span className="text-sm sm:text-base font-bold text-white block">14.8 NM @ 042°</span>
            <span className="text-[11px] text-emerald-400 block mt-0.5">Cordon perimeter: 11.4 km</span>
          </div>
        </div>
      </div>
    </section>
  );
};
