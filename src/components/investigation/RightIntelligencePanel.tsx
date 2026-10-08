'use client';

import React, { useState } from 'react';
import { useIntelligence } from '@/context/IntelligenceContext';
import { 
  ShieldAlert, 
  ExternalLink, 
  Plus, 
  Maximize2, 
  FileSearch, 
  CheckCircle2, 
  Network, 
  Radio, 
  Copy, 
  Tag, 
  Clock, 
  FileText
} from 'lucide-react';

export function RightIntelligencePanel() {
  const { selectedEntity, investigation, addToast, setIsEntityDrawerOpen } = useIntelligence();
  const [evidenceTab, setEvidenceTab] = useState<'RELATIONS' | 'EVIDENCE'>('RELATIONS');
  const [copied, setCopied] = useState(false);

  if (!selectedEntity) {
    return (
      <div className="glass-panel p-6 rounded-xl border border-slate-800 bg-[#0d121d] flex flex-col items-center justify-center text-center h-full min-h-[460px]">
        <Network className="w-10 h-10 text-slate-600 mb-3" />
        <h4 className="text-sm font-medium text-slate-300">No Entity Selected</h4>
        <p className="text-xs text-slate-500 mt-1 max-w-xs">
          Select a node from the threat graph or IOC table to inspect correlated telemetry.
        </p>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedEntity.name);
    setCopied(true);
    addToast('Copied to Clipboard', `Copied "${selectedEntity.name}"`, 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddToCase = () => {
    addToast('Entity Pinned', `Linked ${selectedEntity.name} to active case ${investigation.id}`, 'success');
  };

  const getRiskBadge = (score: number) => {
    if (score >= 80) return 'bg-red-500/20 text-red-400 border-red-500/30';
    if (score >= 60) return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
  };

  return (
    <div className="glass-panel rounded-xl border border-slate-800 bg-[#0d121d] flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-[#090d14] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-200 font-mono">
            Intelligence Inspector
          </span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
          CASE: {investigation.id}
        </span>
      </div>

      <div className="p-4 space-y-4 overflow-y-auto flex-1">
        {/* Entity Card Title & Type */}
        <div className="p-3.5 rounded-lg bg-[#080b12] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 font-semibold">
              {selectedEntity.type}
            </span>
            <div className="flex items-center gap-1.5">
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${getRiskBadge(selectedEntity.riskScore)}`}>
                RISK {selectedEntity.riskScore}
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                {selectedEntity.confidence}% CONF
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-mono font-bold text-slate-100 break-all select-all">
              {selectedEntity.name}
            </h3>
            <button
              onClick={handleCopy}
              className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors shrink-0"
              title="Copy identifier"
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            {selectedEntity.description}
          </p>
        </div>

        {/* Observation Timestamps & Counts */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-lg bg-[#080b12] border border-slate-800">
            <div className="text-[10px] font-mono text-slate-500">FIRST SEEN</div>
            <div className="font-mono text-slate-200 mt-0.5 flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>{selectedEntity.firstSeen}</span>
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-[#080b12] border border-slate-800">
            <div className="text-[10px] font-mono text-slate-500">LAST SEEN</div>
            <div className="font-mono text-slate-200 mt-0.5 flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-cyan-400" />
              <span>{selectedEntity.lastSeen}</span>
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-[#080b12] border border-slate-800">
            <div className="text-[10px] font-mono text-slate-500">INDICATORS</div>
            <div className="font-mono text-cyan-400 font-semibold mt-0.5">
              23 Correlated
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-[#080b12] border border-slate-800">
            <div className="text-[10px] font-mono text-slate-500">FEED CITATIONS</div>
            <div className="font-mono text-blue-400 font-semibold mt-0.5">
              14 Feeds
            </div>
          </div>
        </div>

        {/* Tags */}
        <div>
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <Tag className="w-3 h-3 text-slate-500" />
            <span>Classification Tags</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {selectedEntity.tags.map((tag, idx) => (
              <span 
                key={idx} 
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Tab switch: Relationships vs Raw Evidence */}
        <div className="pt-2">
          <div className="flex border-b border-slate-800">
            <button
              onClick={() => setEvidenceTab('RELATIONS')}
              className={`pb-2 px-3 text-xs font-mono font-medium transition-colors border-b-2 -mb-[2px] ${
                evidenceTab === 'RELATIONS'
                  ? 'border-cyan-400 text-cyan-300'
                  : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              Relationships ({selectedEntity.relationships.length})
            </button>
            <button
              onClick={() => setEvidenceTab('EVIDENCE')}
              className={`pb-2 px-3 text-xs font-mono font-medium transition-colors border-b-2 -mb-[2px] ${
                evidenceTab === 'EVIDENCE'
                  ? 'border-cyan-400 text-cyan-300'
                  : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              Evidence ({selectedEntity.sourceEvidence.length})
            </button>
          </div>

          <div className="mt-3 space-y-2">
            {evidenceTab === 'RELATIONS' ? (
              selectedEntity.relationships.map((rel, idx) => (
                <div 
                  key={idx}
                  className="p-2.5 rounded-lg bg-[#080b12] border border-slate-800/80 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-950/60 text-cyan-400 border border-cyan-500/30">
                      {rel.relationType}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {rel.confidence}% Confidence
                    </span>
                  </div>
                  <div className="font-mono text-xs text-slate-200 truncate">
                    {rel.targetName}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 flex items-center justify-between">
                    <span>Source: {rel.source}</span>
                  </div>
                </div>
              ))
            ) : (
              selectedEntity.sourceEvidence.map((ev) => (
                <div 
                  key={ev.id}
                  className="p-2.5 rounded-lg bg-[#080b12] border border-slate-800 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-cyan-400 font-semibold">{ev.category}</span>
                    <span className="text-slate-500">{ev.sourceName}</span>
                  </div>
                  <div className="text-xs text-slate-300 font-medium">
                    {ev.title}
                  </div>
                  <div className="p-2 rounded bg-black/60 font-mono text-[10px] text-slate-400 overflow-x-auto border border-slate-800">
                    {ev.rawSample}
                  </div>
                  <div className="text-[9px] text-slate-500 font-mono">
                    Observed: {ev.observedAt}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Action CTA Buttons */}
      <div className="p-3 border-t border-slate-800 bg-[#090d14] grid grid-cols-3 gap-2">
        <button
          onClick={() => setIsEntityDrawerOpen(true)}
          className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
          title="Open comprehensive drawer"
        >
          <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
          <span>Expand</span>
        </button>

        <button
          onClick={() => setEvidenceTab('EVIDENCE')}
          className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg bg-blue-950/40 border border-blue-500/30 hover:bg-blue-900/40 text-blue-300 text-xs font-medium transition-colors"
          title="View raw evidence telemetry"
        >
          <FileSearch className="w-3.5 h-3.5 text-blue-400" />
          <span>Evidence</span>
        </button>

        <button
          onClick={handleAddToCase}
          className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium transition-colors shadow-sm"
          title="Pin to investigation case"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Case</span>
        </button>
      </div>
    </div>
  );
}
