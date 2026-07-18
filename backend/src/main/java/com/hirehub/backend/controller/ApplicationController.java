package com.hirehub.backend.controller;

import com.hirehub.backend.dto.application.ApplicationDto;
import com.hirehub.backend.dto.application.ApplyRequest;
import com.hirehub.backend.dto.application.UpdateApplicationStatusRequest;
import com.hirehub.backend.service.ApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    // Candidate endpoints
    @PostMapping("/apply/{jobId}")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ApplicationDto> apply(
            @PathVariable Long jobId,
            Authentication authentication,
            @RequestBody ApplyRequest request
    ) {
        return new ResponseEntity<>(
                applicationService.apply(jobId, authentication.getName(), request),
                HttpStatus.CREATED
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<Void> withdraw(@PathVariable Long id, Authentication authentication) {
        applicationService.withdraw(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/candidate")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<List<ApplicationDto>> getCandidateApplications(Authentication authentication) {
        return ResponseEntity.ok(applicationService.getCandidateApplications(authentication.getName()));
    }

    // Recruiter endpoints
    @GetMapping("/job/{jobId}")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<List<ApplicationDto>> getJobApplicants(
            @PathVariable Long jobId,
            Authentication authentication
    ) {
        return ResponseEntity.ok(applicationService.getJobApplicants(jobId, authentication.getName()));
    }

    @GetMapping("/recruiter")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<List<ApplicationDto>> getRecruiterApplications(Authentication authentication) {
        return ResponseEntity.ok(applicationService.getRecruiterApplications(authentication.getName()));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<ApplicationDto> updateApplicationStatus(
            @PathVariable Long id,
            Authentication authentication,
            @Valid @RequestBody UpdateApplicationStatusRequest request
    ) {
        return ResponseEntity.ok(applicationService.updateApplicationStatus(id, authentication.getName(), request));
    }
}
