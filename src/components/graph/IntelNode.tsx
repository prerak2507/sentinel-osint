'use client';

import React, { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { 
  Globe, 
  Server, 
  Lock, 
  Skull, 
  Bug, 
  ShieldAlert, 
  Building,
  FileWarning
} from 'lucide-react';

export type IntelNodeData = {
  label: string;
  sublabel: string;
  entityType: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  riskScore: number;
  selected?: boolean;
};

const iconMap: Record<string, React.ElementType> = {
  DOMAIN: Globe,
  IP: Server,
  CERTIFICATE: Lock,
  THREAT_ACTOR: Skull,
  MALWARE: Bug,
  VULNERABILITY: ShieldAlert,
  ORGANIZATION: Building,
};

const severityColors: Record<string, { ring: string; bg: string; text: string; glow: string }> = {
  CRITICAL: { ring: 'ring-red-500/60', bg: 'bg-red-950/30', text: 'text-red-400', glow: '0 0 22px rgba(239,68,68,0.35)' },
  HIGH: { ring: 'ring-amber-500/60', bg: 'bg-amber-950/25', text: 'text-amber-400', glow: '0 0 18px rgba(245,158,11,0.3)' },
  MEDIUM: { ring: 'ring-blue-500/50', bg: 'bg-blue-950/25', text: 'text-blue-400', glow: '0 0 14px rgba(59,130,246,0.25)' },
  LOW: { ring: 'ring-emerald-500/40', bg: 'bg-emerald-950/20', text: 'text-emerald-400', glow: '0 0 10px rgba(16,185,129,0.2)' },
  INFO: { ring: 'ring-slate-500/40', bg: 'bg-slate-900/30', text: 'text-slate-400', glow: 'none' },
};

function IntelNodeComponent({ data, selected }: NodeProps & { data: IntelNodeData }) {
  const Icon = iconMap[data.entityType] || FileWarning;
  const sev = severityColors[data.severity] || severityColors.INFO;

  return (
    <div
      className={`
        relative px-4 py-3 rounded-xl border-2 backdrop-blur-lg min-w-[170px] max-w-[210px]
        transition-all duration-200 ease-out cursor-grab active:cursor-grabbing
        ${selected ? `ring-2 ${sev.ring} scale-[1.06]` : 'hover:scale-[1.03]'}
        ${sev.bg}
        ${selected ? 'border-cyan-400/80' : 'border-white/[0.08]'}
      `}
      style={{
        background: 'rgba(10, 14, 23, 0.92)',
        boxShadow: selected ? sev.glow : '0 2px 12px rgba(0,0,0,0.4)',
      }}
    >
      {/* Incoming handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-2.5 !h-2.5 !bg-slate-600 !border-slate-500 hover:!bg-cyan-400 transition-colors"
      />

      {/* Header row */}
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <div className={`p-1 rounded-md ${sev.bg} border border-white/[0.06]`}>
            <Icon className={`w-3.5 h-3.5 ${sev.text}`} />
          </div>
          <span className="text-[9px] font-mono uppercase tracking-wider text-slate-500 font-medium">
            {data.entityType.replace('_', ' ')}
          </span>
        </div>
        <span className={`text-[10px] font-mono font-bold tabular-nums ${sev.text}`}>
          {data.riskScore}
        </span>
      </div>

      {/* Label */}
      <div className="text-[12px] font-mono font-semibold text-slate-100 leading-tight truncate" title={data.label}>
        {data.label}
      </div>

      {/* Sublabel */}
      <div className="text-[10px] text-slate-500 truncate mt-0.5 leading-snug" title={data.sublabel}>
        {data.sublabel}
      </div>

      {/* Outgoing handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="!w-2.5 !h-2.5 !bg-slate-600 !border-slate-500 hover:!bg-cyan-400 transition-colors"
      />
    </div>
  );
}

export const IntelNode = memo(IntelNodeComponent);
