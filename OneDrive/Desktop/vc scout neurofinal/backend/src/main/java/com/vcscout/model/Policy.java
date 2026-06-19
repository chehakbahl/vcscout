package com.vcscout.model;

import jakarta.persistence.*;

@Entity
@Table(name = "policies")
public class Policy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "policy_id", unique = true)
    private String policyId; // e.g. "POL_001"

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(name = "target_agent", nullable = false)
    private String targetAgent; // e.g. "compliance_agent", "all"

    @Column(name = "rule_type", nullable = false)
    private String ruleType; // e.g. "BLOCK_HTTP_URL"

    @Column(name = "rule_value")
    private String ruleValue;

    private Boolean active = true;

    public Policy() {}

    public Policy(String policyId, String name, String description, String targetAgent, String ruleType, String ruleValue, Boolean active) {
        this.policyId = policyId;
        this.name = name;
        this.description = description;
        this.targetAgent = targetAgent;
        this.ruleType = ruleType;
        this.ruleValue = ruleValue;
        this.active = active;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPolicyId() { return policyId; }
    public void setPolicyId(String policyId) { this.policyId = policyId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getTargetAgent() { return targetAgent; }
    public void setTargetAgent(String targetAgent) { this.targetAgent = targetAgent; }

    public String getRuleType() { return ruleType; }
    public void setRuleType(String ruleType) { this.ruleType = ruleType; }

    public String getRuleValue() { return ruleValue; }
    public void setRuleValue(String ruleValue) { this.ruleValue = ruleValue; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
}
