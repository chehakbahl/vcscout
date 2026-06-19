package com.vcscout.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime timestamp = LocalDateTime.now();

    @Column(nullable = false)
    private String actor;

    @Column(nullable = false)
    private String action;

    private String target;

    @Column(nullable = false)
    private String verdict;

    @Column(name = "policy_id")
    private String policyId;

    @Column(columnDefinition = "TEXT")
    private String details;

    public AuditLog() {}

    public AuditLog(LocalDateTime timestamp, String actor, String action, String target, String verdict, String policyId, String details) {
        this.timestamp = timestamp;
        this.actor = actor;
        this.action = action;
        this.target = target;
        this.verdict = verdict;
        this.policyId = policyId;
        this.details = details;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public String getActor() { return actor; }
    public void setActor(String actor) { this.actor = actor; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getTarget() { return target; }
    public void setTarget(String target) { this.target = target; }

    public String getVerdict() { return verdict; }
    public void setVerdict(String verdict) { this.verdict = verdict; }

    public String getPolicyId() { return policyId; }
    public void setPolicyId(String policyId) { this.policyId = policyId; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }
}
