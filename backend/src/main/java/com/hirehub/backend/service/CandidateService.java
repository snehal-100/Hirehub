package com.hirehub.backend.service;

import com.hirehub.backend.dto.candidate.CandidateProfileDto;
import com.hirehub.backend.dto.candidate.UpdateCandidateProfileRequest;
import org.springframework.web.multipart.MultipartFile;

public interface CandidateService {
    CandidateProfileDto getProfile(String email);
    CandidateProfileDto updateProfile(String email, UpdateCandidateProfileRequest request);
    CandidateProfileDto uploadResume(String email, MultipartFile file);
    CandidateProfileDto uploadPhoto(String email, MultipartFile file);
    CandidateProfileDto deleteResume(String email);
}
