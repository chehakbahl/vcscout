package com.vcscout.controller;

import com.vcscout.model.Incident;
import com.vcscout.model.Startup;
import com.vcscout.service.StartupService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/startups")
@CrossOrigin(origins = "*")
public class StartupController {

    private final StartupService startupService;

    public StartupController(StartupService startupService) {
        this.startupService = startupService;
    }

    @PostMapping("/analyze")
    public ResponseEntity<Startup> analyzeStartup(@RequestBody AnalyzeRequest request) {
        Startup startup = startupService.analyzeStartup(
                request.getName(),
                request.getWebsiteUrl(),
                request.getFounderLinkedin()
        );
        return ResponseEntity.ok(startup);
    }

    @GetMapping
    public ResponseEntity<List<Startup>> getAllStartups() {
        return ResponseEntity.ok(startupService.getAllStartups());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getStartupById(@PathVariable Long id) {
        Startup startup = startupService.getStartupById(id);
        List<Incident> incidents = startupService.getIncidentsByStartupId(id);
        
        Map<String, Object> response = new HashMap<>();
        response.put("startup", startup);
        response.put("incidents", incidents);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/incidents")
    public ResponseEntity<List<Incident>> getAllIncidents() {
        return ResponseEntity.ok(startupService.getAllIncidents());
    }

    // DTO for incoming request
    public static class AnalyzeRequest {
        private String name;
        private String websiteUrl;
        private String founderLinkedin;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getWebsiteUrl() { return websiteUrl; }
        public void setWebsiteUrl(String websiteUrl) { this.websiteUrl = websiteUrl; }

        public String getFounderLinkedin() { return founderLinkedin; }
        public void setFounderLinkedin(String founderLinkedin) { this.founderLinkedin = founderLinkedin; }
    }
}
