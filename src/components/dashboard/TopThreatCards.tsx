'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useIntelligence } from '@/context/IntelligenceContext';
import { ShieldAlert, ArrowRight, Activity, Users, Database, Radio } from 'lucide-react';

export function TopThreatCards() {
  const { threats, runInvestigationSearch, loadDemoInvestigation } = useIntelligence();
  const router = useRouter();

  const handleInvestigate = async (title: string, caseId: string) => {
    if (caseId === 'INV-2026-1042') {
      loadDemoInvestigation();
    } else {
      await runInvestigationSearch(title);
    }
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
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200 font-mono">
            High Priority Threat Clusters
          </h3>
        </div>
        <span className="text-[11px] font-mono text-slate-500">
          Ranked by Composite Risk Index
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {threats.map((threat) => (
          <div
            key={threat.id}
            className="glass-panel p-5 rounded-xl border border-slate-800 bg-[#0d121d] hover:border-slate-700 transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-2.5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {threat.id}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {threat.caseId}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors mt-1.5 font-mono">
                    {threat.title}
                  </h4>
                </div>

                <div className="text-right shrink-0">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${getSeverityBadge(threat.severity)}`}>
                    {threat.severity}
                  </span>
                  <div className="text-[10px] font-mono text-slate-500 mt-1">
                    CONF {threat.confidence}%
                  </div>
                </div>
              </div>

              {/* Summary */}
              <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-4">
                {threat.summary}
              </p>

              {/* Telemetry pill badges */}
              <div className="grid grid-cols-3 gap-2 p-2 rounded-lg bg-[#080b12] border border-slate-800/80 text-center font-mono">
                <div>
                  <span className="text-[10px] text-slate-500 block">INDICATORS</span>
                  <span className="text-xs font-bold text-cyan-400 mt-0.5 block">{threat.indicatorCount}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">ENTITIES</span>
                  <span className="text-xs font-bold text-purple-400 mt-0.5 block">{threat.entityCount}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">SOURCES</span>
                  <span className="text-xs font-bold text-blue-400 mt-0.5 block">{threat.sourceCount}</span>
                </div>
              </div>
            </div>

            {/* Bottom action */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <div className="text-[10px] font-mono text-slate-500">
                Target: <span className="text-slate-300">{threat.targetedSector || 'Enterprise'}</span>
              </div>

              <button
                onClick={() => handleInvestigate(threat.title, threat.caseId)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-medium transition-all"
              >
                <span>Investigate</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
