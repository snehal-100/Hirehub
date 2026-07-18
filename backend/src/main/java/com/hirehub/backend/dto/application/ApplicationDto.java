package com.hirehub.backend.dto.application;

import com.hirehub.backend.constant.ApplicationStatus;
import com.hirehub.backend.dto.candidate.CandidateProfileDto;
import com.hirehub.backend.dto.job.JobDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationDto {
    private Long id;
    private CandidateProfileDto candidate;
    private JobDto job;
    private String resume;
    private String coverLetter;
    private ApplicationStatus status;
    private LocalDateTime appliedAt;
}
