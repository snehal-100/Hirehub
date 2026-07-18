package com.hirehub.backend.mapper;

import com.hirehub.backend.dto.job.JobDto;
import com.hirehub.backend.entity.Job;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class JobMapper {

    private final RecruiterProfileMapper recruiterProfileMapper;

    public JobDto toDto(Job job) {
        if (job == null) {
            return null;
        }
        return JobDto.builder()
                .id(job.getId())
                .title(job.getTitle())
                .description(job.getDescription())
                .salary(job.getSalary())
                .location(job.getLocation())
                .experience(job.getExperience())
                .employmentType(job.getEmploymentType())
                .category(job.getCategory())
                .vacancies(job.getVacancies())
                .deadline(job.getDeadline())
                .status(job.getStatus())
                .recruiter(recruiterProfileMapper.toDto(job.getRecruiter()))
                .createdAt(job.getCreatedAt())
                .updatedAt(job.getUpdatedAt())
                .build();
    }
}
