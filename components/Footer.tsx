"use client";

import React from "react";
import { Shield, Radio, ExternalLink } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/10 bg-[#02050b] text-white/60 py-16 px-6 relative z-10 font-sans text-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="space-y-3">
          <div className="flex items-center space-x-2.5">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-500/30 text-cyan-400">
              <Shield className="w-3.5 h-3.5" />
            </div>
            <span className="text-sm font-bold tracking-wider text-white">AQUAGUARD EARTH SYSTEMS</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              v2.4
            </span>
          </div>
          <p className="text-xs text-white/50 max-w-sm">
            Autonomous orbital computer vision and hydrodynamic Lagrangian trajectory reconstruction for maritime environmental enforcement.
          </p>
          <div className="flex items-center space-x-2 text-[11px] font-mono text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>GLOBAL NETWORK HEALTH: OPTIMAL (6 SATELLITES IN SWATH)</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-8 text-xs font-mono">
          <div>
            <h4 className="text-white font-semibold uppercase tracking-wider text-[11px] mb-3">
              Forensic Modules
            </h4>
            <ul className="space-y-2 text-white/50">
              <li className="hover:text-cyan-300 transition-colors cursor-pointer">SAR Surface Damping</li>
              <li className="hover:text-cyan-300 transition-colors cursor-pointer">Lagrangian Backtracking</li>
              <li className="hover:text-cyan-300 transition-colors cursor-pointer">AIS Correlation Matrix</li>
              <li className="hover:text-cyan-300 transition-colors cursor-pointer">Containment Dispatch</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold uppercase tracking-wider text-[11px] mb-3">
              Governance & Law
            </h4>
            <ul className="space-y-2 text-white/50">
              <li className="hover:text-cyan-300 transition-colors cursor-pointer">IMO MARPOL Annex I</li>
              <li className="hover:text-cyan-300 transition-colors cursor-pointer">UNCLOS Part XII</li>
              <li className="hover:text-cyan-300 transition-colors cursor-pointer">Evidence Chain of Custody</li>
              <li className="hover:text-cyan-300 transition-colors cursor-pointer">Port State Control Export</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-white/40 text-[11px] font-mono">
        <p>© 2026 AquaGuard Earth Systems. All rights reserved.</p>
        <p>COPERNICUS OPEN ACCESS • NOAA SATELLITE OPERATIONS • WGS84</p>
      </div>
    </footer>
  );
};
