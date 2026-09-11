"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { ShieldAlert, CheckCircle2, Crosshair, Navigation, Satellite } from "lucide-react";

interface FrameScrollerProps {
  onOpenDossier: () => void;
}

const TOTAL_FRAMES = 160;

export const FrameScroller: React.FC<FrameScrollerProps> = ({ onOpenDossier }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const lastDrawnFrameRef = useRef<number>(0);
  const currentFrameRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);

  const [frame, setFrame] = useState<number>(0);
  const [phase, setPhase] = useState<"detect" | "outflow" | "drift" | "contain">("detect");

  // ── DRAW FRAME ON CANVAS (GPU-accelerated, zero flicker) ───────────
  const renderFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (canvas.width === 0 || canvas.height === 0) return;

    const isValid = (img: HTMLImageElement | null): img is HTMLImageElement =>
      !!(img && img.complete && img.naturalWidth > 0);

    // Pick target frame or search backward/forward for nearest ready frame
    let img = imagesRef.current[frameIndex];

    if (!isValid(img)) {
      // Look back for last known good frame
      for (let i = frameIndex - 1; i >= 0; i--) {
        if (isValid(imagesRef.current[i])) {
          img = imagesRef.current[i];
          break;
        }
      }
      // If none backward, look forward
      if (!isValid(img)) {
        for (let i = frameIndex + 1; i < TOTAL_FRAMES; i++) {
          if (isValid(imagesRef.current[i])) {
            img = imagesRef.current[i];
            break;
          }
        }
      }
      // Fallback to last successfully drawn frame
      if (!isValid(img)) {
        img = imagesRef.current[lastDrawnFrameRef.current];
      }
    }

    if (!isValid(img)) return;

    lastDrawnFrameRef.current = frameIndex;

    const width = canvas.width;
    const height = canvas.height;
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = width / height;

    let drawWidth = width;
    let drawHeight = height;
    let offsetX = 0;
    let offsetY = 0;

    // Cover container preserving aspect ratio
    if (canvasRatio > imgRatio) {
      drawHeight = width / imgRatio;
      offsetY = (height - drawHeight) / 2;
    } else {
      drawWidth = height * imgRatio;
      offsetX = (width - drawWidth) / 2;
    }

    // High quality smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Draw directly over previous contents (no blank flash!)
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }, []);

  // ── PRELOAD ALL 160 FRAMES INTO PERSISTENT MEMORY ─────────────────
  useEffect(() => {
    let isMounted = true;

    // Load frame 0 immediately with highest priority
    const f0 = new Image();
    f0.src = `/sequence/frame_0.webp`;
    f0.onload = () => {
      if (!isMounted) return;
      imagesRef.current[0] = f0;
      renderFrame(0);
    };

    // Preload remaining frames
    for (let i = 1; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = `/sequence/frame_${i}.webp`;
      img.onload = () => {
        if (!isMounted) return;
        imagesRef.current[i] = img;
        // If this is the current active frame, render it
        if (currentFrameRef.current === i) {
          renderFrame(i);
        }
      };
    }

    return () => {
      isMounted = false;
    };
  }, [renderFrame]);

  // ── CANVAS RESIZE HANDLER (DPR aware) ─────────────────────────────
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      renderFrame(currentFrameRef.current);
    };

    const initialRaf = requestAnimationFrame(handleResize);
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(initialRaf);
      window.removeEventListener("resize", handleResize);
    };
  }, [renderFrame]);

  // ── SMOOTH SCROLL HANDLER VIA REQUEST ANIMATION FRAME ─────────────
  useEffect(() => {
    function computeAndDraw() {
      const el = sectionRef.current;
      if (!el) return;

      const sectionTop = el.getBoundingClientRect().top + window.scrollY;
      const sectionHeight = el.offsetHeight;
      const scrolled = window.scrollY - sectionTop;
      const scrollable = sectionHeight - window.innerHeight;

      if (scrollable <= 0) {
        currentFrameRef.current = 0;
        setFrame(0);
        setPhase("detect");
        renderFrame(0);
        return;
      }

      const clamped = Math.min(Math.max(scrolled, 0), scrollable);
      const pct = clamped / scrollable;
      const f = Math.min(Math.floor(pct * TOTAL_FRAMES), TOTAL_FRAMES - 1);

      if (f !== currentFrameRef.current) {
        currentFrameRef.current = f;
        renderFrame(f);
        setFrame(f);

        const newPhase =
          f < 36 ? "detect" :
          f < 86 ? "outflow" :
          f < 126 ? "drift" : "contain";

        setPhase(newPhase);
      }
    }

    function onScroll() {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      rafIdRef.current = requestAnimationFrame(computeAndDraw);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    // Initial draw
    computeAndDraw();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [renderFrame]);

  return (
    /* ── outer spacer — gives the page its scroll height ── */
    <div ref={sectionRef} style={{ height: "550vh" }} className="relative">

      {/* ── sticky viewport — stays pinned while you scroll through the spacer ── */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#030712]">

        {/* GPU-ACCELERATED HARDWARE CANVAS — ZERO FLICKER, PERFECT FRAMES */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
        />

        {/* ── PHASE DOTS ── */}
        <div className="absolute top-32 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 pointer-events-none">
          {(["detect", "outflow", "drift", "contain"] as const).map((p, i) => (
            <div
              key={p}
              className={`px-3 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border transition-all ${
                phase === p
                  ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300"
                  : "bg-white/[.03] border-white/10 text-white/20"
              }`}
            >
              0{i + 1}
            </div>
          ))}
        </div>

        {/* ── INFO CARDS ── */}
        {phase === "detect" && (
          <div className="absolute left-6 sm:left-12 top-1/2 -translate-y-1/2 max-w-sm z-20">
            <div className="p-6 rounded-2xl bg-black/80 backdrop-blur-xl border border-cyan-500/40 shadow-[0_0_40px_rgba(6,182,212,0.15)]">
              <div className="flex items-center gap-2 text-cyan-400 text-[10px] font-mono uppercase tracking-widest mb-2">
                <Satellite className="w-3.5 h-3.5" />
                <span>Phase 01 · SAR Radar Pass</span>
              </div>
              <h2 className="text-lg font-extrabold text-white mb-2">SAR Backscatter Anomaly Detected</h2>
              <p className="text-xs text-white/65 leading-relaxed mb-3">
                Sentinel-1C passes over Gulf Sector 04 at 693 km altitude. A 4.82 km² damping footprint reveals hydrocarbon slick suppressing capillary waves by −12.8 dB.
              </p>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />−12.8 dB DAMPENING
              </span>
            </div>
          </div>
        )}

        {phase === "outflow" && (
          <div className="absolute left-6 sm:left-12 top-1/2 -translate-y-1/2 max-w-sm z-20">
            <div className="p-6 rounded-2xl bg-black/80 backdrop-blur-xl border border-amber-500/40 shadow-[0_0_40px_rgba(245,158,11,0.15)]">
              <div className="flex items-center gap-2 text-amber-400 text-[10px] font-mono uppercase tracking-widest mb-2">
                <Crosshair className="w-3.5 h-3.5" />
                <span>Phase 02 · Discharge Plume</span>
              </div>
              <h2 className="text-lg font-extrabold text-white mb-2">Bilge Bypass Discharge Confirmed</h2>
              <p className="text-xs text-white/65 leading-relaxed mb-3">
                High-zoom optical locks onto the starboard bilge pipe of MV PACIFIC TITAN. Heavy sludge at 7.8 m³/min for 18 min 42 sec — total discharge: 142 m³ (893 bbl).
              </p>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-amber-500/15 border border-amber-500/30 text-amber-300">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />142 m³ ILLEGAL DISCHARGE
              </span>
            </div>
          </div>
        )}

        {phase === "drift" && (
          <div className="absolute right-6 sm:right-12 top-1/2 -translate-y-1/2 max-w-sm z-20">
            <div className="p-6 rounded-2xl bg-black/80 backdrop-blur-xl border border-sky-500/40 shadow-[0_0_40px_rgba(14,165,233,0.15)]">
              <div className="flex items-center gap-2 text-sky-400 text-[10px] font-mono uppercase tracking-widest mb-2">
                <Navigation className="w-3.5 h-3.5" />
                <span>Phase 03 · Lagrangian Drift</span>
              </div>
              <h2 className="text-lg font-extrabold text-white mb-2">4D Reverse-Drift Backtrack</h2>
              <p className="text-xs text-white/65 leading-relaxed mb-3">
                Hydrodynamic model integrates 72 h current fields. Trajectory resolves origin to 28°36′N 88°32′W — aligning with TITAN&apos;s AIS track and a 1.8 kn speed anomaly.
              </p>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-sky-500/15 border border-sky-500/30 text-sky-300">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />14.8 NM BACKTRACKED
              </span>
            </div>
          </div>
        )}

        {phase === "contain" && (
          <div className="absolute right-6 sm:right-12 top-1/2 -translate-y-1/2 max-w-sm z-20">
            <div className="p-6 rounded-2xl bg-black/80 backdrop-blur-xl border border-emerald-500/40 shadow-[0_0_40px_rgba(16,185,129,0.15)]">
              <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-mono uppercase tracking-widest mb-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Phase 04 · Containment</span>
              </div>
              <h2 className="text-lg font-extrabold text-white mb-2">11.4 km Boom · Vessel Apprehended</h2>
              <p className="text-xs text-white/65 leading-relaxed mb-3">
                4 skimmers deploy offshore boom enclosing the 4.82 km² slick. SAR + AIS + drift cross-correlation yields 98.6% attribution. Legal dossier filed.
              </p>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />98.6% ATTRIBUTION CONFIDENCE
              </span>
              <button
                onClick={onOpenDossier}
                className="w-full flex items-center justify-center gap-2 mt-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold font-mono text-xs uppercase tracking-wider transition-all"
              >
                <ShieldAlert className="w-3.5 h-3.5" />Open Legal Evidence Dossier
              </button>

              <a
                href="#c4i-console"
                className="w-full flex items-center justify-center gap-2 mt-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-400 to-cyan-400 hover:from-cyan-400 hover:to-sky-300 text-slate-950 font-bold font-mono text-xs uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(6,182,212,0.5)] hover:scale-105"
              >
                <Satellite className="w-3.5 h-3.5 animate-pulse" />Attach C4I Operational Model ↓
              </a>
            </div>
          </div>
        )}

        {/* ── DISCHARGE RETICLE (frames 36-95) ── */}
        {frame >= 36 && frame <= 95 && (
          <div className="absolute pointer-events-none z-20" style={{ top: "54%", left: "49%", transform: "translate(-50%,-50%)" }}>
            <div className="relative w-16 h-16 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-amber-400/70 animate-spin" style={{ animationDuration: "8s" }} />
              <div className="absolute inset-2 rounded-full border border-amber-400/30 animate-pulse" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_14px_rgba(245,158,11,.8)]" />
            </div>
          </div>
        )}

        {/* ── SCROLL HINT (frame 0 only) ── */}
        {frame === 0 && (
          <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none">
            <p className="text-white/40 text-xs font-mono tracking-widest uppercase">Scroll to advance frames</p>
            <div className="w-px h-10 bg-gradient-to-b from-cyan-400 to-transparent animate-pulse" />
          </div>
        )}

        {/* ── BOTTOM FADE — blends into the section below ── */}
        <div
          className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none"
          style={{ height: "18vh", background: "linear-gradient(to bottom, transparent, #050505)" }}
        />

      </div>
    </div>
  );
};
