package com.hirehub.backend.config;

import com.hirehub.backend.constant.JobStatus;
import com.hirehub.backend.constant.Role;
import com.hirehub.backend.entity.CandidateProfile;
import com.hirehub.backend.entity.Job;
import com.hirehub.backend.entity.RecruiterProfile;
import com.hirehub.backend.entity.User;
import com.hirehub.backend.repository.CandidateProfileRepository;
import com.hirehub.backend.repository.JobRepository;
import com.hirehub.backend.repository.RecruiterProfileRepository;
import com.hirehub.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CandidateProfileRepository candidateProfileRepository;
    private final RecruiterProfileRepository recruiterProfileRepository;
    private final JobRepository jobRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // 1. Seed Admin User
        if (!userRepository.existsByEmail("admin@hirehub.com")) {
            User admin = User.builder()
                    .firstName("Platform")
                    .lastName("Admin")
                    .email("admin@hirehub.com")
                    .password(passwordEncoder.encode("admin123"))
                    .phone("1234567890")
                    .role(Role.ADMIN)
                    .enabled(true)
                    .build();
            userRepository.save(admin);
        }

        // 2. Seed Recruiter User and Profile
        if (!userRepository.existsByEmail("recruiter@hirehub.com")) {
            User recruiterUser = User.builder()
                    .firstName("Jane")
                    .lastName("Doe")
                    .email("recruiter@hirehub.com")
                    .password(passwordEncoder.encode("recruiter123"))
                    .phone("0987654321")
                    .role(Role.RECRUITER)
                    .enabled(true)
                    .build();
            User savedRecruiter = userRepository.save(recruiterUser);

            RecruiterProfile recruiterProfile = RecruiterProfile.builder()
                    .user(savedRecruiter)
                    .companyName("TechCorp Solutions")
                    .website("https://techcorp.example.com")
                    .industry("Information Technology")
                    .location("San Francisco, CA")
                    .about("TechCorp Solutions is a leading software engineering agency specializing in cloud architectures, AI models, and scalable backend platforms.")
                    .verified(true) // Pre-verify the seeded recruiter
                    .build();
            RecruiterProfile savedProfile = recruiterProfileRepository.save(recruiterProfile);

            // Seed Sample Jobs for the Recruiter
            if (jobRepository.count() == 0) {
                Job job1 = Job.builder()
                        .title("Senior Full-Stack Engineer (React & Java)")
                        .description("We are looking for a Senior Full-Stack Engineer with strong expertise in React, Spring Boot, Java 17, and MySQL to join our scaling engineering team. You will lead design systems and build high-performance REST APIs.")
                        .salary("$130,000 - $160,000")
                        .location("Remote")
                        .experience("5+ years")
                        .employmentType("Full-time")
                        .category("Software Engineering")
                        .vacancies(3)
                        .deadline(LocalDate.now().plusMonths(2))
                        .status(JobStatus.ACTIVE)
                        .recruiter(savedProfile)
                        .build();

                Job job2 = Job.builder()
                        .title("AI / Machine Learning Engineer")
                        .description("Join our Core AI squad to develop, optimize, and deploy LLM applications, retrieval-augmented generation pipelines, and predictive algorithms. Strong math and Python skills required.")
                        .salary("$150,000 - $180,000")
                        .location("San Francisco, CA")
                        .experience("3+ years")
                        .employmentType("Full-time")
                        .category("Data Science / AI")
                        .vacancies(2)
                        .deadline(LocalDate.now().plusMonths(1))
                        .status(JobStatus.ACTIVE)
                        .recruiter(savedProfile)
                        .build();

                jobRepository.save(job1);
                jobRepository.save(job2);
            }
        }

        // 3. Seed Candidate User and Profile
        if (!userRepository.existsByEmail("candidate@hirehub.com")) {
            User candidateUser = User.builder()
                    .firstName("Alex")
                    .lastName("Smith")
                    .email("candidate@hirehub.com")
                    .password(passwordEncoder.encode("candidate123"))
                    .phone("5551234567")
                    .role(Role.CANDIDATE)
                    .enabled(true)
                    .build();
            User savedCandidate = userRepository.save(candidateUser);

            CandidateProfile candidateProfile = CandidateProfile.builder()
                    .user(savedCandidate)
                    .headline("Passionate Junior Software Developer")
                    .bio("Aspiring junior developer focused on building modern web applications. Skilled in React, JavaScript, Node.js, and Java fundamentals.")
                    .experience("1 Year Internship at DevLab")
                    .education("Bachelor of Science in Computer Science")
                    .skills("Java, React, HTML, CSS, SQL, Git")
                    .github("https://github.com/alexsmith")
                    .linkedin("https://linkedin.com/in/alexsmith")
                    .portfolio("https://alexsmith.dev")
                    .build();
            candidateProfileRepository.save(candidateProfile);
        }
    }
}
