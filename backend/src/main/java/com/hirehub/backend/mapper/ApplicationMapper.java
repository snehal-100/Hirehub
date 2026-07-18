package com.hirehub.backend.mapper;

import com.hirehub.backend.dto.application.ApplicationDto;
import com.hirehub.backend.entity.Application;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ApplicationMapper {

    private final CandidateProfileMapper candidateProfileMapper;
    private final JobMapper jobMapper;

    public ApplicationDto toDto(Application application) {
        if (application == null) {
            return null;
        }
        return ApplicationDto.builder()
                .id(application.getId())
                .candidate(candidateProfileMapper.toDto(application.getCandidate()))
                .job(jobMapper.toDto(application.getJob()))
                .resume(application.getResume())
                .coverLetter(application.getCoverLetter())
                .status(application.getStatus())
                .appliedAt(application.getAppliedAt())
                .build();
    }
}
