'use client';

import React, { useEffect, useState } from 'react';
import { 
  fetchStartups, 
  fetchStartupDetails, 
  fetchReport, 
  analyzeStartup, 
  fetchIncidents 
} from '../../lib/api';
import { Startup, Incident, Report } from '../../lib/types';
import { 
  Play, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  FileText, 
  ArrowRight,
  TrendingDown,
  Lock,
  Cpu,
  RefreshCw,
  Shield
} from 'lucide-react';

export default function SecurityOverview() {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null);
  const [selectedIncidents, setSelectedIncidents] = useState<Incident[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({ name: '', websiteUrl: '', founderLinkedin: '' });
  const [loading, setLoading] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Navigation tabs for reports
  const [activeReportTab, setActiveReportTab] = useState<'final' | 'founder' | 'security' | 'compliance'>('final');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const allStartups = await fetchStartups();
      const allIncidents = await fetchIncidents();
      setStartups(allStartups);
      setIncidents(allIncidents);
      
      // Auto-select first startup if any
      if (allStartups.length > 0 && !selectedId) {
        handleSelectStartup(allStartups[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectStartup = async (id: number) => {
    setSelectedId(id);
    setLoadingDetail(true);
    try {
      const details = await fetchStartupDetails(id);
      setSelectedStartup(details.startup);
      setSelectedIncidents(details.incidents);
      
      const report = await fetchReport(id);
      setSelectedReport(report);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.websiteUrl) return;
    
    setLoading(true);
    setError(null);
    try {
      const newStartup = await analyzeStartup(
        formData.name,
        formData.websiteUrl,
        formData.founderLinkedin
      );
      
      // Reset form
      setFormData({ name: '', websiteUrl: '', founderLinkedin: '' });
      
      // Refresh list
      await loadDashboardData();
      
      // Select new startup
      await handleSelectStartup(newStartup.id);
    } catch (err) {
      setError('Analysis failed. The action may have been BLOCKED or DELEGATED by active ArmorIQ policies. Verify logs.');
      loadDashboardData(); // Refresh logs/startups anyway to capture block trail
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number, type: 'risk' | 'safety') => {
    if (type === 'risk') {
      if (score >= 70) return 'text-accent-red border-accent-red/20 bg-accent-red/5';
      if (score >= 40) return 'text-accent-yellow border-accent-yellow/20 bg-accent-yellow/5';
      return 'text-accent-green border-accent-green/20 bg-accent-green/5';
    } else {
      if (score >= 80) return 'text-accent-green border-accent-green/20 bg-accent-green/5';
      if (score >= 50) return 'text-accent-yellow border-accent-yellow/20 bg-accent-yellow/5';
      return 'text-accent-red border-accent-red/20 bg-accent-red/5';
    }
  };

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-red-500/10 text-red-500 border border-red-500/20';
      case 'HIGH':
        return 'bg-accent-yellow/10 text-accent-yellow border border-accent-yellow/20';
      case 'MEDIUM':
        return 'bg-blue-500/10 text-blue-500 border border-blue-500/20';
      default:
        return 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="glass-panel p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs text-text-muted font-medium">Evaluated Startups</p>
            <h3 className="text-2xl font-bold text-white mt-1">{startups.length}</h3>
          </div>
          <div className="p-3 bg-primary-glow rounded-xl">
            <Cpu className="h-5 w-5 text-primary" />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs text-text-muted font-medium">Open Security Incidents</p>
            <h3 className="text-2xl font-bold text-accent-red glow-text-red mt-1">
              {incidents.filter(i => i.status === 'OPEN').length}
            </h3>
          </div>
          <div className="p-3 bg-accent-red/10 rounded-xl">
            <AlertTriangle className="h-5 w-5 text-accent-red" />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs text-text-muted font-medium">Compliance Flags</p>
            <h3 className="text-2xl font-bold text-accent-yellow mt-1">
              {incidents.filter(i => i.title.toLowerCase().includes('compliance') || i.title.toLowerCase().includes('gdpr')).length}
            </h3>
          </div>
          <div className="p-3 bg-accent-yellow/10 rounded-xl">
            <Lock className="h-5 w-5 text-accent-yellow" />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs text-text-muted font-medium">Avg. Security Score</p>
            <h3 className="text-2xl font-bold text-accent-green glow-text-green mt-1">
              {startups.length > 0 
                ? Math.round(startups.reduce((acc, curr) => acc + curr.securityScore, 0) / startups.length)
                : 0}%
            </h3>
          </div>
          <div className="p-3 bg-accent-green/10 rounded-xl">
            <CheckCircle className="h-5 w-5 text-accent-green" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Form and Startup List */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Analyze Startup Trigger Form */}
          <div className="glass-panel p-6 rounded-2xl border border-card-border relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary-glow rounded-full filter blur-xl opacity-30"></div>
            <h2 className="text-base font-bold text-white flex items-center gap-2 mb-4">
              <Play className="h-4.5 w-4.5 text-primary animate-pulse" />
              Evaluate New Target
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-text-muted font-medium mb-1 block">Startup Name</label>
                <input
                  type="text"
                  placeholder="e.g. Acme Inc"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary/50 focus:bg-white/[0.08]"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-text-muted font-medium mb-1 block">Website Domain URL</label>
                <input
                  type="text"
                  placeholder="e.g. https://acme.com"
                  value={formData.websiteUrl}
                  onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary/50 focus:bg-white/[0.08]"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-text-muted font-medium mb-1 block">Founder LinkedIn Profile</label>
                <input
                  type="text"
                  placeholder="e.g. https://linkedin.com/in/name"
                  value={formData.founderLinkedin}
                  onChange={(e) => setFormData({ ...formData, founderLinkedin: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary/50 focus:bg-white/[0.08]"
                />
              </div>

              {error && (
                <div className="p-3 bg-accent-red/10 border border-accent-red/20 rounded-xl flex gap-2">
                  <XCircle className="h-4 w-4 text-accent-red shrink-0 mt-0.5" />
                  <p className="text-xs text-accent-red">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full cyber-btn text-white rounded-xl py-3 text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all duration-300"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4.5 w-4.5 animate-spin" />
                    Engaging Agents...
                  </>
                ) : (
                  <>
                    <Cpu className="h-4.5 w-4.5" />
                    Trigger Multi-Agent Analysis
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Startup Registry Feed */}
          <div className="glass-panel p-6 rounded-2xl border border-card-border">
            <h2 className="text-base font-bold text-white mb-4">Startups Queue</h2>
            {startups.length === 0 ? (
              <p className="text-xs text-text-muted text-center py-8">No startup audits registered yet.</p>
            ) : (
              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                {startups.map((startup) => (
                  <button
                    key={startup.id}
                    onClick={() => handleSelectStartup(startup.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-center justify-between cursor-pointer ${
                      selectedId === startup.id
                        ? 'bg-primary-glow/10 border-primary/30 shadow-md'
                        : 'bg-white/[0.02] border-card-border hover:bg-white/5'
                    }`}
                  >
                    <div>
                      <h4 className="font-bold text-sm text-white">{startup.name}</h4>
                      <p className="text-[11px] text-text-muted truncate max-w-[150px]">{startup.websiteUrl}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-[10px] text-text-muted font-semibold block uppercase">Risk Score</span>
                        <span className="font-bold text-sm text-white">{startup.riskScore}/100</span>
                      </div>
                      <div className={`h-8 w-8 rounded-full border flex items-center justify-center font-bold text-xs font-mono ${
                        getScoreColor(startup.riskScore, 'risk')
                      }`}>
                        {startup.riskScore}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Selected Startup details */}
        <div className="lg:col-span-2 space-y-6">
          {loadingDetail ? (
            <div className="glass-panel p-8 rounded-2xl min-h-[500px] flex flex-col items-center justify-center gap-4">
              <RefreshCw className="h-8 w-8 text-primary animate-spin" />
              <p className="text-sm text-text-muted font-medium">Reconstructing Agent Findings...</p>
            </div>
          ) : selectedStartup ? (
            <>
              {/* Detailed Score Cards and Metadata Header */}
              <div className="glass-panel p-6 rounded-2xl border border-card-border">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-card-border pb-5 mb-5">
                  <div>
                    <h1 className="text-xl font-bold text-white">{selectedStartup.name}</h1>
                    <a 
                      href={selectedStartup.websiteUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-xs text-primary hover:underline font-medium mt-1 inline-block"
                    >
                      {selectedStartup.websiteUrl}
                    </a>
                  </div>
                  <div className="text-xs text-text-muted bg-white/5 border border-card-border px-3.5 py-1.5 rounded-full font-mono">
                    Audited: {new Date(selectedStartup.createdAt).toLocaleString()}
                  </div>
                </div>

                {/* Score Dials Display */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="bg-white/[0.02] border border-card-border p-4 rounded-xl flex flex-col items-center text-center">
                    <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-2">Overall Risk</span>
                    <div className={`h-16 w-16 rounded-full border-2 flex items-center justify-center text-lg font-bold font-mono ${
                      getScoreColor(selectedStartup.riskScore, 'risk')
                    }`}>
                      {selectedStartup.riskScore}
                    </div>
                    <span className="text-xs font-semibold text-white mt-2">
                      {selectedStartup.riskScore >= 70 ? 'High Exposure' : selectedStartup.riskScore >= 40 ? 'Moderate' : 'Secure'}
                    </span>
                  </div>

                  <div className="bg-white/[0.02] border border-card-border p-4 rounded-xl flex flex-col items-center text-center">
                    <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-2">Security Posture</span>
                    <div className={`h-16 w-16 rounded-full border-2 flex items-center justify-center text-lg font-bold font-mono ${
                      getScoreColor(selectedStartup.securityScore, 'safety')
                    }`}>
                      {selectedStartup.securityScore}
                    </div>
                    <span className="text-xs font-semibold text-white mt-2">
                      {selectedStartup.securityScore >= 80 ? 'Robust' : selectedStartup.securityScore >= 50 ? 'Gaps Detected' : 'Vulnerable'}
                    </span>
                  </div>

                  <div className="bg-white/[0.02] border border-card-border p-4 rounded-xl flex flex-col items-center text-center">
                    <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-2">Legal Compliance</span>
                    <div className={`h-16 w-16 rounded-full border-2 flex items-center justify-center text-lg font-bold font-mono ${
                      getScoreColor(selectedStartup.complianceScore, 'safety')
                    }`}>
                      {selectedStartup.complianceScore}
                    </div>
                    <span className="text-xs font-semibold text-white mt-2">
                      {selectedStartup.complianceScore >= 80 ? 'Compliant' : selectedStartup.complianceScore >= 50 ? 'Medium Risk' : 'Violations'}
                    </span>
                  </div>
                </div>

                {/* AI Executive Summary Block */}
                {selectedStartup.summary && (
                  <div className="bg-primary-glow/5 border border-primary/20 p-5 rounded-xl">
                    <h3 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-2 mb-2">
                      <Cpu className="h-4 w-4" />
                      Executive Summary
                    </h3>
                    <p className="text-sm leading-relaxed text-zinc-300">{selectedStartup.summary.replace("Executive Summary", "").trim()}</p>
                  </div>
                )}
              </div>

              {/* Incidents / Alerts Panel */}
              <div className="glass-panel p-6 rounded-2xl border border-card-border">
                <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-accent-red animate-pulse" />
                  Incident Response Feed
                </h2>
                {selectedIncidents.length === 0 ? (
                  <div className="p-5 bg-accent-green/5 border border-accent-green/20 rounded-xl flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-accent-green" />
                    <p className="text-xs text-accent-green font-medium">No critical risks detected. Startup currently complies with baseline security policies.</p>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {selectedIncidents.map((inc) => (
                      <div key={inc.id} className="bg-white/[0.02] border border-card-border p-4 rounded-xl space-y-2">
                        <div className="flex items-center justify-between gap-4">
                          <h4 className="font-bold text-sm text-white">{inc.title}</h4>
                          <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold font-mono ${getSeverityBadge(inc.severity)}`}>
                            {inc.severity}
                          </span>
                        </div>
                        <p className="text-xs text-text-muted leading-relaxed">{inc.description}</p>
                        <div className="border-t border-card-border pt-2 mt-2">
                          <p className="text-[11px] font-bold text-accent-green flex items-center gap-1.5">
                            <ArrowRight className="h-3 w-3 shrink-0" />
                            Remediation Action Plan:
                          </p>
                          <p className="text-xs text-zinc-300 italic mt-0.5 pl-4">{inc.remediationSteps}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Multi-Agent Report Panel (Markdown output switcher) */}
              <div className="glass-panel p-6 rounded-2xl border border-card-border">
                <div className="border-b border-card-border pb-4 mb-4 flex items-center justify-between flex-wrap gap-4">
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Agent Verification Reports
                  </h2>
                  
                  {/* Selector Tabs */}
                  <div className="flex p-0.5 bg-white/5 border border-card-border rounded-xl">
                    {(['final', 'founder', 'security', 'compliance'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveReportTab(tab)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg capitalize cursor-pointer transition-all duration-300 ${
                          activeReportTab === tab
                            ? 'bg-primary text-white shadow-sm'
                            : 'text-text-muted hover:text-white'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Report Content */}
                <div className="bg-white/[0.01] border border-card-border rounded-xl p-6 text-sm text-zinc-300 font-sans leading-relaxed max-h-[500px] overflow-y-auto">
                  {selectedReport ? (
                    (() => {
                      let text = '';
                      switch (activeReportTab) {
                        case 'founder':
                          text = selectedReport.founderReport || 'No founder analysis output logged.';
                          break;
                        case 'security':
                          text = selectedReport.securityReport || 'No security audit output logged.';
                          break;
                        case 'compliance':
                          text = selectedReport.complianceReport || 'No compliance audit output logged.';
                          break;
                        default:
                          text = selectedReport.finalReport || 'No consolidated audit output logged.';
                      }

                      // Dynamic basic markdown formatter helper
                      return (
                        <div className="space-y-4 font-normal">
                          {text.split('\n\n').map((para, i) => {
                            if (para.startsWith('### ')) {
                              return <h4 key={i} className="text-sm font-bold text-white border-b border-card-border pb-1 mt-4">{para.replace('### ', '')}</h4>;
                            }
                            if (para.startsWith('## ')) {
                              return <h3 key={i} className="text-base font-bold text-primary mt-6">{para.replace('## ', '')}</h3>;
                            }
                            if (para.startsWith('# ')) {
                              return <h2 key={i} className="text-lg font-bold text-white border-b border-card-border pb-2 glow-text-cyan">{para.replace('# ', '')}</h2>;
                            }
                            if (para.startsWith('- ')) {
                              return (
                                <ul key={i} className="list-disc pl-5 space-y-1 my-2">
                                  {para.split('\n').map((li, j) => (
                                    <li key={j} className="text-xs text-zinc-300">{li.replace('- ', '')}</li>
                                  ))}
                                </ul>
                              );
                            }
                            if (para.startsWith('1. ') || para.startsWith('2. ') || para.startsWith('3. ')) {
                              return (
                                <ol key={i} className="list-decimal pl-5 space-y-1.5 my-2">
                                  {para.split('\n').map((li, j) => (
                                    <li key={j} className="text-xs text-zinc-300">{li.substring(3)}</li>
                                  ))}
                                </ol>
                              );
                            }
                            return <p key={i} className="text-xs text-zinc-300">{para}</p>;
                          })}
                        </div>
                      );
                    })()
                  ) : (
                    <p className="text-xs text-text-muted text-center py-6">No report logged for selection.</p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="glass-panel p-8 rounded-2xl min-h-[500px] flex flex-col items-center justify-center text-center">
              <Shield className="h-16 w-16 text-card-border mb-4" />
              <h3 className="text-lg font-bold text-white">No Target Selected</h3>
              <p className="text-xs text-text-muted mt-2 max-w-sm">
                Add a startup via the left panel to launch the multi-agent cybersecurity due-diligence audit, or select one from the queue.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
