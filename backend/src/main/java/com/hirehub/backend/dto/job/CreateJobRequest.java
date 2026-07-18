package com.hirehub.backend.dto.job;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateJobRequest {

    @NotBlank(message = "Job title is required")
    private String title;

    @NotBlank(message = "Job description is required")
    private String description;

    @NotBlank(message = "Salary details are required")
    private String salary;

    @NotBlank(message = "Job location is required")
    private String location;

    @NotBlank(message = "Experience level is required")
    private String experience;

    @NotBlank(message = "Employment type is required (e.g. Full-time, Remote)")
    private String employmentType;

    @NotBlank(message = "Job category is required")
    private String category;

    @Min(value = 1, message = "Vacancies must be at least 1")
    private int vacancies;

    @NotNull(message = "Application deadline is required")
    @FutureOrPresent(message = "Deadline must be in the present or future")
    private LocalDate deadline;
}
