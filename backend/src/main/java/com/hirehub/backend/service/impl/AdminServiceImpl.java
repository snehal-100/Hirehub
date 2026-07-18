package com.hirehub.backend.service.impl;

import com.hirehub.backend.constant.ApplicationStatus;
import com.hirehub.backend.constant.Role;
import com.hirehub.backend.dto.admin.AdminDashboardDto;
import com.hirehub.backend.dto.candidate.CandidateDashboardDto;
import com.hirehub.backend.dto.recruiter.RecruiterDashboardDto;
import com.hirehub.backend.entity.Application;
import com.hirehub.backend.entity.Job;
import com.hirehub.backend.entity.RecruiterProfile;
import com.hirehub.backend.entity.User;
import com.hirehub.backend.exception.ResourceNotFoundException;
import com.hirehub.backend.repository.*;
import com.hirehub.backend.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.TextStyle;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final RecruiterProfileRepository recruiterProfileRepository;
    private final CandidateProfileRepository candidateProfileRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final SavedJobRepository savedJobRepository;

    @Override
    @Transactional
    public void verifyRecruiter(Long recruiterId) {
        RecruiterProfile profile = recruiterProfileRepository.findById(recruiterId)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter profile not found"));
        profile.setVerified(true);
        recruiterProfileRepository.save(profile);
    }

    @Override
    @Transactional
    public void toggleUserStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setEnabled(!user.isEnabled());
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (user.getRole() == Role.CANDIDATE) {
            candidateProfileRepository.findByUserId(userId).ifPresent(candidateProfileRepository::delete);
        } else if (user.getRole() == Role.RECRUITER) {
            recruiterProfileRepository.findByUserId(userId).ifPresent(recruiterProfileRepository::delete);
        }
        userRepository.delete(user);
    }

    @Override
    @Transactional
    public void deleteJobByAdmin(Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
        jobRepository.delete(job);
    }

    @Override
    public AdminDashboardDto getAdminDashboard() {
        List<User> users = userRepository.findAll();
        long totalUsers = users.size();
        long totalCandidates = users.stream().filter(u -> u.getRole() == Role.CANDIDATE).count();
        long totalRecruiters = users.stream().filter(u -> u.getRole() == Role.RECRUITER).count();
        long totalJobs = jobRepository.count();
        long totalApplications = applicationRepository.count();

        Map<String, Long> monthlyRegs = users.stream()
                .filter(u -> u.getCreatedAt() != null)
                .collect(Collectors.groupingBy(
                        u -> u.getCreatedAt().getMonth().getDisplayName(TextStyle.FULL, Locale.ENGLISH),
                        LinkedHashMap::new,
                        Collectors.counting()
                ));

        return AdminDashboardDto.builder()
                .totalUsers(totalUsers)
                .totalCandidates(totalCandidates)
                .totalRecruiters(totalRecruiters)
                .totalJobs(totalJobs)
                .totalApplications(totalApplications)
                .monthlyRegistrations(monthlyRegs)
                .build();
    }

    @Override
    public RecruiterDashboardDto getRecruiterDashboard(String recruiterEmail) {
        RecruiterProfile recruiter = recruiterProfileRepository.findByUserEmail(recruiterEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter profile not found"));

        List<Job> jobs = jobRepository.findByRecruiterId(recruiter.getId());
        long totalJobs = jobs.size();

        List<Application> apps = applicationRepository.findByJobRecruiterId(recruiter.getId());
        long totalApps = apps.size();

        long selectedCount = apps.stream()
                .filter(a -> a.getStatus() == ApplicationStatus.SELECTED)
                .count();

        double hiringRate = totalApps > 0 ? ((double) selectedCount / totalApps) * 100.0 : 0.0;

        Map<String, Long> statusMap = apps.stream()
                .collect(Collectors.groupingBy(
                        a -> a.getStatus().name(),
                        Collectors.counting()
                ));

        for (ApplicationStatus status : ApplicationStatus.values()) {
            statusMap.putIfAbsent(status.name(), 0L);
        }

        return RecruiterDashboardDto.builder()
                .totalJobsPosted(totalJobs)
                .totalApplicationsReceived(totalApps)
                .hiringRate(hiringRate)
                .statusBreakdown(statusMap)
                .build();
    }

    @Override
    public CandidateDashboardDto getCandidateDashboard(String candidateEmail) {
        List<Application> apps = applicationRepository.findByCandidateUserEmail(candidateEmail);
        long totalApps = apps.size();

        long totalSaved = savedJobRepository.findByCandidateUserEmail(candidateEmail).size();

        long totalInterviews = apps.stream()
                .filter(a -> a.getStatus() == ApplicationStatus.INTERVIEW)
                .count();

        return CandidateDashboardDto.builder()
                .totalApplications(totalApps)
                .totalSavedJobs(totalSaved)
                .totalInterviews(totalInterviews)
                .build();
    }
}
