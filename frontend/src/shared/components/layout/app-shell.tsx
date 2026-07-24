'use client';

import React, { useState } from 'react';
import { Header } from '@/shared/components/layout/header';
import { Sidebar } from '@/shared/components/layout/sidebar';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen((prev) => !prev)} />
        <main className="flex-1 overflow-y-auto p-6 animate-fade-in scrollbar-thin">
          {children}
        </main>
      </div>
    </div>
  );
};
