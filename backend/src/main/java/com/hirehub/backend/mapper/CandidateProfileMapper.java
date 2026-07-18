package com.hirehub.backend.mapper;

import com.hirehub.backend.dto.candidate.CandidateProfileDto;
import com.hirehub.backend.entity.CandidateProfile;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CandidateProfileMapper {

    private final UserMapper userMapper;

    public CandidateProfileDto toDto(CandidateProfile profile) {
        if (profile == null) {
            return null;
        }
        return CandidateProfileDto.builder()
                .id(profile.getId())
                .user(userMapper.toDto(profile.getUser()))
                .headline(profile.getHeadline())
                .bio(profile.getBio())
                .experience(profile.getExperience())
                .education(profile.getEducation())
                .skills(profile.getSkills())
                .github(profile.getGithub())
                .linkedin(profile.getLinkedin())
                .portfolio(profile.getPortfolio())
                .resumePath(profile.getResumePath())
                .profilePhoto(profile.getProfilePhoto())
                .build();
    }
}
