package com.hirehub.backend.controller;

import com.hirehub.backend.dto.job.SavedJobDto;
import com.hirehub.backend.service.SavedJobService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/saved-jobs")
@RequiredArgsConstructor
public class SavedJobController {

    private final SavedJobService savedJobService;

    @PostMapping("/{jobId}")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<SavedJobDto> saveJob(@PathVariable Long jobId, Authentication authentication) {
        return new ResponseEntity<>(
                savedJobService.saveJob(jobId, authentication.getName()),
                HttpStatus.CREATED
        );
    }

    @DeleteMapping("/{jobId}")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<Void> removeSavedJob(@PathVariable Long jobId, Authentication authentication) {
        savedJobService.removeSavedJob(jobId, authentication.getName());
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<List<SavedJobDto>> getSavedJobs(Authentication authentication) {
        return ResponseEntity.ok(savedJobService.getSavedJobs(authentication.getName()));
    }
}
