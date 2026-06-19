import React from 'react';
import Link from 'next/link';
import { Shield, Lock, Activity, UserCheck, Eye, Terminal } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col justify-between relative overflow-hidden">
      
      {/* Background Glowing Rings */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-cyan-500/10 rounded-full filter blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-500/10 rounded-full filter blur-[150px] pointer-events-none"></div>

      {/* Navigation Header */}
      <header className="max-w-7xl mx-auto w-full px-6 py-6 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 rounded-xl border border-cyan-500/30">
            <Shield className="h-6 w-6 text-cyan-400" />
          </div>
          <div>
            <h1 className="font-bold text-base tracking-wide leading-none">VC SCOUT</h1>
            <span className="text-[10px] text-cyan-400 font-mono tracking-wider font-semibold uppercase">AI Security Agent</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 bg-emerald-500 rounded-full animate-ping"></span>
          <span className="text-xs font-mono text-emerald-400">ArmorIQ Network Secure</span>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto w-full px-6 py-16 flex flex-col items-center text-center relative z-10 my-auto">
        
        {/* Platform Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/5 border border-cyan-500/20 text-xs font-semibold text-cyan-400 mb-8 font-mono">
          <Terminal className="h-3.5 w-3.5" />
          AI-Driven Cybersecurity Due Diligence Platform
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight max-w-2xl bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-100 to-zinc-400">
          Enforcing Secure Due Diligence for Venture Capital
        </h1>

        {/* Subtitle description */}
        <p className="mt-6 text-sm sm:text-base text-zinc-400 leading-relaxed max-w-xl">
          Conduct deep security audits, GDPR compliance verification, and team verification. 
          Enforced by active, policy-gated intent boundaries utilizing the <span className="text-cyan-400 font-semibold font-mono">ArmorIQ SDK</span>.
        </p>

        {/* Call to Action */}
        <div className="mt-10">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 font-bold text-sm tracking-wide shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/35 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer text-white"
          >
            <Shield className="h-4.5 w-4.5" />
            Launch Security Console
          </Link>
        </div>

        {/* Feature Icons Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-3xl mt-20 text-left">
          
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-3">
            <GlobeCardIcon className="h-5 w-5 text-cyan-400" />
            <h3 className="font-bold text-xs text-white">SSL & Network Audits</h3>
            <p className="text-[11px] text-zinc-400 leading-relaxed">Continuous analysis of website attack surfaces and SSL certificate configurations.</p>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-3">
            <Lock className="h-5 w-5 text-yellow-400" />
            <h3 className="font-bold text-xs text-white">Compliance checks</h3>
            <p className="text-[11px] text-zinc-400 leading-relaxed">Dynamic evaluation of Privacy Policies, Terms of Service, cookie consents, and GDPR flags.</p>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-3">
            <UserCheck className="h-5 w-5 text-emerald-400" />
            <h3 className="font-bold text-xs text-white">Founder Verification</h3>
            <p className="text-[11px] text-zinc-400 leading-relaxed">Social footprint checks and identity validations to flags potential fraud vectors.</p>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-3">
            <Activity className="h-5 w-5 text-rose-400" />
            <h3 className="font-bold text-xs text-white">ArmorIQ Policy Gating</h3>
            <p className="text-[11px] text-zinc-400 leading-relaxed">Intent-aware validation layers intercepting agent actions in real time.</p>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto w-full px-6 py-8 border-t border-white/5 text-center text-xs text-zinc-500 relative z-10">
        <p>&copy; 2026 VC Scout AI. All rights reserved. Developed for Cybersecurity Hackathon 2026.</p>
      </footer>

    </div>
  );
}

// Inline fallback icon for globe
function GlobeCardIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}
