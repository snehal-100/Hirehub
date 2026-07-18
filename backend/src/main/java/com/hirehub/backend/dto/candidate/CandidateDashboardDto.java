package com.hirehub.backend.dto.candidate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CandidateDashboardDto {
    private long totalApplications;
    private long totalSavedJobs;
    private long totalInterviews;
}
