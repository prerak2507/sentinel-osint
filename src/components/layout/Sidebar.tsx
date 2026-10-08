'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useIntelligence } from '@/context/IntelligenceContext';
import { 
  ShieldAlert, 
  Terminal, 
  Database, 
  Users, 
  Radio, 
  Clock, 
  FileText, 
  Bell, 
  Settings, 
  Activity, 
  LayoutDashboard, 
  Sparkles,
  ChevronRight,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

interface SidebarProps {
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

export function Sidebar({ mobileOpen, setMobileOpen }: SidebarProps) {
  const pathname = usePathname();
  const { alerts, loadDemoInvestigation } = useIntelligence();

  const unreadAlertsCount = alerts.filter(a => !a.acknowledged).length;

  const navItems = [
    { label: 'Overview', href: '/app', icon: LayoutDashboard },
    { label: 'Investigate', href: '/app/investigate', icon: Terminal, badge: 'ACTIVE' },
    { label: 'Threats', href: '/app/threats', icon: ShieldAlert },
    { label: 'Entities', href: '/app/entities', icon: Users },
    { label: 'IOCs', href: '/app/iocs', icon: Database },
    { label: 'Sources', href: '/app/sources', icon: Radio },
    { label: 'Timeline', href: '/app/timeline', icon: Clock },
    { label: 'Reports', href: '/app/reports', icon: FileText },
    { 
      label: 'Alerts', 
      href: '/app/alerts', 
      icon: Bell, 
      count: unreadAlertsCount > 0 ? unreadAlertsCount : undefined,
      countVariant: 'destructive' as const
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen?.(false)}
        />
      )}

      <aside className={`
        fixed lg:static top-0 bottom-0 left-0 z-40
        w-64 bg-[#0a0d14] border-r border-slate-800/80 flex flex-col justify-between
        transition-transform duration-200 ease-in-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Top: Logo & Platform Identity */}
        <div>
          <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800/80 bg-[#07090e]">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400/80 transition-colors shadow-[0_0_12px_rgba(6,182,212,0.15)]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="font-semibold text-sm tracking-wider text-slate-100 font-mono">
                  SENTINEL<span className="text-cyan-400">OSINT</span>
                </span>
                <span className="block text-[9px] uppercase tracking-widest text-slate-500 font-mono">
                  Threat Intel Unit
                </span>
              </div>
            </Link>
          </div>

          {/* Quick Demo Trigger Button */}
          <div className="p-3 border-b border-slate-800/60">
            <button
              onClick={() => {
                loadDemoInvestigation();
                setMobileOpen?.(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-md bg-cyan-950/30 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-900/40 text-xs font-medium transition-all group"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-12 transition-transform" />
                <span>Load Demo Case</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-900/50 text-cyan-200 border border-cyan-400/20">
                INV-1042
              </span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider font-mono">
              Investigation Workspace
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen?.(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                    isActive 
                      ? 'bg-blue-600/15 text-cyan-300 border border-cyan-500/30 shadow-sm' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'
                    }`} />
                    <span>{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {item.badge && (
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                        {item.badge}
                      </span>
                    )}
                    {item.count !== undefined && (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 font-semibold">
                        {item.count}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: System Engine Status & User Profile */}
        <div className="p-3 border-t border-slate-800/80 bg-[#07090e]/70 space-y-3">
          {/* Live Engine Status indicator */}
          <div className="p-2.5 rounded-lg bg-[#0d121d] border border-slate-800">
            <div className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                <span className="font-mono text-slate-300 font-medium">ENGINE ONLINE</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">8 FEEDS</span>
            </div>
            <div className="mt-1 text-[10px] text-slate-400 flex items-center justify-between">
              <span>Correlation Rate</span>
              <span className="font-mono text-cyan-400">1.42k sig/s</span>
            </div>
          </div>

          {/* Settings and Profile */}
          <div className="flex items-center justify-between pt-1">
            <Link 
              href="/app/settings"
              onClick={() => setMobileOpen?.(false)}
              className="flex items-center gap-2 px-2 py-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              <Settings className="w-3.5 h-3.5 text-slate-500" />
              <span>Settings</span>
            </Link>

            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-[10px] font-mono text-blue-300 font-bold">
                SOC
              </div>
              <span className="text-[11px] font-mono text-slate-400">Analyst</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
