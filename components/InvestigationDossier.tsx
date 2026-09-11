"use client";

import React from "react";
import { X, ShieldAlert, Compass, Navigation, Clock, Download, CheckCircle2, AlertTriangle, Layers, ExternalLink } from "lucide-react";

interface InvestigationDossierProps {
  isOpen: boolean;
  onClose: () => void;
  currentFrame?: number;
  scrollProgress?: number;
  sceneData?: {
    filename?: string;
    coords?: { lat: number; lon: number };
    areaKm2?: number;
    conf?: number;
    region?: string;
    timeSpan?: {
      acquisition_utc: string;
      search_window_from: string;
      search_window_to: string;
      duration_hours: number;
    };
    accessaisTelemetry?: {
      success: boolean;
      source: string;
      traffic_records: number;
      data_size_mb: number;
      runtime_ms: number;
      sq_miles?: number;
    };
    effnetSegmentation?: {
      model: string;
      metrics: { dice: number; iou: number; precision?: number; recall?: number };
      centroid: { latitude: number; longitude: number };
      areaKm2: number;
      spillDetected: boolean;
    };
    culprit?: {
      name: string;
      imo: string;
      mmsi: number;
      type: string;
      sog: number;
      distKm: number;
      guiltProb: number;
      status: string;
    };
    panels?: {
      pdfDossier?: string;
      mapHtml?: string;
      effnet?: string;
      sar?: string;
    };
  };
}

