'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useIntelligence } from '@/context/IntelligenceContext';
import { 
  Search, 
  Bell, 
  Menu, 
  Sparkles, 
  FileText, 
  ChevronRight, 
  ShieldAlert,
  Terminal,
  Activity
} from 'lucide-react';

interface TopHeaderProps {
  onMenuToggle: () => void;
}

export function TopHeader({ onMenuToggle }: TopHeaderProps) {
  const pathname = usePathname();
  const { 
    investigation, 
    alerts, 
    setIsCommandPaletteOpen, 
    loadDemoInvestigation 
  } = useIntelligence();

  const unreadAlerts = alerts.filter(a => !a.acknowledged).length;

  const getBreadcrumbTitle = () => {
    switch (pathname) {
      case '/app':
        return 'Threat Intelligence Overview';
      case '/app/investigate':
        return 'Investigation Workspace';
      case '/app/threats':
        return 'Threat Matrix';
      case '/app/entities':
        return 'Entity Explorer';
      case '/app/iocs':
        return 'Indicators of Compromise';
      case '/app/sources':
        return 'OSINT Feeds & Collectors';
      case '/app/timeline':
        return 'Threat Timeline';
      case '/app/reports':
        return 'Intelligence Reports';
      case '/app/alerts':
        return 'Security Alerts';
      case '/app/settings':
        return 'Platform Settings';
      default:
        return 'OSINT Station';
    }
  };

  return (
    <header className="h-16 bg-[#0a0d14]/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Mobile hamburger & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="p-2 -ml-2 text-slate-400 hover:text-slate-200 lg:hidden rounded-lg hover:bg-slate-800/50"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-mono hidden sm:inline">SENTINEL</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600 hidden sm:inline" />
          <span className="font-semibold text-slate-200 tracking-wide">
            {getBreadcrumbTitle()}
          </span>
          {investigation && pathname === '/app/investigate' && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="font-mono text-cyan-400 font-medium px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-500/20 text-[11px]">
                {investigation.id}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Center: Command Palette Trigger */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-lg bg-[#0e1422] border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-300 text-xs transition-all shadow-inner group"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
            <span className="font-mono text-[11px] text-slate-400">Search IOC, domain, hash, or actor...</span>
          </div>
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-slate-800/80 border border-slate-700 text-slate-400">
              ⌘K
            </kbd>
          </div>
        </button>
      </div>

      {/* Right: Actions, Quick Alerts, Report CTA */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="p-2 text-slate-400 hover:text-slate-200 md:hidden rounded-lg hover:bg-slate-800/50"
          aria-label="Search"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Active Investigation Context pill */}
        <Link 
          href="/app/investigate"
          className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs"
        >
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          <span className="text-[11px] font-mono text-slate-400">CASE:</span>
          <span className="text-[11px] font-mono font-medium text-slate-200">
            {investigation.id}
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-400 font-semibold border border-rose-500/30">
            RISK {investigation.riskScore}
          </span>
        </Link>

        {/* Alerts Bell */}
        <Link
          href="/app/alerts"
          className="relative p-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800/50 transition-colors"
          aria-label="Alerts"
        >
          <Bell className="w-4 h-4" />
          {unreadAlerts > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-[#0a0d14]" />
          )}
        </Link>

        {/* Generate Report Link */}
        <Link
          href="/app/reports"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 text-xs font-medium transition-all shadow-sm"
        >
          <FileText className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden sm:inline">Report</span>
        </Link>
      </div>
    </header>
  );
}
