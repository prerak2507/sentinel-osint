'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useIntelligence } from '@/context/IntelligenceContext';
import { AlertType, ThreatSeverity } from '@/types/intelligence';
import { 
  Bell, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  Terminal, 
  TrendingUp, 
  Radio, 
  Clock, 
  ArrowRight,
  Database,
  FileSearch
} from 'lucide-react';

export default function AlertsPage() {
  const { alerts, acknowledgeAlert, dismissAlert, runInvestigationSearch, loadDemoInvestigation } = useIntelligence();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'ACKNOWLEDGED'>('ACTIVE');

  const filteredAlerts = alerts.filter(a => activeTab === 'ACTIVE' ? !a.acknowledged : a.acknowledged);

  const handleInvestigate = async (caseId?: string, entityId?: string) => {
    if (caseId === 'INV-2026-1042') {
      loadDemoInvestigation();
    } else {
      await runInvestigationSearch(caseId || 'Suspicious Infrastructure Cluster');
    }
    router.push('/app/investigate');
  };

  const getAlertIcon = (type: AlertType) => {
    switch (type) {
      case 'RISK_ESCALATION':
        return <TrendingUp className="w-4 h-4 text-rose-400" />;
      case 'CRITICAL_THREAT':
        return <ShieldAlert className="w-4 h-4 text-red-400" />;
      case 'NEW_IOC':
        return <Database className="w-4 h-4 text-amber-400" />;
      case 'SOURCE_FAILURE':
        return <Radio className="w-4 h-4 text-orange-400" />;
      case 'CORRELATION_DETECTED':
        return <Bell className="w-4 h-4 text-cyan-400" />;
    }
  };

  const getSeverityBadge = (sev: ThreatSeverity) => {
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
      <div className="p-5 rounded-xl bg-[#0d121d] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-rose-400" />
            <h1 className="text-lg font-bold text-slate-100 font-mono tracking-tight">
              Security Alert Center
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Automated notifications triggered by confidence thresholds, risk escalation, and new IOC detections.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 bg-[#080b12] p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab('ACTIVE')}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${
              activeTab === 'ACTIVE'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Active ({alerts.filter(a => !a.acknowledged).length})
          </button>
          <button
            onClick={() => setActiveTab('ACKNOWLEDGED')}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${
              activeTab === 'ACKNOWLEDGED'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Reviewed ({alerts.filter(a => a.acknowledged).length})
          </button>
        </div>
      </div>

      {/* Alert Cards */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="p-12 text-center rounded-xl bg-[#0d121d] border border-slate-800 font-mono text-xs text-slate-500">
            No {activeTab.toLowerCase()} security alerts present in the event queue.
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className="glass-panel p-5 rounded-xl border border-slate-800 bg-[#0d121d] hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="p-1 rounded bg-[#080b12] border border-slate-800">
                    {getAlertIcon(alert.type)}
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${getSeverityBadge(alert.severity)}`}>
                    {alert.severity}
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400">
                    {alert.type.replace('_', ' ')}
                  </span>
                  <span className="text-slate-600 font-mono">•</span>
                  <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{alert.timestamp}</span>
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-100 font-mono group-hover:text-cyan-300 transition-colors">
                    {alert.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-3xl">
                    {alert.description}
                  </p>
                </div>

                <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500">
                  <span>Source: <strong className="text-slate-400 font-normal">{alert.source}</strong></span>
                  {alert.relatedCaseId && (
                    <>
                      <span>•</span>
                      <span>Case: <strong className="text-cyan-400 font-normal">{alert.relatedCaseId}</strong></span>
                    </>
                  )}
                  {alert.riskScoreBefore && alert.riskScoreAfter && (
                    <>
                      <span>•</span>
                      <span className="text-rose-400 font-bold">Risk: {alert.riskScoreBefore} → {alert.riskScoreAfter}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
                {!alert.acknowledged && (
                  <button
                    onClick={() => acknowledgeAlert(alert.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Acknowledge</span>
                  </button>
                )}

                <button
                  onClick={() => handleInvestigate(alert.relatedCaseId, alert.entityId)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-medium transition-all shadow-sm"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Investigate</span>
                </button>

                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="p-1.5 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
                  title="Dismiss alert"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
