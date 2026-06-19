package com.vcscout.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "startup_id", referencedColumnName = "id", nullable = false)
    private Startup startup;

    @Column(name = "founder_report", columnDefinition = "TEXT")
    private String founderReport;

    @Column(name = "security_report", columnDefinition = "TEXT")
    private String securityReport;

    @Column(name = "compliance_report", columnDefinition = "TEXT")
    private String complianceReport;

    @Column(name = "final_report", columnDefinition = "TEXT")
    private String finalReport;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Report() {}

    public Report(Startup startup, String founderReport, String securityReport, String complianceReport, String finalReport) {
        this.startup = startup;
        this.founderReport = founderReport;
        this.securityReport = securityReport;
        this.complianceReport = complianceReport;
        this.finalReport = finalReport;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Startup getStartup() { return startup; }
    public void setStartup(Startup startup) { this.startup = startup; }

    public String getFounderReport() { return founderReport; }
    public void setFounderReport(String founderReport) { this.founderReport = founderReport; }

    public String getSecurityReport() { return securityReport; }
    public void setSecurityReport(String securityReport) { this.securityReport = securityReport; }

    public String getComplianceReport() { return complianceReport; }
    public void setComplianceReport(String complianceReport) { this.complianceReport = complianceReport; }

    public String getFinalReport() { return finalReport; }
    public void setFinalReport(String finalReport) { this.finalReport = finalReport; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
