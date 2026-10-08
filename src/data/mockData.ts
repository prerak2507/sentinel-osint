import { 
  Threat, 
  IOC, 
  Entity, 
  Source, 
  Alert, 
  Investigation, 
  Report, 
  TimelineEvent, 
  EvidenceItem,
  PipelineMetrics 
} from '@/types/intelligence';

export const INITIAL_PIPELINE_METRICS: PipelineMetrics = {
  rawSignals: 47,
  normalizedSignals: 31,
  extractedEntities: 18,
  correlatedRelationships: 7,
  highRiskClusters: 3,
  throughputPerSec: 1420,
  lastUpdated: 'Just now'
};

export const DEMO_EVIDENCE_ITEMS: EvidenceItem[] = [
  {
    id: 'EVD-901',
    title: 'DNS SOA & Fast-Flux IP Resolution Record',
    sourceName: 'ShadowServer Scanning Engine',
    sourceUrl: 'https://osint.shadowserver.org/reports/dns-soa-901',
    observedAt: '2026-09-28 04:12:09 UTC',
    rawSample: 'SOA ns1.suspicious-domain.example hostmaster.suspicious-domain.example (2026092801 7200 3600 1209600 300) [TTL: 60s fast-flux rotation to ASN49301]',
    verified: true,
    confidence: 96,
    category: 'WHOIS'
  },
  {
    id: 'EVD-902',
    title: 'TLS Certificate Fingerprint Match with C2 Beacon Profile',
    sourceName: 'AlienVault OTX Feed',
    sourceUrl: 'https://otx.alienvault.com/pulse/66f9120ac45b91',
    observedAt: '2026-09-29 11:34:22 UTC',
    rawSample: 'TLS JA3: a0e9f5d64349fb13191bc781f81f42e1 | JA3S: e7d705a3286e19ea42f587b344ee6865 | CommonName: *.suspicious-domain.example | Issuer: C=XX, O=GhostShell Infrastructure Net',
    verified: true,
    confidence: 94,
    category: 'CERTIFICATE'
  },
  {
    id: 'EVD-903',
    title: 'Payload Staging Delivery via Inverted HTTP POST Beacons',
    sourceName: 'URLHaus Malware Tracker',
    sourceUrl: 'https://urlhaus.abuse.ch/url/3104928/',
    observedAt: '2026-09-30 18:22:15 UTC',
    rawSample: 'POST /api/v2/telemetry/heartbeat HTTP/1.1 -> Payload hash sha256: 4b29a8f4c1e089d71c26b91e4a64380b271d533b66d0124976fa8e932b101c51 (GhostShell.Loader.x64)',
    verified: true,
    confidence: 91,
    category: 'MALWARE_SAMPLE'
  },
  {
    id: 'EVD-904',
    title: 'Exploit Telemetry Correlating Windows RCE Telemetry',
    sourceName: 'CISA Known Exploited Feeds',
    sourceUrl: 'https://cisa.gov/known-exploited-vulnerabilities-catalog/cve-2024-38077',
    observedAt: '2026-10-01 09:14:40 UTC',
    rawSample: 'Target Port 135/3389 exploit probes originating from staging node 185.220.101.45 matching CVE-2024-38077 MadLicense RCE signature payload buffer',
    verified: true,
    confidence: 88,
    category: 'ADVISORY'
  }
];

