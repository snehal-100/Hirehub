package com.hirehub.backend.service.impl;

import com.hirehub.backend.dto.candidate.CandidateProfileDto;
import com.hirehub.backend.dto.candidate.UpdateCandidateProfileRequest;
import com.hirehub.backend.entity.CandidateProfile;
import com.hirehub.backend.entity.User;
import com.hirehub.backend.exception.ResourceNotFoundException;
import com.hirehub.backend.mapper.CandidateProfileMapper;
import com.hirehub.backend.repository.CandidateProfileRepository;
import com.hirehub.backend.repository.UserRepository;
import com.hirehub.backend.service.CandidateService;
import com.hirehub.backend.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class CandidateServiceImpl implements CandidateService {

    private final CandidateProfileRepository candidateProfileRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;
    private final CandidateProfileMapper candidateProfileMapper;

    @Override
    public CandidateProfileDto getProfile(String email) {
        CandidateProfile profile = candidateProfileRepository.findByUserEmail(email)
                .orElseGet(() -> {
                    User user = userRepository.findByEmail(email)
                            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
                    CandidateProfile newProfile = CandidateProfile.builder()
                            .user(user)
                            .headline("")
                            .bio("")
                            .experience("")
                            .education("")
                            .skills("")
                            .github("")
                            .linkedin("")
                            .portfolio("")
                            .build();
                    return candidateProfileRepository.save(newProfile);
                });
        return candidateProfileMapper.toDto(profile);
    }

    @Override
    @Transactional
    public CandidateProfileDto updateProfile(String email, UpdateCandidateProfileRequest request) {
        CandidateProfile profile = candidateProfileRepository.findByUserEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate profile not found"));

        User user = profile.getUser();
        if (request.getFirstName() != null) user.setFirstName(request.getFirstName());
        if (request.getLastName() != null) user.setLastName(request.getLastName());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        userRepository.save(user);

        profile.setHeadline(request.getHeadline());
        profile.setBio(request.getBio());
        profile.setExperience(request.getExperience());
        profile.setEducation(request.getEducation());
        profile.setSkills(request.getSkills());
        profile.setGithub(request.getGithub());
        profile.setLinkedin(request.getLinkedin());
        profile.setPortfolio(request.getPortfolio());

        CandidateProfile updatedProfile = candidateProfileRepository.save(profile);
        return candidateProfileMapper.toDto(updatedProfile);
    }

    @Override
    @Transactional
    public CandidateProfileDto uploadResume(String email, MultipartFile file) {
        CandidateProfile profile = candidateProfileRepository.findByUserEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate profile not found"));

        String path = fileStorageService.storeFile(file, "resumes");
        profile.setResumePath(path);
        
        CandidateProfile updatedProfile = candidateProfileRepository.save(profile);
        return candidateProfileMapper.toDto(updatedProfile);
    }

    @Override
    @Transactional
    public CandidateProfileDto uploadPhoto(String email, MultipartFile file) {
        CandidateProfile profile = candidateProfileRepository.findByUserEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate profile not found"));

        String path = fileStorageService.storeFile(file, "photos");
        profile.setProfilePhoto(path);

        CandidateProfile updatedProfile = candidateProfileRepository.save(profile);
        return candidateProfileMapper.toDto(updatedProfile);
    }

    @Override
    @Transactional
    public CandidateProfileDto deleteResume(String email) {
        CandidateProfile profile = candidateProfileRepository.findByUserEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate profile not found"));

        profile.setResumePath(null);
        CandidateProfile updatedProfile = candidateProfileRepository.save(profile);
        return candidateProfileMapper.toDto(updatedProfile);
    }
}
