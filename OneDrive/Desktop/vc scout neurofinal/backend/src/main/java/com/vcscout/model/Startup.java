package com.vcscout.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "startups")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Startup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "website_url", nullable = false)
    private String websiteUrl;

    @Column(name = "founder_linkedin")
    private String founderLinkedin;

    @Column(name = "risk_score")
    private Integer riskScore = 0;

    @Column(name = "security_score")
    private Integer securityScore = 0;

    @Column(name = "compliance_score")
    private Integer complianceScore = 0;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Startup() {}

    public Startup(String name, String websiteUrl, String founderLinkedin) {
        this.name = name;
        this.websiteUrl = websiteUrl;
        this.founderLinkedin = founderLinkedin;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getWebsiteUrl() { return websiteUrl; }
    public void setWebsiteUrl(String websiteUrl) { this.websiteUrl = websiteUrl; }

    public String getFounderLinkedin() { return founderLinkedin; }
    public void setFounderLinkedin(String founderLinkedin) { this.founderLinkedin = founderLinkedin; }

    public Integer getRiskScore() { return riskScore; }
    public void setRiskScore(Integer riskScore) { this.riskScore = riskScore; }

    public Integer getSecurityScore() { return securityScore; }
    public void setSecurityScore(Integer securityScore) { this.securityScore = securityScore; }

    public Integer getComplianceScore() { return complianceScore; }
    public void setComplianceScore(Integer complianceScore) { this.complianceScore = complianceScore; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
