package com.hirehub.backend.service;

import com.hirehub.backend.dto.admin.AdminDashboardDto;
import com.hirehub.backend.dto.candidate.CandidateDashboardDto;
import com.hirehub.backend.dto.recruiter.RecruiterDashboardDto;

public interface AdminService {
    // Admin Operations
    void verifyRecruiter(Long recruiterId);
    void toggleUserStatus(Long userId);
    void deleteUser(Long userId);
    void deleteJobByAdmin(Long jobId);

    // Dashboard Telemetry
    AdminDashboardDto getAdminDashboard();
    RecruiterDashboardDto getRecruiterDashboard(String recruiterEmail);
    CandidateDashboardDto getCandidateDashboard(String candidateEmail);
}
