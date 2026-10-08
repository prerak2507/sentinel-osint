'use client';

import React from 'react';
import { ShieldAlert, AlertTriangle, Users, Radio, Database, TrendingUp } from 'lucide-react';

export function MetricCards() {
  const metrics = [
    {
      title: 'Active Threats',
      value: '37',
      sublabel: '+4 in last 24h',
      icon: ShieldAlert,
      color: 'text-rose-400',
      border: 'border-rose-500/25',
      bg: 'bg-rose-950/15',
      badge: 'Escalated'
    },
    {
      title: 'Critical Indicators',
      value: '8',
      sublabel: 'Weaponized CVEs & C2s',
      icon: AlertTriangle,
      color: 'text-amber-400',
      border: 'border-amber-500/25',
      bg: 'bg-amber-950/15',
      badge: 'Action Required'
    },
    {
      title: 'Entities Tracked',
      value: '1,284',
      sublabel: 'Actors, Orgs & IPs',
      icon: Users,
      color: 'text-cyan-400',
      border: 'border-cyan-500/25',
      bg: 'bg-cyan-950/15',
      badge: 'Synchronized'
    },
    {
      title: 'Sources Connected',
      value: '24',
      sublabel: '8 Primary OSINT Feeds',
      icon: Radio,
      color: 'text-emerald-400',
      border: 'border-emerald-500/25',
      bg: 'bg-emerald-950/15',
      badge: '100% Uptime'
    },
    {
      title: 'Data Collected',
      value: '2.4M',
      sublabel: 'Ingested records',
      icon: Database,
      color: 'text-blue-400',
      border: 'border-blue-500/25',
      bg: 'bg-blue-950/15',
      badge: 'Continuous'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
      {metrics.map((m, idx) => {
        const Icon = m.icon;
        return (
          <div
            key={idx}
            className={`p-4 rounded-xl border ${m.border} ${m.bg} bg-[#0c101a] backdrop-blur-md flex flex-col justify-between hover:border-slate-600 transition-all duration-200 group`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                {m.title}
              </span>
              <Icon className={`w-4 h-4 ${m.color} transition-transform group-hover:scale-110`} />
            </div>

            <div className="flex items-baseline gap-2">
              <span className={`text-2xl lg:text-3xl font-bold font-mono tracking-tight ${m.color}`}>
                {m.value}
              </span>
            </div>

            <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
              <span className="text-slate-400 font-mono truncate">{m.sublabel}</span>
              <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
                {m.badge}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
