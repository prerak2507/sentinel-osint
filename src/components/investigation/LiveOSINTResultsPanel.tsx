'use client';

import React from 'react';
import type { UnifiedOSINTResult } from '@/lib/osint-services';
import {
  Globe,
  Server,
  ShieldAlert,
  MapPin,
  Clock,
  Database,
  Radio,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Bug,
  Lock,
  Wifi,
  Copy,
} from 'lucide-react';

interface LiveOSINTResultsPanelProps {
  result: UnifiedOSINTResult;
}

export function LiveOSINTResultsPanel({ result }: LiveOSINTResultsPanelProps) {
  const { query, type, sources, riskScore, confidence, severity, summary, geoLocation, shodan, cve, dns, rdap, urlhaus, reverseDns } = result;

  const getSeverityColor = (sev: string) => {
    switch (sev) {
      case 'CRITICAL': return 'text-red-400 bg-red-500/10 border-red-500/25';
      case 'HIGH': return 'text-amber-400 bg-amber-500/10 border-amber-500/25';
      case 'MEDIUM': return 'text-blue-400 bg-blue-500/10 border-blue-500/25';
      case 'LOW': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/25';
    }
  };

  return (
    <div className="space-y-4">
      {/* Live Intelligence Header Badge */}
      <div className="flex items-center gap-2 text-[10px] font-mono">
        <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          LIVE DATA
        </span>
        <span className="text-slate-500">{sources.length} real OSINT feeds queried</span>
      </div>

      {/* Primary Risk Overview */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-3 rounded-lg bg-[#080b12] border border-white/[0.05]">
          <span className="text-[9px] font-mono text-slate-500 uppercase">Risk Score</span>
          <div className={`text-xl font-bold font-mono mt-0.5 ${
            riskScore >= 80 ? 'text-red-400' : riskScore >= 60 ? 'text-amber-400' : riskScore >= 40 ? 'text-blue-400' : 'text-emerald-400'
          }`}>
            {riskScore}<span className="text-xs text-slate-600 font-normal">/100</span>
          </div>
        </div>
        <div className="p-3 rounded-lg bg-[#080b12] border border-white/[0.05]">
          <span className="text-[9px] font-mono text-slate-500 uppercase">Severity</span>
          <div className={`text-sm font-bold font-mono mt-1 px-2 py-0.5 rounded inline-block border ${getSeverityColor(severity)}`}>
            {severity}
          </div>
        </div>
        <div className="p-3 rounded-lg bg-[#080b12] border border-white/[0.05]">
          <span className="text-[9px] font-mono text-slate-500 uppercase">Confidence</span>
          <div className="text-xl font-bold font-mono text-cyan-400 mt-0.5">
            {confidence}<span className="text-xs text-slate-600 font-normal">%</span>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="p-3 rounded-lg bg-[#080b12] border border-white/[0.05]">
        <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
          <Database className="w-3 h-3" />
          Intelligence Summary
        </div>
        <p className="text-xs text-slate-300 leading-relaxed font-sans">
          {summary}
        </p>
      </div>

      {/* Connected OSINT Sources */}
      <div>
        <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
          <Radio className="w-3 h-3 text-cyan-400" />
          Sources Queried ({sources.length})
        </div>
        <div className="flex flex-wrap gap-1">
          {sources.map((src, i) => (
            <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/8 text-cyan-300/80 border border-cyan-500/15">
              {src}
            </span>
          ))}
          {sources.length === 0 && (
            <span className="text-[10px] font-mono text-slate-600">No feeds returned data for this indicator</span>
          )}
        </div>
      </div>

      {/* Geolocation */}
      {geoLocation && (
        <div className="p-3 rounded-lg bg-[#080b12] border border-white/[0.05] space-y-2">
          <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-3 h-3" />
            Geolocation Intelligence
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div><span className="text-slate-500">Country:</span> <span className="text-slate-200">{geoLocation.country} ({geoLocation.countryCode})</span></div>
            <div><span className="text-slate-500">City:</span> <span className="text-slate-200">{geoLocation.city}, {geoLocation.regionName}</span></div>
            <div><span className="text-slate-500">ISP:</span> <span className="text-slate-200">{geoLocation.isp}</span></div>
            <div><span className="text-slate-500">ASN:</span> <span className="text-slate-200">{geoLocation.as}</span></div>
            <div><span className="text-slate-500">Org:</span> <span className="text-slate-200">{geoLocation.org}</span></div>
            <div><span className="text-slate-500">Coords:</span> <span className="text-slate-200">{geoLocation.lat}, {geoLocation.lon}</span></div>
          </div>
        </div>
      )}

      {/* Shodan InternetDB */}
      {shodan && (
        <div className="p-3 rounded-lg bg-[#080b12] border border-white/[0.05] space-y-2">
          <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <Wifi className="w-3 h-3" />
            Shodan InternetDB
          </div>

          {shodan.ports && shodan.ports.length > 0 && (
            <div>
              <span className="text-[10px] font-mono text-slate-500">Open Ports ({shodan.ports.length}):</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {shodan.ports.map((p) => (
                  <span key={p} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 border border-white/[0.06]">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          )}

          {shodan.vulns && shodan.vulns.length > 0 && (
            <div>
              <span className="text-[10px] font-mono text-red-400 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Known Vulnerabilities ({shodan.vulns.length}):
              </span>
              <div className="flex flex-wrap gap-1 mt-1">
                {shodan.vulns.map((v) => (
                  <span key={v} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-500/10 text-red-300 border border-red-500/20">
                    {v}
                  </span>
                ))}
              </div>
            </div>
          )}

          {shodan.hostnames && shodan.hostnames.length > 0 && (
            <div>
              <span className="text-[10px] font-mono text-slate-500">Hostnames:</span>
              <div className="text-xs font-mono text-slate-300 mt-0.5">
                {shodan.hostnames.join(', ')}
              </div>
            </div>
          )}
        </div>
      )}

      {/* CVE Data */}
      {cve && (
        <div className="p-3 rounded-lg bg-[#080b12] border border-white/[0.05] space-y-2">
          <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-3 h-3" />
            CVE Intelligence
          </div>
          <div className="text-sm font-mono font-bold text-slate-100">{cve.id}</div>
          {(cve.cvss3 || cve.cvss) && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-slate-500">CVSS:</span>
              <span className={`text-sm font-bold font-mono ${
                (cve.cvss3 || cve.cvss || 0) >= 9 ? 'text-red-400' : (cve.cvss3 || cve.cvss || 0) >= 7 ? 'text-amber-400' : 'text-blue-400'
              }`}>
                {cve.cvss3 || cve.cvss}
              </span>
            </div>
          )}
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {cve.summary?.substring(0, 500)}
          </p>
          {cve.Published && (
            <div className="text-[10px] font-mono text-slate-500">
              Published: {new Date(cve.Published).toLocaleDateString()}
            </div>
          )}
          {cve.vulnerable_product && cve.vulnerable_product.length > 0 && (
            <div>
              <span className="text-[10px] font-mono text-slate-500">Affected Products ({Math.min(cve.vulnerable_product.length, 5)}):</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {cve.vulnerable_product.slice(0, 5).map((p, i) => (
                  <span key={i} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-white/[0.06] truncate max-w-[200px]">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* DNS Records */}
      {dns && dns.Answer && dns.Answer.length > 0 && (
        <div className="p-3 rounded-lg bg-[#080b12] border border-white/[0.05] space-y-2">
          <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <Globe className="w-3 h-3" />
            DNS Resolution (Cloudflare DoH)
          </div>
          <div className="space-y-1">
            {dns.Answer.map((rec, i) => (
              <div key={i} className="flex items-center justify-between text-xs font-mono p-1.5 rounded bg-black/30 border border-white/[0.03]">
                <span className="text-slate-200">{rec.data}</span>
                <span className="text-slate-500">TTL: {rec.TTL}s</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* URLHaus */}
      {urlhaus && urlhaus.urls && urlhaus.urls.length > 0 && (
        <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/15 space-y-2">
          <div className="text-[10px] font-mono text-red-400 uppercase tracking-wider flex items-center gap-1.5">
            <Bug className="w-3 h-3" />
            URLHaus Malware Intelligence ({urlhaus.urls.length} URLs)
          </div>
          <div className="space-y-1.5">
            {urlhaus.urls.slice(0, 5).map((u, i) => (
              <div key={i} className="p-2 rounded bg-black/30 border border-white/[0.03] space-y-0.5">
                <div className="text-[11px] font-mono text-red-300 break-all">{u.url}</div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
                  <span>Status: <span className={u.url_status === 'online' ? 'text-red-400 font-bold' : 'text-slate-400'}>{u.url_status}</span></span>
                  <span>Threat: {u.threat}</span>
                  <span>Added: {u.date_added}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RDAP / WHOIS */}
      {rdap && (
        <div className="p-3 rounded-lg bg-[#080b12] border border-white/[0.05] space-y-2">
          <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <Lock className="w-3 h-3" />
            RDAP Registration Data
          </div>
          {rdap.ldhName && (
            <div className="text-xs font-mono text-slate-200">{rdap.ldhName}</div>
          )}
          {rdap.status && rdap.status.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {rdap.status.map((s, i) => (
                <span key={i} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-white/[0.06]">
                  {s}
                </span>
              ))}
            </div>
          )}
          {rdap.events && rdap.events.length > 0 && (
            <div className="space-y-1 text-xs font-mono">
              {rdap.events.slice(0, 4).map((ev, i) => (
                <div key={i} className="flex justify-between text-slate-400">
                  <span className="capitalize">{ev.eventAction}:</span>
                  <span className="text-slate-300">{new Date(ev.eventDate).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}
          {rdap.nameservers && rdap.nameservers.length > 0 && (
            <div>
              <span className="text-[10px] font-mono text-slate-500">Nameservers:</span>
              <div className="text-[11px] font-mono text-slate-300 mt-0.5">
                {rdap.nameservers.map(ns => ns.ldhName).join(', ')}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Reverse DNS */}
      {reverseDns && reverseDns.length > 0 && (
        <div className="p-3 rounded-lg bg-[#080b12] border border-white/[0.05] space-y-2">
          <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <Server className="w-3 h-3" />
            Reverse DNS ({reverseDns.length})
          </div>
          <div className="space-y-0.5">
            {reverseDns.slice(0, 8).map((entry, i) => (
              <div key={i} className="text-xs font-mono text-slate-300">{entry}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
