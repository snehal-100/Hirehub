package com.hirehub.backend.service;

import com.hirehub.backend.dto.auth.AuthResponse;
import com.hirehub.backend.dto.auth.LoginRequest;
import com.hirehub.backend.dto.auth.RegisterRequest;
import com.hirehub.backend.dto.auth.UserDto;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    UserDto getCurrentUser(String email);
}
