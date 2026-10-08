'use client';

import React, { useState } from 'react';
import { useIntelligence } from '@/context/IntelligenceContext';
import { 
  Settings as SettingsIcon, 
  Sliders, 
  Key, 
  Bell, 
  ShieldCheck, 
  Save, 
  CheckCircle2, 
  Database,
  Radio
} from 'lucide-react';

export default function SettingsPage() {
  const { addToast } = useIntelligence();

  const [confidenceThreshold, setConfidenceThreshold] = useState(85);
  const [dedupWindowDays, setDedupWindowDays] = useState(14);
  const [autoEscalate, setAutoEscalate] = useState(true);
  const [fastFluxDetection, setFastFluxDetection] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('Settings Saved', 'Correlation engine and collector thresholds updated', 'success');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-5 rounded-xl bg-[#0d121d] border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-cyan-400" />
          <div>
            <h1 className="text-lg font-bold text-slate-100 font-mono tracking-tight">
              Platform & Engine Configuration
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Tune correlation parameters, manage API authentication, and define automated escalation rules.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Correlation Engine Tuning */}
        <div className="glass-panel p-6 rounded-xl border border-slate-800 bg-[#0d121d] space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              Correlation Engine Algorithms
            </h3>
          </div>

          <div className="space-y-4 font-mono text-xs">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-slate-300">Minimum Correlation Confidence Threshold</label>
                <span className="text-cyan-400 font-bold">{confidenceThreshold}%</span>
              </div>
              <input
                type="range"
                min="60"
                max="98"
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Relationships with confidence scores below this threshold will not automatically establish active graph edges.
              </p>
            </div>

            <div className="pt-2">
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-slate-300">Deduplication Telemetry Memory Window</label>
                <span className="text-cyan-400 font-bold">{dedupWindowDays} Days</span>
              </div>
              <input
                type="range"
                min="3"
                max="90"
                value={dedupWindowDays}
                onChange={(e) => setDedupWindowDays(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-[#080b12] border border-slate-800">
              <div>
                <div className="text-slate-200 font-semibold">Fast-Flux DNS Anomaly Detector</div>
                <div className="text-[11px] text-slate-500">Flag nameservers cycling A-Records with TTL &lt; 300s</div>
              </div>
              <input
                type="checkbox"
                checked={fastFluxDetection}
                onChange={(e) => setFastFluxDetection(e.target.checked)}
                className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-[#080b12] border border-slate-800">
              <div>
                <div className="text-slate-200 font-semibold">Auto-Escalate Critical Threats</div>
                <div className="text-[11px] text-slate-500">Automatically promote composite risk scores &gt; 80 to Tier-3 incident response</div>
              </div>
              <input
                type="checkbox"
                checked={autoEscalate}
                onChange={(e) => setAutoEscalate(e.target.checked)}
                className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Simulated OSINT API Connectors */}
        <div className="glass-panel p-6 rounded-xl border border-slate-800 bg-[#0d121d] space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Key className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              External Threat Intelligence API Integrations
            </h3>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {[
              { name: 'AlienVault OTX API', key: 'otx_live_a89bc42918e901a', status: 'ACTIVE' },
              { name: 'Shodan Search API', key: 'shd_v2_f8174ba19102c9', status: 'ACTIVE' },
              { name: 'VirusTotal Enterprise API', key: 'vt_ent_99a81c5520938b', status: 'ACTIVE' },
              { name: 'AbuseIPDB Commercial Key', key: 'ab_ip_47710298a00281', status: 'ACTIVE' },
            ].map((conn, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg bg-[#080b12] border border-slate-800">
                <div>
                  <div className="text-slate-200 font-semibold">{conn.name}</div>
                  <div className="text-slate-500 text-[10px] mt-0.5">Key: {conn.key.slice(0, 10)}••••••••••••</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>AUTHENTICATED</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-semibold transition-all shadow-md"
          >
            <Save className="w-4 h-4" />
            <span>Apply Engine Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
