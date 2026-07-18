package com.hirehub.backend.service.impl;

import com.hirehub.backend.constant.ApplicationStatus;
import com.hirehub.backend.constant.JobStatus;
import com.hirehub.backend.dto.application.ApplicationDto;
import com.hirehub.backend.dto.application.ApplyRequest;
import com.hirehub.backend.dto.application.UpdateApplicationStatusRequest;
import com.hirehub.backend.entity.Application;
import com.hirehub.backend.entity.CandidateProfile;
import com.hirehub.backend.entity.Job;
import com.hirehub.backend.exception.BadRequestException;
import com.hirehub.backend.exception.ResourceNotFoundException;
import com.hirehub.backend.mapper.ApplicationMapper;
import com.hirehub.backend.repository.ApplicationRepository;
import com.hirehub.backend.repository.CandidateProfileRepository;
import com.hirehub.backend.repository.JobRepository;
import com.hirehub.backend.service.ApplicationService;
import com.hirehub.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApplicationServiceImpl implements ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final CandidateProfileRepository candidateProfileRepository;
    private final JobRepository jobRepository;
    private final ApplicationMapper applicationMapper;
    private final NotificationService notificationService;

    @Override
    @Transactional
    public ApplicationDto apply(Long jobId, String candidateEmail, ApplyRequest request) {
        CandidateProfile candidate = candidateProfileRepository.findByUserEmail(candidateEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate profile not found"));

        if (candidate.getResumePath() == null || candidate.getResumePath().trim().isEmpty()) {
            throw new BadRequestException("Please upload a resume in your profile before applying to jobs.");
        }

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        if (job.getStatus() != JobStatus.ACTIVE) {
            throw new BadRequestException("This job listing has been closed.");
        }

        if (job.getDeadline().isBefore(LocalDate.now())) {
            throw new BadRequestException("The application deadline for this job has passed.");
        }

        if (applicationRepository.existsByCandidateIdAndJobId(candidate.getId(), job.getId())) {
            throw new BadRequestException("You have already applied to this job.");
        }

        Application application = Application.builder()
                .candidate(candidate)
                .job(job)
                .resume(candidate.getResumePath())
                .coverLetter(request.getCoverLetter())
                .status(ApplicationStatus.APPLIED)
                .build();

        Application savedApplication = applicationRepository.save(application);

        // Notify Candidate
        notificationService.sendNotification(
                candidate.getUser(),
                "Application Submitted Successfully",
                "You have successfully applied to the job: " + job.getTitle() + " at " + job.getRecruiter().getCompanyName() + "."
        );

        // Notify Recruiter
        notificationService.sendNotification(
                job.getRecruiter().getUser(),
                "New Application Received",
                candidate.getUser().getFirstName() + " " + candidate.getUser().getLastName() + " has applied for: " + job.getTitle() + "."
        );

        return applicationMapper.toDto(savedApplication);
    }

    @Override
    @Transactional
    public void withdraw(Long applicationId, String candidateEmail) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        if (!application.getCandidate().getUser().getEmail().equals(candidateEmail)) {
            throw new BadRequestException("You are not authorized to withdraw this application");
        }

        applicationRepository.delete(application);
    }

    @Override
    public List<ApplicationDto> getCandidateApplications(String candidateEmail) {
        return applicationRepository.findByCandidateUserEmail(candidateEmail).stream()
                .map(applicationMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ApplicationDto> getJobApplicants(Long jobId, String recruiterEmail) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        if (!job.getRecruiter().getUser().getEmail().equals(recruiterEmail)) {
            throw new BadRequestException("You are not authorized to view applicants for this job");
        }

        return applicationRepository.findByJobId(jobId).stream()
                .map(applicationMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ApplicationDto> getRecruiterApplications(String recruiterEmail) {
        return applicationRepository.findByJobRecruiterUserEmail(recruiterEmail).stream()
                .map(applicationMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ApplicationDto updateApplicationStatus(Long applicationId, String recruiterEmail, UpdateApplicationStatusRequest request) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        Job job = application.getJob();
        if (!job.getRecruiter().getUser().getEmail().equals(recruiterEmail)) {
            throw new BadRequestException("You are not authorized to manage this application");
        }

        application.setStatus(request.getStatus());
        Application updatedApplication = applicationRepository.save(application);

        // Notify candidate of status change
        notificationService.sendNotification(
                application.getCandidate().getUser(),
                "Application Status Updated",
                "Your application status for " + job.getTitle() + " has been changed to: " + request.getStatus() + "."
        );

        return applicationMapper.toDto(updatedApplication);
    }
}
