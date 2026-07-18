package com.hirehub.backend.dto.job;

import com.hirehub.backend.constant.JobStatus;
import com.hirehub.backend.dto.recruiter.RecruiterProfileDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobDto {
    private Long id;
    private String title;
    private String description;
    private String salary;
    private String location;
    private String experience;
    private String employmentType;
    private String category;
    private int vacancies;
    private LocalDate deadline;
    private JobStatus status;
    private RecruiterProfileDto recruiter;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
