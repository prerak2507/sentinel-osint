export type ThreatSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

export type IocType = 'IP' | 'DOMAIN' | 'URL' | 'HASH' | 'EMAIL' | 'CVE';

export type EntityType = 
  | 'THREAT_ACTOR' 
  | 'ORGANIZATION' 
  | 'DOMAIN' 
  | 'IP' 
  | 'MALWARE' 
  | 'VULNERABILITY' 
  | 'CAMPAIGN';

export type SourceType = 
  | 'THREAT_FEED' 
  | 'SECURITY_ADVISORY' 
  | 'PUBLIC_API' 
  | 'NEWS' 
  | 'DOMAIN_INTEL' 
  | 'REPOSITORY' 
  | 'MALWARE_TRACKER';

export type AlertType = 
  | 'CRITICAL_THREAT' 
  | 'NEW_IOC' 
  | 'RISK_ESCALATION' 
  | 'SOURCE_FAILURE' 
  | 'CORRELATION_DETECTED';

export type ReportType = 
  | 'EXECUTIVE_SUMMARY' 
  | 'TECHNICAL_ANALYSIS' 
  | 'IOC_REPORT' 
  | 'THREAT_INVESTIGATION';

export interface Threat {
  id: string;
  caseId: string;
  title: string;
  severity: ThreatSeverity;
  confidence: number; // 0 - 100
  riskScore: number; // 0 - 100
  firstSeen: string;
  lastSeen: string;
  sourceCount: number;
  indicatorCount: number;
  entityCount: number;
  status: 'ACTIVE' | 'INVESTIGATING' | 'MITIGATED' | 'MONITORING';
  summary: string;
  primaryActor?: string;
  targetedSector?: string;
}

export interface IOC {
  id: string;
  value: string;
  type: IocType;
  severity: ThreatSeverity;
  confidence: number;
  riskScore: number;
  firstSeen: string;
  lastSeen: string;
  sources: string[];
  tags: string[];
  associatedThreatId?: string;
  asn?: string;
  country?: string;
  registrar?: string;
  description: string;
}

export interface EntityRelationship {
  targetId: string;
  targetName: string;
  targetType: EntityType;
  relationType: 'COMMUNICATES_WITH' | 'HOSTED_ON' | 'RESOLVES_TO' | 'EXPLOITS' | 'ATTRIBUTED_TO' | 'DELIVERS' | 'CERTIFIED_BY';
  confidence: number;
  source: string;
}

export interface Entity {
  id: string;
  name: string;
  type: EntityType;
  riskScore: number;
  confidence: number;
  firstSeen: string;
  lastSeen: string;
  tags: string[];
  description: string;
  relationships: EntityRelationship[];
  indicators: string[];
  threatActors?: string[];
  cveRefs?: string[];
  sourceEvidence: EvidenceItem[];
}

export interface EvidenceItem {
  id: string;
  title: string;
  sourceName: string;
  sourceUrl?: string;
  observedAt: string;
  rawSample: string;
  verified: boolean;
  confidence: number;
  category: 'NETWORK' | 'TELEMETRY' | 'WHOIS' | 'CERTIFICATE' | 'MALWARE_SAMPLE' | 'ADVISORY';
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  dateStr: string;
  title: string;
  description: string;
  severity: ThreatSeverity;
  type: 'DISCOVERY' | 'ASSOCIATION' | 'VERIFICATION' | 'ESCALATION' | 'REPORT' | 'MITIGATION';
  relatedEntity: string;
  source: string;
  riskDelta?: number; // e.g. +14
}

export interface Source {
  id: string;
  name: string;
  type: SourceType;
  status: 'CONNECTED' | 'SYNCING' | 'DEGRADED' | 'DISCONNECTED';
  lastSync: string;
  recordsCollected: number;
  reliability: number; // percentage
  frequency: string;
  endpoint: string;
  category: string;
  latencyMs: number;
  healthStatus: 'HEALTHY' | 'WARNING' | 'ERROR';
}

export interface Alert {
  id: string;
  type: AlertType;
  severity: ThreatSeverity;
  title: string;
  description: string;
  timestamp: string;
  source: string;
  acknowledged: boolean;
  relatedCaseId?: string;
  entityId?: string;
  riskScoreBefore?: number;
  riskScoreAfter?: number;
}

export interface RiskFactor {
  factor: string;
  score: number;
  max: number;
  description: string;
}

export interface Investigation {
  id: string;
  title: string;
  targetQuery: string;
  status: 'ACTIVE' | 'ARCHIVED' | 'ESCALATED';
  riskScore: number;
  severity: ThreatSeverity;
  confidence: number;
  firstSeen: string;
  lastSeen: string;
  sourceCount: number;
  entityCount: number;
  indicatorCount: number;
  riskFactors: RiskFactor[];
  entities: Entity[];
  iocs: IOC[];
  timeline: TimelineEvent[];
  evidence: EvidenceItem[];
  graphNodes: GraphNode[];
  graphEdges: GraphEdge[];
}

export interface GraphNode {
  id: string;
  label: string;
  sublabel: string;
  type: EntityType | 'CERTIFICATE';
  severity: ThreatSeverity;
  riskScore: number;
  x: number;
  y: number;
  details?: Record<string, string | number>;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  confidence: number;
  animated?: boolean;
}

export interface Report {
  id: string;
  caseId: string;
  title: string;
  type: ReportType;
  generatedAt: string;
  author: string;
  classification: 'TLP:AMBER' | 'TLP:CLEAR' | 'TLP:GREEN' | 'TLP:RED';
  riskScore: number;
  confidence: number;
  executiveSummary: string;
  threatAssessment: string;
  indicatorsCount: number;
  entitiesCount: number;
  sourcesCount: number;
  recommendedActions: string[];
  indicators: IOC[];
  entities: Entity[];
  timeline: TimelineEvent[];
  evidence: EvidenceItem[];
}

export interface PipelineMetrics {
  rawSignals: number;
  normalizedSignals: number;
  extractedEntities: number;
  correlatedRelationships: number;
  highRiskClusters: number;
  throughputPerSec: number;
  lastUpdated: string;
}