export const DEMO_TIMELINE: TimelineEvent[] = [
  {
    id: 'TL-01',
    timestamp: '2026-09-28 04:12:09 UTC',
    dateStr: 'SEP 28',
    title: 'Domain Discovered & Registered',
    description: 'suspicious-domain.example registered under anonymous privacy registrar with abnormal nameserver clustering.',
    severity: 'LOW',
    type: 'DISCOVERY',
    relatedEntity: 'suspicious-domain.example',
    source: 'Domain Registration Monitor',
    riskDelta: 18
  },
  {
    id: 'TL-02',
    timestamp: '2026-09-29 11:34:22 UTC',
    dateStr: 'SEP 29',
    title: 'IP Association Detected',
    description: 'A-Record resolved to bulletproof hosting IP 185.220.101.45 with concurrent pivot to 194.26.29.112.',
    severity: 'MEDIUM',
    type: 'ASSOCIATION',
    relatedEntity: '185.220.101.45',
    source: 'Passive DNS Sensor Net',
    riskDelta: 24
  },
  {
    id: 'TL-03',
    timestamp: '2026-09-30 18:22:15 UTC',
    dateStr: 'SEP 30',
    title: 'Additional Source Confirms Indicator',
    description: 'URLHaus flags active malicious staging URL delivering XOR-obfuscated loader shellcode.',
    severity: 'HIGH',
    type: 'VERIFICATION',
    relatedEntity: 'GhostShell C2 Framework v3.4',
    source: 'URLHaus Malware Tracker',
    riskDelta: 16
  },
  {
    id: 'TL-04',
    timestamp: '2026-10-01 09:14:40 UTC',
    dateStr: 'OCT 01',
    title: 'Threat Actor Relationship Detected',
    description: 'JA3S TLS fingerprint & certificate metadata correlates with Vanguard Spider espionage campaigns.',
    severity: 'HIGH',
    type: 'ASSOCIATION',
    relatedEntity: 'Vanguard Spider (Threat Actor)',
    source: 'AlienVault OTX & MISP Feeds',
    riskDelta: 14
  },
  {
    id: 'TL-05',
    timestamp: '2026-10-03 14:05:00 UTC',
    dateStr: 'OCT 03',
    title: 'Risk Score Escalated to 82',
    description: 'Cross-correlation engine triggered critical threshold due to weaponized CVE-2024-38077 payload beaconing.',
    severity: 'CRITICAL',
    type: 'ESCALATION',
    relatedEntity: 'CVE-2024-38077',
    source: 'SentinelOSINT Correlation Engine',
    riskDelta: 10
  },
  {
    id: 'TL-06',
    timestamp: '2026-10-04 08:30:00 UTC',
    dateStr: 'OCT 04',
    title: 'Investigation Escalated & Case Created',
    description: 'Case INV-2026-1042 assigned to Tier-3 threat hunting unit for proactive containment and firewall blocklist push.',
    severity: 'HIGH',
    type: 'REPORT',
    relatedEntity: 'INV-2026-1042',
    source: 'SOC Incident Response Command'
  }
];

