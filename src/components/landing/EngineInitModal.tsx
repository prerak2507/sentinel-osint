'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, RotateCw, Terminal, ShieldCheck } from 'lucide-react';

interface EngineInitModalProps {
  isOpen: boolean;
  onComplete?: () => void;
}

export function EngineInitModal({ isOpen, onComplete }: EngineInitModalProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const steps = [
    'Connecting 8 public OSINT sources & collectors...',
    'Calibrating multi-feed deduplication engine...',
    'Loading entity relationship index (1,284 nodes)...',
    'Synthesizing investigation workspace INV-2026-1042...'
  ];

  const labels = [
    'Sources connected (8/8 online)',
    'Correlation engine ready (Consensus: 94%)',
    'Entity index loaded (1,284 nodes mapped)',
    'Investigation workspace ready'
  ];

  useEffect(() => {
    if (!isOpen) {
      setStep(0);
      return;
    }

    const t1 = setTimeout(() => setStep(1), 500);
    const t2 = setTimeout(() => setStep(2), 1100);
    const t3 = setTimeout(() => setStep(3), 1700);
    const t4 = setTimeout(() => setStep(4), 2300);
    const t5 = setTimeout(() => {
      onComplete?.();
      router.push('/app/investigate');
    }, 2800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [isOpen, onComplete, router]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-lg rounded-2xl border border-cyan-500/40 bg-[#090d16] p-7 shadow-[0_0_60px_rgba(6,182,212,0.25)] space-y-6 font-mono text-xs">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 tracking-wider">
                INITIALIZING INTELLIGENCE ENGINE
              </h3>
              <p className="text-[10px] text-slate-500">SentinelOSINT Core Telemetry Grid</p>
            </div>
          </div>
          <RotateCw className="w-4 h-4 text-cyan-400 animate-spin" />
        </div>

        {/* Progress List */}
        <div className="space-y-3">
          {labels.map((label, idx) => {
            const isDone = step > idx;
            const isCurrent = step === idx;

            return (
              <div 
                key={idx}
                className={`p-3 rounded-lg border transition-all duration-300 flex items-center justify-between ${
                  isDone 
                    ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-300'
                    : isCurrent 
                    ? 'border-cyan-500/50 bg-cyan-950/30 text-cyan-300 animate-pulse'
                    : 'border-slate-800/60 bg-[#06080e] text-slate-600'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : isCurrent ? (
                    <RotateCw className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
                  ) : (
                    <span className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                  )}
                  <span className="text-xs">{isDone ? label : steps[idx]}</span>
                </div>
                {isDone && (
                  <span className="text-[10px] font-bold text-emerald-400 uppercase">
                    READY
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Terminal Line */}
        <div className="p-3 rounded-lg bg-black/80 border border-slate-800 font-mono text-[11px] text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-300">Target case: </span>
            <span className="text-cyan-400 font-bold">INV-2026-1042</span>
          </div>
          <span className="text-slate-500">Allocating SOC Session...</span>
        </div>
      </div>
    </div>
  );
}
