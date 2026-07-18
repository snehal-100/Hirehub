package com.hirehub.backend.service;

import com.hirehub.backend.dto.job.CreateJobRequest;
import com.hirehub.backend.dto.job.JobDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface JobService {
    // Recruiter Management APIs
    JobDto createJob(String recruiterEmail, CreateJobRequest request);
    JobDto updateJob(Long jobId, String recruiterEmail, CreateJobRequest request);
    void deleteJob(Long jobId, String recruiterEmail);
    JobDto closeJob(Long jobId, String recruiterEmail);
    List<JobDto> getRecruiterJobs(String recruiterEmail);

    // Public / Candidate Search APIs
    JobDto getJobById(Long id);
    Page<JobDto> searchJobs(
            String keyword,
            String location,
            String salary,
            String category,
            String experience,
            String employmentType,
            Pageable pageable
    );
}
