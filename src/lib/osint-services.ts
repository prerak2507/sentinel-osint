/**
 * SentinelOSINT — Live OSINT Service Layer
 * 
 * Queries real, free, publicly accessible intelligence APIs.
 * All calls are made server-side via Next.js API routes.
 * No API keys required for these endpoints.
 */

// ─── Shodan InternetDB (free, no auth) ─────────────────
export interface ShodanInternetDBResult {
  ip: string;
  ports: number[];
  hostnames: string[];
  tags: string[];
  vulns: string[];
  cpes: string[];
}

export async function queryShodanInternetDB(ip: string): Promise<ShodanInternetDBResult | null> {
  try {
    const res = await fetch(`https://internetdb.shodan.io/${encodeURIComponent(ip)}`, {
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// ─── IP Geolocation (ip-api.com, free) ──────────────────
export interface IPGeoResult {
  query: string;
  status: string;
  country: string;
  countryCode: string;
  region: string;
  regionName: string;
  city: string;
  zip: string;
  lat: number;
  lon: number;
  timezone: string;
  isp: string;
  org: string;
  as: string;
}

export async function queryIPGeolocation(ip: string): Promise<IPGeoResult | null> {
  try {
    const res = await fetch(`http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query`, {
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.status === 'fail') return null;
    return data;
  } catch {
    return null;
  }
}

// ─── CIRCL CVE Lookup (free, no auth) ───────────────────
export interface CIRCLCVEResult {
  id: string;
  summary: string;
  cvss: number | null;
  cvss3: number | null;
  Published: string;
  Modified: string;
  references: string[];
  vulnerable_product: string[];
  access?: {
    vector?: string;
    complexity?: string;
    authentication?: string;
  };
  impact?: {
    confidentiality?: string;
    integrity?: string;
    availability?: string;
  };
}

export async function queryCVE(cveId: string): Promise<CIRCLCVEResult | null> {
  try {
    const res = await fetch(`https://cve.circl.lu/api/cve/${encodeURIComponent(cveId)}`, {
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// ─── Cloudflare DNS-over-HTTPS (free) ───────────────────
export interface DNSRecord {
  name: string;
  type: number;
  TTL: number;
  data: string;
}

export interface DNSResult {
  Status: number;
  Question: { name: string; type: number }[];
  Answer: DNSRecord[];
}

export async function queryDNS(domain: string, recordType: string = 'A'): Promise<DNSResult | null> {
  try {
    const res = await fetch(
      `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=${recordType}`,
      {
        headers: { Accept: 'application/dns-json' },
        signal: AbortSignal.timeout(8000),
      }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// ─── URLHaus Malware URL Check (free, no auth) ──────────
export interface URLHausResult {
  query_status: string;
  url_info?: {
    id: string;
    url: string;
    url_status: string;
    date_added: string;
    threat: string;
    tags: string[] | null;
    reporter: string;
  };
  urls?: Array<{
    id: string;
    url: string;
    url_status: string;
    date_added: string;
    threat: string;
    tags: string[] | null;
  }>;
}

export async function queryURLHaus(indicator: string): Promise<URLHausResult | null> {
  try {
    const body = new URLSearchParams();
    // Detect if it's a domain or host
    if (indicator.startsWith('http')) {
      body.append('url', indicator);
    } else {
      body.append('host', indicator);
    }

    const res = await fetch('https://urlhaus-api.abuse.ch/v1/host/', {
      method: 'POST',
      body,
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// ─── RDAP WHOIS Lookup (free, via rdap.org) ─────────────
export interface RDAPResult {
  name?: string;
  handle?: string;
  ldhName?: string;
  status?: string[];
  events?: Array<{
    eventAction: string;
    eventDate: string;
  }>;
  entities?: Array<{
    handle?: string;
    roles?: string[];
    vcardArray?: unknown[];
  }>;
  nameservers?: Array<{
    ldhName: string;
  }>;
}

export async function queryRDAP(domain: string): Promise<RDAPResult | null> {
  try {
    const res = await fetch(`https://rdap.org/domain/${encodeURIComponent(domain)}`, {
      signal: AbortSignal.timeout(8000),
      headers: { Accept: 'application/rdap+json' },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// ─── HackerTarget Reverse DNS (free, limited) ───────────
export async function queryReverseDNS(ip: string): Promise<string[]> {
  try {
    const res = await fetch(`https://api.hackertarget.com/reversedns/?q=${encodeURIComponent(ip)}`, {
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];
    const text = await res.text();
    if (text.includes('error') || text.includes('API count exceeded')) return [];
    return text.split('\n').filter(l => l.trim().length > 0);
  } catch {
    return [];
  }
}

// ─── Unified OSINT Lookup ───────────────────────────────
export type IndicatorType = 'ip' | 'domain' | 'cve' | 'url' | 'hash' | 'email' | 'unknown';

export function detectIndicatorType(query: string): IndicatorType {
  const trimmed = query.trim();
  if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(trimmed)) return 'ip';
  if (/^CVE-\d{4}-\d{4,}$/i.test(trimmed)) return 'cve';
  if (/^https?:\/\//i.test(trimmed)) return 'url';
  if (/^[a-f0-9]{32,128}$/i.test(trimmed)) return 'hash';
  if (trimmed.includes('@') && trimmed.includes('.')) return 'email';
  if (/^[a-zA-Z0-9][a-zA-Z0-9-]*\.[a-zA-Z]{2,}/.test(trimmed)) return 'domain';
  return 'unknown';
}

export interface UnifiedOSINTResult {
  query: string;
  type: IndicatorType;
  timestamp: string;
  sources: string[];
  riskScore: number;
  confidence: number;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  summary: string;
  geoLocation?: IPGeoResult | null;
  shodan?: ShodanInternetDBResult | null;
  cve?: CIRCLCVEResult | null;
  dns?: DNSResult | null;
  rdap?: RDAPResult | null;
  urlhaus?: URLHausResult | null;
  reverseDns?: string[];
  rawFindings: Record<string, unknown>;
}

function computeRiskScore(data: {
  shodan?: ShodanInternetDBResult | null;
  cve?: CIRCLCVEResult | null;
  urlhaus?: URLHausResult | null;
  type: IndicatorType;
}): { score: number; severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO'; confidence: number } {
  let score = 20; // base
  let confidence = 40;
  const sources: string[] = [];

  if (data.shodan) {
    sources.push('Shodan');
    if (data.shodan.vulns && data.shodan.vulns.length > 0) {
      score += Math.min(data.shodan.vulns.length * 8, 30);
      confidence += 15;
    }
    if (data.shodan.ports && data.shodan.ports.length > 5) {
      score += 10;
    }
    if (data.shodan.tags && data.shodan.tags.length > 0) {
      score += 5;
    }
  }

  if (data.cve) {
    sources.push('CIRCL CVE');
    const cvss = data.cve.cvss3 || data.cve.cvss || 0;
    score += Math.round(cvss * 4);
    confidence += 20;
  }

  if (data.urlhaus) {
    sources.push('URLHaus');
    if (data.urlhaus.query_status === 'no_results') {
      // clean
    } else if (data.urlhaus.urls && data.urlhaus.urls.length > 0) {
      score += Math.min(data.urlhaus.urls.length * 12, 30);
      confidence += 15;
    }
  }

  score = Math.min(score, 100);
  confidence = Math.min(confidence, 99);

  let severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO' = 'INFO';
  if (score >= 80) severity = 'CRITICAL';
  else if (score >= 60) severity = 'HIGH';
  else if (score >= 40) severity = 'MEDIUM';
  else if (score >= 20) severity = 'LOW';

  return { score, severity, confidence };
}

export async function performUnifiedLookup(query: string): Promise<UnifiedOSINTResult> {
  const type = detectIndicatorType(query);
  const sources: string[] = [];
  const rawFindings: Record<string, unknown> = {};

  let geoLocation: IPGeoResult | null = null;
  let shodan: ShodanInternetDBResult | null = null;
  let cve: CIRCLCVEResult | null = null;
  let dns: DNSResult | null = null;
  let rdap: RDAPResult | null = null;
  let urlhaus: URLHausResult | null = null;
  let reverseDns: string[] = [];

  if (type === 'ip') {
    const [shodanRes, geoRes, reverseDnsRes, urlhausRes] = await Promise.allSettled([
      queryShodanInternetDB(query),
      queryIPGeolocation(query),
      queryReverseDNS(query),
      queryURLHaus(query),
    ]);

    if (shodanRes.status === 'fulfilled' && shodanRes.value) {
      shodan = shodanRes.value;
      sources.push('Shodan InternetDB');
      rawFindings.shodan = shodan;
    }
    if (geoRes.status === 'fulfilled' && geoRes.value) {
      geoLocation = geoRes.value;
      sources.push('IP-API Geolocation');
      rawFindings.geolocation = geoLocation;
    }
    if (reverseDnsRes.status === 'fulfilled') {
      reverseDns = reverseDnsRes.value;
      if (reverseDns.length > 0) {
        sources.push('HackerTarget Reverse DNS');
        rawFindings.reverseDns = reverseDns;
      }
    }
    if (urlhausRes.status === 'fulfilled' && urlhausRes.value) {
      urlhaus = urlhausRes.value;
      sources.push('URLHaus Abuse.ch');
      rawFindings.urlhaus = urlhaus;
    }
  } else if (type === 'domain') {
    const [dnsRes, rdapRes, urlhausRes] = await Promise.allSettled([
      queryDNS(query, 'A'),
      queryRDAP(query),
      queryURLHaus(query),
    ]);

    if (dnsRes.status === 'fulfilled' && dnsRes.value) {
      dns = dnsRes.value;
      sources.push('Cloudflare DNS-over-HTTPS');
      rawFindings.dns = dns;

      // If we got an IP from DNS, also query that
      if (dns.Answer && dns.Answer.length > 0) {
        const resolvedIP = dns.Answer[0].data;
        if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(resolvedIP)) {
          const [shodanRes, geoRes] = await Promise.allSettled([
            queryShodanInternetDB(resolvedIP),
            queryIPGeolocation(resolvedIP),
          ]);
          if (shodanRes.status === 'fulfilled' && shodanRes.value) {
            shodan = shodanRes.value;
            sources.push('Shodan InternetDB (resolved IP)');
            rawFindings.shodan = shodan;
          }
          if (geoRes.status === 'fulfilled' && geoRes.value) {
            geoLocation = geoRes.value;
            sources.push('IP-API Geolocation (resolved IP)');
            rawFindings.geolocation = geoLocation;
          }
        }
      }
    }
    if (rdapRes.status === 'fulfilled' && rdapRes.value) {
      rdap = rdapRes.value;
      sources.push('RDAP WHOIS Registry');
      rawFindings.rdap = rdap;
    }
    if (urlhausRes.status === 'fulfilled' && urlhausRes.value) {
      urlhaus = urlhausRes.value;
      sources.push('URLHaus Abuse.ch');
      rawFindings.urlhaus = urlhaus;
    }
  } else if (type === 'cve') {
    const cveRes = await queryCVE(query);
    if (cveRes) {
      cve = cveRes;
      sources.push('CIRCL CVE Database');
      rawFindings.cve = cve;
    }
  } else if (type === 'url') {
    const urlhausRes = await queryURLHaus(query);
    if (urlhausRes) {
      urlhaus = urlhausRes;
      sources.push('URLHaus Abuse.ch');
      rawFindings.urlhaus = urlhaus;
    }
    // Extract domain from URL and do DNS
    try {
      const urlObj = new URL(query);
      const hostname = urlObj.hostname;
      const dnsRes = await queryDNS(hostname);
      if (dnsRes) {
        dns = dnsRes;
        sources.push('Cloudflare DNS-over-HTTPS');
        rawFindings.dns = dnsRes;
      }
    } catch { /* invalid URL */ }
  }

  const { score, severity, confidence } = computeRiskScore({ shodan, cve, urlhaus, type });

  // Build human summary
  const summaryParts: string[] = [];
  if (geoLocation) summaryParts.push(`Located in ${geoLocation.city}, ${geoLocation.country} (${geoLocation.isp})`);
  if (shodan && shodan.ports?.length) summaryParts.push(`${shodan.ports.length} open ports detected [${shodan.ports.slice(0, 8).join(', ')}]`);
  if (shodan && shodan.vulns?.length) summaryParts.push(`${shodan.vulns.length} known vulnerabilities: ${shodan.vulns.slice(0, 5).join(', ')}`);
  if (shodan && shodan.hostnames?.length) summaryParts.push(`Hostnames: ${shodan.hostnames.slice(0, 4).join(', ')}`);
  if (cve) summaryParts.push(`${cve.id}: ${cve.summary?.substring(0, 200)}`);
  if (dns && dns.Answer?.length) summaryParts.push(`DNS resolves to ${dns.Answer.map(a => a.data).join(', ')} (TTL: ${dns.Answer[0]?.TTL}s)`);
  if (urlhaus && urlhaus.urls?.length) summaryParts.push(`URLHaus: ${urlhaus.urls.length} malicious URL(s) associated`);
  if (rdap && rdap.events) {
    const reg = rdap.events.find(e => e.eventAction === 'registration');
    if (reg) summaryParts.push(`Domain registered: ${reg.eventDate}`);
  }
  if (reverseDns.length > 0) summaryParts.push(`Reverse DNS: ${reverseDns.slice(0, 3).join(', ')}`);

  return {
    query,
    type,
    timestamp: new Date().toISOString(),
    sources,
    riskScore: score,
    confidence,
    severity,
    summary: summaryParts.length > 0 ? summaryParts.join(' · ') : `Queried ${sources.length > 0 ? sources.join(', ') : 'available OSINT sources'}. No significant threats detected for this indicator.`,
    geoLocation,
    shodan,
    cve,
    dns,
    rdap,
    urlhaus,
    reverseDns,
    rawFindings,
  };
}
