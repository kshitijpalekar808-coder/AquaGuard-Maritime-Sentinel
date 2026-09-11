"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Play, Pause, RotateCcw, Maximize2, ShieldAlert, Sparkles, Navigation, Layers } from "lucide-react";

interface HeroCanvasProps {
  currentFrame: number;
  setCurrentFrame: React.Dispatch<React.SetStateAction<number>>;
  onOpenDossier: () => void;
}

const TOTAL_FRAMES = 120;

export const HeroCanvas: React.FC<HeroCanvasProps> = ({
  currentFrame,
  setCurrentFrame,
  onOpenDossier,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  // Track current frame in a ref so resize handler is never stale
  const currentFrameRef = useRef<number>(currentFrame);
  
  const [loadedCount, setLoadedCount] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [fps, setFps] = useState<number>(24);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  // Preload frames progressively
  useEffect(() => {
    let isMounted = true;
    let loaded = 0;

    // First load frame 0 immediately so user sees instant visual
    const priorityIndices = [0, 20, 40, 60, 80, 100, 119];
    const otherIndices = Array.from({ length: TOTAL_FRAMES }, (_, i) => i).filter(
      (i) => !priorityIndices.includes(i)
    );

    const loadOrder = [...priorityIndices, ...otherIndices];

    loadOrder.forEach((index) => {
      const img = new Image();
      img.src = `/sequence/frame_${index}.webp`;
      img.onload = () => {
        if (!isMounted) return;
        imagesRef.current[index] = img;
        loaded++;
        setLoadedCount(loaded);
        if (index === 0 && canvasRef.current) {
          drawFrame(0);
        }
      };
      img.onerror = () => {
        // Fallback gracefully
        loaded++;
        setLoadedCount(loaded);
      };
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Draw frame on canvas — stable callback with empty deps (no state dependencies)
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Ensure canvas has non-zero dimensions before drawing
    if (canvas.width === 0 || canvas.height === 0) return;

    const img = imagesRef.current[frameIndex] || imagesRef.current[0];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    // Set canvas dimensions based on container
    const width = canvas.width;
    const height = canvas.height;

    // Calculate aspect ratio fill/contain (cover behavior for cinematic view)
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = width / height;

    let drawWidth = width;
    let drawHeight = height;
    let offsetX = 0;
    let offsetY = 0;

    if (canvasRatio > imgRatio) {
      drawHeight = width / imgRatio;
      offsetY = (height - drawHeight) / 2;
    } else {
      drawWidth = height * imgRatio;
      offsetX = (width - drawWidth) / 2;
    }

    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

    // Subtle dark cinematic vignette overlay
    const gradient = ctx.createRadialGradient(
      width / 2,
      height / 2,
      Math.min(width, height) * 0.35,
      width / 2,
      height / 2,
      Math.max(width, height) * 0.8
    );
    gradient.addColorStop(0, "rgba(5, 5, 5, 0)");
    gradient.addColorStop(1, "rgba(5, 5, 5, 0.65)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }, []); // Stable — reads only refs, no state

  // Sync currentFrameRef when prop changes
  useEffect(() => {
    currentFrameRef.current = currentFrame;
  }, [currentFrame]);

  // Sync canvas size to display size — only depends on drawFrame (stable), NOT currentFrame
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
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

  // Playback Loop
  useEffect(() => {
    if (!isPlaying) return;

    const interval = 1000 / fps;
    const timer = setInterval(() => {
      setCurrentFrame((prev) => {
        const next = (prev + 1) % TOTAL_FRAMES;
        drawFrame(next);
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isPlaying, fps, drawFrame, setCurrentFrame]);

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetFrame = parseInt(e.target.value, 10);
    setCurrentFrame(targetFrame);
    drawFrame(targetFrame);
  };

  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Phase metadata based on current frame
  const getPhaseInfo = (frame: number) => {
    if (frame < 30) {
      return {
        tag: "PHASE 1: ORBITAL DETECTION",
        title: "Copernicus Sentinel-1C Synthetic Aperture Radar anomaly flagged",
        time: "T - 00h 00m UTC",
        coords: "28°42'11.4\" N, 88°21'35.8\" W",
      };
    } else if (frame < 70) {
      return {
        tag: "PHASE 2: EFFLUENT SOURCE IDENTIFICATION",
        title: "Optical multi-zoom confirms heavy bilge oil discharge plume",
        time: "T - 06h 45m UTC",
        coords: "28°36'12.0\" N, 88°32'40.0\" W",
      };
    } else if (frame < 95) {
      return {
        tag: "PHASE 3: LAGRANGIAN BACKTRACKING",
        title: "Reverse hydrodynamic current vectors pinpoint MV Pacific Titan",
        time: "T - 04h 15m UTC",
        coords: "28°39'22.1\" N, 88°27'15.4\" W",
      };
    } else {
      return {
        tag: "PHASE 4: CONTAINMENT FLEET ORCHESTRATION",
        title: "Rapid response skimmers deploy 11.4 km containment boom",
        time: "T + 02h 30m UTC",
        coords: "28°44'05.2\" N, 88°19'50.1\" W",
      };
    }
  };

  const phase = getPhaseInfo(currentFrame);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[16/9] max-h-[78vh] min-h-[440px] rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(6,182,212,0.12)] bg-[#040810] group"
    >
      {/* Background Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block object-cover"
      />

      {/* Progress buffer indicator */}
      {loadedCount < TOTAL_FRAMES && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/5 z-20 overflow-hidden">
          <div
            className="h-full bg-cyan-400/80 transition-all duration-300"
            style={{ width: `${(loadedCount / TOTAL_FRAMES) * 100}%` }}
          />
        </div>
      )}

      {/* Tactical HUD Header */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20 pointer-events-none">
        <div className="flex items-center space-x-2 pointer-events-auto">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-cyan-500/30 text-cyan-300 text-[11px] font-mono tracking-wider shadow-lg">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            LIVE REPLAY SEQUENCE
          </span>
          <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white/70 text-[11px] font-mono">
            {phase.coords}
          </span>
        </div>

        <div className="flex items-center space-x-2 pointer-events-auto">
          <div className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-mono text-white/80">
            FRAME <span className="text-cyan-400 font-bold">{String(currentFrame).padStart(3, "0")}</span> / {TOTAL_FRAMES - 1}
          </div>
          <button
            onClick={handleToggleFullscreen}
            className="p-1.5 rounded-lg bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/10 text-white/70 hover:text-white transition-colors"
            title="Toggle Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Narrative Telemetry Banner */}
      <div className="absolute top-16 left-4 max-w-md pointer-events-none z-20">
        <div className="p-3.5 rounded-xl bg-black/75 backdrop-blur-md border border-cyan-500/20 text-white shadow-xl animate-in fade-in duration-300">
          <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400 uppercase tracking-wider mb-1">
            <span>{phase.tag}</span>
            <span className="text-white/40">{phase.time}</span>
          </div>
          <p className="text-xs font-medium text-white/90 leading-snug">
            {phase.title}
          </p>
        </div>
      </div>

      {/* Interactive Evidence Hotspots */}
      {currentFrame >= 35 && currentFrame <= 75 && (
        <div
          className="absolute z-20 transition-all duration-300 pointer-events-auto"
          style={{ top: "54%", left: "48%" }}
        >
          <div className="relative group/pin">
            <button
              onClick={() => setActiveHotspot(activeHotspot === "plume" ? null : "plume")}
              className="relative flex items-center justify-center w-8 h-8 rounded-full bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-400 text-cyan-300 transition-all transform hover:scale-110 shadow-[0_0_20px_rgba(6,182,212,0.6)]"
            >
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-60"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            </button>

            {/* Hotspot Tooltip */}
            <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 rounded-xl bg-[#070e1b]/95 backdrop-blur-xl border border-cyan-500/40 shadow-2xl text-xs font-mono transition-all duration-200 ${activeHotspot === "plume" ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none group-hover/pin:opacity-100 group-hover/pin:scale-100 group-hover/pin:pointer-events-auto"}`}>
              <div className="flex items-center justify-between text-[10px] text-cyan-400 uppercase font-bold mb-1">
                <span>EVIDENCE PT #01</span>
                <span className="text-emerald-400">98.6% MATCH</span>
              </div>
              <p className="text-[11px] text-white/90 font-sans font-medium">
                Bilge separator bypass outflow point discharging oily sludge mixture.
              </p>
              <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-white/60">
                <span>EST VOL: 142 m³</span>
                <button
                  onClick={onOpenDossier}
                  className="text-cyan-300 hover:text-cyan-200 underline font-sans"
                >
                  Inspect Dossier →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentFrame >= 90 && (
        <div
          className="absolute z-20 transition-all duration-300 pointer-events-auto"
          style={{ top: "38%", left: "15%" }}
        >
          <div className="relative group/pin">
            <button
              onClick={() => setActiveHotspot(activeHotspot === "boom" ? null : "boom")}
              className="relative flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500/20 hover:bg-emerald-500/40 border border-emerald-400 text-emerald-300 transition-all transform hover:scale-110 shadow-[0_0_20px_rgba(16,185,129,0.5)]"
            >
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"></span>
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            </button>

            <div className={`absolute bottom-full left-0 mb-2 w-60 p-3 rounded-xl bg-[#070e1b]/95 backdrop-blur-xl border border-emerald-500/40 shadow-2xl text-xs font-mono transition-all duration-200 ${activeHotspot === "boom" ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none group-hover/pin:opacity-100 group-hover/pin:scale-100 group-hover/pin:pointer-events-auto"}`}>
              <div className="text-[10px] text-emerald-400 uppercase font-bold mb-1">
                CONTAINMENT SKIMMER #2
              </div>
              <p className="text-[11px] text-white/90 font-sans font-medium">
                Ocean boom deployed with high-capacity weir skimmer recovering 85 bbl/hr.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Tactical Timeline Scrubber Dock */}
      <div className="absolute bottom-4 left-4 right-4 z-20">
        <div className="p-3 rounded-xl bg-black/80 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col gap-2.5">
          {/* Milestone markers along scrubber */}
          <div className="flex items-center justify-between text-[10px] font-mono text-white/40 px-1">
            <span
              onClick={() => {
                setCurrentFrame(0);
                drawFrame(0);
              }}
              className="cursor-pointer hover:text-cyan-400 transition-colors"
            >
              01 • DETECTION
            </span>
            <span
              onClick={() => {
                setCurrentFrame(48);
                drawFrame(48);
              }}
              className="cursor-pointer hover:text-cyan-400 transition-colors"
            >
              02 • PLUME OUTFLOW
            </span>
            <span
              onClick={() => {
                setCurrentFrame(78);
                drawFrame(78);
              }}
              className="cursor-pointer hover:text-cyan-400 transition-colors"
            >
              03 • DRIFT BACKTRACK
            </span>
            <span
              onClick={() => {
                setCurrentFrame(110);
                drawFrame(110);
              }}
              className="cursor-pointer hover:text-cyan-400 transition-colors"
            >
              04 • FLEET CORDON
            </span>
          </div>

          {/* Interactive Scrub Range Input */}
          <div className="relative flex items-center">
            <input
              type="range"
              min={0}
              max={TOTAL_FRAMES - 1}
              value={currentFrame}
              onChange={handleScrub}
              className="w-full h-1.5 bg-white/15 rounded-lg appearance-none cursor-pointer accent-cyan-400 hover:accent-cyan-300 transition-all focus:outline-none"
            />
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-between pt-1 font-mono text-xs text-white/70">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-colors"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span className="text-[11px]">{isPlaying ? "PAUSE" : "PLAY"}</span>
              </button>

              <button
                onClick={() => {
                  setCurrentFrame(0);
                  drawFrame(0);
                }}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                title="Restart Sequence"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setFps((prev) => (prev === 24 ? 40 : prev === 40 ? 12 : 24))}
                className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-[11px] text-white/70 hover:text-white transition-colors"
              >
                {fps} FPS
              </button>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3">
              <span className="hidden sm:inline-block text-[11px] text-white/40">
                SCROLL OR DRAG TO SCRUB FOOTAGE
              </span>
              <button
                onClick={onOpenDossier}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-[11px] font-sans font-medium transition-all"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Forensic Dossier</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
