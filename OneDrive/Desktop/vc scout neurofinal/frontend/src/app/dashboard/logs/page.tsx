'use client';

import React, { useEffect, useState } from 'react';
import { fetchAuditLogs } from '../../../lib/api';
import { AuditLog } from '../../../lib/types';
import { 
  Activity, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Search,
  SlidersHorizontal
} from 'lucide-react';

export default function AuditLogsDashboard() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter state
  const [search, setSearch] = useState('');
  const [verdictFilter, setVerdictFilter] = useState<'ALL' | 'ALLOW' | 'DENY' | 'DELEGATE'>('ALL');

  useEffect(() => {
    loadLogs();
  }, []);

  useEffect(() => {
    let result = logs;
    
    // Filter by search query
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(log => 
        log.actor.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        (log.target && log.target.toLowerCase().includes(q)) ||
        (log.details && log.details.toLowerCase().includes(q)) ||
        (log.policyId && log.policyId.toLowerCase().includes(q))
      );
    }
    
    // Filter by verdict
    if (verdictFilter !== 'ALL') {
      result = result.filter(log => log.verdict === verdictFilter);
    }
    
    setFilteredLogs(result);
  }, [search, verdictFilter, logs]);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const allLogs = await fetchAuditLogs();
      setLogs(allLogs);
    } catch (err) {
      console.error('Failed to load logs', err);
    } finally {
      setLoading(false);
    }
  };

  const getVerdictBadge = (verdict: string) => {
    switch (verdict) {
      case 'ALLOW':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-green/15 text-accent-green border border-accent-green/20 text-[10px] font-bold tracking-wider font-mono uppercase">
            <CheckCircle2 className="h-3.5 w-3.5" />
            ALLOW
          </span>
        );
      case 'DENY':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-red/15 text-accent-red border border-accent-red/20 text-[10px] font-bold tracking-wider font-mono uppercase">
            <XCircle className="h-3.5 w-3.5" />
            DENY
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-yellow/15 text-accent-yellow border border-accent-yellow/20 text-[10px] font-bold tracking-wider font-mono uppercase">
            <AlertTriangle className="h-3.5 w-3.5" />
            DELEGATE
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary glow-text-cyan" />
            ArmorIQ Policy Audit Trails
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Real-time tracking of AI agent intents, execution boundaries, and policy enforcements.
          </p>
        </div>

        <button
          onClick={loadLogs}
          disabled={loading}
          className="flex items-center gap-2 self-start sm:self-center bg-white/5 hover:bg-white/10 border border-card-border hover:border-white/20 rounded-xl px-4 py-2.5 text-xs text-white font-semibold transition-all duration-300 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Logs
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-card-border flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search by actor, target, policy ID, or details..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-primary/50 focus:bg-white/[0.08]"
          />
        </div>

        {/* Verdict Filters */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto py-1">
          <SlidersHorizontal className="h-4 w-4 text-text-muted shrink-0 mr-2" />
          {(['ALL', 'ALLOW', 'DENY', 'DELEGATE'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setVerdictFilter(filter)}
              className={`text-[11px] font-bold px-3.5 py-1.5 rounded-lg tracking-wide shrink-0 transition-all duration-300 cursor-pointer ${
                verdictFilter === filter
                  ? 'bg-primary text-white'
                  : 'bg-white/5 border border-card-border text-text-muted hover:text-white'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Table */}
      <div className="glass-panel rounded-2xl border border-card-border overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4">
            <RefreshCw className="h-8 w-8 text-primary animate-spin" />
            <p className="text-sm text-text-muted font-medium">Synchronizing Audit Records...</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="py-20 text-center text-text-muted">
            <Activity className="h-12 w-12 text-card-border mx-auto mb-4" />
            <p className="text-sm font-semibold text-white">No logs found</p>
            <p className="text-xs mt-1">Try clearing filters or running a startup analysis.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-card-border bg-white/[0.02] text-[10px] font-bold uppercase tracking-wider text-text-muted">
                  <th className="py-4 px-6">Timestamp</th>
                  <th className="py-4 px-6">Agent Actor</th>
                  <th className="py-4 px-6">Action Checked</th>
                  <th className="py-4 px-6">Target Surface</th>
                  <th className="py-4 px-6">Policy Gate Verdict</th>
                  <th className="py-4 px-6">Policy ID</th>
                  <th className="py-4 px-6">Details / Explanations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-card-border text-xs">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.01] transition-colors duration-200">
                    {/* Timestamp */}
                    <td className="py-4.5 px-6 font-mono text-[11px] text-text-muted shrink-0">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    
                    {/* Actor */}
                    <td className="py-4.5 px-6 font-bold text-white font-mono">
                      {log.actor}
                    </td>
                    
                    {/* Action */}
                    <td className="py-4.5 px-6 font-medium text-zinc-300">
                      <span className="bg-white/5 border border-card-border px-2 py-0.5 rounded font-mono text-[10px]">
                        {log.action}
                      </span>
                    </td>
                    
                    {/* Target */}
                    <td className="py-4.5 px-6 text-primary truncate max-w-[150px] font-mono text-[11px]" title={log.target || ''}>
                      {log.target || 'N/A'}
                    </td>
                    
                    {/* Verdict */}
                    <td className="py-4.5 px-6 shrink-0">
                      {getVerdictBadge(log.verdict)}
                    </td>
                    
                    {/* Policy ID */}
                    <td className="py-4.5 px-6 font-mono font-semibold text-accent-yellow">
                      {log.policyId || '-'}
                    </td>
                    
                    {/* Details */}
                    <td className="py-4.5 px-6 text-text-muted leading-relaxed max-w-sm">
                      {log.details || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