export const DEMO_IOCS: IOC[] = [
  {
    id: 'IOC-001',
    value: 'suspicious-domain.example',
    type: 'DOMAIN',
    severity: 'HIGH',
    confidence: 89,
    riskScore: 82,
    firstSeen: '2026-09-28',
    lastSeen: '2026-10-04',
    sources: ['AlienVault OTX', 'URLHaus', 'ShadowServer', 'Shodan'],
    tags: ['C2 Gateway', 'Fast-Flux', 'Impersonation'],
    associatedThreatId: 'THREAT-0241',
    registrar: 'NameSilo Privacy LLC',
    description: 'Primary command-and-control ingress domain mimicking enterprise perimeter services'
  },
  {
    id: 'IOC-002',
    value: '185.220.101.45',
    type: 'IP',
    severity: 'CRITICAL',
    confidence: 94,
    riskScore: 91,
    firstSeen: '2026-09-29',
    lastSeen: '2026-10-04',
    sources: ['AbuseIPDB', 'ShadowServer', 'VirusTotal', 'CISA KEV'],
    tags: ['Bulletproof Hosting', 'Scanner', 'Exploit Ingress'],
    associatedThreatId: 'THREAT-0241',
    asn: 'AS49301 (G-Core Data Route)',
    country: 'Seychelles / Off-shore',
    description: 'Active scanning origin conducting CVE-2024-38077 probes and reverse proxy relay'
  },
  {
    id: 'IOC-003',
    value: '194.26.29.112',
    type: 'IP',
    severity: 'HIGH',
    confidence: 88,
    riskScore: 79,
    firstSeen: '2026-09-29',
    lastSeen: '2026-10-03',
    sources: ['AlienVault OTX', 'Shodan', 'AbuseIPDB'],
    tags: ['C2 Listener', 'TLS Beacons'],
    associatedThreatId: 'THREAT-0241',
    asn: 'AS209854 (ServerHub Transit)',
    country: 'Netherlands',
    description: 'Encrypted telemetry handler receiving heartbeat payloads from GhostShell implants'
  },
  {
    id: 'IOC-004',
    value: '91.215.85.17',
    type: 'IP',
    severity: 'MEDIUM',
    confidence: 82,
    riskScore: 68,
    firstSeen: '2026-09-30',
    lastSeen: '2026-10-02',
    sources: ['URLHaus', 'VirusTotal'],
    tags: ['Payload Stager', 'HTTP File Server'],
    associatedThreatId: 'THREAT-0241',
    asn: 'AS57169 (Global Telecom LLC)',
    country: 'Romania',
    description: 'Transient payload drop point hosting encrypted second-stage DLL payloads'
  },
  {
    id: 'IOC-005',
    value: 'https://suspicious-domain.example/api/v2/telemetry/heartbeat',
    type: 'URL',
    severity: 'CRITICAL',
    confidence: 95,
    riskScore: 94,
    firstSeen: '2026-09-30',
    lastSeen: '2026-10-04',
    sources: ['URLHaus', 'AlienVault OTX'],
    tags: ['C2 Endpoint', 'POST Exfiltration'],
    associatedThreatId: 'THREAT-0241',
    description: 'Active C2 check-in URI receiving base64 encoded client telemetry'
  },
  {
    id: 'IOC-006',
    value: '4b29a8f4c1e089d71c26b91e4a64380b271d533b66d0124976fa8e932b101c51',
    type: 'HASH',
    severity: 'CRITICAL',
    confidence: 98,
    riskScore: 96,
    firstSeen: '2026-09-30',
    lastSeen: '2026-10-04',
    sources: ['VirusTotal', 'URLHaus', 'MalwareBazaar'],
    tags: ['GhostShell Loader', 'SHA256', 'Win64 PE'],
    associatedThreatId: 'THREAT-0241',
    description: 'GhostShell Stage-1 memory injection stub with AMSI and ETW bypass routines'
  },
  {
    id: 'IOC-007',
    value: 'CVE-2024-38077',
    type: 'CVE',
    severity: 'CRITICAL',
    confidence: 99,
    riskScore: 98,
    firstSeen: '2026-07-09',
    lastSeen: '2026-10-04',
    sources: ['NVD NIST', 'CISA KEV', 'MITRE ATT&CK'],
    tags: ['Remote Code Execution', 'Windows RDL', 'Unauthenticated'],
    associatedThreatId: 'THREAT-0241',
    description: 'Windows Remote Desktop Licensing Service heap-based buffer overflow weaponized by Vanguard Spider'
  },
  {
    id: 'IOC-008',
    value: 'secops-alert@infra-ops-cloud.org',
    type: 'EMAIL',
    severity: 'MEDIUM',
    confidence: 76,
    riskScore: 61,
    firstSeen: '2026-09-28',
    lastSeen: '2026-10-01',
    sources: ['Whois XML API', 'SecurityTrails'],
    tags: ['Registrant Contact', 'Burner Identity'],
    associatedThreatId: 'THREAT-0241',
    description: 'Synthetic persona mailbox utilized for batch certificate and domain acquisition'
  }
];

