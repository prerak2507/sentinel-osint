'use client';

import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Filter, 
  Cpu, 
  Network, 
  ShieldAlert, 
  CheckCircle2, 
  Zap,
  Globe,
  Server,
  Lock,
  Layers
} from 'lucide-react';

export function HeroPipelineVisual() {
  const [pulseIndex, setPulseIndex] = useState(0);
  const [activeNode, setActiveNode] = useState<string>('correlation');

  useEffect(() => {
    const timer = setInterval(() => {
      setPulseIndex((prev) => (prev + 1) % 4);
    }, 2200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full rounded-2xl border border-slate-800 bg-[#090d16]/90 p-5 lg:p-7 shadow-[0_0_50px_rgba(6,182,212,0.08)] backdrop-blur-xl overflow-hidden font-mono select-none">
      {/* Top Header Badge */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-cyan-300 font-bold tracking-wider">
            AUTOMATED OSINT CORRELATION TOPOLOGY
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span className="text-emerald-400">● 8 SOURCES ACTIVE</span>
          <span className="text-slate-600">|</span>
          <span className="text-cyan-400">1,420 SIG/SEC</span>
        </div>
      </div>

      {/* Main Interactive Flow Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 items-center relative">
        {/* Stage 1: Public OSINT Feeds */}
        <div className="space-y-2.5">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
            01. Public Feeds
          </div>
          {[
            { name: 'AlienVault OTX', icon: Radio, count: '18.4k' },
            { name: 'CISA KEV Catalog', icon: Lock, count: '1.2k' },
            { name: 'ShadowServer Net', icon: Server, count: '421k' },
            { name: 'URLHaus Track', icon: Globe, count: '64.1k' }
          ].map((feed, idx) => {
            const Icon = feed.icon;
            const isPulsing = pulseIndex === idx;
            return (
              <div
                key={feed.name}
                className={`p-2.5 rounded-lg border transition-all duration-300 flex items-center justify-between ${
                  isPulsing 
                    ? 'border-cyan-500/70 bg-cyan-950/30 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                    : 'border-slate-800 bg-[#06080e] text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className={`w-3.5 h-3.5 ${isPulsing ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <span className="text-xs truncate">{feed.name}</span>
                </div>
                <span className="text-[10px] font-bold text-slate-400">{feed.count}</span>
              </div>
            );
          })}
        </div>

        {/* Stage 2: Normalization & Ingest Engine */}
        <div className="space-y-3">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
            02. Normalization
          </div>
          <div className="p-4 rounded-xl border border-cyan-500/30 bg-[#06080e] space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold">
              <Filter className="w-4 h-4" />
              <span>Deduplication Hub</span>
            </div>
            <div className="space-y-1.5 text-[10px] text-slate-400">
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span>RFC Canonicalization</span>
                <span className="text-emerald-400">PASSED</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span>Entropy Anomaly</span>
                <span className="text-cyan-400">0.942</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Fast-Flux Check</span>
                <span className="text-amber-400">FLAGGED</span>
              </div>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-cyan-400 h-full w-4/5 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Stage 3: Entity Correlation Graph */}
        <div className="space-y-3">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
            03. Graph Correlator
          </div>
          <div className="p-4 rounded-xl border border-blue-500/40 bg-[#06080e] space-y-2.5">
            <div className="flex items-center justify-between text-xs text-blue-400 font-semibold">
              <div className="flex items-center gap-1.5">
                <Network className="w-4 h-4" />
                <span>Relationship Matrix</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-950 text-blue-300 border border-blue-500/30">
                8 NODES
              </span>
            </div>

            <div className="space-y-1 text-[10px] text-slate-300">
              <div className="p-1.5 rounded bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-cyan-300 font-semibold">suspicious-domain</span>
                <span className="text-slate-500">ROOT</span>
              </div>
              <div className="pl-3 space-y-1 border-l border-cyan-500/30 ml-2">
                <div className="text-slate-400 flex justify-between">
                  <span>→ 185.220.101.45</span>
                  <span className="text-rose-400 font-bold">96%</span>
                </div>
                <div className="text-slate-400 flex justify-between">
                  <span>→ Vanguard Spider</span>
                  <span className="text-amber-400 font-bold">87%</span>
                </div>
                <div className="text-slate-400 flex justify-between">
                  <span>→ GhostShell C2</span>
                  <span className="text-rose-400 font-bold">92%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stage 4: Risk Scoring & Action Brief */}
        <div className="space-y-3">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
            04. Decision Brief
          </div>
          <div className="p-4 rounded-xl border border-rose-500/40 bg-[#06080e] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-rose-400 text-xs font-semibold">
                <ShieldAlert className="w-4 h-4" />
                <span>Threat Verdict</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-500/40">
                CRITICAL
              </span>
            </div>

            <div className="flex items-baseline justify-between border-b border-slate-800/80 pb-2">
              <span className="text-xs text-slate-400">Risk Score:</span>
              <span className="text-2xl font-bold text-rose-400 font-mono">
                82 <span className="text-[10px] text-slate-500 font-normal">/ 100</span>
              </span>
            </div>

            <div className="text-[10px] text-slate-300 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3 h-3 shrink-0" />
                <span>Firewall Rule Generated</span>
              </div>
              <div className="flex items-center gap-1.5 text-cyan-400">
                <CheckCircle2 className="w-3 h-3 shrink-0" />
                <span>IOC Broadcast Dispatched</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Traveling Particle SVG Line below */}
      <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          <span>Real-time cross-correlation engine synthesizing 24 public parameters</span>
        </div>
        <span className="text-cyan-400 font-bold">CASE INV-2026-1042 ACTIVE</span>
      </div>
    </div>
  );
}
