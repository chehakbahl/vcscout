package com.vcscout.controller;

import com.vcscout.model.AuditLog;
import com.vcscout.model.Report;
import com.vcscout.service.StartupService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class AuditLogController {

    private final StartupService startupService;

    public AuditLogController(StartupService startupService) {
        this.startupService = startupService;
    }

    @GetMapping("/logs")
    public ResponseEntity<List<AuditLog>> getAuditLogs() {
        return ResponseEntity.ok(startupService.getAuditLogs());
    }

    @GetMapping("/reports/{startupId}")
    public ResponseEntity<Report> getReportByStartupId(@PathVariable Long startupId) {
        Report report = startupService.getReportByStartupId(startupId);
        return ResponseEntity.ok(report);
    }
}
