'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Settings, FileText, Activity } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Security Overview', href: '/dashboard', icon: Shield },
    { name: 'Policy Control', href: '/dashboard/policies', icon: Settings },
    { name: 'ArmorIQ Logs', href: '/dashboard/logs', icon: Activity },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar Navigation */}
      <aside className="w-64 glass-panel border-r border-card-border flex flex-col justify-between p-6">
        <div>
          {/* Logo Brand Header */}
          <div className="flex items-center gap-3 mb-10">
            <div className="p-2.5 bg-primary-glow rounded-xl border border-primary/30">
              <Shield className="h-6.5 w-6.5 text-primary glow-text-cyan animate-pulse" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-wide text-white">VC SCOUT</h1>
              <p className="text-[10px] text-primary tracking-wider uppercase font-semibold">AI Security Agent</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-300 font-medium text-sm ${
                    isActive
                      ? 'bg-primary-glow text-primary border border-primary/20 shadow-md'
                      : 'text-text-muted hover:bg-white/5 hover:text-white border border-transparent'
                  }`}
                >
                  <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-primary' : 'text-text-muted'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Attribution */}
        <div className="border-t border-card-border pt-4 text-center">
          <p className="text-[11px] text-text-muted">Cybersecurity Hackathon 2026</p>
          <span className="text-[9px] text-primary font-mono opacity-80 mt-1 block">Powered by ArmorIQ Intent Engine</span>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-card-border glass-panel flex items-center justify-between px-8 z-10">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 bg-accent-green rounded-full animate-pulse"></span>
            <span className="text-xs font-mono font-medium text-accent-green tracking-wide">
              ArmorIQ Policy Gate: Enforcing Active Controls
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col text-right">
              <span className="text-xs font-semibold text-white">Investment Associate</span>
              <span className="text-[10px] text-text-muted">Compliance Auditor</span>
            </div>
            <div className="h-9 w-9 bg-primary-glow border border-primary/25 rounded-full flex items-center justify-center font-bold text-primary font-mono">
              IA
            </div>
          </div>
        </header>

        {/* Dynamic Pages Render */}
        <div className="flex-1 overflow-y-auto p-8 relative">
          {/* Neon background decorations */}
          <div className="absolute top-20 right-20 w-80 h-80 bg-primary-glow rounded-full filter blur-[150px] pointer-events-none opacity-20"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-blue-500/10 rounded-full filter blur-[150px] pointer-events-none opacity-10"></div>
          
          <div className="relative z-10 max-w-7xl mx-auto h-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
