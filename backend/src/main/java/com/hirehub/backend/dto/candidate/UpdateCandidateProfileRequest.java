package com.hirehub.backend.dto.candidate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateCandidateProfileRequest {
    private String firstName; // Candidates can also update their name
    private String lastName;
    private String phone;
    private String headline;
    private String bio;
    private String experience;
    private String education;
    private String skills;
    private String github;
    private String linkedin;
    private String portfolio;
}
