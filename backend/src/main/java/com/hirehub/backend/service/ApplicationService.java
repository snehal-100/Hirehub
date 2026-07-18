package com.hirehub.backend.service;

import com.hirehub.backend.dto.application.ApplicationDto;
import com.hirehub.backend.dto.application.ApplyRequest;
import com.hirehub.backend.dto.application.UpdateApplicationStatusRequest;

import java.util.List;

public interface ApplicationService {
    ApplicationDto apply(Long jobId, String candidateEmail, ApplyRequest request);
    void withdraw(Long applicationId, String candidateEmail);
    List<ApplicationDto> getCandidateApplications(String candidateEmail);
    List<ApplicationDto> getJobApplicants(Long jobId, String recruiterEmail);
    List<ApplicationDto> getRecruiterApplications(String recruiterEmail);
    ApplicationDto updateApplicationStatus(Long applicationId, String recruiterEmail, UpdateApplicationStatusRequest request);
}
