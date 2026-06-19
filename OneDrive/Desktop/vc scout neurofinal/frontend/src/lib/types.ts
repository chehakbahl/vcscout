export interface Startup {
  id: number;
  name: string;
  websiteUrl: string;
  founderLinkedin: string | null;
  riskScore: number;
  securityScore: number;
  complianceScore: number;
  summary: string | null;
  createdAt: string;
}

export interface Report {
  id: number;
  startupId: number;
  founderReport: string | null;
  securityReport: string | null;
  complianceReport: string | null;
  finalReport: string | null;
  createdAt: string;
}

export interface Incident {
  id: number;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  description: string;
  remediationSteps: string;
  status: 'OPEN' | 'RESOLVED';
  createdAt: string;
}

export interface AuditLog {
  id: number;
  timestamp: string;
  actor: string;
  action: string;
  target: string | null;
  verdict: 'ALLOW' | 'DENY' | 'DELEGATE';
  policyId: string | null;
  details: string | null;
}

export interface Policy {
  id?: number;
  policyId: string;
  name: string;
  description: string | null;
  targetAgent: string;
  ruleType: string;
  ruleValue: string | null;
  active: boolean;
}
