package com.vcscout.controller;

import com.vcscout.model.Policy;
import com.vcscout.service.StartupService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/policies")
@CrossOrigin(origins = "*")
public class PolicyController {

    private final StartupService startupService;

    public PolicyController(StartupService startupService) {
        this.startupService = startupService;
    }

    @GetMapping
    public ResponseEntity<List<Policy>> getPolicies() {
        return ResponseEntity.ok(startupService.getPolicies());
    }

    @PostMapping
    public ResponseEntity<Policy> savePolicy(@RequestBody Policy policy) {
        Policy saved = startupService.savePolicy(policy);
        return ResponseEntity.ok(saved);
    }
}
