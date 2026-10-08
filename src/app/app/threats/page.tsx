'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useIntelligence } from '@/context/IntelligenceContext';
import { ThreatSeverity } from '@/types/intelligence';
import { 
  ShieldAlert, 
  Search, 
  Terminal, 
  ArrowRight, 
  Calendar, 
  Target, 
  Users, 
  Database, 
  Radio,
  Clock,
  Sparkles
} from 'lucide-react';

export default function ThreatsPage() {
  const { threats, runInvestigationSearch, loadDemoInvestigation } = useIntelligence();
  const router = useRouter();

  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');

  const handleInvestigate = async (title: string, caseId: string) => {
    if (caseId === 'INV-2026-1042') {
      loadDemoInvestigation();
    } else {
      await runInvestigationSearch(title);
    }
    router.push('/app/investigate');
  };

  const filteredThreats = threats.filter((t) => {
    if (severityFilter !== 'ALL' && t.severity !== severityFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return t.title.toLowerCase().includes(q) || 
             t.caseId.toLowerCase().includes(q) ||
             t.summary.toLowerCase().includes(q) ||
             (t.primaryActor && t.primaryActor.toLowerCase().includes(q));
    }
    return true;
  });

  const getSeverityBadge = (sev: ThreatSeverity) => {
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
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <h1 className="text-lg font-bold text-slate-100 font-mono tracking-tight">
              Threat Intelligence Clusters
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Aggregated malicious infrastructure campaigns, actor operations, and active attack surfaces.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="px-2.5 py-1 rounded bg-[#080b12] border border-slate-800">
            Active Threat Clusters: <strong className="text-rose-400">{threats.length}</strong>
          </span>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="glass-panel p-4 rounded-xl border border-slate-800 bg-[#0d121d] flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1">
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((s) => (
            <button
              key={s}
              onClick={() => setSeverityFilter(s)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${
                severityFilter === s
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search campaign, actor, or case ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#080b12] border border-slate-800 font-mono text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>
      </div>

      {/* Threats List */}
      <div className="space-y-4">
        {filteredThreats.map((threat) => (
          <div
            key={threat.id}
            className="glass-panel p-5 rounded-xl border border-slate-800 bg-[#0d121d] hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5 group"
          >
            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-bold">
                  {threat.id}
                </span>
                <span className="text-[10px] font-mono text-cyan-400 font-semibold">
                  {threat.caseId}
                </span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${getSeverityBadge(threat.severity)}`}>
                  {threat.severity}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-500/30">
                  {threat.status}
                </span>
              </div>

              <div>
                <h3 className="text-base font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors font-mono">
                  {threat.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
                  {threat.summary}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
                {threat.primaryActor && (
                  <span className="flex items-center gap-1.5 text-rose-300/90">
                    <Target className="w-3.5 h-3.5 text-rose-400" />
                    <span>Actor: {threat.primaryActor}</span>
                  </span>
                )}
                {threat.targetedSector && (
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <span>Target: {threat.targetedSector}</span>
                  </span>
                )}
                <span className="flex items-center gap-1 text-slate-500">
                  <Clock className="w-3 h-3" />
                  <span>Observed: {threat.firstSeen} to {threat.lastSeen}</span>
                </span>
              </div>
            </div>

            {/* Metrics & Action Button */}
            <div className="flex md:flex-col items-center md:items-end justify-between gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
              <div className="text-right">
                <div className="text-xl font-bold font-mono text-rose-400">
                  {threat.riskScore} <span className="text-xs text-slate-500 font-normal">/ 100</span>
                </div>
                <div className="text-[10px] font-mono text-slate-500">
                  {threat.confidence}% Confidence
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                <span>{threat.indicatorCount} IOCs</span>
                <span>•</span>
                <span>{threat.entityCount} Entities</span>
              </div>

              <button
                onClick={() => handleInvestigate(threat.title, threat.caseId)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-medium transition-all shadow-sm"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Investigate</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
