"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { ShieldAlert, ArrowDown, Play, Pause, RotateCcw, CheckCircle2, Volume2, VolumeX, Sparkles, Navigation, Layers, Flame, Radar, Eye, Crosshair } from "lucide-react";
import { ForensicGraphicsOverlay } from "@/components/ForensicGraphicsOverlay";

interface ScrollCanvasProps {
  onOpenDossier: () => void;
  onFrameChange?: (frame: number) => void;
}

const TOTAL_FRAMES = 120;
type ViewMode = "normal" | "sar" | "thermal";

export const ScrollCanvas: React.FC<ScrollCanvasProps> = ({
  onOpenDossier,
  onFrameChange,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const lastDrawnIndexRef = useRef<number>(0);
  // Keep viewMode in a ref so drawFrame never goes stale
  const viewModeRef = useRef<ViewMode>("normal");
  // Keep current frame in ref too for use inside RAF callbacks
  const currentFrameRef = useRef<number>(0);

  const [currentFrame, setCurrentFrame] = useState<number>(0);
  const [loadedCount, setLoadedCount] = useState<number>(0);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<ViewMode>("normal");
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const frameRequestRef = useRef<number | null>(null);

  // Preload all 120 frames in strict numerical order 0→119
  // Frames 0-59 are loaded first (high priority) then 60-119
  useEffect(() => {
    let isMounted = true;
    let loaded = 0;

    // Priority: load first half first so early scroll looks great immediately
    const firstHalf = Array.from({ length: 60 }, (_, i) => i);
    const secondHalf = Array.from({ length: 60 }, (_, i) => i + 60);
    const loadOrder = [...firstHalf, ...secondHalf];

    const loadFrame = (index: number) => {
      const img = new Image();
      img.src = `/sequence/frame_${index}.webp`;
      img.onload = () => {
        if (!isMounted) return;
        imagesRef.current[index] = img;
        loaded++;
        setLoadedCount(loaded);
        // Draw first frame as soon as it's ready
        if (index === 0 && canvasRef.current) {
          drawFrame(0);
        }
      };
      img.onerror = () => {
        if (!isMounted) return;
        loaded++;
        setLoadedCount(loaded);
      };
    };

    loadOrder.forEach(loadFrame);

    return () => {
      isMounted = false;
    };
  }, []);

  // Draw frame on canvas with view mode filters and reliable fallback.
  // Uses refs only — never recreated, so no stale closure issues.
  const drawFrame = useCallback((frameIndex: number, overrideMode?: ViewMode) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Ensure canvas has non-zero dimensions before drawing
    if (canvas.width === 0 || canvas.height === 0) return;

    const isValid = (i: HTMLImageElement | null) => !!(i && i.complete && i.naturalWidth > 0);

    // Try requested frame first
    let img = imagesRef.current[frameIndex];

    if (!isValid(img)) {
      // Search BACKWARD first (show last good frame = no black flash)
      for (let back = frameIndex - 1; back >= 0; back--) {
        if (isValid(imagesRef.current[back])) {
          img = imagesRef.current[back];
          break;
        }
      }
      // If nothing behind, search forward
      if (!isValid(img)) {
        for (let fwd = frameIndex + 1; fwd < TOTAL_FRAMES; fwd++) {
          if (isValid(imagesRef.current[fwd])) {
            img = imagesRef.current[fwd];
            break;
          }
        }
      }
    }

    // If still nothing, use last successfully drawn index
    if (!isValid(img)) {
      img = imagesRef.current[lastDrawnIndexRef.current];
    }

    if (!img || !img.complete || img.naturalWidth === 0) return;

    lastDrawnIndexRef.current = frameIndex;

    const width = canvas.width;
    const height = canvas.height;

    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = width / height;

    let drawWidth = width;
    let drawHeight = height;
    let offsetX = 0;
    let offsetY = 0;

    // Cover canvas
    if (canvasRatio > imgRatio) {
      drawHeight = width / imgRatio;
      offsetY = (height - drawHeight) / 2;
    } else {
      drawWidth = height * imgRatio;
      offsetX = (width - drawWidth) / 2;
    }

    ctx.clearRect(0, 0, width, height);

    // Filter modes — read from ref so this callback is always fresh
    const mode = overrideMode ?? viewModeRef.current;
    if (mode === "sar") {
      ctx.filter = "contrast(180%) brightness(85%) hue-rotate(160deg) saturate(140%)";
    } else if (mode === "thermal") {
      ctx.filter = "contrast(160%) brightness(110%) hue-rotate(290deg) saturate(220%)";
    } else {
      ctx.filter = "none";
    }

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

    // Reset filter after draw
    ctx.filter = "none";

    // Mode-specific overlays
    if (mode === "sar") {
      ctx.fillStyle = "rgba(6, 182, 212, 0.04)";
      ctx.fillRect(0, 0, width, height);
    } else if (mode === "thermal") {
      ctx.fillStyle = "rgba(249, 115, 22, 0.05)";
      ctx.fillRect(0, 0, width, height);
    }
  }, []); // Stable — reads viewModeRef, never depends on state

  // Window resize handler — only depends on drawFrame (stable), NOT currentFrame.
  // Reading currentFrameRef inside avoids stale closure without adding it as a dep.
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      drawFrame(currentFrameRef.current);
    };

    // Defer initial sizing by one tick so the canvas element is fully mounted
    const rafId = requestAnimationFrame(handleResize);
    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
    };
  }, [drawFrame]); // drawFrame is stable, so this runs once

  // Keep currentFrameRef in sync with state
  useEffect(() => {
    currentFrameRef.current = currentFrame;
  }, [currentFrame]);

  // Scroll listener: Robust getBoundingClientRect calculation
  useEffect(() => {
    if (isAutoPlaying) return;

    const handleScroll = () => {
      // If a RAF is already scheduled, cancel it and reschedule (always use latest scroll pos)
      if (frameRequestRef.current) {
        cancelAnimationFrame(frameRequestRef.current);
      }

      frameRequestRef.current = requestAnimationFrame(() => {
        frameRequestRef.current = null;
        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const totalScroll = rect.height - window.innerHeight;

        if (totalScroll <= 0) return;

        // Progress based on container's scroll position
        const currentY = Math.max(0, -rect.top);
        const progress = Math.min(Math.max(currentY / totalScroll, 0), 1);
        setScrollProgress(progress);

        const targetFrame = Math.min(
          Math.floor(progress * TOTAL_FRAMES),
          TOTAL_FRAMES - 1
        );

        currentFrameRef.current = targetFrame;
        setCurrentFrame(targetFrame);
        drawFrame(targetFrame);
        onFrameChange?.(targetFrame);
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frameRequestRef.current) {
        cancelAnimationFrame(frameRequestRef.current);
        frameRequestRef.current = null;
      }
    };
  }, [isAutoPlaying, drawFrame, onFrameChange]);

  // Auto-play simulation loop
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentFrame((prev) => {
        const next = (prev + 1) % TOTAL_FRAMES;
        currentFrameRef.current = next;
        drawFrame(next);
        onFrameChange?.(next);
        setScrollProgress(next / (TOTAL_FRAMES - 1));
        return next;
      });
    }, 42); // ~24 fps smooth playback

    return () => clearInterval(interval);
  }, [isAutoPlaying, drawFrame, onFrameChange]);

  // Interactive scrubber input
  const handleScrubberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsAutoPlaying(false);
    const target = parseInt(e.target.value, 10);
    setCurrentFrame(target);
    setScrollProgress(target / (TOTAL_FRAMES - 1));
    drawFrame(target);
    onFrameChange?.(target);
  };

  // Jump to milestone
  const jumpToMilestone = (percent: number) => {
    setIsAutoPlaying(false);
    const container = containerRef.current;
    if (!container) return;
    const totalScroll = container.offsetHeight - window.innerHeight;
    const targetY = container.offsetTop + totalScroll * percent;
    window.scrollTo({ top: targetY, behavior: "smooth" });
  };

  // Switch view mode — sync both state (for UI) and ref (for drawFrame)
  const handleViewModeChange = (mode: ViewMode) => {
    viewModeRef.current = mode;
    setViewMode(mode);
    drawFrame(currentFrameRef.current, mode);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[450vh] bg-[#050505]"
    >
      {/* Sticky Fullscreen Canvas Viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-[#040810]">
        {/* Background Sequence Canvas */}
        <canvas
          ref={canvasRef}
          className="w-full h-full block object-cover select-none"
        />

        {/* Dynamic Interactive Forensic Graphics Overlay */}
        <ForensicGraphicsOverlay
          scrollProgress={scrollProgress}
          currentFrame={currentFrame}
          onOpenDossier={onOpenDossier}
        />

        {/* Buffering Progress Badge */}
        {loadedCount < TOTAL_FRAMES && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-black/85 backdrop-blur-md border border-cyan-500/30 text-[11px] font-mono text-cyan-300 shadow-xl">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span>BUFFERING HIGH-RES FRAMES ({loadedCount}/{TOTAL_FRAMES})</span>
          </div>
        )}

        {/* Top Floating HUD Bar */}
        <div className="absolute top-20 sm:top-24 left-6 right-6 flex items-center justify-between z-20 pointer-events-none">
          <div className="flex items-center space-x-3 pointer-events-auto">
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-white/90 text-xs font-mono shadow-lg">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span className="text-cyan-300 font-bold">SENTINEL-1C</span>
              <span className="text-white/30 hidden sm:inline">|</span>
              <span className="text-white/70 hidden sm:inline">28°36&apos;12&quot; N, 88°32&apos;40&quot; W</span>
            </div>

            {/* Interactive View Mode Filter Toggle */}
            <div className="hidden md:flex items-center p-1 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-xs font-mono shadow-lg">
              <button
                onClick={() => handleViewModeChange("normal")}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-full transition-all ${
                  viewMode === "normal"
                    ? "bg-cyan-500 text-slate-950 font-bold shadow-md"
                    : "text-white/60 hover:text-white"
                }`}
              >
                <Eye className="w-3 h-3" />
                <span>OPTICAL</span>
              </button>
              <button
                onClick={() => handleViewModeChange("sar")}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-full transition-all ${
                  viewMode === "sar"
                    ? "bg-cyan-500 text-slate-950 font-bold shadow-md"
                    : "text-white/60 hover:text-white"
                }`}
              >
                <Radar className="w-3 h-3" />
                <span>SAR RADAR</span>
              </button>
              <button
                onClick={() => handleViewModeChange("thermal")}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-full transition-all ${
                  viewMode === "thermal"
                    ? "bg-amber-500 text-slate-950 font-bold shadow-md"
                    : "text-white/60 hover:text-white"
                }`}
              >
                <Flame className="w-3 h-3" />
                <span>THERMAL</span>
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2 pointer-events-auto">
            <div className="px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-cyan-500/30 text-xs font-mono text-cyan-300 shadow-lg">
              FRAME <span className="font-bold text-white">{String(currentFrame).padStart(3, "0")}</span> / {TOTAL_FRAMES - 1}
            </div>
            <div className="px-2.5 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-xs font-mono text-white/70 shadow-lg">
              {Math.round(scrollProgress * 100)}% SCROLLED
            </div>
          </div>
        </div>

        {/* INTERACTIVE HOTSPOTS ON THE SHIP & SLICK */}
        {/* Hotspot 1: Discharge Outflow Pipe */}
        <div
          className="absolute z-30 pointer-events-auto transition-transform duration-300"
          style={{ top: "54%", left: "49%" }}
        >
          <div className="relative group/pin">
            <button
              onClick={() => setActiveHotspot(activeHotspot === "outflow" ? null : "outflow")}
              className="relative flex items-center justify-center w-8 h-8 rounded-full bg-amber-500/20 hover:bg-amber-500/40 border border-amber-400 text-amber-300 transition-all hover:scale-110 shadow-[0_0_20px_rgba(245,158,11,0.6)]"
              title="Inspect Discharge Point"
            >
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-60"></span>
              <Crosshair className="w-4 h-4 text-amber-300" />
            </button>

            {/* Hotspot Popover */}
            <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-72 p-4 rounded-xl bg-[#070e1b]/95 backdrop-blur-xl border border-amber-500/40 shadow-2xl text-xs font-mono transition-all duration-200 ${
              activeHotspot === "outflow" ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none group-hover/pin:opacity-100 group-hover/pin:scale-100 group-hover/pin:pointer-events-auto"
            }`}>
              <div className="flex items-center justify-between text-[10px] text-amber-400 uppercase font-bold mb-1.5">
                <span>BILGE DISCHARGE VALVE</span>
                <span className="px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/30 text-amber-300">ACTIVE OUTFLOW</span>
              </div>
              <p className="text-[11px] text-white/90 font-sans font-medium mb-2">
                Starboard hull discharge port emitting heavy oily sludge plume into surface waters.
              </p>
              <div className="space-y-1 text-[10px] text-white/70 border-t border-white/10 pt-2">
                <div className="flex justify-between">
                  <span className="text-white/40">VISCOSITY:</span>
                  <span className="text-amber-300 font-bold">380 cSt (Heavy Fuel)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">EST. VOLUME:</span>
                  <span className="text-white font-bold">142 m³ / 893 bbl</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hotspot 2: Suspect Vessel Bridge */}
        <div
          className="absolute z-30 pointer-events-auto transition-transform duration-300"
          style={{ top: "30%", left: "62%" }}
        >
          <div className="relative group/pin">
            <button
              onClick={() => setActiveHotspot(activeHotspot === "bridge" ? null : "bridge")}
              className="relative flex items-center justify-center w-8 h-8 rounded-full bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-400 text-cyan-300 transition-all hover:scale-110 shadow-[0_0_20px_rgba(6,182,212,0.6)]"
              title="Inspect Vessel Telemetry"
            >
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-60"></span>
              <Navigation className="w-3.5 h-3.5 text-cyan-300" />
            </button>

            <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-72 p-4 rounded-xl bg-[#070e1b]/95 backdrop-blur-xl border border-cyan-500/40 shadow-2xl text-xs font-mono transition-all duration-200 ${
              activeHotspot === "bridge" ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none group-hover/pin:opacity-100 group-hover/pin:scale-100 group-hover/pin:pointer-events-auto"
            }`}>
              <div className="flex items-center justify-between text-[10px] text-cyan-400 uppercase font-bold mb-1.5">
                <span>AIS VESSEL TARGET</span>
                <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 border border-cyan-500/30 text-cyan-300">98.6% CORRELATION</span>
              </div>
              <p className="text-[11px] text-white/90 font-sans font-semibold mb-1">
                MV PACIFIC TITAN
              </p>
              <p className="text-[10px] text-white/60 font-sans mb-2">
                IMO 9482012 • Bulk Carrier • Flag: Liberia (LBR)
              </p>
              <div className="space-y-1 text-[10px] text-white/70 border-t border-white/10 pt-2">
                <div className="flex justify-between">
                  <span className="text-white/40">SPEED DELTA:</span>
                  <span className="text-amber-400 font-bold">-1.8 kn drop at origin</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">DISTANCE TO ORIGIN:</span>
                  <span className="text-cyan-300 font-bold">0.3 NM (T - 06:45)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hotspot 3: Containment Boom Perimeter */}
        <div
          className="absolute z-30 pointer-events-auto transition-transform duration-300"
          style={{ top: "36%", left: "18%" }}
        >
          <div className="relative group/pin">
            <button
              onClick={() => setActiveHotspot(activeHotspot === "boom" ? null : "boom")}
              className="relative flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/20 hover:bg-emerald-500/40 border border-emerald-400 text-emerald-300 transition-all hover:scale-110 shadow-[0_0_20px_rgba(16,185,129,0.6)]"
              title="Inspect Containment Boom"
            >
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"></span>
              <Layers className="w-3.5 h-3.5 text-emerald-300" />
            </button>

            <div className={`absolute bottom-full left-0 mb-3 w-68 p-4 rounded-xl bg-[#070e1b]/95 backdrop-blur-xl border border-emerald-500/40 shadow-2xl text-xs font-mono transition-all duration-200 ${
              activeHotspot === "boom" ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none group-hover/pin:opacity-100 group-hover/pin:scale-100 group-hover/pin:pointer-events-auto"
            }`}>
              <div className="flex items-center justify-between text-[10px] text-emerald-400 uppercase font-bold mb-1.5">
                <span>OCEAN BOOM CORDON</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/30 text-emerald-300">11.4 KM ENCLOSED</span>
              </div>
              <p className="text-[11px] text-white/90 font-sans mb-2">
                High-tensile offshore containment barrier preventing slick dispersion toward coastal sensitive zones.
              </p>
              <div className="text-[10px] text-emerald-300/80 border-t border-white/10 pt-1.5">
                4 Recovery skimmers active • 85 bbl/hr recovery
              </div>
            </div>
          </div>
        </div>

        {/* NARRATIVE CHAPTER OVERLAYS */}

        {/* HERO TITLE (0% - 22% Scroll) */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center px-6 text-center z-20 transition-all duration-500 pointer-events-none ${
            scrollProgress < 0.22
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-12 pointer-events-none"
          }`}
        >
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-950/85 border border-cyan-500/40 text-cyan-300 font-mono text-xs tracking-wider mb-4 shadow-[0_0_25px_rgba(6,182,212,0.3)] pointer-events-auto">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>AUTONOMOUS MARITIME FORENSICS • COPERNICUS RADAR FUSION</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl leading-[1.08] text-white drop-shadow-2xl">
            Autonomous Satellite Intelligence for{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">
              Maritime Spill Forensics
            </span>
          </h1>

          <p className="mt-4 sm:mt-6 text-sm sm:text-base text-white/80 max-w-2xl leading-relaxed font-sans drop-shadow-md">
            Scroll down or drag the timeline slider below to scrub through all 120 sequence frames. Click any glowing target pin to inspect real-time forensics.
          </p>

          <div className="mt-8 flex items-center space-x-4 pointer-events-auto">
            <button
              onClick={onOpenDossier}
              className="flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:scale-105"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Inspect Incident Dossier</span>
            </button>

            <button
              onClick={() => jumpToMilestone(0.35)}
              className="flex items-center space-x-2 px-5 py-3.5 rounded-xl bg-black/70 hover:bg-black/90 border border-white/20 hover:border-cyan-500/40 text-white font-mono text-xs uppercase tracking-wider transition-all"
            >
              <ArrowDown className="w-4 h-4 text-cyan-400 animate-bounce" />
              <span>Scroll to Scrub Footage</span>
            </button>
          </div>
        </div>

        {/* PHASE 01: SATELLITE DETECTION (22% - 50% Scroll) */}
        <div
          className={`absolute left-6 sm:left-14 top-1/2 -translate-y-1/2 max-w-md z-20 transition-all duration-500 pointer-events-none ${
            scrollProgress >= 0.22 && scrollProgress < 0.52
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-8 pointer-events-none"
          }`}
        >
          <div className="p-6 sm:p-7 rounded-2xl bg-black/85 backdrop-blur-xl border border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.2)] text-white pointer-events-auto">
            <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs uppercase tracking-widest mb-2.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span>PHASE 01 • SATELLITE RADAR PASS</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white mb-2">
              SAR Backscatter Anomaly Flagged
            </h2>
            <p className="text-xs sm:text-sm text-white/75 leading-relaxed font-sans mb-3">
              Sentinel-1C Synthetic Aperture Radar detects a 4.82 km² damping footprint in Gulf Sector 04. Capillary sea waves smoothed by surface hydrocarbon layer.
            </p>
            <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 font-mono text-xs text-cyan-300 flex justify-between">
              <span>RADAR DEPRESSION:</span>
              <span className="font-bold text-white">-12.8 dB (ANOMALOUS)</span>
            </div>
          </div>
        </div>

        {/* PHASE 02: EFFLUENT OUTFLOW (52% - 78% Scroll) */}
        <div
          className={`absolute left-6 sm:left-14 top-1/2 -translate-y-1/2 max-w-md z-20 transition-all duration-500 pointer-events-none ${
            scrollProgress >= 0.52 && scrollProgress < 0.78
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-8 pointer-events-none"
          }`}
        >
          <div className="p-6 sm:p-7 rounded-2xl bg-black/85 backdrop-blur-xl border border-amber-500/30 shadow-[0_0_40px_rgba(245,158,11,0.2)] text-white pointer-events-auto">
            <div className="flex items-center space-x-2 text-amber-400 font-mono text-xs uppercase tracking-widest mb-2.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <span>PHASE 02 • DISCHARGE PLUME ISOLATION</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white mb-2">
              Bilge Plume Outflow Confirmed
            </h2>
            <p className="text-xs sm:text-sm text-white/75 leading-relaxed font-sans mb-3">
              Optical high-zoom locks onto discharge pipe releasing oily sludge mixture into wake. Calculated volume: <span className="text-amber-300 font-bold">142 m³ (~893 bbl)</span>.
            </p>
            <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 font-mono text-xs flex justify-between">
              <span className="text-white/50">PRIMARY SUSPECT:</span>
              <span className="text-amber-300 font-bold">MV PACIFIC TITAN</span>
            </div>
          </div>
        </div>

        {/* PHASE 03: FLEET CONTAINMENT & ATTRIBUTION (78% - 100% Scroll) */}
        <div
          className={`absolute right-6 sm:right-14 top-1/2 -translate-y-1/2 max-w-md z-20 transition-all duration-500 pointer-events-none ${
            scrollProgress >= 0.78
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-8 pointer-events-none"
          }`}
        >
          <div className="p-6 sm:p-7 rounded-2xl bg-black/85 backdrop-blur-xl border border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.2)] text-white pointer-events-auto">
            <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs uppercase tracking-widest mb-2.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>PHASE 03 • CONTAINMENT CORDON & ATTRIBUTION</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white mb-2">
              11.4 km Boom Enclosure Deployed
            </h2>
            <p className="text-xs sm:text-sm text-white/75 leading-relaxed font-sans mb-3">
              Lagrangian drift backtracks 14.8 NM to pinpoint vessel discharge time. 4 skimmers deploy barrier boom, containing the slick and preventing coastal ecological damage.
            </p>
            <button
              onClick={onOpenDossier}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs uppercase tracking-wider transition-all shadow-lg hover:scale-105"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Launch Legal Evidence Dossier</span>
            </button>
          </div>
        </div>

        {/* BOTTOM FLOATING INTERACTIVE CONTROLLER & TIMELINE SCRUBBER */}
        <div className="absolute bottom-6 left-6 right-6 z-30 flex flex-col gap-2.5 p-3.5 rounded-2xl bg-black/90 backdrop-blur-xl border border-white/15 shadow-2xl">
          {/* Milestone Jump Tabs */}
          <div className="flex items-center justify-between text-xs font-mono">
            <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto">
              <button
                onClick={() => jumpToMilestone(0.0)}
                className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg border text-[11px] transition-all whitespace-nowrap ${
                  scrollProgress < 0.22
                    ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-300 font-bold"
                    : "bg-white/5 border-white/10 text-white/60 hover:text-white"
                }`}
              >
                01 • HERO
              </button>
              <button
                onClick={() => jumpToMilestone(0.35)}
                className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg border text-[11px] transition-all whitespace-nowrap ${
                  scrollProgress >= 0.22 && scrollProgress < 0.52
                    ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-300 font-bold"
                    : "bg-white/5 border-white/10 text-white/60 hover:text-white"
                }`}
              >
                02 • DETECTION
              </button>
              <button
                onClick={() => jumpToMilestone(0.65)}
                className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg border text-[11px] transition-all whitespace-nowrap ${
                  scrollProgress >= 0.52 && scrollProgress < 0.78
                    ? "bg-amber-500/20 border-amber-500/40 text-amber-300 font-bold"
                    : "bg-white/5 border-white/10 text-white/60 hover:text-white"
                }`}
              >
                03 • OUTFLOW
              </button>
              <button
                onClick={() => jumpToMilestone(0.92)}
                className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg border text-[11px] transition-all whitespace-nowrap ${
                  scrollProgress >= 0.78
                    ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300 font-bold"
                    : "bg-white/5 border-white/10 text-white/60 hover:text-white"
                }`}
              >
                04 • CONTAINMENT
              </button>
            </div>

            {/* Auto Play / Simulation Mode Button */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-colors text-xs font-mono"
              >
                {isAutoPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
                <span className="text-[10px] sm:text-[11px] font-bold">{isAutoPlaying ? "PAUSE" : "AUTO PLAY"}</span>
              </button>
            </div>
          </div>

          {/* Interactive Scrub Slider Range */}
          <div className="flex items-center space-x-3">
            <span className="text-[10px] font-mono text-white/40 hidden sm:inline">SCRUB</span>
            <input
              type="range"
              min={0}
              max={TOTAL_FRAMES - 1}
              value={currentFrame}
              onChange={handleScrubberChange}
              className="w-full h-2 bg-white/15 rounded-lg appearance-none cursor-pointer accent-cyan-400 hover:accent-cyan-300 transition-all focus:outline-none"
            />
            <span className="text-[10px] font-mono text-cyan-400 font-bold w-12 text-right">
              {String(currentFrame).padStart(3, "0")} / 119
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
