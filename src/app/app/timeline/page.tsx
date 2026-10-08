'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useIntelligence } from '@/context/IntelligenceContext';
import { 
  Clock, 
  ShieldAlert, 
  Calendar, 
  ArrowRight, 
  Terminal, 
  GitCommit, 
  CheckCircle2, 
  TrendingUp,
  Filter
} from 'lucide-react';

export default function TimelinePage() {
  const { investigation, runInvestigationSearch } = useIntelligence();
  const router = useRouter();

  const [filterType, setFilterType] = useState<string>('ALL');

  const timelineEvents = investigation.timeline.filter((e) => {
    if (filterType !== 'ALL' && e.type !== filterType) return false;
    return true;
  });

  const handleEntityPivot = async (entity: string) => {
    await runInvestigationSearch(entity);
    router.push('/app/investigate');
  };

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return 'text-red-400 bg-red-950/40 border-red-500/40';
      case 'HIGH':
        return 'text-amber-400 bg-amber-950/40 border-amber-500/40';
      case 'MEDIUM':
        return 'text-blue-400 bg-blue-950/40 border-blue-500/40';
      default:
        return 'text-emerald-400 bg-emerald-950/40 border-emerald-500/40';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-xl bg-[#0d121d] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            <h1 className="text-lg font-bold text-slate-100 font-mono tracking-tight">
              Attack Progression & Temporal Timeline
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Chronological attack reconstruction and threat intelligence milestone escalation.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded bg-[#080b12] border border-slate-800 text-slate-400">
            Case: <strong className="text-cyan-300">{investigation.id}</strong>
          </span>
          <span className="px-2.5 py-1 rounded bg-rose-950/40 text-rose-400 border border-rose-500/30 font-bold">
            RISK {investigation.riskScore}
          </span>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="glass-panel p-4 rounded-xl border border-slate-800 bg-[#0d121d] flex flex-wrap items-center gap-1.5">
        {['ALL', 'DISCOVERY', 'ASSOCIATION', 'VERIFICATION', 'ESCALATION', 'REPORT'].map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${
              filterType === t
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Timeline Stream */}
      <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
        {timelineEvents.map((evt, idx) => (
          <div key={evt.id} className="relative group">
            {/* Timeline node icon */}
            <div className={`
              absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full border flex items-center justify-center transition-transform group-hover:scale-125
              ${evt.severity === 'CRITICAL' ? 'bg-red-950 border-red-500 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.4)]' :
                evt.severity === 'HIGH' ? 'bg-amber-950 border-amber-500 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.4)]' :
                'bg-blue-950 border-blue-500 text-blue-400'}
            `}>
              <GitCommit className="w-3.5 h-3.5" />
            </div>

            {/* Event Card */}
            <div className="glass-panel p-5 rounded-xl border border-slate-800 bg-[#0d121d] hover:border-slate-700 transition-all space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-sm font-bold text-cyan-300">
                    {evt.dateStr}
                  </span>
                  <span className="text-slate-600 font-mono">•</span>
                  <span className="font-mono text-xs text-slate-400">
                    {evt.timestamp}
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.2 rounded border font-semibold ${getSeverityBadge(evt.severity)}`}>
                    {evt.severity}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    {evt.type}
                  </span>
                </div>

                {evt.riskDelta !== undefined && (
                  <div className="flex items-center gap-1 font-mono text-xs text-rose-400 font-semibold">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Risk Delta: +{evt.riskDelta}</span>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-100 font-mono">
                  {evt.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {evt.description}
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs font-mono border-t border-slate-800/80">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Related Entity:</span>
                  <button
                    onClick={() => handleEntityPivot(evt.relatedEntity)}
                    className="text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-2 flex items-center gap-1"
                  >
                    <span>{evt.relatedEntity}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="text-slate-500">
                  Source: <span className="text-slate-300">{evt.source}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
