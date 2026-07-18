package com.hirehub.backend.controller;

import com.hirehub.backend.dto.candidate.CandidateDashboardDto;
import com.hirehub.backend.dto.candidate.CandidateProfileDto;
import com.hirehub.backend.dto.candidate.UpdateCandidateProfileRequest;
import com.hirehub.backend.service.AdminService;
import com.hirehub.backend.service.CandidateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/candidate")
@RequiredArgsConstructor
public class CandidateController {

    private final CandidateService candidateService;
    private final AdminService adminService;

    @GetMapping("/profile")
    public ResponseEntity<CandidateProfileDto> getProfile(Authentication authentication) {
        return ResponseEntity.ok(candidateService.getProfile(authentication.getName()));
    }

    @PutMapping("/profile")
    public ResponseEntity<CandidateProfileDto> updateProfile(
            Authentication authentication,
            @RequestBody UpdateCandidateProfileRequest request
    ) {
        return ResponseEntity.ok(candidateService.updateProfile(authentication.getName(), request));
    }

    @PostMapping("/profile/resume")
    public ResponseEntity<CandidateProfileDto> uploadResume(
            Authentication authentication,
            @RequestParam("file") MultipartFile file
    ) {
        return ResponseEntity.ok(candidateService.uploadResume(authentication.getName(), file));
    }

    @PostMapping("/profile/photo")
    public ResponseEntity<CandidateProfileDto> uploadPhoto(
            Authentication authentication,
            @RequestParam("file") MultipartFile file
    ) {
        return ResponseEntity.ok(candidateService.uploadPhoto(authentication.getName(), file));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<CandidateDashboardDto> getDashboard(Authentication authentication) {
        return ResponseEntity.ok(adminService.getCandidateDashboard(authentication.getName()));
    }

    @DeleteMapping("/profile/resume")
    public ResponseEntity<CandidateProfileDto> deleteResume(Authentication authentication) {
        return ResponseEntity.ok(candidateService.deleteResume(authentication.getName()));
    }
}
