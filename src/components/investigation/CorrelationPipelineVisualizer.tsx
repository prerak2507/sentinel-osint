'use client';

import React from 'react';
import { useIntelligence } from '@/context/IntelligenceContext';
import { 
  Radio, 
  Filter, 
  Users, 
  GitMerge, 
  ShieldAlert, 
  ArrowRight, 
  Zap,
  Activity
} from 'lucide-react';

export function CorrelationPipelineVisualizer() {
  const { pipelineMetrics } = useIntelligence();

  const stages = [
    {
      step: '01',
      title: 'Raw Signals',
      count: pipelineMetrics.rawSignals,
      unit: 'signals ingested',
      desc: 'OSINT telemetry, DNS logs & hashes',
      icon: Radio,
      color: 'text-blue-400',
      border: 'border-blue-500/30',
      bg: 'bg-blue-950/20'
    },
    {
      step: '02',
      title: 'Normalization',
      count: pipelineMetrics.normalizedSignals,
      unit: 'clean indicators',
      desc: 'RFC canonicalization & noise suppression',
      icon: Filter,
      color: 'text-cyan-400',
      border: 'border-cyan-500/30',
      bg: 'bg-cyan-950/20'
    },
    {
      step: '03',
      title: 'Entity Extraction',
      count: pipelineMetrics.extractedEntities,
      unit: 'unique entities',
      desc: 'Actors, malware strains, IPs & CVEs',
      icon: Users,
      color: 'text-purple-400',
      border: 'border-purple-500/30',
      bg: 'bg-purple-950/20'
    },
    {
      step: '04',
      title: 'Graph Detection',
      count: pipelineMetrics.correlatedRelationships,
      unit: 'proven edges',
      desc: 'JA3 matching & temporal clustering',
      icon: GitMerge,
      color: 'text-amber-400',
      border: 'border-amber-500/30',
      bg: 'bg-amber-950/20'
    },
    {
      step: '05',
      title: 'Threat Clusters',
      count: pipelineMetrics.highRiskClusters,
      unit: 'critical incidents',
      desc: 'Synthesized intelligence & action briefs',
      icon: ShieldAlert,
      color: 'text-rose-400',
      border: 'border-rose-500/30',
      bg: 'bg-rose-950/20'
    }
  ];

  return (
    <div className="glass-panel p-5 rounded-xl border border-slate-800 bg-[#0d121d] space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200 font-mono">
            Automated OSINT Correlation Pipeline
          </h3>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-semibold">{pipelineMetrics.throughputPerSec}</span> sig/sec throughput
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-500">Updated: {pipelineMetrics.lastUpdated}</span>
        </div>
      </div>

      {/* Horizontal Pipeline Sequence */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          return (
            <div 
              key={stage.step}
              className={`p-3.5 rounded-lg border ${stage.border} ${stage.bg} flex flex-col justify-between relative group hover:border-cyan-400/50 transition-all`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-slate-500">
                    STAGE {stage.step}
                  </span>
                  <Icon className={`w-4 h-4 ${stage.color}`} />
                </div>

                <div className="text-xs font-semibold text-slate-200 font-mono">
                  {stage.title}
                </div>

                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className={`text-2xl font-bold font-mono ${stage.color}`}>
                    {stage.count}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {stage.unit}
                  </span>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-800/80 leading-tight">
                {stage.desc}
              </div>

              {/* Arrow separator indicator for desktop */}
              {idx < stages.length - 1 && (
                <div className="hidden md:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-4 h-4 rounded-full bg-[#0a0d14] border border-slate-700 items-center justify-center text-slate-500">
                  <ArrowRight className="w-2.5 h-2.5" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
