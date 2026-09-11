"use client";

import React from "react";
import { Shield, Volume2, VolumeX, FileText, ChevronRight } from "lucide-react";

interface NavbarProps {
  onOpenDossier: () => void;
  audioActive: boolean;
  toggleAudio: () => void;
  scrollProgress: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenDossier,
  audioActive,
  toggleAudio,
  scrollProgress,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 transition-all duration-300 bg-gradient-to-b from-black/90 via-black/60 to-transparent backdrop-blur-md border-b border-white/5">
      {/* Brand & System Status */}
      <div className="flex items-center space-x-6">
        <a href="#" className="flex items-center space-x-2.5 group">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 group-hover:border-cyan-400 transition-colors">
            <Shield className="w-4 h-4" />
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold tracking-wider text-white">AQUAGUARD</span>
              <span className="text-[10px] font-mono tracking-widest px-1.5 py-0.5 rounded bg-white/10 text-white/70">
                v2.4 INTEL
              </span>
            </div>
            <p className="text-[10px] font-mono text-cyan-400/80 flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              SENTINEL-1C SAR ACTIVE
            </p>
          </div>
        </a>

        {/* Section Nav Anchors */}
        <nav className="hidden xl:flex items-center space-x-6 text-xs font-mono text-white/60">
          <a href="#sequence" className="hover:text-cyan-300 transition-colors">
            LIVE REPLAY
          </a>
          <a href="#c4i-console" className="text-cyan-400 hover:text-cyan-200 font-bold flex items-center gap-1.5 transition-colors">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            C4I RADAR CONSOLE
          </a>
          <a href="#capabilities" className="hover:text-cyan-300 transition-colors">
            CAPABILITIES
          </a>
          <a href="#incident" className="hover:text-cyan-300 transition-colors">
            INCIDENT FORENSICS
          </a>
          <a href="#metrics" className="hover:text-cyan-300 transition-colors">
            METRICS
          </a>
        </nav>
      </div>

      {/* Progress & Quick Actions */}
      <div className="flex items-center space-x-3 sm:space-x-5">
        {/* Scroll Progress Indicator */}
        <div className="hidden md:flex items-center space-x-2 font-mono text-xs text-white/60">
          <span className="text-[11px]">SCRUB PROGRESS</span>
          <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-cyan-400 transition-all duration-150 ease-out"
              style={{ width: `${Math.round(scrollProgress * 100)}%` }}
            />
          </div>
          <span className="text-white/80 w-8 text-right text-[11px]">{Math.round(scrollProgress * 100)}%</span>
        </div>

        {/* Audio Ambiance Toggle */}
        <button
          onClick={toggleAudio}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-colors text-xs font-mono"
          title="Toggle Hydrophone Ambient Soundscape"
        >
          {audioActive ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span className="hidden sm:inline text-[11px] text-cyan-300">AUDIO ON</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-white/40" />
              <span className="hidden sm:inline text-[11px]">MUTED</span>
            </>
          )}
        </button>

        {/* Jump to C4I Console Button */}
        <a
          href="#c4i-console"
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 hover:text-white transition-all text-xs font-mono font-bold shadow-[0_0_15px_rgba(6,182,212,0.2)]"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>RADAR CONSOLE</span>
        </a>

        {/* Open Dossier Button */}
        <button
          onClick={onOpenDossier}
          className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 hover:text-cyan-200 transition-all text-xs font-mono font-medium shadow-sm hover:shadow-[0_0_15px_rgba(6,182,212,0.25)]"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>DOSSIER</span>
          <ChevronRight className="w-3.5 h-3.5 text-cyan-400/60" />
        </button>
      </div>
    </header>
  );
};
