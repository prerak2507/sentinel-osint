'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useIntelligence } from '@/context/IntelligenceContext';
import { 
  Search, 
  ShieldAlert, 
  Database, 
  Terminal, 
  FileText, 
  Users, 
  Radio, 
  ArrowRight, 
  Clock, 
  X,
  Sparkles
} from 'lucide-react';

export function CommandPalette() {
  const { 
    isCommandPaletteOpen, 
    setIsCommandPaletteOpen, 
    investigation, 
    iocs, 
    entities, 
    threats,
    runInvestigationSearch,
    loadDemoInvestigation 
  } = useIntelligence();

  const [input, setInput] = useState('');
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setInput('');
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const filteredIocs = iocs.filter(ioc => 
    ioc.value.toLowerCase().includes(input.toLowerCase()) || 
    ioc.type.toLowerCase().includes(input.toLowerCase())
  ).slice(0, 4);

  const filteredEntities = entities.filter(e => 
    e.name.toLowerCase().includes(input.toLowerCase()) || 
    e.type.toLowerCase().includes(input.toLowerCase())
  ).slice(0, 3);

  const filteredThreats = threats.filter(t => 
    t.title.toLowerCase().includes(input.toLowerCase()) || 
    t.caseId.toLowerCase().includes(input.toLowerCase())
  ).slice(0, 2);

  const handleSelectInvestigation = async (query: string) => {
    setIsCommandPaletteOpen(false);
    await runInvestigationSearch(query);
    router.push('/app/investigate');
  };

  const handleNavigate = (path: string) => {
    setIsCommandPaletteOpen(false);
    router.push(path);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/70 backdrop-blur-sm"
      onClick={() => setIsCommandPaletteOpen(false)}
    >
      <div 
        className="w-full max-w-2xl rounded-xl border border-slate-700/60 bg-[#0d121d] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 bg-[#090d14]">
          <Search className="w-5 h-5 text-cyan-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search IOC (IP, domain, hash, CVE), threat actor, case ID..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && input.trim()) {
                handleSelectInvestigation(input.trim());
              }
              if (e.key === 'Escape') {
                setIsCommandPaletteOpen(false);
              }
            }}
            className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none font-mono"
          />
          {input && (
            <button 
              onClick={() => setInput('')}
              className="text-slate-500 hover:text-slate-300 p-1 mr-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded border border-slate-700 text-slate-400">ESC</span>
        </div>

        {/* Results area */}
        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-4">
          {input.trim() && (
            <div className="p-2">
              <button
                onClick={() => handleSelectInvestigation(input)}
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-blue-950/30 border border-blue-500/30 hover:bg-blue-900/40 text-left transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <div>
                    <span className="text-xs text-slate-400">Launch deep OSINT investigation on: </span>
                    <span className="text-xs font-mono font-medium text-cyan-300">"{input}"</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-cyan-400" />
              </button>
            </div>
          )}

          {/* Quick Actions / Shortcuts */}
          <div>
            <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Quick Navigation
            </div>
            <div className="grid grid-cols-2 gap-1 px-1 mt-1">
              <button
                onClick={() => handleNavigate('/app/investigate')}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs text-slate-300 hover:bg-slate-800/60 hover:text-white transition-colors"
              >
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>Investigation Workspace</span>
              </button>
              <button
                onClick={() => handleNavigate('/app/iocs')}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs text-slate-300 hover:bg-slate-800/60 hover:text-white transition-colors"
              >
                <Database className="w-4 h-4 text-blue-400" />
                <span>IOC Explorer</span>
              </button>
              <button
                onClick={() => handleNavigate('/app/entities')}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs text-slate-300 hover:bg-slate-800/60 hover:text-white transition-colors"
              >
                <Users className="w-4 h-4 text-purple-400" />
                <span>Entity Explorer</span>
              </button>
              <button
                onClick={() => handleNavigate('/app/reports')}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs text-slate-300 hover:bg-slate-800/60 hover:text-white transition-colors"
              >
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Threat Reports</span>
              </button>
              <button
                onClick={() => handleNavigate('/app/timeline')}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs text-slate-300 hover:bg-slate-800/60 hover:text-white transition-colors"
              >
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Attack Timeline</span>
              </button>
              <button
                onClick={() => {
                  loadDemoInvestigation();
                  handleNavigate('/app/investigate');
                }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs text-cyan-300 hover:bg-cyan-950/30 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Reset Demo Case</span>
              </button>
            </div>
          </div>

          {/* IOC results */}
          {filteredIocs.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Matching Indicators of Compromise ({filteredIocs.length})
              </div>
              <div className="space-y-1 mt-1">
                {filteredIocs.map((ioc) => (
                  <button
                    key={ioc.id}
                    onClick={() => handleSelectInvestigation(ioc.value)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-800/60 text-left transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {ioc.type}
                      </span>
                      <span className="text-xs font-mono text-slate-200 group-hover:text-cyan-300">
                        {ioc.value}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-semibold ${
                        ioc.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                        ioc.severity === 'HIGH' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}>
                        {ioc.severity}
                      </span>
                      <span className="text-[11px] text-slate-500">{ioc.sources.length} sources</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Threat cases */}
          {filteredThreats.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Threat Clusters ({filteredThreats.length})
              </div>
              <div className="space-y-1 mt-1">
                {filteredThreats.map((threat) => (
                  <button
                    key={threat.id}
                    onClick={() => handleSelectInvestigation(threat.title)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-800/60 text-left transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <ShieldAlert className="w-4 h-4 text-red-400" />
                      <div>
                        <div className="text-xs font-medium text-slate-200 group-hover:text-cyan-300">
                          {threat.title}
                        </div>
                        <div className="text-[10px] font-mono text-slate-500">
                          {threat.caseId} • {threat.status}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-rose-400 font-semibold">
                      Risk {threat.riskScore}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer shortcuts info */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-slate-800/80 bg-[#090d14] text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px]">↵</kbd> Investigate</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px]">esc</kbd> Close</span>
          </div>
          <span className="font-mono text-[10px] text-cyan-400/80">SentinelOSINT Command Grid v2.4</span>
        </div>
      </div>
    </div>
  );
}