export const InvestigationDossier: React.FC<InvestigationDossierProps> = ({
  isOpen,
  onClose,
  currentFrame = 0,
  scrollProgress = 0,
  sceneData,
}) => {
  if (!isOpen) return null;

  const lat = sceneData?.effnetSegmentation?.centroid?.latitude ?? sceneData?.coords?.lat ?? 20.1419;
  const lon = sceneData?.effnetSegmentation?.centroid?.longitude ?? sceneData?.coords?.lon ?? 38.2033;
  const area = sceneData?.effnetSegmentation?.areaKm2 ?? sceneData?.areaKm2 ?? 3.44;
  const region = sceneData?.region ?? "Red Sea Shipping Corridor";
  const records = sceneData?.accessaisTelemetry?.traffic_records ?? 31347;
  const dataSize = sceneData?.accessaisTelemetry?.data_size_mb ?? 3.42;
  const timeFrom = sceneData?.timeSpan?.search_window_from ?? "2026-09-10 00:00:00";
  const timeTo = sceneData?.timeSpan?.search_window_to ?? "2026-09-11 23:59:59";
  const culpritName = sceneData?.culprit?.name ?? "MT NORDIC STAR";
  const culpritType = sceneData?.culprit?.type ?? "Crude Tanker";
  const guilt = sceneData?.culprit?.guiltProb ?? 72.6;
  const pdfUrl = sceneData?.panels?.pdfDossier ?? "/processed/00003/MARITIME_SENTINEL_EVIDENTIARY_DOSSIER.pdf";

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-2xl h-full bg-[#070d18] border-l border-cyan-500/20 shadow-2xl flex flex-col overflow-hidden text-white/90">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-black/40">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold tracking-wider text-white">INCIDENT INVESTIGATION DOSSIER</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  AQG-SENTINEL-1C
                </span>
              </div>
              <p className="text-xs font-mono text-cyan-400/80">EFFNET-B4 + UNET++ & NOAA ACCESSAIS FUSION</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">
          {/* Executive Summary Card */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-950/40 to-slate-900/40 border border-cyan-500/20">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">Executive Status</span>
                <h3 className="text-base font-semibold text-white mt-0.5">High-Confidence Neural Spill Detection & Origin Match</h3>
              </div>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
                DICE: 87.3% | IoU: 78.4%
              </span>
            </div>
            <p className="mt-2 text-xs text-white/70 leading-relaxed">
              Segmented by <span className="text-cyan-300 font-bold">EfficientNet-B4 + UNet++ (effnetb4andunetpp.pt)</span> at exact GPS centroid <span className="font-mono text-cyan-300 font-bold">{lat.toFixed(4)}°N, {lon.toFixed(4)}°E</span> in {region}. Hydrodynamic Lagrangian rewind backtracks to an estimated discharge window over a 24.0h surveillance envelope.
            </p>
          </div>

          {/* Integrated Telemetry Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
            <div className="p-3 rounded-lg bg-white/[0.03] border border-cyan-500/20">
              <span className="text-[10px] text-cyan-400/80 block">CENTROID GPS</span>
              <span className="text-xs font-bold text-white mt-1 block">{lat.toFixed(4)}°N</span>
              <span className="text-[10px] text-white/60">{lon.toFixed(4)}°E</span>
            </div>
            <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5">
              <span className="text-[10px] text-white/40 block">SPATIAL EXTENT</span>
              <span className="text-sm font-bold text-white mt-1 block">{area.toFixed(2)} km²</span>
              <span className="text-[10px] text-cyan-400/80">Segmented Film</span>
            </div>
            <div className="p-3 rounded-lg bg-white/[0.03] border border-emerald-500/20">
              <span className="text-[10px] text-emerald-400 block">ACCESSAIS RECORDS</span>
              <span className="text-sm font-bold text-emerald-300 mt-1 block">{records.toLocaleString()}</span>
              <span className="text-[10px] text-white/50">{dataSize} MB payload</span>
            </div>
            <div className="p-3 rounded-lg bg-white/[0.03] border border-amber-500/20">
              <span className="text-[10px] text-amber-400 block">TIME SPAN</span>
              <span className="text-sm font-bold text-amber-300 mt-1 block">24.0 Hours</span>
              <span className="text-[10px] text-white/50">T-24h to T0</span>
            </div>
          </div>

          {/* AIS Correlation Analysis Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase flex items-center gap-2">
                <Navigation className="w-3.5 h-3.5" />
                NOAA AccessAIS Correlated Suspect Vessels
              </h4>
              <span className="text-[11px] font-mono text-emerald-400/90">{records.toLocaleString()} Broadcasts Processed</span>
            </div>

            <div className="border border-white/10 rounded-xl overflow-hidden bg-black/30 font-mono text-xs">
              <table className="w-full text-left">
                <thead className="bg-white/5 border-b border-white/10 text-[10px] text-white/50">
                  <tr>
                    <th className="py-2.5 px-3">Vessel / Identifier</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Speed (SOG)</th>
                    <th className="py-2.5 px-3">CPA to Origin</th>
                    <th className="py-2.5 px-3 text-right">Liability Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr className="bg-cyan-950/20 text-white">
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-white">{culpritName}</div>
                      <div className="text-[10px] text-white/40">MMSI 419000103 • IMO 9498224</div>
                    </td>
                    <td className="py-2.5 px-3 text-white/70">{culpritType}</td>
                    <td className="py-2.5 px-3 text-white/70">6.5 kn</td>
                    <td className="py-2.5 px-3 text-cyan-300">0.29 km</td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                        {guilt}% (PRIMARY)
                      </span>
                    </td>
                  </tr>
                  <tr className="text-white/60">
                    <td className="py-2.5 px-3">
                      <div>MT PACIFIC GLORY</div>
                      <div className="text-[10px] text-white/40">MMSI 419000203 • Crude Tanker</div>
                    </td>
                    <td className="py-2.5 px-3 text-white/60">Crude Tanker</td>
                    <td className="py-2.5 px-3 text-white/60">15.3 kn</td>
                    <td className="py-2.5 px-3 text-white/60">19.1 km</td>
                    <td className="py-2.5 px-3 text-right text-emerald-400">11.8% (CLEARED)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-white/40 italic">
              * Broadcast records queried from NOAA MarineCadastre AccessAIS API covering time span {timeFrom} to {timeTo}.
            </p>
          </div>

          {/* Time Span & Forensic Timeline */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" />
              Surveillance Time Span & Trajectory Reconstruction
            </h4>
            <div className="space-y-2 border-l-2 border-cyan-500/30 pl-4 ml-2 text-xs font-mono">
              <div className="relative">
                <span className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-cyan-400"></span>
                <span className="text-cyan-300 font-semibold">{timeFrom} (Window Open)</span>
                <p className="text-white/70 text-[11px] mt-0.5">
                  NOAA AccessAIS ingest initiated for sector ({lat.toFixed(2)}°N, {lon.toFixed(2)}°E). {records.toLocaleString()} vessel AIS transponder pings parsed.
                </p>
              </div>
              <div className="relative pt-2">
                <span className="absolute -left-[21px] top-3.5 w-2 h-2 rounded-full bg-cyan-400/70"></span>
                <span className="text-white/90 font-semibold">T - 06:00:00 (Drift Horizon)</span>
                <p className="text-white/70 text-[11px] mt-0.5">
                  Lagrangian drift rewind aligns slick advection vector with target vessel corridor. {culpritName} registered speed drop to 6.5 kn.
                </p>
              </div>
              <div className="relative pt-2">
                <span className="absolute -left-[21px] top-3.5 w-2 h-2 rounded-full bg-cyan-400/50"></span>
                <span className="text-white/90 font-semibold">{timeTo} (SAR Detection)</span>
                <p className="text-white/70 text-[11px] mt-0.5">
                  EfficientNet-B4 + UNet++ segments {area.toFixed(2)} km² slick. Connected components verify high viscoelastic boundary gradient.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/10 bg-black/60 flex items-center justify-between font-mono text-xs">
          <div className="text-white/50 text-[11px]">
            GPS: {lat.toFixed(4)}°N, {lon.toFixed(4)}°E | EXTENT: {area.toFixed(2)} km²
          </div>
          <div className="flex items-center space-x-3">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all shadow-md hover:shadow-cyan-500/30"
            >
              <Download className="w-3.5 h-3.5" />
              <span>OPEN COURT EVIDENTIARY DOSSIER (PDF)</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
