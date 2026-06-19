package com.vcscout.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "incidents")
public class Incident {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "startup_id", nullable = false)
    private Startup startup;

    @Column(nullable = false)
    private String severity; // e.g. "CRITICAL", "HIGH", "MEDIUM", "LOW"

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(name = "remediation_steps", columnDefinition = "TEXT", nullable = false)
    private String remediationSteps;

    @Column(nullable = false)
    private String status = "OPEN"; // "OPEN", "RESOLVED"

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Incident() {}

    public Incident(Startup startup, String severity, String title, String description, String remediationSteps) {
        this.startup = startup;
        this.severity = severity;
        this.title = title;
        this.description = description;
        this.remediationSteps = remediationSteps;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Startup getStartup() { return startup; }
    public void setStartup(Startup startup) { this.startup = startup; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getRemediationSteps() { return remediationSteps; }
    public void setRemediationSteps(String remediationSteps) { this.remediationSteps = remediationSteps; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
