package com.hirehub.backend.service.impl;

import com.hirehub.backend.dto.auth.AuthResponse;
import com.hirehub.backend.dto.auth.LoginRequest;
import com.hirehub.backend.dto.auth.RegisterRequest;
import com.hirehub.backend.dto.auth.UserDto;
import com.hirehub.backend.entity.User;
import com.hirehub.backend.exception.BadRequestException;
import com.hirehub.backend.exception.ResourceNotFoundException;
import com.hirehub.backend.mapper.UserMapper;
import com.hirehub.backend.constant.Role;
import com.hirehub.backend.entity.CandidateProfile;
import com.hirehub.backend.entity.RecruiterProfile;
import com.hirehub.backend.repository.CandidateProfileRepository;
import com.hirehub.backend.repository.RecruiterProfileRepository;
import com.hirehub.backend.repository.UserRepository;
import com.hirehub.backend.security.JwtService;
import com.hirehub.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final CandidateProfileRepository candidateProfileRepository;
    private final RecruiterProfileRepository recruiterProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserMapper userMapper;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(request.getRole())
                .enabled(true)
                .build();

        User savedUser = userRepository.save(user);

        if (savedUser.getRole() == Role.CANDIDATE) {
            CandidateProfile profile = CandidateProfile.builder()
                    .user(savedUser)
                    .headline("")
                    .bio("")
                    .experience("")
                    .education("")
                    .skills("")
                    .github("")
                    .linkedin("")
                    .portfolio("")
                    .build();
            candidateProfileRepository.save(profile);
        } else if (savedUser.getRole() == Role.RECRUITER) {
            RecruiterProfile profile = RecruiterProfile.builder()
                    .user(savedUser)
                    .companyName("")
                    .companyLogo("")
                    .website("")
                    .industry("")
                    .location("")
                    .about("")
                    .verified(false)
                    .build();
            recruiterProfileRepository.save(profile);
        }
        
        String token = jwtService.generateToken(savedUser);

        return AuthResponse.builder()
                .token(token)
                .user(userMapper.toDto(savedUser))
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
        } catch (Exception e) {
            throw new BadRequestException("Invalid email or password");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!user.isEnabled()) {
            throw new BadRequestException("Your account is disabled. Please contact admin.");
        }

        String token = jwtService.generateToken(user);

        return AuthResponse.builder()
                .token(token)
                .user(userMapper.toDto(user))
                .build();
    }

    @Override
    public UserDto getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return userMapper.toDto(user);
    }
}
