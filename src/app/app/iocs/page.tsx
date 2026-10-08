'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useIntelligence } from '@/context/IntelligenceContext';
import { IocType, ThreatSeverity } from '@/types/intelligence';
import { 
  Database, 
  Search, 
  Copy, 
  CheckCircle2, 
  ExternalLink, 
  Filter, 
  ArrowUpDown, 
  Plus, 
  Terminal, 
  Download,
  ShieldAlert
} from 'lucide-react';

export default function IocExplorerPage() {
  const { iocs, runInvestigationSearch, addIocToInvestigation, addToast } = useIntelligence();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [searchFilter, setSearchFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [sortField, setSortField] = useState<'riskScore' | 'confidence' | 'lastSeen'>('riskScore');
  const [sortAsc, setSortAsc] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New IOC Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newValue, setNewValue] = useState('');
  const [newType, setNewType] = useState<IocType>('IP');
  const [newSeverity, setNewSeverity] = useState<ThreatSeverity>('HIGH');
  const [newDescription, setNewDescription] = useState('');

  const tabs = ['ALL', 'IP', 'DOMAIN', 'URL', 'HASH', 'EMAIL', 'CVE'];

  const handleCopy = (val: string, id: string) => {
    navigator.clipboard.writeText(val);
    setCopiedId(id);
    addToast('Indicator Copied', `Copied "${val}" to clipboard`, 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleInvestigate = async (val: string) => {
    await runInvestigationSearch(val);
    router.push('/app/investigate');
  };

  const handleRegisterIoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newValue.trim()) return;

    addIocToInvestigation({
      value: newValue.trim(),
      type: newType,
      severity: newSeverity,
      confidence: 88,
      riskScore: newSeverity === 'CRITICAL' ? 95 : newSeverity === 'HIGH' ? 82 : 60,
      firstSeen: new Date().toISOString().split('T')[0],
      lastSeen: new Date().toISOString().split('T')[0],
      sources: ['Manual Analyst Submission', 'Sentinel Correlation Engine'],
      tags: ['Analyst Seed', 'Manual Triage'],
      description: newDescription || 'Analyst flagged indicator under surveillance'
    });

    setIsModalOpen(false);
    setNewValue('');
    setNewDescription('');
  };

  const filteredIocs = iocs
    .filter(item => {
      if (activeTab !== 'ALL' && item.type !== activeTab) return false;
      if (severityFilter !== 'ALL' && item.severity !== severityFilter) return false;
      if (searchFilter.trim()) {
        const q = searchFilter.toLowerCase();
        return item.value.toLowerCase().includes(q) || 
               item.description.toLowerCase().includes(q) ||
               item.tags.some(t => t.toLowerCase().includes(q));
      }
      return true;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortField === 'riskScore') comparison = a.riskScore - b.riskScore;
      if (sortField === 'confidence') comparison = a.confidence - b.confidence;
      if (sortField === 'lastSeen') comparison = a.lastSeen.localeCompare(b.lastSeen);
      return sortAsc ? comparison : -comparison;
    });

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-[#0d121d] border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-cyan-400" />
            <h1 className="text-lg font-bold text-slate-100 font-mono tracking-tight">
              Indicators of Compromise (IOC) Explorer
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Normalized technical indicators aggregated across 8 public threat intelligence streams.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const jsonStr = JSON.stringify(iocs, null, 2);
              const blob = new Blob([jsonStr], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `sentinel-iocs-${new Date().toISOString().split('T')[0]}.json`;
              a.click();
              addToast('IOCs Exported', 'Downloaded complete IOC database in JSON format', 'success');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Feed</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-medium transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Register IOC</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="glass-panel p-4 rounded-xl border border-slate-800 bg-[#0d121d] space-y-4">
        {/* Type Tabs */}
        <div className="flex flex-wrap gap-1 border-b border-slate-800 pb-3">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${
                activeTab === tab
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search & Sort Toolbar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by indicator value, tag, or description..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#080b12] border border-slate-800 font-mono text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          <div className="md:col-span-3 flex items-center gap-2">
            <span className="text-xs font-mono text-slate-500">Severity:</span>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="flex-1 px-2.5 py-2 rounded-lg bg-[#080b12] border border-slate-800 font-mono text-xs text-slate-200 focus:outline-none"
            >
              <option value="ALL">ALL LEVELS</option>
              <option value="CRITICAL">CRITICAL</option>
              <option value="HIGH">HIGH</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="LOW">LOW</option>
            </select>
          </div>

          <div className="md:col-span-3 flex items-center gap-2">
            <span className="text-xs font-mono text-slate-500">Sort:</span>
            <button
              onClick={() => {
                if (sortField === 'riskScore') setSortAsc(!sortAsc);
                else { setSortField('riskScore'); setSortAsc(false); }
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg border font-mono text-xs transition-colors ${
                sortField === 'riskScore'
                  ? 'bg-slate-800 text-cyan-300 border-cyan-500/30'
                  : 'bg-[#080b12] text-slate-400 border-slate-800'
              }`}
            >
              <span>Risk Score</span>
              <ArrowUpDown className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* IOC Table */}
      <div className="glass-panel rounded-xl border border-slate-800 bg-[#0d121d] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#080b12] border-b border-slate-800 text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Indicator Value</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Risk</th>
                <th className="py-3 px-3">Confidence</th>
                <th className="py-3 px-3">Sources</th>
                <th className="py-3 px-3">Last Seen</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredIocs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No matching indicators found for current query.
                  </td>
                </tr>
              ) : (
                filteredIocs.map((ioc) => (
                  <tr 
                    key={ioc.id}
                    className="hover:bg-slate-800/40 transition-colors group"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors max-w-xs md:max-w-md truncate">
                          {ioc.value}
                        </span>
                        <button
                          onClick={() => handleCopy(ioc.value, ioc.id)}
                          className="p-1 text-slate-500 hover:text-slate-300 transition-colors"
                          title="Copy indicator"
                        >
                          {copiedId === ioc.id ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                      <div className="text-[10px] text-slate-400 truncate max-w-xs mt-0.5">
                        {ioc.description}
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {ioc.type}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getSeverityBadge(ioc.severity)}`}>
                        {ioc.riskScore}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-slate-300 font-semibold">
                      {ioc.confidence}%
                    </td>

                    <td className="py-3 px-3">
                      <span className="text-cyan-400 font-medium">
                        {ioc.sources.length} Feeds
                      </span>
                    </td>

                    <td className="py-3 px-3 text-slate-400">
                      {ioc.lastSeen}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleInvestigate(ioc.value)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-blue-950/40 hover:bg-blue-900/60 border border-blue-500/30 text-blue-300 text-[11px] transition-colors"
                      >
                        <Terminal className="w-3 h-3 text-cyan-400" />
                        <span>Investigate</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 border-t border-slate-800 bg-[#080b12] flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span>Showing {filteredIocs.length} of {iocs.length} normalized indicators</span>
          <span>Automatic RFC 791/1035 canonicalization active</span>
        </div>
      </div>

      {/* Register New IOC Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div 
            className="w-full max-w-md rounded-xl border border-slate-700 bg-[#0d121d] shadow-2xl p-5 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-mono font-bold text-slate-100">
                  Register Technical Indicator
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-500 hover:text-slate-300"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterIoc} className="space-y-3 font-mono text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Indicator Value</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 198.51.100.22 or malware-c2.net"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-[#080b12] border border-slate-800 text-slate-100 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as IocType)}
                    className="w-full p-2.5 rounded-lg bg-[#080b12] border border-slate-800 text-slate-100 focus:outline-none"
                  >
                    <option value="IP">IP Address</option>
                    <option value="DOMAIN">Domain</option>
                    <option value="URL">URL</option>
                    <option value="HASH">SHA256 Hash</option>
                    <option value="EMAIL">Email</option>
                    <option value="CVE">CVE Identifier</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Severity</label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value as ThreatSeverity)}
                    className="w-full p-2.5 rounded-lg bg-[#080b12] border border-slate-800 text-slate-100 focus:outline-none"
                  >
                    <option value="CRITICAL">Critical</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Context / Description</label>
                <textarea
                  rows={2}
                  placeholder="Observed in beaconing telemetry or threat report..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-[#080b12] border border-slate-800 text-slate-100 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold"
                >
                  Register & Correlate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
