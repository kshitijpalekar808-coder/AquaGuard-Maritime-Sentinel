"use client";

import React from "react";
import { ShieldCheck, Zap, Globe, Scale } from "lucide-react";

export const Metrics: React.FC = () => {
  const stats = [
    {
      icon: ShieldCheck,
      value: "98.6%",
      label: "Attribution Confidence",
      description: "Validated against physical slick mass centers and AIS trajectory intersections.",
    },
    {
      icon: Zap,
      value: "< 12 min",
      label: "Detection-to-Alert Latency",
      description: "End-to-end pipeline from satellite downlink to automated maritime authority dispatch.",
    },
    {
      icon: Globe,
      value: "100%",
      label: "Global EEZ & High Seas Watch",
      description: "Continuous radar swath monitoring covering critical international shipping lanes.",
    },
    {
      icon: Scale,
      value: "MARPOL",
      label: "Annex I Legal Admissibility",
      description: "Forensic chains of custody tailored for maritime court prosecution and port detentions.",
    },
  ];

  return (
    <section id="metrics" className="py-20 px-6 max-w-7xl mx-auto relative z-10">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block mb-2">
          Global Operational Benchmarks
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
          Delivering High-Precision Accountability
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-cyan-500/30 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                    {stat.value}
                  </span>
                  <div className="p-2 rounded-lg bg-cyan-950/40 border border-cyan-500/20 text-cyan-400">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-white/90 mb-2">
                  {stat.label}
                </h3>
                <p className="text-xs text-white/50 leading-relaxed">
                  {stat.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
