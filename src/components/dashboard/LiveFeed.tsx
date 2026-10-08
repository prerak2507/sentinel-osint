'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useIntelligence } from '@/context/IntelligenceContext';
import { LIVE_FEED_INITIAL } from '@/data/mockData';
import { Radio, ArrowRight, ShieldAlert, Sparkles, Filter } from 'lucide-react';

interface FeedEvent {
  id: string;
  time: string;
  title: string;
  entity: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  source: string;
}

export function LiveFeed() {
  const [feed, setFeed] = useState<FeedEvent[]>(LIVE_FEED_INITIAL);
  const [isPaused, setIsPaused] = useState(false);
  const router = useRouter();
  const { runInvestigationSearch, addToast } = useIntelligence();

  // Subtle real-time ingestion simulation
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];

      const simulatedEvents: Omit<FeedEvent, 'id' | 'time'>[] = [
        {
          title: 'Suspicious TLS wildcard certificate logged',
          entity: 'Cert-LetEncrypt-Wildcard-7F8A',
          severity: 'HIGH',
          source: 'Censys SSL Certificates'
        },
        {
          title: 'Payload delivery URI matched signature',
          entity: 'https://suspicious-domain.example/api/v2/telemetry/heartbeat',
          severity: 'CRITICAL',
          source: 'URLHaus Malware Tracker'
        },
        {
          title: 'Fast-flux DNS A-Record update detected',
          entity: '91.215.85.17',
          severity: 'MEDIUM',
          source: 'ShadowServer Scanning Engine'
        },
        {
          title: 'Threat actor infrastructure pivot observed',
          entity: 'Vanguard Spider (UNC3886)',
          severity: 'HIGH',
          source: 'AlienVault OTX Pulse'
        }
      ];

      const sample = simulatedEvents[Math.floor(Math.random() * simulatedEvents.length)];
      const newEvent: FeedEvent = {
        id: `EVT-${Date.now().toString().slice(-4)}`,
        time: timeStr,
        ...sample
      };

      setFeed(prev => [newEvent, ...prev.slice(0, 11)]);
    }, 9000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const handleInspectEntity = async (entity: string) => {
    await runInvestigationSearch(entity);
    router.push('/app/investigate');
  };

  const getSeverityStyle = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return 'text-red-400 bg-red-950/40 border-red-500/30';
      case 'HIGH':
        return 'text-amber-400 bg-amber-950/40 border-amber-500/30';
      case 'MEDIUM':
        return 'text-blue-400 bg-blue-950/40 border-blue-500/30';
      default:
        return 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30';
    }
  };

  return (
    <div className="glass-panel p-5 rounded-xl border border-slate-800 bg-[#0d121d] flex flex-col h-full">
      {/* Feed Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200 font-mono">
            Live OSINT Stream
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700 transition-colors"
          >
            {isPaused ? 'RESUME STREAM' : 'PAUSE'}
          </button>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/30">
            AUTO-CORRELATING
          </span>
        </div>
      </div>

      {/* Scrolling Events */}
      <div className="mt-3 space-y-2.5 overflow-y-auto max-h-[380px] pr-1">
        {feed.map((event) => (
          <div
            key={event.id}
            onClick={() => handleInspectEntity(event.entity)}
            className="p-3 rounded-lg bg-[#080b12] border border-slate-800/80 hover:border-cyan-500/40 hover:bg-[#0c111c] transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="font-mono text-slate-500">[{event.time}]</span>
              <span className={`font-mono text-[9px] font-bold px-1.5 py-0.2 rounded border ${getSeverityStyle(event.severity)}`}>
                {event.severity}
              </span>
            </div>

            <div className="text-xs font-medium text-slate-200 group-hover:text-cyan-300 transition-colors">
              {event.title}
            </div>

            <div className="mt-1.5 flex items-center justify-between text-[10px] font-mono">
              <span className="text-cyan-400/90 truncate max-w-[200px]">
                {event.entity}
              </span>
              <span className="text-slate-500 truncate">
                {event.source}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Feed Footer */}
      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
        <span>Click any event to initiate correlated case pivot</span>
        <ArrowRight className="w-3 h-3 text-cyan-400" />
      </div>
    </div>
  );
}
