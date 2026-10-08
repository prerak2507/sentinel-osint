'use client';

import React from 'react';
import { RiskFactor, ThreatSeverity } from '@/types/intelligence';
import { ShieldAlert, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

interface RiskScoreRadialProps {
  score: number;
  severity: ThreatSeverity;
  confidence: number;
  factors: RiskFactor[];
}

export function RiskScoreRadial({ score, severity, confidence, factors }: RiskScoreRadialProps) {
  // SVG circular gauge math
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = () => {
    if (score >= 80) return { stroke: '#ef4444', text: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30' };
    if (score >= 60) return { stroke: '#f59e0b', text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' };
    if (score >= 40) return { stroke: '#3b82f6', text: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' };
    return { stroke: '#10b981', text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' };
  };

  const colors = getScoreColor();

  return (
    <div className="glass-panel p-5 rounded-xl border border-slate-800 bg-[#0d121d]">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200 font-mono">
            Analytical Threat Scoring
          </h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
          CONFIDENCE {confidence}%
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center mt-4">
        {/* Radial gauge */}
        <div className="md:col-span-5 flex flex-col items-center justify-center">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 130 130">
              {/* Background circle */}
              <circle
                cx="65"
                cy="65"
                r={radius}
                className="stroke-slate-800 fill-none"
                strokeWidth="10"
              />
              {/* Animated Progress circle */}
              <circle
                cx="65"
                cy="65"
                r={radius}
                fill="none"
                stroke={colors.stroke}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
                style={{
                  filter: `drop-shadow(0 0 8px ${colors.stroke}55)`
                }}
              />
            </svg>

            {/* Inner score reading */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className={`text-3xl font-bold font-mono tracking-tight ${colors.text}`}>
                {score}
              </span>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest -mt-0.5">
                / 100 RISK
              </span>
              <span className={`mt-1 text-[9px] font-mono font-semibold px-2 py-0.2 rounded ${colors.bg} ${colors.text} border ${colors.border}`}>
                {severity}
              </span>
            </div>
          </div>

          <div className="mt-2 text-center">
            <div className="text-[11px] text-slate-400 font-mono">
              Composite Threat Index
            </div>
          </div>
        </div>

        {/* Scoring Factor Breakdown */}
        <div className="md:col-span-7 space-y-2.5">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Correlation Factors</span>
            <span className="text-[10px] text-cyan-400">Additive Model</span>
          </div>

          {factors.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">{item.factor}</span>
                <span className="font-mono text-cyan-400 font-semibold">
                  +{item.score} <span className="text-[10px] text-slate-500 font-normal">/ {item.max}</span>
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800/80 overflow-hidden">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-700"
                  style={{ width: `${(item.score / item.max) * 100}%` }}
                />
              </div>
              <div className="text-[10px] text-slate-500 leading-tight">
                {item.description}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mandatory Analytical Methodology Disclaimer */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-start gap-2 bg-[#090d14]/60 p-2.5 rounded-lg border border-slate-800">
        <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
        <p className="text-[11px] text-slate-400 leading-relaxed">
          <strong className="text-slate-300">Methodology Note:</strong> Risk score is a prototype analytical score combining source reliability, indicator reputation, correlation strength, recency and historical evidence. Not intended as an authoritative single-source ground truth.
        </p>
      </div>
    </div>
  );
}
