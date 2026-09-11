"use client";

import React from "react";
import { Eye, Waves, Compass, Anchor, Cpu, ArrowUpRight } from "lucide-react";

export const Capabilities: React.FC = () => {
  const features = [
    {
      icon: Eye,
      tag: "ORBITAL RECONNAISSANCE",
      title: "Autonomous Satellite Computer Vision",
      description:
        "High-cadence Synthetic Aperture Radar (SAR) and multispectral optical algorithms identify low-backscatter oil damping signatures across millions of square kilometers of open ocean.",
      metrics: "Sub-meter resolution • Day/Night all-weather",
      badge: "SENTINEL & RADARSAT FUSION",
    },
    {
      icon: Waves,
      tag: "FLUID DYNAMICS ENGINE",
      title: "Lagrangian Reverse-Drift Trajectory",
      description:
        "Coupled hydrodynamic simulations model ocean currents, Stokes wave drift, and windage vectors in reverse time (Δt = -12h), back-tracing the slick mass center to the exact release origin point.",
      metrics: "0.1 kn vector accuracy • 4D Navier-Stokes solver",
      badge: "REVERSE HYDRODYNAMICS",
    },
    {
      icon: Compass,
      tag: "CRIME-CHAIN ATTRIBUTION",
      title: "AIS Spatiotemporal Vessel Correlation",
      description:
        "Fuses global Automatic Identification System (AIS) transponder trails with slick origin timestamps, flagging telltale engine speed drops and draught anomalies characteristic of illicit bilge dumping.",
      metrics: "98.6% attribution confidence • IMO verification",
      badge: "MARPOL COMPLIANCE",
    },
    {
      icon: Anchor,
      tag: "RAPID INTERCEPTION",
      title: "Containment Fleet Deployment Vectors",
      description:
        "Optimizes nautical intercepts and boom placement coordinates for maritime response vessels, skimmers, and airborne dispersant units to circumscribe surface slicks before coastal impact.",
      metrics: "Automated cordon geometry • Live escort routing",
      badge: "HAZMAT DIRECT RESPONSE",
    },
  ];

  return (
    <section id="capabilities" className="py-24 px-6 max-w-7xl mx-auto relative z-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs uppercase tracking-widest mb-3">
            <Cpu className="w-4 h-4" />
            <span>Forensic Intelligence Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            End-to-End Maritime <br className="hidden sm:block" />
            Contamination Intelligence
          </h2>
        </div>
        <p className="max-w-md text-sm text-white/60 leading-relaxed font-sans">
          AquaGuard fuses multi-source orbital constellations with oceanographic physics and global ship telemetry to turn ephemeral slicks into irrefutable legal evidence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <div
              key={idx}
              className="group relative p-8 rounded-2xl bg-gradient-to-b from-white/[0.04] to-transparent border border-white/10 hover:border-cyan-500/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] flex flex-col justify-between overflow-hidden"
            >
              {/* Subtle top corner gradient accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-bl-full pointer-events-none group-hover:bg-cyan-500/10 transition-colors" />

              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono tracking-wider px-2.5 py-1 rounded bg-white/5 border border-white/10 text-white/60">
                    {feature.badge}
                  </span>
                </div>

                <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider block mb-1">
                  {feature.tag}
                </span>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-200 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-white/65 leading-relaxed font-sans mb-6">
                  {feature.description}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/50">
                <span>{feature.metrics}</span>
                <ArrowUpRight className="w-4 h-4 text-white/30 group-hover:text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