export const DEMO_ENTITIES: Entity[] = [
  {
    id: 'ENT-01',
    name: 'suspicious-domain.example',
    type: 'DOMAIN',
    riskScore: 82,
    confidence: 89,
    firstSeen: '2026-09-28',
    lastSeen: '2026-10-04',
    tags: ['Suspicious', 'Infrastructure', 'OSINT Correlated', 'Fast-Flux'],
    description: 'Primary ingress domain for Vanguard Spider campaign targeting financial and critical tech services.',
    relationships: [
      {
        targetId: 'ENT-02',
        targetName: '185.220.101.45',
        targetType: 'IP',
        relationType: 'RESOLVES_TO',
        confidence: 96,
        source: 'ShadowServer DNS Telemetry'
      },
      {
        targetId: 'ENT-04',
        targetName: 'Vanguard Spider (Threat Actor)',
        targetType: 'THREAT_ACTOR',
        relationType: 'ATTRIBUTED_TO',
        confidence: 87,
        source: 'AlienVault OTX Threat Matrix'
      },
      {
        targetId: 'ENT-05',
        targetName: 'GhostShell C2 Framework v3.4',
        targetType: 'MALWARE',
        relationType: 'DELIVERS',
        confidence: 92,
        source: 'URLHaus Stager Match'
      },
      {
        targetId: 'ENT-06',
        targetName: 'Cert-LetEncrypt-Wildcard-7F8A',
        targetType: 'ORGANIZATION',
        relationType: 'CERTIFIED_BY',
        confidence: 94,
        source: 'Censys SSL Certificates'
      }
    ],
    indicators: ['IOC-001', 'IOC-005'],
    sourceEvidence: DEMO_EVIDENCE_ITEMS
  },
  {
    id: 'ENT-02',
    name: '185.220.101.45',
    type: 'IP',
    riskScore: 91,
    confidence: 94,
    firstSeen: '2026-09-29',
    lastSeen: '2026-10-04',
    tags: ['Bulletproof Hosting', 'ASN 49301', 'Scanner'],
    description: 'Seychelles routed IP with high abuse score, recognized for recurrent exploitation probes.',
    relationships: [
      {
        targetId: 'ENT-01',
        targetName: 'suspicious-domain.example',
        targetType: 'DOMAIN',
        relationType: 'COMMUNICATES_WITH',
        confidence: 96,
        source: 'Passive DNS'
      },
      {
        targetId: 'ENT-07',
        targetName: 'CVE-2024-38077',
        targetType: 'VULNERABILITY',
        relationType: 'EXPLOITS',
        confidence: 88,
        source: 'CISA KEV Telemetry'
      }
    ],
    indicators: ['IOC-002'],
    sourceEvidence: [DEMO_EVIDENCE_ITEMS[0], DEMO_EVIDENCE_ITEMS[3]]
  },
  {
    id: 'ENT-03',
    name: '194.26.29.112',
    type: 'IP',
    riskScore: 79,
    confidence: 88,
    firstSeen: '2026-09-29',
    lastSeen: '2026-10-03',
    tags: ['C2 Transit', 'Amsterdam Pop'],
    description: 'Reverse proxy listener in the Netherlands relaying heartbeats to command backends.',
    relationships: [
      {
        targetId: 'ENT-05',
        targetName: 'GhostShell C2 Framework v3.4',
        targetType: 'MALWARE',
        relationType: 'COMMUNICATES_WITH',
        confidence: 90,
        source: 'Shodan Fingerprint'
      }
    ],
    indicators: ['IOC-003'],
    sourceEvidence: [DEMO_EVIDENCE_ITEMS[1]]
  },
  {
    id: 'ENT-04',
    name: 'Vanguard Spider (Threat Actor)',
    type: 'THREAT_ACTOR',
    riskScore: 95,
    confidence: 87,
    firstSeen: '2024-02-14',
    lastSeen: '2026-10-04',
    tags: ['Financially Motivated', 'Extortion', 'APT Affiliate'],
    description: 'High-sophistication threat group known for exploiting edge appliances, deploying custom stealth loaders, and living-off-the-land exfiltration.',
    relationships: [
      {
        targetId: 'ENT-01',
        targetName: 'suspicious-domain.example',
        targetType: 'DOMAIN',
        relationType: 'ATTRIBUTED_TO',
        confidence: 87,
        source: 'SentinelOSINT Correlation Engine'
      },
      {
        targetId: 'ENT-05',
        targetName: 'GhostShell C2 Framework v3.4',
        targetType: 'MALWARE',
        relationType: 'DELIVERS',
        confidence: 93,
        source: 'Mandiant/AlienVault OTX'
      }
    ],
    indicators: ['IOC-001', 'IOC-006'],
    sourceEvidence: [DEMO_EVIDENCE_ITEMS[1], DEMO_EVIDENCE_ITEMS[2]]
  },
  {
    id: 'ENT-05',
    name: 'GhostShell C2 Framework v3.4',
    type: 'MALWARE',
    riskScore: 93,
    confidence: 92,
    firstSeen: '2026-08-11',
    lastSeen: '2026-10-04',
    tags: ['Modular C2', 'AMSI Bypass', 'Memory Injection'],
    description: 'Proprietary post-exploitation agent featuring polymorphic payload stagers and DNS-tunneled heartbeat fallback.',
    relationships: [
      {
        targetId: 'ENT-01',
        targetName: 'suspicious-domain.example',
        targetType: 'DOMAIN',
        relationType: 'COMMUNICATES_WITH',
        confidence: 92,
        source: 'URLHaus Sample'
      }
    ],
    indicators: ['IOC-006'],
    sourceEvidence: [DEMO_EVIDENCE_ITEMS[2]]
  },
  {
    id: 'ENT-07',
    name: 'CVE-2024-38077',
    type: 'VULNERABILITY',
    riskScore: 98,
    confidence: 99,
    firstSeen: '2024-07-09',
    lastSeen: '2026-10-04',
    tags: ['CVSS 9.8', 'RDL Overflow', 'Zero-Click'],
    description: 'Critical Remote Desktop Licensing buffer overflow allowing unauthenticated SYSTEM execution across domain boundaries.',
    relationships: [
      {
        targetId: 'ENT-02',
        targetName: '185.220.101.45',
        targetType: 'IP',
        relationType: 'EXPLOITS',
        confidence: 88,
        source: 'CISA KEV Advisory'
      }
    ],
    indicators: ['IOC-007'],
    sourceEvidence: [DEMO_EVIDENCE_ITEMS[3]]
  }
];

