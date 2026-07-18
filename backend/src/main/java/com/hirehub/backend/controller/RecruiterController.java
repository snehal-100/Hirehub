package com.hirehub.backend.controller;

import com.hirehub.backend.dto.recruiter.RecruiterDashboardDto;
import com.hirehub.backend.dto.recruiter.RecruiterProfileDto;
import com.hirehub.backend.dto.recruiter.UpdateRecruiterProfileRequest;
import com.hirehub.backend.service.AdminService;
import com.hirehub.backend.service.RecruiterService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/recruiter")
@RequiredArgsConstructor
public class RecruiterController {

    private final RecruiterService recruiterService;
    private final AdminService adminService;

    @GetMapping("/profile")
    public ResponseEntity<RecruiterProfileDto> getProfile(Authentication authentication) {
        return ResponseEntity.ok(recruiterService.getProfile(authentication.getName()));
    }

    @PutMapping("/profile")
    public ResponseEntity<RecruiterProfileDto> updateProfile(
            Authentication authentication,
            @RequestBody UpdateRecruiterProfileRequest request
    ) {
        return ResponseEntity.ok(recruiterService.updateProfile(authentication.getName(), request));
    }

    @PostMapping("/profile/logo")
    public ResponseEntity<RecruiterProfileDto> uploadLogo(
            Authentication authentication,
            @RequestParam("file") MultipartFile file
    ) {
        return ResponseEntity.ok(recruiterService.uploadLogo(authentication.getName(), file));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<RecruiterDashboardDto> getDashboard(Authentication authentication) {
        return ResponseEntity.ok(adminService.getRecruiterDashboard(authentication.getName()));
    }
}
