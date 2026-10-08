'use client';

import React, { useState } from 'react';
import { useIntelligence } from '@/context/IntelligenceContext';
import { Source } from '@/types/intelligence';
import { 
  Radio, 
  RotateCw, 
  CheckCircle2, 
  ExternalLink, 
  Sliders, 
  Activity, 
  Database, 
  ShieldCheck, 
  Clock, 
  AlertTriangle,
  Zap,
  Server
} from 'lucide-react';

export default function SourcesPage() {
  const { sources, syncSource, addToast } = useIntelligence();
  const [selectedSource, setSelectedSource] = useState<Source | null>(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isSyncingAll, setIsSyncingAll] = useState(false);

  const totalRecords = sources.reduce((acc, s) => acc + s.recordsCollected, 0);
  const avgReliability = Math.round(sources.reduce((acc, s) => acc + s.reliability, 0) / sources.length);

  const handleSyncAll = async () => {
    setIsSyncingAll(true);
    addToast('Batch Synchronization', 'Ingesting telemetry streams across all 8 feeds...', 'info');
    for (const src of sources) {
      await syncSource(src.id);
    }
    setIsSyncingAll(false);
    addToast('Batch Complete', 'All intelligence collectors up to date', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-xl bg-[#0d121d] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-cyan-400" />
            <h1 className="text-lg font-bold text-slate-100 font-mono tracking-tight">
              OSINT Sources & Collectors Management
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time telemetry ingestion pipelines, rate controllers, and automated deduplication endpoints.
          </p>
        </div>

        <button
          onClick={handleSyncAll}
          disabled={isSyncingAll}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-mono text-xs font-semibold transition-all shadow-sm shrink-0"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isSyncingAll ? 'animate-spin' : ''}`} />
          <span>{isSyncingAll ? 'Synchronizing All...' : 'Sync All Feeds'}</span>
        </button>
      </div>

      {/* Collector Infrastructure Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-[#0d121d] border border-slate-800">
          <span className="text-[10px] font-mono text-slate-500">ACTIVE COLLECTORS</span>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
            {sources.length} / {sources.length}
          </div>
          <span className="text-[10px] font-mono text-slate-400 mt-1 block">100% Operational</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0d121d] border border-slate-800">
          <span className="text-[10px] font-mono text-slate-500">RECORDS COLLECTED</span>
          <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">
            {(totalRecords / 1000000).toFixed(2)}M
          </div>
          <span className="text-[10px] font-mono text-slate-400 mt-1 block">Indexed & Deduplicated</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0d121d] border border-slate-800">
          <span className="text-[10px] font-mono text-slate-500">MEAN RELIABILITY</span>
          <div className="text-2xl font-bold font-mono text-blue-400 mt-1">
            {avgReliability}%
          </div>
          <span className="text-[10px] font-mono text-slate-400 mt-1 block">Weighted Consensus</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0d121d] border border-slate-800">
          <span className="text-[10px] font-mono text-slate-500">AVG INGEST LATENCY</span>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
            182 ms
          </div>
          <span className="text-[10px] font-mono text-slate-400 mt-1 block">Optimal Transit</span>
        </div>
      </div>

      {/* Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sources.map((src) => {
          const isSyncing = src.status === 'SYNCING';

          return (
            <div
              key={src.id}
              className="glass-panel p-5 rounded-xl border border-slate-800 bg-[#0d121d] hover:border-slate-700 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-semibold">
                      {src.type.replace('_', ' ')}
                    </span>
                    <h3 className="text-sm font-bold font-mono text-slate-100 group-hover:text-cyan-300 transition-colors mt-1.5">
                      {src.name}
                    </h3>
                  </div>

                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border flex items-center gap-1.5 ${
                    isSyncing 
                      ? 'bg-amber-950/40 text-amber-400 border-amber-500/40 animate-pulse'
                      : 'bg-emerald-950/40 text-emerald-400 border-emerald-500/40'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isSyncing ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                    {src.status}
                  </span>
                </div>

                <div className="text-xs text-slate-400 mb-4 font-mono truncate">
                  {src.category}
                </div>

                {/* Telemetry Stats */}
                <div className="grid grid-cols-3 gap-2 p-3 rounded-lg bg-[#080b12] border border-slate-800/80 text-center font-mono text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block">RECORDS</span>
                    <span className="font-bold text-slate-200 mt-0.5 block">
                      {src.recordsCollected.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">LAST SYNC</span>
                    <span className="font-semibold text-cyan-300 mt-0.5 block truncate">
                      {src.lastSync}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">RELIABILITY</span>
                    <span className="font-bold text-emerald-400 mt-0.5 block">
                      {src.reliability}%
                    </span>
                  </div>
                </div>

                {/* Endpoint preview */}
                <div className="mt-3 p-2 rounded bg-black/60 font-mono text-[10px] text-slate-500 truncate border border-slate-800">
                  <span className="text-slate-400">ENDPOINT: </span>{src.endpoint}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <div className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                  <Activity className="w-3 h-3 text-cyan-400" />
                  <span>{src.latencyMs}ms • {src.frequency}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedSource(src);
                      setIsConfigModalOpen(true);
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors"
                  >
                    Configure
                  </button>
                  <button
                    onClick={() => syncSource(src.id)}
                    disabled={isSyncing}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/50 hover:bg-cyan-900/70 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-medium transition-all"
                  >
                    <RotateCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Configuration Modal */}
      {isConfigModalOpen && selectedSource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div 
            className="w-full max-w-md rounded-xl border border-slate-700 bg-[#0d121d] shadow-2xl p-5 space-y-4 font-mono text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] text-slate-500 uppercase">Collector Parameters</span>
                <h3 className="text-sm font-bold text-slate-100">{selectedSource.name}</h3>
              </div>
              <button
                onClick={() => setIsConfigModalOpen(false)}
                className="text-slate-500 hover:text-slate-300"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-slate-400 block mb-1">Polling Cadence</label>
                <select 
                  defaultValue={selectedSource.frequency}
                  className="w-full p-2.5 rounded-lg bg-[#080b12] border border-slate-800 text-slate-200"
                >
                  <option>Continuous Stream</option>
                  <option>Every 2m</option>
                  <option>Every 5m</option>
                  <option>Every 15m</option>
                  <option>Hourly</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Consensus Reliability Weight</label>
                <input
                  type="range"
                  min="50"
                  max="100"
                  defaultValue={selectedSource.reliability}
                  className="w-full accent-cyan-400"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>50% (Loose)</span>
                  <span className="text-cyan-400 font-bold">{selectedSource.reliability}%</span>
                  <span>100% (Strict)</span>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">API Authentication Token</label>
                <input
                  type="password"
                  defaultValue="sk_live_sentinel_encrypted_token_77a9"
                  className="w-full p-2.5 rounded-lg bg-[#080b12] border border-slate-800 text-slate-400"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setIsConfigModalOpen(false)}
                className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-slate-200"
              >
                Close
              </button>
              <button
                onClick={() => {
                  addToast('Configuration Saved', `Updated ingest parameters for ${selectedSource.name}`, 'success');
                  setIsConfigModalOpen(false);
                }}
                className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