export const DEMO_SOURCES: Source[] = [
  {
    id: 'SRC-01',
    name: 'AlienVault OTX Threat Matrix',
    type: 'THREAT_FEED',
    status: 'CONNECTED',
    lastSync: '2 minutes ago',
    recordsCollected: 18429,
    reliability: 92,
    frequency: 'Every 5m',
    endpoint: 'https://otx.alienvault.com/api/v1/pulses/subscribed',
    category: 'Community Intelligence Pulses',
    latencyMs: 142,
    healthStatus: 'HEALTHY'
  },
  {
    id: 'SRC-02',
    name: 'CISA Known Exploited Feeds (KEV)',
    type: 'SECURITY_ADVISORY',
    status: 'CONNECTED',
    lastSync: '12 minutes ago',
    recordsCollected: 1240,
    reliability: 98,
    frequency: 'Hourly',
    endpoint: 'https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json',
    category: 'Federal Vulnerability Directives',
    latencyMs: 88,
    healthStatus: 'HEALTHY'
  },
  {
    id: 'SRC-03',
    name: 'ShadowServer Scanning Engine',
    type: 'DOMAIN_INTEL',
    status: 'CONNECTED',
    lastSync: '4 minutes ago',
    recordsCollected: 421900,
    reliability: 95,
    frequency: 'Continuous Stream',
    endpoint: 'https://api.shadowserver.org/v1/network/telemetry',
    category: 'Global Port & SSL Telemetry',
    latencyMs: 210,
    healthStatus: 'HEALTHY'
  },
  {
    id: 'SRC-04',
    name: 'URLHaus Malware Tracker',
    type: 'MALWARE_TRACKER',
    status: 'CONNECTED',
    lastSync: '6 minutes ago',
    recordsCollected: 64120,
    reliability: 91,
    frequency: 'Every 10m',
    endpoint: 'https://urlhaus-api.abuse.ch/v1/payloads/recent',
    category: 'Weaponized Payload Dissemination',
    latencyMs: 165,
    healthStatus: 'HEALTHY'
  },
  {
    id: 'SRC-05',
    name: 'MISP Global Threat Sharing',
    type: 'THREAT_FEED',
    status: 'CONNECTED',
    lastSync: '18 minutes ago',
    recordsCollected: 114800,
    reliability: 94,
    frequency: 'Every 15m',
    endpoint: 'https://misp.circl.lu/events/restSearch',
    category: 'Encrypted Trust Circle Events',
    latencyMs: 280,
    healthStatus: 'HEALTHY'
  },
  {
    id: 'SRC-06',
    name: 'VirusTotal Intelligence API',
    type: 'PUBLIC_API',
    status: 'CONNECTED',
    lastSync: '1 minute ago',
    recordsCollected: 890210,
    reliability: 96,
    frequency: 'Real-time Webhook',
    endpoint: 'https://www.virustotal.com/api/v3/intelligence/hunting_notifications',
    category: 'Multivariant File & URL Heuristics',
    latencyMs: 115,
    healthStatus: 'HEALTHY'
  },
  {
    id: 'SRC-07',
    name: 'AbuseIPDB Realtime Stream',
    type: 'PUBLIC_API',
    status: 'CONNECTED',
    lastSync: '3 minutes ago',
    recordsCollected: 312400,
    reliability: 89,
    frequency: 'Every 5m',
    endpoint: 'https://api.abuseipdb.com/api/v2/blacklist',
    category: 'Distributed IP Abuse Telemetry',
    latencyMs: 195,
    healthStatus: 'HEALTHY'
  },
  {
    id: 'SRC-08',
    name: 'Shodan OSINT Port Explorer',
    type: 'DOMAIN_INTEL',
    status: 'CONNECTED',
    lastSync: '8 minutes ago',
    recordsCollected: 520000,
    reliability: 93,
    frequency: 'Every 30m',
    endpoint: 'https://api.shodan.io/shodan/host/search',
    category: 'Internet Connected Device Fingerprints',
    latencyMs: 310,
    healthStatus: 'HEALTHY'
  }
];

