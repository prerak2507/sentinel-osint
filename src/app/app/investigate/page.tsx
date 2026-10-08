'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { useIntelligence } from '@/context/IntelligenceContext';
import { ThreatGraph } from '@/components/investigation/ThreatGraph';
import { RiskScoreRadial } from '@/components/investigation/RiskScoreRadial';
import { RightIntelligencePanel } from '@/components/investigation/RightIntelligencePanel';
import { CorrelationPipelineVisualizer } from '@/components/investigation/CorrelationPipelineVisualizer';
import { LiveOSINTResultsPanel } from '@/components/investigation/LiveOSINTResultsPanel';
import { EntityDrawer } from '@/components/entities/EntityDrawer';
import type { UnifiedOSINTResult } from '@/lib/osint-services';
import { 
  Search, 
  Terminal, 
  ShieldAlert, 
  Database, 
  Radio, 
  Sparkles, 
  FileText, 
  RotateCw,
  Zap,
  Globe,
  Activity
} from 'lucide-react';

export default function InvestigatePage() {
  const { 
    investigation, 
    searchQuery, 
    runInvestigationSearch, 
    isSearching,
    loadDemoInvestigation,
    addToast,
    setSearchQuery,
  } = useIntelligence();

  const [inputVal, setInputVal] = useState(searchQuery);
  const [liveResult, setLiveResult] = useState<UnifiedOSINTResult | null>(null);
  const [isLiveSearching, setIsLiveSearching] = useState(false);
  const [activeTab, setActiveTab] = useState<'GRAPH' | 'LIVE_OSINT' | 'SCORING'>('GRAPH');

  const handleSearchSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const q = inputVal.trim();
    if (!q) return;

    // Start both: mock investigation AND live OSINT lookup
    setIsLiveSearching(true);
    setLiveResult(null);
    setActiveTab('LIVE_OSINT');
    addToast('Initiating OSINT Lookup', `Querying live public feeds for "${q}"...`, 'info');

    // Run both in parallel
    const [, osintResult] = await Promise.allSettled([
      runInvestigationSearch(q),
      fetch('/api/osint/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      }).then(r => r.json()),
    ]);

    if (osintResult.status === 'fulfilled' && osintResult.value?.data) {
      setLiveResult(osintResult.value.data);
      addToast(
        'Live Intelligence Retrieved',
        `${osintResult.value.data.sources?.length || 0} real OSINT feeds returned data`,
        'success'
      );
    } else {
      addToast('OSINT Lookup', 'Some live feeds may be unreachable. Showing cached intelligence.', 'warning');
    }

    setIsLiveSearching(false);
  }, [inputVal, runInvestigationSearch, addToast]);

  const handleQuickPill = useCallback(async (query: string) => {
    setInputVal(query);
    setIsLiveSearching(true);
    setLiveResult(null);
    setActiveTab('LIVE_OSINT');
    
    const [, osintResult] = await Promise.allSettled([
      runInvestigationSearch(query),
      fetch('/api/osint/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      }).then(r => r.json()),
    ]);

    if (osintResult.status === 'fulfilled' && osintResult.value?.data) {
      setLiveResult(osintResult.value.data);
    }
    setIsLiveSearching(false);
  }, [runInvestigationSearch]);

  return (
    <div className="space-y-5">
      {/* Top Investigation Status Bar */}
      <div className="p-4 rounded-xl bg-[#0b101a]/80 border border-white/[0.05] flex flex-col md:flex-row md:items-center justify-between gap-4 backdrop-blur-sm">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span className="text-[11px] font-mono text-slate-500">CASE:</span>
            <span className="text-xs font-mono font-bold text-slate-100 px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06]">
              {investigation.id}
            </span>
          </div>

          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {investigation.status}
          </span>

          <span className="text-[10px] font-mono text-cyan-300/80 px-2 py-0.5 rounded-full bg-cyan-500/8 border border-cyan-500/15">
            {investigation.targetQuery}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadDemoInvestigation}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] text-slate-300 text-xs font-mono transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Demo Case</span>
          </button>

          <Link
            href="/app/reports"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-medium transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Generate Report</span>
          </Link>
        </div>
      </div>

      {/* Investigation Search Bar */}
      <div className="p-4 rounded-xl bg-[#0b101a]/80 border border-white/[0.05] space-y-3 backdrop-blur-sm">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Enter any IP, domain, CVE ID, URL, or hash for LIVE OSINT lookup..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#070a10] border border-white/[0.06] focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 focus:outline-none font-mono text-sm text-slate-100 placeholder:text-slate-600 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching || isLiveSearching}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white font-mono text-xs font-semibold flex items-center gap-2 transition-all shadow-lg shadow-cyan-900/30 shrink-0"
          >
            {isSearching || isLiveSearching ? (
              <>
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
                <span>Querying Live Feeds...</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5" />
                <span>Run OSINT Lookup</span>
              </>
            )}
          </button>
        </form>

        {/* Quick query suggestions */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[10px] font-mono text-slate-500">Try real lookups:</span>
          {[
            { label: '8.8.8.8', desc: 'Google DNS' },
            { label: '1.1.1.1', desc: 'Cloudflare' },
            { label: 'google.com', desc: 'Domain' },
            { label: 'CVE-2024-3094', desc: 'XZ Utils' },
            { label: 'CVE-2021-44228', desc: 'Log4Shell' },
            { label: 'github.com', desc: 'Domain' },
          ].map((pill) => (
            <button
              key={pill.label}
              type="button"
              onClick={() => handleQuickPill(pill.label)}
              className="group flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.02] border border-white/[0.05] hover:border-cyan-500/30 hover:bg-cyan-500/5 text-[11px] font-mono transition-all"
            >
              <span className="text-slate-300 group-hover:text-cyan-300">{pill.label}</span>
              <span className="text-slate-600 text-[9px]">{pill.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Investigation Result Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {[
          { label: 'RISK SCORE', value: liveResult?.riskScore ?? investigation.riskScore, suffix: '/ 100', color: 'text-red-400' },
          { label: 'SEVERITY', value: liveResult?.severity ?? investigation.severity, color: 'text-amber-400' },
          { label: 'CONFIDENCE', value: `${liveResult?.confidence ?? investigation.confidence}%`, color: 'text-emerald-400' },
          { label: 'FIRST SEEN', value: investigation.firstSeen, color: 'text-slate-300' },
          { label: 'LAST SEEN', value: investigation.lastSeen, color: 'text-cyan-300' },
          { label: 'ENTITIES', value: `${investigation.entityCount}`, color: 'text-purple-400' },
          { label: 'LIVE SOURCES', value: `${liveResult?.sources?.length ?? investigation.sourceCount}`, color: 'text-blue-400' },
        ].map((m, i) => (
          <div key={i} className="p-3 rounded-lg bg-[#0b101a]/80 border border-white/[0.04]">
            <span className="text-[9px] font-mono text-slate-500 uppercase">{m.label}</span>
            <div className={`text-sm font-bold font-mono ${m.color} mt-0.5`}>
              {m.value} {m.suffix && <span className="text-xs text-slate-600 font-normal">{m.suffix}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Content Tabs */}
      <div className="flex items-center gap-1 bg-[#080b12] p-1 rounded-xl border border-white/[0.04] w-fit">
        {([
          { key: 'GRAPH', label: 'Threat Graph', icon: Activity, badge: undefined },
          { key: 'LIVE_OSINT', label: 'Live OSINT Data', icon: Globe, badge: liveResult ? `${liveResult.sources.length}` : undefined },
          { key: 'SCORING', label: 'Risk Analysis', icon: ShieldAlert, badge: undefined },
        ] as const).map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              activeTab === tab.key
                ? 'bg-cyan-500/12 text-cyan-300 border border-cyan-500/25 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            <span>{tab.label}</span>
            {tab.badge && (
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 font-bold">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div className="lg:col-span-8 space-y-5">
          {/* Tab Content */}
          {activeTab === 'GRAPH' && (
            <ThreatGraph 
              graphNodes={investigation.graphNodes} 
              graphEdges={investigation.graphEdges} 
            />
          )}

          {activeTab === 'LIVE_OSINT' && (
            <div className="rounded-xl border border-white/[0.06] bg-[#0b101a]/80 p-5 backdrop-blur-sm min-h-[400px]">
              {isLiveSearching ? (
                <div className="flex flex-col items-center justify-center h-[400px] text-center space-y-4">
                  <RotateCw className="w-8 h-8 text-cyan-400 animate-spin" />
                  <div>
                    <div className="text-sm font-mono text-slate-200">Querying Live OSINT Feeds...</div>
                    <div className="text-xs text-slate-500 mt-1 font-mono">
                      Shodan InternetDB · Cloudflare DNS · CIRCL CVE · URLHaus · ip-api · RDAP
                    </div>
                  </div>
                </div>
              ) : liveResult ? (
                <LiveOSINTResultsPanel result={liveResult} />
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] text-center space-y-3">
                  <Globe className="w-10 h-10 text-slate-700" />
                  <div className="text-sm font-mono text-slate-400">No live lookup performed yet</div>
                  <div className="text-xs text-slate-600 max-w-sm">
                    Enter an IP address, domain name, CVE ID, or URL above to query real OSINT intelligence feeds in real-time.
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'SCORING' && (
            <RiskScoreRadial
              score={liveResult?.riskScore ?? investigation.riskScore}
              severity={liveResult?.severity ?? investigation.severity}
              confidence={liveResult?.confidence ?? investigation.confidence}
              factors={investigation.riskFactors}
            />
          )}
        </div>

        {/* Right Intelligence Panel */}
        <div className="lg:col-span-4 sticky top-20">
          <RightIntelligencePanel />
        </div>
      </div>

      {/* Pipeline */}
      <CorrelationPipelineVisualizer />

      {/* Entity Drawer */}
      <EntityDrawer />
    </div>
  );
}
