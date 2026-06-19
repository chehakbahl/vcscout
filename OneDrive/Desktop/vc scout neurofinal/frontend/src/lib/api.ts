import { Startup, Report, AuditLog, Policy, Incident } from './types';

const API_BASE = 'http://localhost:8080/api';

export async function fetchStartups(): Promise<Startup[]> {
  const res = await fetch(`${API_BASE}/startups`);
  if (!res.ok) throw new Error('Failed to fetch startups');
  return res.json();
}

export async function fetchStartupDetails(id: number): Promise<{ startup: Startup; incidents: Incident[] }> {
  const res = await fetch(`${API_BASE}/startups/${id}`);
  if (!res.ok) throw new Error('Failed to fetch startup details');
  return res.json();
}

export async function fetchReport(startupId: number): Promise<Report> {
  const res = await fetch(`${API_BASE}/reports/${startupId}`);
  if (!res.ok) throw new Error('Failed to fetch report');
  return res.json();
}

export async function analyzeStartup(name: string, websiteUrl: string, founderLinkedin: string): Promise<Startup> {
  const res = await fetch(`${API_BASE}/startups/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, websiteUrl, founderLinkedin }),
  });
  if (!res.ok) throw new Error('Failed to analyze startup');
  return res.json();
}

export async function fetchAuditLogs(): Promise<AuditLog[]> {
  const res = await fetch(`${API_BASE}/logs`);
  if (!res.ok) throw new Error('Failed to fetch audit logs');
  return res.json();
}

export async function fetchPolicies(): Promise<Policy[]> {
  const res = await fetch(`${API_BASE}/policies`);
  if (!res.ok) throw new Error('Failed to fetch policies');
  return res.json();
}

export async function savePolicy(policy: Policy): Promise<Policy> {
  const res = await fetch(`${API_BASE}/policies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(policy),
  });
  if (!res.ok) throw new Error('Failed to save policy');
  return res.json();
}

export async function fetchIncidents(): Promise<Incident[]> {
  const res = await fetch(`${API_BASE}/startups/incidents`);
  if (!res.ok) throw new Error('Failed to fetch incidents');
  return res.json();
}