export const DEMO_THREATS: Threat[] = [
  {
    id: 'THREAT-0241',
    caseId: 'INV-2026-1042',
    title: 'Suspicious Infrastructure Cluster',
    severity: 'CRITICAL',
    confidence: 91,
    riskScore: 82,
    firstSeen: '2026-09-28',
    lastSeen: '2026-10-04',
    sourceCount: 14,
    indicatorCount: 27,
    entityCount: 8,
    status: 'ACTIVE',
    summary: 'Correlated multi-region C2 cluster utilizing bulletproof hostings in Seychelles and Amsterdam, actively staging GhostShell memory injection payloads linked to Vanguard Spider.',
    primaryActor: 'Vanguard Spider',
    targetedSector: 'Financial & Core Infrastructure'
  },
  {
    id: 'THREAT-0199',
    caseId: 'INV-2026-0988',
    title: 'CobaltStrike Beacon Infrastructure Pivot',
    severity: 'HIGH',
    confidence: 84,
    riskScore: 78,
    firstSeen: '2026-09-19',
    lastSeen: '2026-10-03',
    sourceCount: 9,
    indicatorCount: 18,
    entityCount: 6,
    status: 'INVESTIGATING',
    summary: 'Malleable C2 listener configurations hosted across dynamic cloud VM instances targeting defense supply chains.',
    primaryActor: 'UNC2975 Affiliate',
    targetedSector: 'Defense Industrial Base'
  },
  {
    id: 'THREAT-0187',
    caseId: 'INV-2026-0941',
    title: 'Financial Sector Phishing Subdomain Spoofing',
    severity: 'MEDIUM',
    confidence: 76,
    riskScore: 64,
    firstSeen: '2026-09-24',
    lastSeen: '2026-10-02',
    sourceCount: 6,
    indicatorCount: 12,
    entityCount: 4,
    status: 'MONITORING',
    summary: 'Automated reverse-proxy credential harvesting kits clone multi-factor authentication portals across lookalike domains.',
    primaryActor: 'Tycoon2FA Operator',
    targetedSector: 'Commercial Banking'
  },
  {
    id: 'THREAT-0174',
    caseId: 'INV-2026-0899',
    title: 'Unverified Fast-Flux Dynamic DNS Cluster',
    severity: 'LOW',
    confidence: 62,
    riskScore: 45,
    firstSeen: '2026-09-26',
    lastSeen: '2026-10-01',
    sourceCount: 4,
    indicatorCount: 7,
    entityCount: 3,
    status: 'MONITORING',
    summary: 'High TTL rotation across residential proxy IP ranges, currently undergoing passive anomaly telemetry collection.',
    primaryActor: 'Unknown Cluster',
    targetedSector: 'E-commerce'
  }
];

export const DEMO_ALERTS: Alert[] = [
  {
    id: 'ALT-108',
    type: 'RISK_ESCALATION',
    severity: 'CRITICAL',
    title: 'Risk score increased from 64 → 82',
    description: 'New high-confidence source correlation: URLHaus payload stub correlates with Vanguard Spider signature repository.',
    timestamp: '14 minutes ago',
    source: 'SentinelOSINT Correlation Engine',
    acknowledged: false,
    relatedCaseId: 'INV-2026-1042',
    entityId: 'ENT-01',
    riskScoreBefore: 64,
    riskScoreAfter: 82
  },
  {
    id: 'ALT-107',
    type: 'NEW_IOC',
    severity: 'HIGH',
    title: 'New malicious C2 listener discovered: 185.220.101.45',
    description: 'ShadowServer scanner detected active exploitation probe against port 3389/135 exploiting CVE-2024-38077.',
    timestamp: '42 minutes ago',
    source: 'ShadowServer Scanning Engine',
    acknowledged: false,
    relatedCaseId: 'INV-2026-1042',
    entityId: 'ENT-02'
  },
  {
    id: 'ALT-106',
    type: 'CORRELATION_DETECTED',
    severity: 'HIGH',
    title: 'Cryptographic Certificate Match with APT Infrastructure',
    description: 'TLS JA3 hash e7d705a3286e matches known Vanguard Spider beacon profile in AlienVault OTX.',
    timestamp: '2 hours ago',
    source: 'AlienVault OTX Pulse Correlator',
    acknowledged: true,
    relatedCaseId: 'INV-2026-1042',
    entityId: 'ENT-01'
  },
  {
    id: 'ALT-105',
    type: 'SOURCE_FAILURE',
    severity: 'MEDIUM',
    title: 'Shodan OSINT Port Explorer Latency Threshold Exceeded',
    description: 'API response time degraded to 310ms. Automatic retry circuit engaged with cached records fallback.',
    timestamp: '4 hours ago',
    source: 'Source Health Watchdog',
    acknowledged: true
  }
];

