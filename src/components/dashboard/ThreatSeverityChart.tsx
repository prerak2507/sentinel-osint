'use client';

import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { ShieldAlert, Calendar } from 'lucide-react';

interface SeverityDataPoint {
  severity: string;
  count: number;
  color: string;
}

const DATA_BY_TIME_FILTER: Record<string, SeverityDataPoint[]> = {
  '24H': [
    { severity: 'Critical', count: 8, color: '#ef4444' },
    { severity: 'High', count: 19, color: '#f59e0b' },
    { severity: 'Medium', count: 42, color: '#3b82f6' },
    { severity: 'Low', count: 28, color: '#10b981' }
  ],
  '7D': [
    { severity: 'Critical', count: 37, color: '#ef4444' },
    { severity: 'High', count: 86, color: '#f59e0b' },
    { severity: 'Medium', count: 210, color: '#3b82f6' },
    { severity: 'Low', count: 145, color: '#10b981' }
  ],
  '30D': [
    { severity: 'Critical', count: 142, color: '#ef4444' },
    { severity: 'High', count: 320, color: '#f59e0b' },
    { severity: 'Medium', count: 780, color: '#3b82f6' },
    { severity: 'Low', count: 610, color: '#10b981' }
  ],
  '90D': [
    { severity: 'Critical', count: 380, color: '#ef4444' },
    { severity: 'High', count: 890, color: '#f59e0b' },
    { severity: 'Medium', count: 2150, color: '#3b82f6' },
    { severity: 'Low', count: 1820, color: '#10b981' }
  ]
};

export function ThreatSeverityChart() {
  const [filter, setFilter] = useState<'24H' | '7D' | '30D' | '90D'>('7D');
  const currentData = DATA_BY_TIME_FILTER[filter];

  return (
    <div className="glass-panel p-5 rounded-xl border border-slate-800 bg-[#0d121d] flex flex-col justify-between">
      {/* Chart Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200 font-mono">
            Threat Severity Distribution
          </h3>
        </div>

        {/* Time filters */}
        <div className="flex items-center gap-1 bg-[#080b12] p-1 rounded-lg border border-slate-800">
          {(['24H', '7D', '30D', '90D'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-medium transition-colors ${
                filter === t
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Body */}
      <div className="h-56 mt-4 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={currentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis 
              dataKey="severity" 
              stroke="#64748b" 
              fontSize={11} 
              tickLine={false} 
              axisLine={{ stroke: '#1e293b' }}
              fontFamily="monospace"
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={10} 
              tickLine={false} 
              axisLine={{ stroke: '#1e293b' }}
              fontFamily="monospace"
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as SeverityDataPoint;
                  return (
                    <div className="p-2.5 rounded-lg bg-[#090d14] border border-slate-700 shadow-xl font-mono text-xs">
                      <div className="text-slate-400">{data.severity} Incidents</div>
                      <div className="text-base font-bold text-slate-100 mt-0.5">
                        {data.count} <span className="text-[10px] text-slate-500 font-normal">indicators</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {currentData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} opacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Distribution Legend */}
      <div className="pt-3 border-t border-slate-800/80 grid grid-cols-4 gap-2 text-center text-xs font-mono">
        {currentData.map((item, idx) => (
          <div key={idx} className="p-1.5 rounded bg-[#080b12] border border-slate-800">
            <span className="text-[10px] text-slate-400 block">{item.severity}</span>
            <span className="font-bold text-slate-200 mt-0.5 block" style={{ color: item.color }}>
              {item.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
