import React from 'react';
import { IntelligenceProvider } from '@/context/IntelligenceContext';
import { AppShell } from '@/components/layout/AppShell';

export const metadata = {
  title: 'SentinelOSINT | Threat Intelligence Investigation Workspace',
  description: 'Automated Open-Source Threat Intelligence (OSINT) Aggregator and SOC Investigation Platform',
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <IntelligenceProvider>
      <AppShell>
        {children}
      </AppShell>
    </IntelligenceProvider>
  );
}
