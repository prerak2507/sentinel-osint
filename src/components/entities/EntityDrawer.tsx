'use client';

import React from 'react';
import { useIntelligence } from '@/context/IntelligenceContext';
import { 
  X, 
  ShieldAlert, 
  ExternalLink, 
  Network, 
  FileText, 
  Clock, 
  Database, 
  Tag, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

export function EntityDrawer() {
  const { 
    selectedEntity, 
    isEntityDrawerOpen, 
    setIsEntityDrawerOpen, 
    investigation,
    addToast 
  } = useIntelligence();

  if (!isEntityDrawerOpen || !selectedEntity) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl bg-[#0a0d14] border-l border-slate-800 shadow-2xl h-full flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-250"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-800 bg-[#07090e] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                Entity Intelligence File
              </span>
              <h2 className="text-sm font-mono font-bold text-slate-100">
                {selectedEntity.name}
              </h2>
            </div>
          </div>
          <button
            onClick={() => setIsEntityDrawerOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="p-5 space-y-6 overflow-y-auto flex-1">
          {/* Key Intelligence Summary */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-[#0e1422] border border-slate-800">
              <span className="text-[10px] font-mono text-slate-500">TYPE</span>
              <div className="text-xs font-mono font-semibold text-cyan-300 mt-0.5">
                {selectedEntity.type}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-[#0e1422] border border-slate-800">
              <span className="text-[10px] font-mono text-slate-500">RISK INDEX</span>
              <div className="text-xs font-mono font-bold text-rose-400 mt-0.5">
                {selectedEntity.riskScore} / 100
              </div>
            </div>
            <div className="p-3 rounded-lg bg-[#0e1422] border border-slate-800">
              <span className="text-[10px] font-mono text-slate-500">CONFIDENCE</span>
              <div className="text-xs font-mono font-bold text-emerald-400 mt-0.5">
                {selectedEntity.confidence}%
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Threat Intelligence Context
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed p-3 rounded-lg bg-[#0e1422] border border-slate-800">
              {selectedEntity.description}
            </p>
          </div>

          {/* Classification Tags */}
          <div>
            <h4 className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Taxonomy & Tags
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {selectedEntity.tags.map((tag, i) => (
                <span key={i} className="text-xs font-mono px-2.5 py-1 rounded-md bg-blue-950/40 text-blue-300 border border-blue-500/30">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Correlated Relationships */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider">
                Graph Relationships ({selectedEntity.relationships.length})
              </h4>
              <span className="text-[10px] font-mono text-slate-500">Edge Evidence</span>
            </div>
            <div className="space-y-2">
              {selectedEntity.relationships.map((rel, i) => (
                <div key={i} className="p-3 rounded-lg bg-[#0e1422] border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-500/30 font-semibold">
                      {rel.relationType}
                    </span>
                    <span className="font-mono text-xs text-slate-400">
                      {rel.confidence}% Confidence
                    </span>
                  </div>
                  <div className="text-xs font-mono font-medium text-slate-200 mt-1">
                    {rel.targetName}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    Source: {rel.source}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Source Evidence Feed */}
          <div>
            <h4 className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Telemetry Evidence Log ({selectedEntity.sourceEvidence.length})
            </h4>
            <div className="space-y-2">
              {selectedEntity.sourceEvidence.map((ev) => (
                <div key={ev.id} className="p-3 rounded-lg bg-[#0e1422] border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-cyan-400 font-semibold">{ev.title}</span>
                    <span className="text-slate-500">{ev.sourceName}</span>
                  </div>
                  <div className="p-2.5 rounded bg-black/70 font-mono text-[11px] text-slate-300 border border-slate-800 break-all">
                    {ev.rawSample}
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span>Observed: {ev.observedAt}</span>
                    <span className="text-emerald-400">Verified Sample</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-[#07090e] flex items-center justify-end gap-3">
          <button
            onClick={() => setIsEntityDrawerOpen(false)}
            className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              addToast('Entity Added to Case', `Linked ${selectedEntity.name} to investigation`, 'success');
              setIsEntityDrawerOpen(false);
            }}
            className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium transition-colors shadow-sm"
          >
            Pin to Case {investigation.id}
          </button>
        </div>
      </div>
    </div>
  );
}
