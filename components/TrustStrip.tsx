"use client";

import React from "react";
import { Satellite, Shield, Globe2, Landmark } from "lucide-react";

export const TrustStrip: React.FC = () => {
  const partners = [
    { label: "Copernicus Sentinel-1C", sub: "European Space Agency (ESA) SAR" },
    { label: "IMO MARPOL Annex I", sub: "Oil Pollution Standards" },
    { label: "NOAA CoastWatch", sub: "Oceanographic Thermal & Wind Fields" },
    { label: "EMSA CleanSeaNet", sub: "European Maritime Safety Framework" },
  ];

  return (
    <section className="pt-2 pb-12 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-[11px] font-mono text-white/40 uppercase tracking-widest mb-8">
          Interoperable with Global Space Agencies & Maritime Regulatory Standards
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {partners.map((partner, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-cyan-500/20 transition-colors">
              <div className="font-semibold text-white/80 text-sm tracking-wide">
                {partner.label}
              </div>
              <div className="text-[11px] font-mono text-cyan-400/60 mt-1">
                {partner.sub}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
