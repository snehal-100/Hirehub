package com.hirehub.backend.service;

import com.hirehub.backend.dto.recruiter.RecruiterProfileDto;
import com.hirehub.backend.dto.recruiter.UpdateRecruiterProfileRequest;
import org.springframework.web.multipart.MultipartFile;

public interface RecruiterService {
    RecruiterProfileDto getProfile(String email);
    RecruiterProfileDto updateProfile(String email, UpdateRecruiterProfileRequest request);
    RecruiterProfileDto uploadLogo(String email, MultipartFile file);
}
