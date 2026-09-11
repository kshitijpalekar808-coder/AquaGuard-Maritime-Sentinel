import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AquaGuard | AI Maritime Oil-Spill Detection & Forensic Investigation",
  description:
    "AI-powered satellite intelligence detects, tracks, and reconstructs ocean oil contamination through hydrodynamic drift backtracking and AIS vessel correlation.",
  keywords: [
    "oil spill detection",
    "maritime intelligence",
    "satellite SAR",
    "Lagrangian drift backtracking",
    "AIS vessel correlation",
    "oceanographic investigation",
  ],
  authors: [{ name: "AquaGuard Earth Systems" }],
  openGraph: {
    title: "AquaGuard | Maritime Oil-Spill Intelligence",
    description: "Detect. Trace. Investigate. AI-driven maritime environmental forensics.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark bg-[#050505]">
      <body className="min-h-screen bg-[#050505] text-white/90 antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        {children}
      </body>
    </html>
  );
}
