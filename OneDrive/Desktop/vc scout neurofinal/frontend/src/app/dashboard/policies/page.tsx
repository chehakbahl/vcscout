'use client';

import React, { useEffect, useState } from 'react';
import { fetchPolicies, savePolicy } from '../../../lib/api';
import { Policy } from '../../../lib/types';
import { 
  Settings, 
  Plus, 
  ShieldAlert, 
  Check, 
  X,
  Play,
  Activity,
  UserCheck,
  Globe,
  PlusCircle,
  RefreshCw
} from 'lucide-react';

export default function PolicyDashboard() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPolicy, setNewPolicy] = useState<Policy>({
    policyId: '',
    name: '',
    description: '',
    targetAgent: 'all',
    ruleType: 'BLOCK_HTTP_URL',
    ruleValue: '',
    active: true
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPoliciesList();
  }, []);

  const loadPoliciesList = async () => {
    setLoading(true);
    try {
      const allPolicies = await fetchPolicies();
      setPolicies(allPolicies);
    } catch (err) {
      console.error('Failed to load policies', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (policy: Policy) => {
    const updated = { ...policy, active: !policy.active };
    try {
      await savePolicy(updated);
      setPolicies(policies.map(p => p.policyId === policy.policyId ? updated : p));
    } catch (err) {
      console.error('Failed to toggle policy state', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPolicy.policyId || !newPolicy.name || !newPolicy.ruleType) return;
    
    setSaving(true);
    try {
      const saved = await savePolicy(newPolicy);
      setPolicies([...policies, saved]);
      setShowAddForm(false);
      // Reset form
      setNewPolicy({
        policyId: '',
        name: '',
        description: '',
        targetAgent: 'all',
        ruleType: 'BLOCK_HTTP_URL',
        ruleValue: '',
        active: true
      });
    } catch (err) {
      console.error('Failed to save policy', err);
    } finally {
      setSaving(false);
    }
  };

  const getAgentIcon = (agent: string) => {
    switch (agent) {
      case 'security_agent':
        return <Globe className="h-4.5 w-4.5 text-primary shrink-0" />;
      case 'founder_agent':
        return <UserCheck className="h-4.5 w-4.5 text-accent-yellow shrink-0" />;
      case 'compliance_agent':
        return <ShieldAlert className="h-4.5 w-4.5 text-accent-red shrink-0" />;
      default:
        return <Settings className="h-4.5 w-4.5 text-zinc-400 shrink-0" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Settings className="h-6 w-6 text-primary glow-text-cyan" />
            ArmorIQ Governance Policies
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Dynamic policy gates defining validation criteria, agent access scopes, and delegation thresholds.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 self-start sm:self-center bg-primary hover:bg-primary/95 text-white rounded-xl px-4 py-2.5 text-xs font-semibold shadow-md transition-all duration-300 cursor-pointer"
        >
          {showAddForm ? <X className="h-4.5 w-4.5" /> : <Plus className="h-4.5 w-4.5" />}
          {showAddForm ? 'Cancel Editor' : 'Register New Policy'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Dynamic policy editor form */}
        {showAddForm && (
          <div className="lg:col-span-1 glass-panel p-6 rounded-2xl border border-primary/20 relative">
            <h2 className="text-base font-bold text-white flex items-center gap-2 mb-4">
              <PlusCircle className="h-4.5 w-4.5 text-primary" />
              Policy Definition
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-text-muted font-medium mb-1 block">Policy ID Code</label>
                <input
                  type="text"
                  placeholder="e.g. POL_004"
                  value={newPolicy.policyId}
                  onChange={(e) => setNewPolicy({ ...newPolicy, policyId: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary/50"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-text-muted font-medium mb-1 block">Policy Name</label>
                <input
                  type="text"
                  placeholder="e.g. Reject Empty Website Urls"
                  value={newPolicy.name}
                  onChange={(e) => setNewPolicy({ ...newPolicy, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary/50"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-text-muted font-medium mb-1 block">Description</label>
                <textarea
                  placeholder="Summarize policy intent..."
                  value={newPolicy.description || ''}
                  onChange={(e) => setNewPolicy({ ...newPolicy, description: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white h-20 focus:outline-none focus:border-primary/50"
                />
              </div>

              <div>
                <label className="text-xs text-text-muted font-medium mb-1 block">Target Agent Scope</label>
                <select
                  value={newPolicy.targetAgent}
                  onChange={(e) => setNewPolicy({ ...newPolicy, targetAgent: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary/50"
                >
                  <option className="bg-background" value="all">Global (All Agents)</option>
                  <option className="bg-background" value="security_agent">Security Agent</option>
                  <option className="bg-background" value="founder_agent">Founder Agent</option>
                  <option className="bg-background" value="compliance_agent">Compliance Agent</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-text-muted font-medium mb-1 block">Rule Type Constraint</label>
                <select
                  value={newPolicy.ruleType}
                  onChange={(e) => setNewPolicy({ ...newPolicy, ruleType: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary/50"
                >
                  <option className="bg-background" value="BLOCK_HTTP_URL">Block Unsecured HTTP</option>
                  <option className="bg-background" value="REQUIRE_FOUNDER_LINKEDIN">Mandate LinkedIn Profile</option>
                  <option className="bg-background" value="BLOCK_SUSPICIOUS_DOMAINS">Isolate Restricted Domains</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-text-muted font-medium mb-1 block">Rule Parameter Value</label>
                <input
                  type="text"
                  placeholder="e.g. test.com,scam.org"
                  value={newPolicy.ruleValue || ''}
                  onChange={(e) => setNewPolicy({ ...newPolicy, ruleValue: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary/50"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full cyber-btn text-white rounded-xl py-3 text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all duration-300"
              >
                {saving ? (
                  <RefreshCw className="h-4.5 w-4.5 animate-spin" />
                ) : (
                  'Deploy Policy Rule'
                )}
              </button>
            </form>
          </div>
        )}

        {/* Dynamic Policies Cards grid */}
        <div className={`${showAddForm ? 'lg:col-span-2' : 'lg:col-span-3'} grid grid-cols-1 md:grid-cols-2 gap-5`}>
          {loading ? (
            <div className="col-span-full py-20 flex flex-col items-center justify-center gap-4">
              <RefreshCw className="h-8 w-8 text-primary animate-spin" />
              <p className="text-sm text-text-muted font-medium">Querying Gate Policies...</p>
            </div>
          ) : policies.length === 0 ? (
            <div className="col-span-full py-20 text-center text-text-muted">
              <Settings className="h-12 w-12 text-card-border mx-auto mb-4" />
              <p className="text-sm font-semibold text-white">No policies loaded</p>
            </div>
          ) : (
            policies.map((policy) => (
              <div
                key={policy.policyId}
                className={`glass-panel p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between h-48 relative overflow-hidden ${
                  policy.active ? 'border-card-border' : 'border-card-border opacity-60'
                }`}
              >
                {/* Top header */}
                <div className="space-y-1.5 relative z-10">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      {getAgentIcon(policy.targetAgent)}
                      <span className="text-[10px] uppercase font-bold tracking-wider font-mono text-text-muted">
                        {policy.targetAgent === 'all' ? 'GLOBAL RULE' : policy.targetAgent.replace('_', ' ')}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] font-bold text-primary bg-primary-glow px-2.5 py-0.5 rounded border border-primary/20">
                      {policy.policyId}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-white pt-1">{policy.name}</h3>
                  <p className="text-[11px] text-text-muted leading-relaxed">{policy.description}</p>
                </div>

                {/* Bottom Toggle controls */}
                <div className="flex items-center justify-between border-t border-card-border pt-3 mt-4 relative z-10">
                  <div className="text-[10px] text-text-muted font-mono">
                    Constraint: <span className="text-primary font-semibold">{policy.ruleType}</span>
                    {policy.ruleValue && (
                      <span className="text-zinc-400 block truncate max-w-[200px]">Val: {policy.ruleValue}</span>
                    )}
                  </div>
                  
                  {/* Switch */}
                  <button
                    onClick={() => handleToggleActive(policy)}
                    className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-300 focus:outline-none cursor-pointer flex items-center ${
                      policy.active ? 'bg-primary justify-end' : 'bg-white/10 justify-start'
                    }`}
                  >
                    <span className="h-5 w-5 rounded-full bg-white shadow-md block"></span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
