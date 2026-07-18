package com.hirehub.backend.dto.recruiter;

import com.hirehub.backend.dto.auth.UserDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecruiterProfileDto {
    private Long id;
    private UserDto user;
    private String companyName;
    private String companyLogo;
    private String website;
    private String industry;
    private String location;
    private String about;
    private boolean verified;
}
