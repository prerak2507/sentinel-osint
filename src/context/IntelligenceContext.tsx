'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Investigation, 
  Entity, 
  IOC, 
  Source, 
  Alert, 
  Threat, 
  Report, 
  ReportType, 
  PipelineMetrics,
  IocType,
  ThreatSeverity
} from '@/types/intelligence';
import { 
  DEMO_INVESTIGATION, 
  DEMO_ENTITIES, 
  DEMO_IOCS, 
  DEMO_SOURCES, 
  DEMO_ALERTS, 
  DEMO_THREATS, 
  DEMO_REPORT, 
  INITIAL_PIPELINE_METRICS 
} from '@/data/mockData';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: number;
}

interface IntelligenceContextType {
  investigation: Investigation;
  threats: Threat[];
  iocs: IOC[];
  entities: Entity[];
  sources: Source[];
  alerts: Alert[];
  reports: Report[];
  pipelineMetrics: PipelineMetrics;
  selectedEntity: Entity | null;
  setSelectedEntity: (entity: Entity | null) => void;
  isEntityDrawerOpen: boolean;
  setIsEntityDrawerOpen: (open: boolean) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  timeFilter: '24H' | '7D' | '30D' | '90D';
  setTimeFilter: (filter: '24H' | '7D' | '30D' | '90D') => void;
  isSearching: boolean;
  toasts: ToastMessage[];
  addToast: (title: string, message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  dismissToast: (id: string) => void;
  syncSource: (sourceId: string) => Promise<void>;
  acknowledgeAlert: (alertId: string) => void;
  dismissAlert: (alertId: string) => void;
  loadDemoInvestigation: () => void;
  runInvestigationSearch: (query: string) => Promise<void>;
  generateNewReport: (type: ReportType, customTitle?: string) => Promise<Report>;
  addIocToInvestigation: (ioc: Omit<IOC, 'id'>) => void;
}

const IntelligenceContext = createContext<IntelligenceContextType | undefined>(undefined);

export function IntelligenceProvider({ children }: { children: ReactNode }) {
  const [investigation, setInvestigation] = useState<Investigation>(DEMO_INVESTIGATION);
  const [threats, setThreats] = useState<Threat[]>(DEMO_THREATS);
  const [iocs, setIocs] = useState<IOC[]>(DEMO_IOCS);
  const [entities, setEntities] = useState<Entity[]>(DEMO_ENTITIES);
  const [sources, setSources] = useState<Source[]>(DEMO_SOURCES);
  const [alerts, setAlerts] = useState<Alert[]>(DEMO_ALERTS);
  const [reports, setReports] = useState<Report[]>([DEMO_REPORT]);
  const [pipelineMetrics, setPipelineMetrics] = useState<PipelineMetrics>(INITIAL_PIPELINE_METRICS);
  
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(DEMO_ENTITIES[0]);
  const [isEntityDrawerOpen, setIsEntityDrawerOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('suspicious-domain.example');
  const [timeFilter, setTimeFilter] = useState<'24H' | '7D' | '30D' | '90D'>('7D');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Keyboard shortcut for Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Toast notification helper
  const addToast = (
    title: string, 
    message: string, 
    type: 'info' | 'success' | 'warning' | 'error' = 'info'
  ) => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title,
      message,
      type,
      timestamp: Date.now()
    };
    setToasts((prev) => [newToast, ...prev].slice(0, 5));

    // Auto-dismiss after 4.5 seconds
    setTimeout(() => {
      dismissToast(newToast.id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Synchronize Source action
  const syncSource = async (sourceId: string) => {
    const src = sources.find(s => s.id === sourceId);
    if (!src) return;

    setSources(prev => prev.map(s => s.id === sourceId ? { ...s, status: 'SYNCING' } : s));
    addToast('Syncing Source', `Connecting to ${src.name} endpoint...`, 'info');

    // Simulate realistic API collection and normalization latency
    await new Promise(r => setTimeout(r, 1600));

    const addedRecords = Math.floor(Math.random() * 350) + 75;
    setSources(prev => prev.map(s => {
      if (s.id === sourceId) {
        return {
          ...s,
          status: 'CONNECTED',
          lastSync: 'Just now',
          recordsCollected: s.recordsCollected + addedRecords
        };
      }
      return s;
    }));

    // Increment dynamic pipeline metrics
    setPipelineMetrics(prev => ({
      ...prev,
      rawSignals: prev.rawSignals + Math.floor(addedRecords / 8),
      normalizedSignals: prev.normalizedSignals + Math.floor(addedRecords / 14),
      throughputPerSec: prev.throughputPerSec + 40,
      lastUpdated: 'Just now'
    }));

    addToast('Source Synchronized', `Successfully ingested ${addedRecords} new telemetry records from ${src.name}`, 'success');
  };

  // Acknowledge alert
  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, acknowledged: true } : a));
    addToast('Alert Acknowledged', 'Alert status moved to reviewed triage queue', 'info');
  };

