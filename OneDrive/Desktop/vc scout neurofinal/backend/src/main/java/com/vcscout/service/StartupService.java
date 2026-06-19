package com.vcscout.service;

import com.vcscout.model.*;
import com.vcscout.repository.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class StartupService {

    private final StartupRepository startupRepository;
    private final ReportRepository reportRepository;
    private final IncidentRepository incidentRepository;
    private final AuditLogRepository auditLogRepository;
    private final PolicyRepository policyRepository;
    private final RestTemplate restTemplate;

    @Value("${ai.service.url:http://localhost:8000}")
    private String aiServiceUrl;

    public StartupService(StartupRepository startupRepository,
                          ReportRepository reportRepository,
                          IncidentRepository incidentRepository,
                          AuditLogRepository auditLogRepository,
                          PolicyRepository policyRepository) {
        this.startupRepository = startupRepository;
        this.reportRepository = reportRepository;
        this.incidentRepository = incidentRepository;
        this.auditLogRepository = auditLogRepository;
        this.policyRepository = policyRepository;
        this.restTemplate = new RestTemplate();
    }

    @Transactional
    public Startup analyzeStartup(String name, String websiteUrl, String founderLinkedin) {
        // Save initial Startup
        Startup startup = new Startup(name, websiteUrl, founderLinkedin);
        startup = startupRepository.save(startup);

        Map<String, Object> requestPayload = new HashMap<>();
        requestPayload.put("startup_name", name);
        requestPayload.put("website_url", websiteUrl);
        requestPayload.put("founder_linkedin", founderLinkedin);

        try {
            // Trigger Python AI Agent Pipeline
            String analyzeUrl = aiServiceUrl + "/analyze";
            ResponseEntity<Map> responseEntity = restTemplate.postForEntity(analyzeUrl, requestPayload, Map.class);
            Map<String, Object> body = responseEntity.getBody();

            if (body != null && Boolean.TRUE.equals(body.get("success"))) {
                startup.setRiskScore((Integer) body.get("risk_score"));
                startup.setSecurityScore((Integer) body.get("security_score"));
                startup.setComplianceScore((Integer) body.get("compliance_score"));

                Map<String, Object> analysis = (Map<String, Object>) body.get("analysis");
                String founderRep = getReportText(analysis, "founder_report");
                String securityRep = getReportText(analysis, "security_report");
                String complianceRep = getReportText(analysis, "compliance_report");
                String finalRep = getReportText(analysis, "final_report");

                startup.setSummary(extractSummary(finalRep));
                startup = startupRepository.save(startup);

                // Save Report
                Report report = new Report(startup, founderRep, securityRep, complianceRep, finalRep);
                reportRepository.save(report);

                // Save Incidents
                List<Map<String, Object>> incidentsData = (List<Map<String, Object>>) body.get("incidents");
                if (incidentsData != null) {
                    for (Map<String, Object> inc : incidentsData) {
                        Incident incident = new Incident(
                                startup,
                                (String) inc.get("severity"),
                                (String) inc.get("title"),
                                (String) inc.get("description"),
                                (String) inc.get("remediation_steps")
                        );
                        incidentRepository.save(incident);
                    }
                }

                // Sync Audit Logs from Python ArmorIQ Engine
                syncAuditLogs();
            } else {
                throw new RuntimeException("AI Agent returned failed status");
            }
        } catch (Exception e) {
            System.err.println("Error calling AI Agent Microservice: " + e.getMessage() + ". Executing fallback demo mode.");
            executeFallbackMode(startup, websiteUrl, founderLinkedin);
        }

        return startup;
    }

    private String getReportText(Map<String, Object> analysis, String key) {
        if (analysis == null || !analysis.containsKey(key)) return "";
        Map<String, Object> item = (Map<String, Object>) analysis.get(key);
        return item != null ? (String) item.get("raw_report") : "";
    }

    private String extractSummary(String markdownReport) {
        if (markdownReport == null) return "";
        // Extract Executive Summary from report or return a truncated section
        int start = markdownReport.indexOf("Executive Summary");
        if (start != -1) {
            int end = markdownReport.indexOf("##", start + 20);
            if (end != -1) {
                return markdownReport.substring(start, end).trim();
            }
            return markdownReport.substring(start).trim();
        }
        return markdownReport.length() > 500 ? markdownReport.substring(0, 500) + "..." : markdownReport;
    }

    private void executeFallbackMode(Startup startup, String url, String linkedin) {
        // Compute mock fallback scores
        int security = url.startsWith("https://") ? 80 : 45;
        int compliance = (linkedin != null && linkedin.contains("linkedin.com")) ? 85 : 50;
        int risk = 100 - (security + compliance) / 2;

        startup.setSecurityScore(security);
        startup.setComplianceScore(compliance);
        startup.setRiskScore(risk);
        startup.setSummary("Fallback Evaluation: System analyzed " + startup.getName() + " with fallback engine. Potential SSL or identity exposures present.");
        startupRepository.save(startup);

        // Create mock reports
        String founderRep = "### Fallback Founder Verification\nLinkedIn URL: " + linkedin + "\nStatus: Evaluated with minor risks.";
        String securityRep = "### Fallback Security Audit\nWebsite: " + url + "\nSSL: " + (url.startsWith("https://") ? "Active" : "MISSING") + ".";
        String complianceRep = "### Fallback Compliance Audit\nCookie banner and GDPR statements are missing or unvalidated.";
        String finalRep = "# Consolidated Fallback Report for " + startup.getName() + "\n\n## Executive Summary\nPotential security and identity policies unverified. Risk score: " + risk;

        Report report = new Report(startup, founderRep, securityRep, complianceRep, finalRep);
        reportRepository.save(report);

        // Log fallbacks
        AuditLog log1 = new AuditLog(LocalDateTime.now(), "security_agent", "AUDIT_WEBSITE", url, url.startsWith("https://") ? "ALLOW" : "DENY", "POL_001", "Fallback checked SSL settings.");
        auditLogRepository.save(log1);

        if (linkedin == null || !linkedin.contains("linkedin.com")) {
            AuditLog log2 = new AuditLog(LocalDateTime.now(), "founder_agent", "VERIFY_FOUNDER", linkedin, "DELEGATE", "POL_002", "LinkedIn check missing. Delegating to human review.");
            auditLogRepository.save(log2);

            Incident inc = new Incident(startup, "HIGH", "Founder LinkedIn Verification Delegated", "Founder LinkedIn is missing or not pointing to linkedin.com.", "Contact founder and request valid LinkedIn credentials.");
            incidentRepository.save(inc);
        }

        if (!url.startsWith("https://")) {
            Incident inc = new Incident(startup, "CRITICAL", "Insecure Endpoint: Missing SSL Encryption", "Startup website is not secured with HTTPS, enabling man-in-the-middle attacks.", "Require startup to deploy valid SSL certificates.");
            incidentRepository.save(inc);
        }
    }

    public void syncAuditLogs() {
        try {
            String logsUrl = aiServiceUrl + "/logs";
            ResponseEntity<List> responseEntity = restTemplate.getForEntity(logsUrl, List.class);
            List<Map<String, Object>> logs = responseEntity.getBody();

            if (logs != null) {
                // Clear and re-populate to prevent duplicates, or merge. Let's merge based on timestamp/actor/action.
                auditLogRepository.deleteAll(); // Simple sync for demo
                for (Map<String, Object> log : logs) {
                    AuditLog auditLog = new AuditLog(
                            LocalDateTime.parse(((String) log.get("timestamp")).replace("Z", "")),
                            (String) log.get("actor"),
                            (String) log.get("action"),
                            (String) log.get("target"),
                            (String) log.get("verdict"),
                            (String) log.get("policy_id"),
                            (String) log.get("details")
                    );
                    auditLogRepository.save(auditLog);
                }
            }
        } catch (Exception e) {
            System.err.println("Failed to sync audit logs: " + e.getMessage());
        }
    }

    public List<Startup> getAllStartups() {
        return startupRepository.findAllByOrderByIdDesc();
    }

    public Startup getStartupById(Long id) {
        return startupRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Startup not found"));
    }

    public Report getReportByStartupId(Long startupId) {
        return reportRepository.findByStartupId(startupId).orElseThrow(() -> new NoSuchElementException("Report not found"));
    }

    public List<AuditLog> getAuditLogs() {
        syncAuditLogs(); // Try syncing first
        return auditLogRepository.findAllByOrderByTimestampDesc();
    }

    public List<Incident> getAllIncidents() {
        return incidentRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Incident> getIncidentsByStartupId(Long startupId) {
        return incidentRepository.findByStartupId(startupId);
    }

    @Transactional
    public Policy savePolicy(Policy policy) {
        // Sync to Python agent first
        try {
            String policyUrl = aiServiceUrl + "/policies";
            Map<String, Object> payload = new HashMap<>();
            payload.put("id", policy.getPolicyId());
            payload.put("name", policy.getName());
            payload.put("description", policy.getDescription());
            payload.put("target_agent", policy.getTargetAgent());
            payload.put("rule_type", policy.getRuleType());
            payload.put("rule_value", policy.getRuleValue());
            payload.put("active", policy.getActive());

            restTemplate.postForObject(policyUrl, payload, Map.class);
        } catch (Exception e) {
            System.err.println("Failed to propagate policy to Python AI Agent: " + e.getMessage());
        }

        return policyRepository.save(policy);
    }

    public List<Policy> getPolicies() {
        // Populate default policies if database is empty
        List<Policy> dbPolicies = policyRepository.findAll();
        if (dbPolicies.isEmpty()) {
            List<Policy> defaults = Arrays.asList(
                    new Policy("POL_001", "Enforce HTTPS Security", "Block website audits if the URL does not start with https://", "security_agent", "BLOCK_HTTP_URL", "true", true),
                    new Policy("POL_002", "Mandatory Founder Verification", "Delegate review if founder LinkedIn profile is missing or invalid.", "founder_agent", "REQUIRE_FOUNDER_LINKEDIN", "true", true),
                    new Policy("POL_003", "Isolate Suspicious Domains", "Delegate review if URL host matches suspicious hosts.", "all", "BLOCK_SUSPICIOUS_DOMAINS", "test.com,blogspot.com,wordpress.com", true)
            );
            policyRepository.saveAll(defaults);
            return defaults;
        }
        return dbPolicies;
    }
}
