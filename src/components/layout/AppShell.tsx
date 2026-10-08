'use client';

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';
import { CommandPalette } from './CommandPalette';
import { ToastContainer } from '../ui/ToastContainer';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
      <div className="flex flex-1 min-h-screen overflow-hidden">
        {/* Persistent Desktop Sidebar / Mobile Drawer */}
        <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

        {/* Center Workspace Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <TopHeader onMenuToggle={() => setMobileOpen(!mobileOpen)} />

          <main className="flex-1 p-4 lg:p-6 max-w-7xl w-full mx-auto space-y-6">
            {children}
          </main>
        </div>
      </div>

      {/* Global Interactive Command Palette (Cmd + K) */}
      <CommandPalette />

      {/* Real-time Toasts */}
      <ToastContainer />
    </div>
  );
}
