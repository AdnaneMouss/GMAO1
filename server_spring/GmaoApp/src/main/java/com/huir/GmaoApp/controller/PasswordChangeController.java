package com.huir.GmaoApp.controller;

import com.huir.GmaoApp.dto.PasswordChangeRequest;
import com.huir.GmaoApp.model.User;
import com.huir.GmaoApp.service.PasswordChangeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/password")
public class PasswordChangeController {

    @Autowired
    private PasswordChangeService passwordChangeService;

    // 1. Send verification code to user's email
    @PostMapping("/send-code")
    @ResponseBody
    public ResponseEntity<?> sendVerificationCode(@RequestParam String email) {
        passwordChangeService.sendVerificationCode(email);
        return ResponseEntity.ok("Le code de vérification a été envoyé à votre adresse email.");
    }

    @PostMapping("/check-password")
    public ResponseEntity<?> checkCurrentPassword(@RequestParam String currentPassword, @RequestParam String email) {
        String result = passwordChangeService.checkCurrentPassword(currentPassword, email);
        return ResponseEntity.ok(result);
    }

    // 2. Verify the code and update the password
    @PostMapping("/verify-and-update")
    public ResponseEntity<?> verifyAndUpdatePassword(@RequestBody PasswordChangeRequest request) {

        String email = request.getEmail();
        String code = request.getCode();
        String currentPassword = request.getCurrentPassword();  // Added current password field
        String newPassword = request.getNewPassword();

        // Verify the code
        boolean verified = passwordChangeService.verifyCode(email, code);
        if (!verified) {
            return ResponseEntity.badRequest().body("Code invalide ou expiré.");
        }

        // Update the password after verifying the current password
        String result = passwordChangeService.updatePasswordAfterCodeVerification(email, currentPassword, newPassword);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/verify-code")
    public ResponseEntity<?> verifyCode(@RequestParam String email, @RequestParam String code) {
        boolean verified = passwordChangeService.verifyCode(email, code);
        if (!verified) {
            return ResponseEntity.badRequest().body("Code invalide ou expiré.");
        }
        return ResponseEntity.ok("Code vérifié avec succès.");
    }


    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestParam String email,
            @RequestParam String code,
            @RequestParam String newPassword
    ) {
        boolean verified = passwordChangeService.verifyCode(email, code);
        if (!verified) {
            return ResponseEntity.badRequest().body("Code invalide ou expiré.");
        }

        String result = passwordChangeService.updatePasswordAfterCodeVerification(email, "", newPassword);
        return ResponseEntity.ok(result);
    }

}


