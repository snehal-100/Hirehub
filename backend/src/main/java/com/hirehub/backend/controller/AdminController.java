package com.hirehub.backend.controller;

import com.hirehub.backend.dto.admin.AdminDashboardDto;
import com.hirehub.backend.dto.auth.UserDto;
import com.hirehub.backend.dto.job.JobDto;
import com.hirehub.backend.dto.recruiter.RecruiterProfileDto;
import com.hirehub.backend.mapper.JobMapper;
import com.hirehub.backend.mapper.RecruiterProfileMapper;
import com.hirehub.backend.mapper.UserMapper;
import com.hirehub.backend.repository.JobRepository;
import com.hirehub.backend.repository.RecruiterProfileRepository;
import com.hirehub.backend.repository.UserRepository;
import com.hirehub.backend.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final UserRepository userRepository;
    private final RecruiterProfileRepository recruiterProfileRepository;
    private final JobRepository jobRepository;
    private final UserMapper userMapper;
    private final RecruiterProfileMapper recruiterProfileMapper;
    private final JobMapper jobMapper;

    @PutMapping("/recruiters/{id}/verify")
    public ResponseEntity<Void> verifyRecruiter(@PathVariable Long id) {
        adminService.verifyRecruiter(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/users/{id}/toggle-status")
    public ResponseEntity<Void> toggleUserStatus(@PathVariable Long id) {
        adminService.toggleUserStatus(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/jobs/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id) {
        adminService.deleteJobByAdmin(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardDto> getAdminDashboard() {
        return ResponseEntity.ok(adminService.getAdminDashboard());
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> users = userRepository.findAll().stream()
                .map(userMapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @GetMapping("/recruiters")
    public ResponseEntity<List<RecruiterProfileDto>> getAllRecruiters() {
        List<RecruiterProfileDto> recruiters = recruiterProfileRepository.findAll().stream()
                .map(recruiterProfileMapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(recruiters);
    }

    @GetMapping("/jobs")
    public ResponseEntity<List<JobDto>> getAllJobs() {
        List<JobDto> jobs = jobRepository.findAll().stream()
                .map(jobMapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(jobs);
    }
}
