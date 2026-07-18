package com.hirehub.backend.dto.recruiter;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecruiterDashboardDto {
    private long totalJobsPosted;
    private long totalApplicationsReceived;
    private double hiringRate;
    private Map<String, Long> statusBreakdown;
}