export const DEMO_INVESTIGATION: Investigation = {
  id: 'INV-2026-1042',
  title: 'Suspicious Infrastructure Cluster',
  targetQuery: 'suspicious-domain.example',
  status: 'ACTIVE',
  riskScore: 82,
  severity: 'HIGH',
  confidence: 89,
  firstSeen: '2026-09-28',
  lastSeen: '2026-10-04',
  sourceCount: 14,
  entityCount: 9,
  indicatorCount: 23,
  riskFactors: [
    { factor: 'Source Reliability', score: 18, max: 20, description: 'Multiple tier-1 OSINT feeds confirm indicator telemetry with >90% precision.' },
    { factor: 'Indicator Reputation', score: 24, max: 25, description: 'Past IP and domain associations exhibit sustained malicious behavior.' },
    { factor: 'Entity Correlation', score: 19, max: 25, description: 'Direct relationship graph links infrastructure to Vanguard Spider campaigns.' },
    { factor: 'Recency & Frequency', score: 12, max: 15, description: 'Telemetry observed continuously within the previous 72-hour window.' },
    { factor: 'Historical Evidence', score: 9, max: 15, description: 'Archived samples match known weaponized CVE exploit binaries.' }
  ],
  entities: DEMO_ENTITIES,
  iocs: DEMO_IOCS,
  timeline: DEMO_TIMELINE,
  evidence: DEMO_EVIDENCE_ITEMS,
  graphNodes: [
    { id: 'node-domain', label: 'suspicious-domain.example', sublabel: 'C2 Gateway', type: 'DOMAIN', severity: 'HIGH', riskScore: 82, x: 380, y: 220 },
    { id: 'node-ip-1', label: '185.220.101.45', sublabel: 'Bulletproof Host (Seychelles)', type: 'IP', severity: 'CRITICAL', riskScore: 91, x: 200, y: 120 },
    { id: 'node-ip-2', label: '194.26.29.112', sublabel: 'C2 Relay (Netherlands)', type: 'IP', severity: 'HIGH', riskScore: 79, x: 190, y: 320 },
    { id: 'node-ip-3', label: '91.215.85.17', sublabel: 'Payload Stager (Romania)', type: 'IP', severity: 'MEDIUM', riskScore: 68, x: 360, y: 390 },
    { id: 'node-cert', label: 'Cert: *.suspicious-domain', sublabel: 'GhostShell Self-Signed TLS', type: 'CERTIFICATE', severity: 'HIGH', riskScore: 85, x: 570, y: 130 },
    { id: 'node-actor', label: 'Vanguard Spider', sublabel: 'Threat Actor (UNC3886)', type: 'THREAT_ACTOR', severity: 'CRITICAL', riskScore: 95, x: 590, y: 290 },
    { id: 'node-malware', label: 'GhostShell C2 v3.4', sublabel: 'Memory Injector PE', type: 'MALWARE', severity: 'CRITICAL', riskScore: 93, x: 420, y: 70 },
    { id: 'node-cve', label: 'CVE-2024-38077', sublabel: 'Windows RDL RCE (CVSS 9.8)', type: 'VULNERABILITY', severity: 'CRITICAL', riskScore: 98, x: 120, y: 220 }
  ],
  graphEdges: [
    { id: 'e-1', source: 'node-domain', target: 'node-ip-1', label: 'Resolves To', confidence: 96, animated: true },
    { id: 'e-2', source: 'node-domain', target: 'node-ip-2', label: 'Relays Traffic', confidence: 89, animated: true },
    { id: 'e-3', source: 'node-domain', target: 'node-ip-3', label: 'Staged At', confidence: 82 },
    { id: 'e-4', source: 'node-domain', target: 'node-cert', label: 'Secured By', confidence: 94 },
    { id: 'e-5', source: 'node-domain', target: 'node-actor', label: 'Attributed To', confidence: 87, animated: true },
    { id: 'e-6', source: 'node-domain', target: 'node-malware', label: 'Delivers', confidence: 92, animated: true },
    { id: 'e-7', source: 'node-ip-1', target: 'node-cve', label: 'Exploits', confidence: 88, animated: true },
    { id: 'e-8', source: 'node-actor', target: 'node-malware', label: 'Author/Operator', confidence: 94 }
  ]
};

