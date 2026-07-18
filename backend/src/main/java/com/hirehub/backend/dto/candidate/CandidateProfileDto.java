package com.hirehub.backend.dto.candidate;

import com.hirehub.backend.dto.auth.UserDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CandidateProfileDto {
    private Long id;
    private UserDto user;
    private String headline;
    private String bio;
    private String experience;
    private String education;
    private String skills;
    private String github;
    private String linkedin;
    private String portfolio;
    private String resumePath;
    private String profilePhoto;
}
