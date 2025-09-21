package com.example.manufacturing.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

// Data Transfer Object for the login response body
@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
}
