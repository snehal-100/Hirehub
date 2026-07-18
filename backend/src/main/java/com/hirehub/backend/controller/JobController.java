package com.hirehub.backend.controller;

import com.hirehub.backend.dto.job.CreateJobRequest;
import com.hirehub.backend.dto.job.JobDto;
import com.hirehub.backend.service.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    // Recruiter APIs
    @PostMapping
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<JobDto> createJob(
            Authentication authentication,
            @Valid @RequestBody CreateJobRequest request
    ) {
        return new ResponseEntity<>(jobService.createJob(authentication.getName(), request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<JobDto> updateJob(
            @PathVariable Long id,
            Authentication authentication,
            @Valid @RequestBody CreateJobRequest request
    ) {
        return ResponseEntity.ok(jobService.updateJob(id, authentication.getName(), request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id, Authentication authentication) {
        jobService.deleteJob(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/close")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<JobDto> closeJob(@PathVariable Long id, Authentication authentication) {
        return ResponseEntity.ok(jobService.closeJob(id, authentication.getName()));
    }

    @GetMapping("/recruiter")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<List<JobDto>> getRecruiterJobs(Authentication authentication) {
        return ResponseEntity.ok(jobService.getRecruiterJobs(authentication.getName()));
    }

    // Public / Candidate APIs
    @GetMapping("/{id}")
    public ResponseEntity<JobDto> getJobById(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.getJobById(id));
    }

    @GetMapping
    public ResponseEntity<Page<JobDto>> searchJobs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String salary,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String experience,
            @RequestParam(required = false) String employmentType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort
    ) {
        // Parse sort parameter (e.g. "createdAt,desc" -> Sort.by("createdAt").descending())
        String[] sortParams = sort.split(",");
        Sort sortObj = Sort.by(sortParams[0]);
        if (sortParams.length > 1 && "desc".equalsIgnoreCase(sortParams[1])) {
            sortObj = sortObj.descending();
        } else {
            sortObj = sortObj.ascending();
        }

        Pageable pageable = PageRequest.of(page, size, sortObj);
        Page<JobDto> jobs = jobService.searchJobs(
                keyword, location, salary, category, experience, employmentType, pageable
        );
        return ResponseEntity.ok(jobs);
    }
}
