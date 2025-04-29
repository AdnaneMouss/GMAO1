package com.huir.GmaoApp.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class PasswordChangeRequest {
    // Getters and setters
    private String email;
    private String code;
    private String newPassword;
    private String currentPassword;  // Added the currentPassword field

}
