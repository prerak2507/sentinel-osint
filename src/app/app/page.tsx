'use client';

import React from 'react';
import { MetricCards } from '@/components/dashboard/MetricCards';
import { ThreatSeverityChart } from '@/components/dashboard/ThreatSeverityChart';
import { LiveFeed } from '@/components/dashboard/LiveFeed';
import { TopThreatCards } from '@/components/dashboard/TopThreatCards';
import { CorrelationPipelineVisualizer } from '@/components/investigation/CorrelationPipelineVisualizer';
import { ShieldCheck, Sparkles, Terminal, Activity } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Analyst Greeting & Status Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#0d1322] via-[#090d16] to-[#07090e] border border-slate-800/80 shadow-xl relative overflow-hidden">
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>OPERATIONAL READINESS: OPTIMAL</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">SOC LEVEL 3</span>
          </div>
          <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-slate-100 font-sans">
            Good morning, Analyst.
          </h1>
          <p className="text-xs text-slate-400 max-w-xl">
            Your intelligence environment is operational. Cross-correlating 8 verified public OSINT feeds with 2.4M normalized records.
          </p>
        </div>

        <div className="flex items-center gap-2.5 z-10">
          <Link
            href="/app/investigate"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-semibold transition-all shadow-[0_0_15px_rgba(6,182,212,0.25)]"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Open Investigation Workspace</span>
          </Link>
        </div>

        {/* Ambient background grid */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-grid-pattern opacity-10 pointer-events-none" />
      </div>

      {/* Top 5 Metric Cards */}
      <MetricCards />

      {/* Main Grid: Chart & Live Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6">
          <ThreatSeverityChart />
          <TopThreatCards />
        </div>

        <div className="lg:col-span-5">
          <LiveFeed />
        </div>
      </div>

      {/* Bottom Horizontal Correlation Pipeline */}
      <CorrelationPipelineVisualizer />
    </div>
  );
}
