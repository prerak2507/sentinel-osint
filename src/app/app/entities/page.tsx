'use client';

import React, { useState } from 'react';
import { useIntelligence } from '@/context/IntelligenceContext';
import { EntityType, Entity } from '@/types/intelligence';
import { EntityDrawer } from '@/components/entities/EntityDrawer';
import { 
  Users, 
  Search, 
  Globe, 
  Server, 
  Skull, 
  Bug, 
  ShieldAlert, 
  Building, 
  ExternalLink, 
  GitMerge, 
  ArrowRight,
  Database
} from 'lucide-react';

export default function EntityExplorerPage() {
  const { entities, setSelectedEntity, setIsEntityDrawerOpen } = useIntelligence();
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const typeTabs = [
    { label: 'ALL', value: 'ALL' },
    { label: 'THREAT ACTORS', value: 'THREAT_ACTOR' },
    { label: 'DOMAINS', value: 'DOMAIN' },
    { label: 'IPS', value: 'IP' },
    { label: 'MALWARE', value: 'MALWARE' },
    { label: 'VULNERABILITIES', value: 'VULNERABILITY' },
    { label: 'ORGANIZATIONS', value: 'ORGANIZATION' }
  ];

  const getEntityIcon = (type: EntityType) => {
    switch (type) {
      case 'THREAT_ACTOR':
        return <Skull className="w-4 h-4 text-rose-400" />;
      case 'DOMAIN':
        return <Globe className="w-4 h-4 text-cyan-400" />;
      case 'IP':
        return <Server className="w-4 h-4 text-blue-400" />;
      case 'MALWARE':
        return <Bug className="w-4 h-4 text-red-400" />;
      case 'VULNERABILITY':
        return <ShieldAlert className="w-4 h-4 text-amber-400" />;
      case 'ORGANIZATION':
        return <Building className="w-4 h-4 text-purple-400" />;
      default:
        return <Users className="w-4 h-4 text-slate-400" />;
    }
  };

  const handleEntityClick = (entity: Entity) => {
    setSelectedEntity(entity);
    setIsEntityDrawerOpen(true);
  };

  const filteredEntities = entities.filter((e) => {
    if (activeFilter !== 'ALL' && e.type !== activeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return e.name.toLowerCase().includes(q) || 
             e.description.toLowerCase().includes(q) ||
             e.tags.some(t => t.toLowerCase().includes(q));
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-xl bg-[#0d121d] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            <h1 className="text-lg font-bold text-slate-100 font-mono tracking-tight">
              Entity Intelligence Explorer
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Aggregated threat actors, infrastructure, malware implants, and vulnerability nodes.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="px-2.5 py-1 rounded bg-[#080b12] border border-slate-800">
            Total Entities: <strong className="text-cyan-300">{entities.length}</strong>
          </span>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="glass-panel p-4 rounded-xl border border-slate-800 bg-[#0d121d] space-y-4">
        <div className="flex flex-wrap gap-1 border-b border-slate-800 pb-3">
          {typeTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveFilter(tab.value)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${
                activeFilter === tab.value
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search entity by name, campaign, actor alias, or CVE..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#080b12] border border-slate-800 font-mono text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>
      </div>

      {/* Entity Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEntities.map((entity) => (
          <div
            key={entity.id}
            onClick={() => handleEntityClick(entity)}
            className="glass-panel p-5 rounded-xl border border-slate-800 bg-[#0d121d] hover:border-cyan-500/40 hover:bg-[#0f1524] transition-all cursor-pointer flex flex-col justify-between group shadow-sm"
          >
            <div>
              {/* Card Top */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-[#080b12] border border-slate-800">
                    {getEntityIcon(entity.type)}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase">
                      {entity.type.replace('_', ' ')}
                    </span>
                    <h3 className="text-xs font-mono font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                      {entity.name}
                    </h3>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                    entity.riskScore >= 80 ? 'text-red-400 bg-red-950/40 border-red-500/40' :
                    entity.riskScore >= 60 ? 'text-amber-400 bg-amber-950/40 border-amber-500/40' :
                    'text-blue-400 bg-blue-950/40 border-blue-500/40'
                  }`}>
                    RISK {entity.riskScore}
                  </span>
                  <div className="text-[9px] font-mono text-slate-500 mt-1">
                    {entity.confidence}% CONF
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 my-3">
                {entity.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {entity.tags.slice(0, 3).map((tag, i) => (
                  <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700">
                    {tag}
                  </span>
                ))}
                {entity.tags.length > 3 && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 text-slate-500">
                    +{entity.tags.length - 3}
                  </span>
                )}
              </div>
            </div>

            {/* Bottom Meta */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1 text-slate-500">
                <GitMerge className="w-3 h-3 text-cyan-400" />
                <span>{entity.relationships.length} Relationships</span>
              </span>

              <span className="flex items-center gap-1 text-cyan-400 group-hover:translate-x-0.5 transition-transform text-xs font-semibold">
                <span>Inspect</span>
                <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Intelligence Drawer Component */}
      <EntityDrawer />
    </div>
  );
}
