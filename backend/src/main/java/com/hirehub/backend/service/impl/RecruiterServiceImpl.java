package com.hirehub.backend.service.impl;

import com.hirehub.backend.dto.recruiter.RecruiterProfileDto;
import com.hirehub.backend.dto.recruiter.UpdateRecruiterProfileRequest;
import com.hirehub.backend.entity.RecruiterProfile;
import com.hirehub.backend.entity.User;
import com.hirehub.backend.exception.ResourceNotFoundException;
import com.hirehub.backend.mapper.RecruiterProfileMapper;
import com.hirehub.backend.repository.RecruiterProfileRepository;
import com.hirehub.backend.repository.UserRepository;
import com.hirehub.backend.service.FileStorageService;
import com.hirehub.backend.service.RecruiterService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class RecruiterServiceImpl implements RecruiterService {

    private final RecruiterProfileRepository recruiterProfileRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;
    private final RecruiterProfileMapper recruiterProfileMapper;

    @Override
    public RecruiterProfileDto getProfile(String email) {
        RecruiterProfile profile = recruiterProfileRepository.findByUserEmail(email)
                .orElseGet(() -> {
                    User user = userRepository.findByEmail(email)
                            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
                    RecruiterProfile newProfile = RecruiterProfile.builder()
                            .user(user)
                            .companyName("")
                            .companyLogo("")
                            .website("")
                            .industry("")
                            .location("")
                            .about("")
                            .verified(false)
                            .build();
                    return recruiterProfileRepository.save(newProfile);
                });
        return recruiterProfileMapper.toDto(profile);
    }

    @Override
    @Transactional
    public RecruiterProfileDto updateProfile(String email, UpdateRecruiterProfileRequest request) {
        RecruiterProfile profile = recruiterProfileRepository.findByUserEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter profile not found"));

        User user = profile.getUser();
        if (request.getFirstName() != null) user.setFirstName(request.getFirstName());
        if (request.getLastName() != null) user.setLastName(request.getLastName());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        userRepository.save(user);

        profile.setCompanyName(request.getCompanyName());
        profile.setWebsite(request.getWebsite());
        profile.setIndustry(request.getIndustry());
        profile.setLocation(request.getLocation());
        profile.setAbout(request.getAbout());

        RecruiterProfile updatedProfile = recruiterProfileRepository.save(profile);
        return recruiterProfileMapper.toDto(updatedProfile);
    }

    @Override
    @Transactional
    public RecruiterProfileDto uploadLogo(String email, MultipartFile file) {
        RecruiterProfile profile = recruiterProfileRepository.findByUserEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter profile not found"));

        String path = fileStorageService.storeFile(file, "logos");
        profile.setCompanyLogo(path);

        RecruiterProfile updatedProfile = recruiterProfileRepository.save(profile);
        return recruiterProfileMapper.toDto(updatedProfile);
    }
}
