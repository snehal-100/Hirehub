package com.hirehub.backend.service.impl;

import com.hirehub.backend.constant.JobStatus;
import com.hirehub.backend.dto.job.CreateJobRequest;
import com.hirehub.backend.dto.job.JobDto;
import com.hirehub.backend.entity.Job;
import com.hirehub.backend.entity.RecruiterProfile;
import com.hirehub.backend.exception.BadRequestException;
import com.hirehub.backend.exception.ResourceNotFoundException;
import com.hirehub.backend.mapper.JobMapper;
import com.hirehub.backend.repository.JobRepository;
import com.hirehub.backend.repository.RecruiterProfileRepository;
import com.hirehub.backend.service.JobService;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobServiceImpl implements JobService {

    private final JobRepository jobRepository;
    private final RecruiterProfileRepository recruiterProfileRepository;
    private final JobMapper jobMapper;

    @Override
    @Transactional
    public JobDto createJob(String recruiterEmail, CreateJobRequest request) {
        RecruiterProfile recruiter = recruiterProfileRepository.findByUserEmail(recruiterEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter profile not found"));

        if (!recruiter.isVerified()) {
            throw new BadRequestException("Your account is not verified by admin yet. You cannot post jobs.");
        }

        Job job = Job.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .salary(request.getSalary())
                .location(request.getLocation())
                .experience(request.getExperience())
                .employmentType(request.getEmploymentType())
                .category(request.getCategory())
                .vacancies(request.getVacancies())
                .deadline(request.getDeadline())
                .status(JobStatus.ACTIVE)
                .recruiter(recruiter)
                .build();

        Job savedJob = jobRepository.save(job);
        return jobMapper.toDto(savedJob);
    }

    @Override
    @Transactional
    public JobDto updateJob(Long jobId, String recruiterEmail, CreateJobRequest request) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        if (!job.getRecruiter().getUser().getEmail().equals(recruiterEmail)) {
            throw new BadRequestException("You are not authorized to update this job");
        }

        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setSalary(request.getSalary());
        job.setLocation(request.getLocation());
        job.setExperience(request.getExperience());
        job.setEmploymentType(request.getEmploymentType());
        job.setCategory(request.getCategory());
        job.setVacancies(request.getVacancies());
        job.setDeadline(request.getDeadline());

        Job updatedJob = jobRepository.save(job);
        return jobMapper.toDto(updatedJob);
    }

    @Override
    @Transactional
    public void deleteJob(Long jobId, String recruiterEmail) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        if (!job.getRecruiter().getUser().getEmail().equals(recruiterEmail)) {
            throw new BadRequestException("You are not authorized to delete this job");
        }

        jobRepository.delete(job);
    }

    @Override
    @Transactional
    public JobDto closeJob(Long jobId, String recruiterEmail) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        if (!job.getRecruiter().getUser().getEmail().equals(recruiterEmail)) {
            throw new BadRequestException("You are not authorized to close this job");
        }

        job.setStatus(JobStatus.CLOSED);
        Job updatedJob = jobRepository.save(job);
        return jobMapper.toDto(updatedJob);
    }

    @Override
    public List<JobDto> getRecruiterJobs(String recruiterEmail) {
        RecruiterProfile recruiter = recruiterProfileRepository.findByUserEmail(recruiterEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter profile not found"));
        return jobRepository.findByRecruiterId(recruiter.getId()).stream()
                .map(jobMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public JobDto getJobById(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
        return jobMapper.toDto(job);
    }

    @Override
    public Page<JobDto> searchJobs(
            String keyword,
            String location,
            String salary,
            String category,
            String experience,
            String employmentType,
            Pageable pageable
    ) {
        Specification<Job> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Only show active jobs to candidate searches
            predicates.add(cb.equal(root.get("status"), JobStatus.ACTIVE));

            if (keyword != null && !keyword.trim().isEmpty()) {
                String val = "%" + keyword.trim().toLowerCase() + "%";
                Predicate titlePred = cb.like(cb.lower(root.get("title")), val);
                Predicate descPred = cb.like(cb.lower(root.get("description")), val);
                Predicate compPred = cb.like(cb.lower(root.get("recruiter").get("companyName")), val);
                predicates.add(cb.or(titlePred, descPred, compPred));
            }

            if (location != null && !location.trim().isEmpty()) {
                predicates.add(cb.equal(cb.lower(root.get("location")), location.trim().toLowerCase()));
            }

            if (category != null && !category.trim().isEmpty()) {
                predicates.add(cb.equal(cb.lower(root.get("category")), category.trim().toLowerCase()));
            }

            if (experience != null && !experience.trim().isEmpty()) {
                predicates.add(cb.equal(cb.lower(root.get("experience")), experience.trim().toLowerCase()));
            }

            if (employmentType != null && !employmentType.trim().isEmpty()) {
                predicates.add(cb.equal(cb.lower(root.get("employmentType")), employmentType.trim().toLowerCase()));
            }

            if (salary != null && !salary.trim().isEmpty()) {
                String val = "%" + salary.trim().toLowerCase() + "%";
                predicates.add(cb.like(cb.lower(root.get("salary")), val));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return jobRepository.findAll(spec, pageable).map(jobMapper::toDto);
    }
}