  // Dismiss alert
  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(a => a.id !== alertId));
    addToast('Alert Dismissed', 'Alert removed from active view', 'info');
  };

  // Load Demo Investigation
  const loadDemoInvestigation = () => {
    setInvestigation(DEMO_INVESTIGATION);
    setSearchQuery('suspicious-domain.example');
    setSelectedEntity(DEMO_ENTITIES[0]);
    addToast('Demo Environment Loaded', 'Populated case INV-2026-1042: Suspicious Infrastructure Cluster', 'success');
  };

  // Run Investigation Search
  const runInvestigationSearch = async (query: string) => {
    if (!query.trim()) return;
    setIsSearching(true);
    setSearchQuery(query);
    addToast('Correlating Intelligence', `Querying 8 connected OSINT feeds for "${query}"...`, 'info');

    await new Promise(r => setTimeout(r, 1400));

    // Realistic behavior: If searching the demo query or variations, return high-confidence correlation
    const isDomainQuery = query.toLowerCase().includes('domain') || query.includes('.') && !query.includes('/');
    const isIpQuery = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(query.trim());
    const isCve = query.toUpperCase().includes('CVE');

    const derivedSeverity: ThreatSeverity = isCve ? 'CRITICAL' : isIpQuery ? 'HIGH' : isDomainQuery ? 'HIGH' : 'MEDIUM';
    const derivedRisk = isCve ? 98 : isIpQuery ? 91 : isDomainQuery ? 82 : 65;

    const updatedInvestigation: Investigation = {
      ...DEMO_INVESTIGATION,
      id: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      targetQuery: query,
      severity: derivedSeverity,
      riskScore: derivedRisk,
      confidence: 88,
      title: `Correlated Investigation: ${query}`,
      lastSeen: '2026-10-04'
    };

    setInvestigation(updatedInvestigation);
    setIsSearching(false);
    addToast('Investigation Complete', `Correlated ${updatedInvestigation.entityCount} entities and ${updatedInvestigation.indicatorCount} indicators`, 'success');
  };

  // Generate Report
  const generateNewReport = async (type: ReportType, customTitle?: string): Promise<Report> => {
    addToast('Compiling Intelligence', `Synthesizing ${type.replace(/_/g, ' ')} with cryptographic audit trail...`, 'info');
    await new Promise(r => setTimeout(r, 1200));

    const newReport: Report = {
      ...DEMO_REPORT,
      id: `REP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      title: customTitle || `OSINT Analytical Report: ${investigation.title}`,
      type,
      generatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      riskScore: investigation.riskScore,
      confidence: investigation.confidence,
      indicatorsCount: investigation.indicatorCount,
      entitiesCount: investigation.entityCount
    };

    setReports(prev => [newReport, ...prev]);
    addToast('Report Generated', `Intelligence brief ${newReport.id} is ready for export and briefing`, 'success');
    return newReport;
  };

  const addIocToInvestigation = (iocData: Omit<IOC, 'id'>) => {
    const newIoc: IOC = {
      ...iocData,
      id: `IOC-${Date.now().toString().slice(-4)}`
    };
    setIocs(prev => [newIoc, ...prev]);
    addToast('IOC Registered', `Added ${newIoc.value} to active monitoring database`, 'success');
  };

  return (
    <IntelligenceContext.Provider
      value={{
        investigation,
        threats,
        iocs,
        entities,
        sources,
        alerts,
        reports,
        pipelineMetrics,
        selectedEntity,
        setSelectedEntity,
        isEntityDrawerOpen,
        setIsEntityDrawerOpen,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        searchQuery,
        setSearchQuery,
        timeFilter,
        setTimeFilter,
        isSearching,
        toasts,
        addToast,
        dismissToast,
        syncSource,
        acknowledgeAlert,
        dismissAlert,
        loadDemoInvestigation,
        runInvestigationSearch,
        generateNewReport,
        addIocToInvestigation
      }}
    >
      {children}
    </IntelligenceContext.Provider>
  );
}

export function useIntelligence() {
  const context = useContext(IntelligenceContext);
  if (!context) {
    throw new Error('useIntelligence must be used within an IntelligenceProvider');
  }
  return context;
}
