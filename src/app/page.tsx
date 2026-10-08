'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { HeroPipelineVisual } from '@/components/landing/HeroPipelineVisual';
import { EngineInitModal } from '@/components/landing/EngineInitModal';
import { 
  ShieldCheck, 
  Terminal, 
  Radio, 
  Filter, 
  GitMerge, 
  ShieldAlert, 
  FileText, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Database, 
  Users, 
  Layers, 
  Clock, 
  Network,
  AlertTriangle,
  ChevronRight,
  ExternalLink,
  Globe,
  Server,
  Lock,
  Skull,
  Bug,
  Cpu
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const [isInitModalOpen, setIsInitModalOpen] = useState(false);
  const [activeStepHover, setActiveStepHover] = useState<number | null>(null);
  const [selectedGraphNode, setSelectedGraphNode] = useState<{
    id: string;
    label: string;
    type: string;
    risk: number;
    details: string;
  }>({
    id: 'apt',
    label: 'Vanguard Spider (UNC3886)',
    type: 'APT Group / Threat Actor',
    risk: 95,
    details: 'Espionage actor specializing in weaponized perimeter exploitation, zero-day staging, and stealth memory injection.'
  });

  const pipelineSteps = [
    {
      num: '01',
      title: 'COLLECT',
      icon: Radio,
      summary: 'Automated streaming from 8+ public feeds',
      details: 'Continuously queries AlienVault OTX, CISA KEV, URLHaus, ShadowServer, and passive DNS telemetry without human latency.',
      stats: '1,420 sig/s ingest'
    },
    {
      num: '02',
      title: 'NORMALIZE',
      icon: Filter,
      summary: 'Deduplication & schema alignment',
      details: 'Converts disparate raw JSON and syslog formats into unified STIX 2.1 / RFC compliant indicators with entropy scoring.',
      stats: '68% noise reduction'
    },
    {
      num: '03',
      title: 'CORRELATE',
      icon: GitMerge,
      summary: 'Entity & infrastructure resolution',
      details: 'Connects IP addresses, domains, TLS JA3 hashes, CVE advisories, and malware loaders into a persistent multi-dimensional graph.',
      stats: '1,284 graph vertices'
    },
    {
      num: '04',
      title: 'SCORE',
      icon: ShieldAlert,
      summary: 'Transparent multi-factor risk index',
      details: 'Combines source consensus, reputation history, graph centrality, and recency into an explainable 0-100 risk score.',
      stats: '82/100 Composite Risk'
    },
    {
      num: '05',
      title: 'REPORT',
      icon: FileText,
      summary: 'Actionable SOC defense briefs',
      details: 'Generates instant executive briefings, technical indicator feeds, firewall rules, and SIEM hunting queries.',
      stats: 'Instant PDF & JSON'
    }
  ];

  const sourceCards = [
    { name: 'Threat Feeds', type: 'AlienVault OTX & MISP', status: 'Connected', sync: '2m ago', records: '18,429', reliability: '92%' },
    { name: 'Security Advisories', type: 'CISA KEV Directives', status: 'Connected', sync: '12m ago', records: '1,240', reliability: '98%' },
    { name: 'Public APIs', type: 'VirusTotal & AbuseIPDB', status: 'Connected', sync: '1m ago', records: '890,210', reliability: '96%' },
    { name: 'News & Disclosures', type: 'Vulnerability Bulletins', status: 'Connected', sync: '15m ago', records: '42,100', reliability: '88%' },
    { name: 'Domain Intelligence', type: 'Passive DNS & WHOIS', status: 'Connected', sync: '4m ago', records: '421,900', reliability: '95%' },
    { name: 'IP Intelligence', type: 'Shodan Port Explorer', status: 'Connected', sync: '8m ago', records: '520,000', reliability: '93%' },
    { name: 'Code Repositories', type: 'PoC Exploit Trackers', status: 'Connected', sync: '30m ago', records: '9,840', reliability: '91%' },
    { name: 'Malware Feeds', type: 'URLHaus Payload Stagers', status: 'Connected', sync: '6m ago', records: '64,120', reliability: '94%' },
  ];

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 h-16 bg-[#07090e]/85 backdrop-blur-md border-b border-slate-800/80 px-6 lg:px-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.15)]">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="font-mono">
            <span className="font-semibold text-sm tracking-wider text-slate-100">
              SENTINEL<span className="text-cyan-400">OSINT</span>
            </span>
          </div>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-6 text-xs font-mono text-slate-400">
          <a href="#problem" className="hover:text-cyan-300 transition-colors">Problem</a>
          <a href="#pipeline" className="hover:text-cyan-300 transition-colors">Pipeline</a>
          <a href="#sources" className="hover:text-cyan-300 transition-colors">Sources</a>
          <a href="#graph" className="hover:text-cyan-300 transition-colors">Threat Graph</a>
          <a href="#threats" className="hover:text-cyan-300 transition-colors">Detections</a>
          <a href="#reports" className="hover:text-cyan-300 transition-colors">Reports</a>
        </div>

        {/* Primary CTA */}
        <div className="flex items-center gap-3">
          <Link
            href="/app"
            className="text-xs font-mono text-slate-400 hover:text-slate-200 px-3 py-1.5 transition-colors hidden sm:block"
          >
            Analyst Console
          </Link>

          <button
            onClick={() => setIsInitModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-semibold transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:scale-102"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Launch Investigation</span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 lg:px-12 max-w-7xl mx-auto flex flex-col items-center text-center relative">
        {/* Status Indicator */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-6 shadow-inner animate-subtle-pulse">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>● LIVE INTELLIGENCE ENGINE</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">v2.4 TELEMETRY GRID</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-100 max-w-4xl leading-[1.15]">
          Turn Open-Source Noise Into <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
            Actionable Intelligence.
          </span>
        </h1>

        {/* Supporting text */}
        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
          Automate collection, correlation and analysis of public threat intelligence from a single investigation workspace.
        </p>

        {/* Action CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => setIsInitModalOpen(true)}
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono text-sm font-semibold transition-all shadow-[0_0_30px_rgba(6,182,212,0.35)] hover:scale-102"
          >
            <Terminal className="w-4 h-4" />
            <span>Launch Investigation</span>
          </button>

          <Link
            href="/app"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-mono text-sm font-medium transition-all"
          >
            <span>Explore Intelligence</span>
            <ArrowRight className="w-4 h-4 text-cyan-400" />
          </Link>
        </div>

        {/* Interactive Intelligence Visualization */}
        <div className="mt-14 w-full">
          <HeroPipelineVisual />
        </div>
      </section>

      {/* SECTION 1 — THE PROBLEM */}
      <section id="problem" className="py-24 px-6 lg:px-12 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-mono text-rose-400 uppercase tracking-wider mb-2">
            The Industry Challenge
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-100 font-sans">
            Threat intelligence is everywhere. <br />
            <span className="text-slate-400">Actionable intelligence isn't.</span>
          </h2>
          <p className="mt-4 text-sm text-slate-400">
            Security analysts manually sift through isolated repositories, feeds, and forums. Noise obscures the critical kill-chain.
          </p>
        </div>

        {/* Fragmented cards grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-10">
          {[
            { name: 'News & Media', desc: 'Disorganized public press reports' },
            { name: 'Domains', desc: 'Fast-flux dynamic registrations' },
            { name: 'IP Addresses', desc: 'Anonymous bulletproof routing' },
            { name: 'Security Advisories', desc: 'Vendor patches & CVE dumps' },
            { name: 'Underground Forums', desc: 'Noisy credential chatter' },
            { name: 'Public Reports', desc: 'Static PDFs with obsolete indicators' },
            { name: 'Code Repositories', desc: 'Raw unverified proof-of-concepts' },
            { name: 'Threat Feeds', desc: 'Uncorrelated high-volume JSON streams' }
          ].map((item, idx) => (
            <div 
              key={idx}
              className="p-4 rounded-xl bg-[#0c101a] border border-slate-800 text-left space-y-1 hover:border-slate-700 transition-all"
            >
              <div className="text-xs font-mono font-semibold text-slate-200">{item.name}</div>
              <div className="text-[11px] text-slate-500 leading-snug">{item.desc}</div>
            </div>
          ))}
        </div>

        {/* Visual Workflow Transformation */}
        <div className="p-6 rounded-2xl bg-[#090d16] border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 font-mono text-xs">
          <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 text-red-300 text-center flex-1 w-full">
            <span className="text-[10px] uppercase text-red-400 font-bold block mb-1">Status Quo</span>
            <div className="font-semibold text-sm">Fragmented Raw Data</div>
            <div className="text-[11px] text-slate-400 mt-1">Siloed indicators, redundant false positives</div>
          </div>

          <div className="text-slate-600 font-bold hidden md:block">→</div>

          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-300 text-center flex-1 w-full">
            <span className="text-[10px] uppercase text-amber-400 font-bold block mb-1">The Vulnerability</span>
            <div className="font-semibold text-sm">Correlation Gap</div>
            <div className="text-[11px] text-slate-400 mt-1">Inability to connect IP to domain, loader, and actor</div>
          </div>

          <div className="text-slate-600 font-bold hidden md:block">→</div>

          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/50 text-rose-300 text-center flex-1 w-full">
            <span className="text-[10px] uppercase text-rose-400 font-bold block mb-1">Catastrophic Impact</span>
            <div className="font-semibold text-sm">Missed Active Threat</div>
            <div className="text-[11px] text-slate-400 mt-1">Breach proceeds before manual triage completes</div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — HOW SENTINELOSINT WORKS */}
      <section id="pipeline" className="py-24 px-6 lg:px-12 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2">
            The Autonomous Engine
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-100">
            Horizontal Intelligence Pipeline
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            How SentinelOSINT unifies public intelligence from ingestion to actionable defense. Hover each stage to inspect.
          </p>
        </div>

        {/* 5-Step Horizontal Pipeline */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
          {pipelineSteps.map((step, idx) => {
            const Icon = step.icon;
            const isHovered = activeStepHover === idx;

            return (
              <div
                key={step.num}
                onMouseEnter={() => setActiveStepHover(idx)}
                onMouseLeave={() => setActiveStepHover(null)}
                className={`p-5 rounded-xl border transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                  isHovered 
                    ? 'border-cyan-400/80 bg-cyan-950/20 shadow-[0_0_20px_rgba(6,182,212,0.2)] -translate-y-1'
                    : 'border-slate-800 bg-[#0d121d] hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-3">
                    <span className="text-cyan-400 font-bold">STEP {step.num}</span>
                    <Icon className="w-4 h-4 text-slate-400" />
                  </div>

                  <h3 className="text-base font-bold font-mono text-slate-100 mb-1">
                    {step.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    {step.summary}
                  </p>

                  {/* Expanded Hover Details */}
                  <div className={`mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-slate-300 leading-relaxed transition-opacity duration-200 ${
                    isHovered ? 'opacity-100 block' : 'opacity-70'
                  }`}>
                    {step.details}
                  </div>
                </div>

                <div className="mt-4 pt-2.5 border-t border-slate-800/80 text-[10px] font-mono text-cyan-300 flex items-center justify-between">
                  <span>METRIC:</span>
                  <span className="font-bold">{step.stats}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 3 — INTELLIGENCE SOURCES */}
      <section id="sources" className="py-24 px-6 lg:px-12 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2">
              Ingestion Grid
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-100">
              Verified Public Intelligence Sources
            </h2>
          </div>
          <Link
            href="/app/sources"
            className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300"
          >
            <span>Manage Source Collectors</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {sourceCards.map((src, i) => (
            <div
              key={i}
              className="glass-panel p-5 rounded-xl border border-slate-800 bg-[#0d121d] hover:border-slate-700 transition-all font-mono space-y-3"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-100">{src.name}</span>
                <span className="px-1.5 py-0.2 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 text-[10px]">
                  {src.status}
                </span>
              </div>

              <div className="text-[11px] text-slate-400">{src.type}</div>

              <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[10px] text-slate-400">
                <div>
                  <span className="text-slate-500 block">SYNC:</span>
                  <span className="text-slate-300 font-semibold">{src.sync}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">RECORDS:</span>
                  <span className="text-cyan-400 font-semibold">{src.records}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4 — INTELLIGENCE GRAPH */}
      <section id="graph" className="py-24 px-6 lg:px-12 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2">
            Multi-Dimensional Telemetry
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-100">
            Interactive Relationship Graph
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            Click any node below to inspect real-time correlation telemetry and attribution indicators.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Interactive Graph Display */}
          <div className="lg:col-span-8 glass-panel p-6 rounded-2xl border border-slate-800 bg-[#090d16] min-h-[420px] flex flex-col justify-between relative overflow-hidden font-mono">
            {/* Ambient nodes layout */}
            <div className="grid grid-cols-3 gap-4 my-auto">
              <button
                onClick={() => setSelectedGraphNode({
                  id: 'apt',
                  label: 'Vanguard Spider (UNC3886)',
                  type: 'Threat Actor',
                  risk: 95,
                  details: 'Financially motivated APT group linked to weaponized perimeter appliances and custom GhostShell loaders.'
                })}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedGraphNode.id === 'apt'
                    ? 'border-red-500 bg-red-950/40 text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                    : 'border-slate-800 bg-[#070a10] text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>THREAT ACTOR</span>
                  <span className="text-red-400 font-bold">95</span>
                </div>
                <div className="text-xs font-bold text-slate-100 mt-1">Vanguard Spider</div>
              </button>

              <button
                onClick={() => setSelectedGraphNode({
                  id: 'domain',
                  label: 'suspicious-domain.example',
                  type: 'Domain Indicator',
                  risk: 82,
                  details: 'Primary ingress domain utilizing fast-flux DNS A-Record rotation across Seychelles ASN49301.'
                })}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedGraphNode.id === 'domain'
                    ? 'border-cyan-400 bg-cyan-950/40 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                    : 'border-slate-800 bg-[#070a10] text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>DOMAIN</span>
                  <span className="text-amber-400 font-bold">82</span>
                </div>
                <div className="text-xs font-bold text-slate-100 mt-1 truncate">suspicious-domain</div>
              </button>

              <button
                onClick={() => setSelectedGraphNode({
                  id: 'cve',
                  label: 'CVE-2024-38077 (MadLicense)',
                  type: 'Vulnerability Node',
                  risk: 98,
                  details: 'Critical CVSS 9.8 unauthenticated Remote Code Execution in Microsoft Windows Remote Desktop Licensing.'
                })}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedGraphNode.id === 'cve'
                    ? 'border-orange-500 bg-orange-950/40 text-orange-300 shadow-[0_0_15px_rgba(249,115,22,0.3)]'
                    : 'border-slate-800 bg-[#070a10] text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>VULNERABILITY</span>
                  <span className="text-rose-400 font-bold">98</span>
                </div>
                <div className="text-xs font-bold text-slate-100 mt-1">CVE-2024-38077</div>
              </button>

              <button
                onClick={() => setSelectedGraphNode({
                  id: 'ip',
                  label: '185.220.101.45',
                  type: 'IP Indicator (Bulletproof Host)',
                  risk: 91,
                  details: 'Origin server transmitting exploit probe packets against enterprise port 3389.'
                })}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedGraphNode.id === 'ip'
                    ? 'border-blue-500 bg-blue-950/40 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                    : 'border-slate-800 bg-[#070a10] text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>IP ADDRESS</span>
                  <span className="text-rose-400 font-bold">91</span>
                </div>
                <div className="text-xs font-bold text-slate-100 mt-1">185.220.101.45</div>
              </button>

              <button
                onClick={() => setSelectedGraphNode({
                  id: 'malware',
                  label: 'GhostShell C2 Framework v3.4',
                  type: 'Malware Family',
                  risk: 93,
                  details: 'Polymorphic memory injector featuring AMSI bypass and inverted HTTP POST beaconing.'
                })}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedGraphNode.id === 'malware'
                    ? 'border-red-500 bg-red-950/40 text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                    : 'border-slate-800 bg-[#070a10] text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>MALWARE</span>
                  <span className="text-rose-400 font-bold">93</span>
                </div>
                <div className="text-xs font-bold text-slate-100 mt-1">GhostShell C2</div>
              </button>

              <button
                onClick={() => setSelectedGraphNode({
                  id: 'cert',
                  label: 'Let’s Encrypt Wildcard SSL',
                  type: 'TLS Certificate',
                  risk: 85,
                  details: 'JA3S fingerprint e7d705a328 matches C2 beacon TLS profiles observed in AlienVault OTX.'
                })}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedGraphNode.id === 'cert'
                    ? 'border-amber-500 bg-amber-950/40 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                    : 'border-slate-800 bg-[#070a10] text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>CERTIFICATE</span>
                  <span className="text-amber-400 font-bold">85</span>
                </div>
                <div className="text-xs font-bold text-slate-100 mt-1 truncate">*.suspicious-domain</div>
              </button>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
              <span>Interactive network topology demo</span>
              <span className="text-cyan-400">8 correlated entities</span>
            </div>
          </div>

          {/* Node Detail Inspector Box */}
          <div className="lg:col-span-4 glass-panel p-6 rounded-2xl border border-slate-800 bg-[#0d121d] space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-[10px] uppercase text-cyan-400 font-semibold tracking-wider">
                Graph Inspector
              </span>
              <span className="px-2 py-0.5 rounded bg-rose-950/60 text-rose-400 border border-rose-500/30 font-bold">
                RISK {selectedGraphNode.risk}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 uppercase">{selectedGraphNode.type}</span>
              <h3 className="text-sm font-bold text-slate-100 mt-0.5 break-all">
                {selectedGraphNode.label}
              </h3>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-sans bg-[#080b12] p-3 rounded-lg border border-slate-800">
              {selectedGraphNode.details}
            </p>

            <button
              onClick={() => setIsInitModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition-all shadow-sm"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Pivot to Workspace</span>
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 5 — THREAT DETECTION */}
      <section id="threats" className="py-24 px-6 lg:px-12 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-mono text-rose-400 uppercase tracking-wider mb-2">
            Automated Triage Matrix
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-100">
            Real-time Threat Detection
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            Synthesized alerts prioritized by severity, confidence, and source consensus.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              severity: 'CRITICAL',
              title: 'Suspicious Infrastructure Detected',
              desc: 'Correlated multi-region C2 cluster utilizing bulletproof hostings in Seychelles and Amsterdam.',
              confidence: '91%',
              firstSeen: '2026-09-28',
              lastSeen: '2026-10-04',
              sources: 14,
              entities: 8,
              border: 'border-red-500/30'
            },
            {
              severity: 'HIGH',
              title: 'Domain Linked to Malicious Infrastructure',
              desc: 'JA3 TLS fingerprint and certificate metadata correlates with Vanguard Spider espionage campaigns.',
              confidence: '84%',
              firstSeen: '2026-09-19',
              lastSeen: '2026-10-03',
              sources: 9,
              entities: 6,
              border: 'border-amber-500/30'
            },
            {
              severity: 'MEDIUM',
              title: 'Potential Phishing Infrastructure',
              desc: 'Automated reverse-proxy credential harvesting kits clone multi-factor authentication portals.',
              confidence: '76%',
              firstSeen: '2026-09-24',
              lastSeen: '2026-10-02',
              sources: 6,
              entities: 4,
              border: 'border-blue-500/30'
            },
            {
              severity: 'LOW',
              title: 'Unverified Suspicious Indicator',
              desc: 'High TTL rotation across residential proxy IP ranges, currently undergoing passive anomaly collection.',
              confidence: '62%',
              firstSeen: '2026-09-26',
              lastSeen: '2026-10-01',
              sources: 4,
              entities: 3,
              border: 'border-emerald-500/30'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className={`glass-panel p-5 rounded-xl border ${item.border} bg-[#0d121d] flex flex-col justify-between space-y-4`}
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className={`px-2 py-0.5 rounded font-bold ${
                    item.severity === 'CRITICAL' ? 'bg-red-950/60 text-red-400 border border-red-500/40' :
                    item.severity === 'HIGH' ? 'bg-amber-950/60 text-amber-400 border border-amber-500/40' :
                    item.severity === 'MEDIUM' ? 'bg-blue-950/60 text-blue-400 border border-blue-500/40' :
                    'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40'
                  }`}>
                    {item.severity}
                  </span>
                  <span className="text-slate-400 font-mono">CONFIDENCE {item.confidence}</span>
                </div>

                <h3 className="text-sm font-mono font-bold text-slate-100">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 grid grid-cols-4 gap-2 text-[10px] font-mono text-center">
                <div className="p-1 rounded bg-[#080b12] border border-slate-800">
                  <span className="text-slate-500 block">FIRST SEEN</span>
                  <span className="text-slate-300 font-semibold">{item.firstSeen}</span>
                </div>
                <div className="p-1 rounded bg-[#080b12] border border-slate-800">
                  <span className="text-slate-500 block">LAST SEEN</span>
                  <span className="text-cyan-300 font-semibold">{item.lastSeen}</span>
                </div>
                <div className="p-1 rounded bg-[#080b12] border border-slate-800">
                  <span className="text-slate-500 block">SOURCES</span>
                  <span className="text-blue-400 font-semibold">{item.sources}</span>
                </div>
                <div className="p-1 rounded bg-[#080b12] border border-slate-800">
                  <span className="text-slate-500 block">ENTITIES</span>
                  <span className="text-purple-400 font-semibold">{item.entities}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 6 — REPORT GENERATION */}
      <section id="reports" className="py-24 px-6 lg:px-12 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2">
            Actionable Communication
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-100">
            One-Click Intelligence Reports
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            Generate executive briefings and technical defense playbooks ready for SOC containment.
          </p>
        </div>

        {/* Realistic Report Preview Card */}
        <div className="max-w-3xl mx-auto glass-panel p-6 sm:p-8 rounded-2xl border border-slate-700 bg-[#0d121d] space-y-6 font-mono shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] text-amber-400 font-bold px-2 py-0.5 rounded bg-amber-950/60 border border-amber-500/40">
                TLP:AMBER
              </span>
              <h3 className="text-base font-bold text-slate-100 mt-2">
                THREAT INTELLIGENCE REPORT
              </h3>
              <p className="text-xs text-slate-400">Case: Suspicious Infrastructure Investigation (INV-2026-1042)</p>
            </div>

            <div className="text-right shrink-0">
              <span className="text-rose-400 font-bold text-sm block">RISK: HIGH (82/100)</span>
              <span className="text-[11px] text-emerald-400">Confidence: 89%</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center text-xs">
            <div className="p-2.5 rounded-lg bg-[#080b12] border border-slate-800">
              <span className="text-slate-500 text-[10px] block">ENTITIES</span>
              <span className="text-purple-400 font-bold text-sm mt-0.5 block">12</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#080b12] border border-slate-800">
              <span className="text-slate-500 text-[10px] block">INDICATORS</span>
              <span className="text-cyan-400 font-bold text-sm mt-0.5 block">31</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#080b12] border border-slate-800">
              <span className="text-slate-500 text-[10px] block">SOURCES</span>
              <span className="text-blue-400 font-bold text-sm mt-0.5 block">8</span>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-sans bg-[#080b12] p-4 rounded-lg border border-slate-800">
            "SentinelOSINT has correlated open-source intelligence from 8 independent threat streams to uncover an active infrastructure staging cluster attributed to Vanguard Spider. Urgent perimeter blocklist deployment is advised."
          </p>

          <div className="pt-2 flex justify-center">
            <Link
              href="/app/reports"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-semibold transition-all shadow-md"
            >
              <FileText className="w-4 h-4" />
              <span>Generate Intelligence Report</span>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 7 — FINAL CTA */}
      <section className="py-24 px-6 lg:px-12 max-w-5xl mx-auto border-t border-slate-800/80 text-center space-y-6">
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-100">
          Investigate faster. <br />
          Correlate smarter. <br />
          <span className="text-cyan-400">Respond earlier.</span>
        </h2>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Deploy SentinelOSINT to transform fragmented public threat telemetry into cohesive defense operations.
        </p>
        <div className="pt-4">
          <button
            onClick={() => setIsInitModalOpen(true)}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-mono text-sm font-bold transition-all shadow-[0_0_35px_rgba(6,182,212,0.4)] hover:scale-102"
          >
            <Terminal className="w-4 h-4" />
            <span>Launch SentinelOSINT</span>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 px-6 lg:px-12 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-300 font-semibold">SentinelOSINT</span>
          <span>— From Open Data to Actionable Intelligence.</span>
        </div>
        <div>SOC-Grade Defensive Cyber Intelligence Architecture v2.4</div>
      </footer>

      {/* Cinematic Engine Initialization Modal */}
      <EngineInitModal 
        isOpen={isInitModalOpen} 
        onComplete={() => setIsInitModalOpen(false)} 
      />
    </div>
  );
}
