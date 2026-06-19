package com.vcscout.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public ResponseEntity<Map<String, String>> home() {
        Map<String, String> status = new HashMap<>();
        status.put("status", "healthy");
        status.put("service", "VC Scout REST API Backend");
        status.put("database", "H2 (In-Memory Fallback Active)");
        return ResponseEntity.ok(status);
    }
}
