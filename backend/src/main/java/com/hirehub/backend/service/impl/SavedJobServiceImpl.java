package com.hirehub.backend.service.impl;

import com.hirehub.backend.dto.job.SavedJobDto;
import com.hirehub.backend.entity.CandidateProfile;
import com.hirehub.backend.entity.Job;
import com.hirehub.backend.entity.SavedJob;
import com.hirehub.backend.exception.BadRequestException;
import com.hirehub.backend.exception.ResourceNotFoundException;
import com.hirehub.backend.mapper.JobMapper;
import com.hirehub.backend.repository.CandidateProfileRepository;
import com.hirehub.backend.repository.JobRepository;
import com.hirehub.backend.repository.SavedJobRepository;
import com.hirehub.backend.service.SavedJobService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SavedJobServiceImpl implements SavedJobService {

    private final SavedJobRepository savedJobRepository;
    private final CandidateProfileRepository candidateProfileRepository;
    private final JobRepository jobRepository;
    private final JobMapper jobMapper;

    @Override
    @Transactional
    public SavedJobDto saveJob(Long jobId, String candidateEmail) {
        CandidateProfile candidate = candidateProfileRepository.findByUserEmail(candidateEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate profile not found"));

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        if (savedJobRepository.existsByCandidateIdAndJobId(candidate.getId(), job.getId())) {
            throw new BadRequestException("Job is already saved");
        }

        SavedJob savedJob = SavedJob.builder()
                .candidate(candidate)
                .job(job)
                .build();

        SavedJob saved = savedJobRepository.save(savedJob);
        
        return SavedJobDto.builder()
                .id(saved.getId())
                .job(jobMapper.toDto(saved.getJob()))
                .build();
    }

    @Override
    @Transactional
    public void removeSavedJob(Long jobId, String candidateEmail) {
        SavedJob savedJob = savedJobRepository.findByCandidateUserEmailAndJobId(candidateEmail, jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Saved job bookmark not found"));

        savedJobRepository.delete(savedJob);
    }

    @Override
    public List<SavedJobDto> getSavedJobs(String candidateEmail) {
        return savedJobRepository.findByCandidateUserEmail(candidateEmail).stream()
                .map(saved -> SavedJobDto.builder()
                        .id(saved.getId())
                        .job(jobMapper.toDto(saved.getJob()))
                        .build())
                .collect(Collectors.toList());
    }
}
