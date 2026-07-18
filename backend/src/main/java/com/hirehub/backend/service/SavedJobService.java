package com.hirehub.backend.service;

import com.hirehub.backend.dto.job.SavedJobDto;

import java.util.List;

public interface SavedJobService {
    SavedJobDto saveJob(Long jobId, String candidateEmail);
    void removeSavedJob(Long jobId, String candidateEmail);
    List<SavedJobDto> getSavedJobs(String candidateEmail);
}
