package com.hirehub.backend.mapper;

import com.hirehub.backend.dto.recruiter.RecruiterProfileDto;
import com.hirehub.backend.entity.RecruiterProfile;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RecruiterProfileMapper {

    private final UserMapper userMapper;

    public RecruiterProfileDto toDto(RecruiterProfile profile) {
        if (profile == null) {
            return null;
        }
        return RecruiterProfileDto.builder()
                .id(profile.getId())
                .user(userMapper.toDto(profile.getUser()))
                .companyName(profile.getCompanyName())
                .companyLogo(profile.getCompanyLogo())
                .website(profile.getWebsite())
                .industry(profile.getIndustry())
                .location(profile.getLocation())
                .about(profile.getAbout())
                .verified(profile.isVerified())
                .build();
    }
}