export const DEMO_REPORT: Report = {
  id: 'REP-2026-0842',
  caseId: 'INV-2026-1042',
  title: 'Actionable Intelligence Brief: Suspicious Infrastructure Cluster (INV-2026-1042)',
  type: 'THREAT_INVESTIGATION',
  generatedAt: '2026-10-04 10:15:00 UTC',
  author: 'Lead Intelligence Analyst / SentinelOSINT Auto-Engine',
  classification: 'TLP:AMBER',
  riskScore: 82,
  confidence: 89,
  executiveSummary: 'SentinelOSINT has correlated open-source intelligence from 14 independent threat streams to uncover an active infrastructure staging cluster attributed to Vanguard Spider. The campaign leverages fast-flux domain resolution (suspicious-domain.example) and bulletproof hosting in Seychelles and the Netherlands to orchestrate unauthenticated CVE-2024-38077 exploitation probes. Immediate ingress blocking and IOC synchronization across edge firewalls is recommended.',
  threatAssessment: 'High probability (89% confidence) of weaponized exploitation targeting enterprise remote desktop gateways. The malware payload (GhostShell v3.4) utilizes memory injection to evade conventional antivirus and bypasses ETW logging. Cross-referencing telemetry across AlienVault OTX, URLHaus, and ShadowServer indicates aggressive staging over the previous 6 days.',
  indicatorsCount: 23,
  entitiesCount: 9,
  sourcesCount: 14,
  recommendedActions: [
    'Deploy perimeter blocklists on firewalls and DNS resolvers for domain: suspicious-domain.example',
    'Block outbound egress traffic to IPs 185.220.101.45, 194.26.29.112, and 91.215.85.17',
    'Urgent emergency patching of Microsoft Windows Remote Desktop Licensing service (CVE-2024-38077)',
    'Hunt SIEM telemetry for JA3 TLS fingerprint "a0e9f5d64349fb13191bc781f81f42e1" in outbound web proxy logs',
    'Revoke self-signed intermediate certificates matching serial "7f8a3c... GhostShell Infrastructure"'
  ],
  indicators: DEMO_IOCS,
  entities: DEMO_ENTITIES,
  timeline: DEMO_TIMELINE,
  evidence: DEMO_EVIDENCE_ITEMS
};

export const LIVE_FEED_INITIAL = [
  {
    id: 'EVT-501',
    time: '10:42:31',
    title: 'New domain indicator discovered',
    entity: 'suspicious-domain.example',
    severity: 'HIGH' as const,
    source: 'ShadowServer DNS Monitor'
  },
  {
    id: 'EVT-502',
    time: '10:41:08',
    title: 'IP correlated with 3 threat entities',
    entity: '185.220.101.45',
    severity: 'CRITICAL' as const,
    source: 'Sentinel Correlation Engine'
  },
  {
    id: 'EVT-503',
    time: '10:39:52',
    title: 'CVE intelligence telemetry updated',
    entity: 'CVE-2024-38077',
    severity: 'CRITICAL' as const,
    source: 'CISA KEV Catalog'
  },
  {
    id: 'EVT-504',
    time: '10:38:21',
    title: 'Suspicious infrastructure detected',
    entity: 'GhostShell C2 v3.4',
    severity: 'HIGH' as const,
    source: 'URLHaus Stager Monitor'
  },
  {
    id: 'EVT-505',
    time: '10:35:10',
    title: 'Reverse proxy heartbeat beacon logged',
    entity: '194.26.29.112',
    severity: 'MEDIUM' as const,
    source: 'AlienVault OTX Pulse'
  },
  {
    id: 'EVT-506',
    time: '10:31:45',
    title: 'Subdomain generation algorithm anomaly',
    entity: 'ns1.auth-gate.defense-net.org',
    severity: 'LOW' as const,
    source: 'Passive DNS Sensor'
  }
];
