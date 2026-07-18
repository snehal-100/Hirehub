package com.hirehub.backend.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardDto {
    private long totalUsers;
    private long totalCandidates;
    private long totalRecruiters;
    private long totalJobs;
    private long totalApplications;
    private Map<String, Long> monthlyRegistrations;
}
