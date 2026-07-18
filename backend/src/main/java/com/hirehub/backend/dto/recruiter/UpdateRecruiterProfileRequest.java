package com.hirehub.backend.dto.recruiter;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateRecruiterProfileRequest {
    private String firstName;
    private String lastName;
    private String phone;
    private String companyName;
    private String website;
    private String industry;
    private String location;
    private String about;
}
