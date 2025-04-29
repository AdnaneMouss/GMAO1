package com.huir.GmaoApp.model;

import java.time.LocalDateTime;

public class CodeDetails {
    private String code;
    private LocalDateTime expirationTime;

    public CodeDetails(String code, LocalDateTime expirationTime) {
        this.code = code;
        this.expirationTime = expirationTime;
    }

    public String getCode() {
        return code;
    }

    public LocalDateTime getExpirationTime() {
        return expirationTime;
    }

    // Check if the code is expired
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expirationTime);
    }
}
