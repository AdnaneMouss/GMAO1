package com.huir.GmaoApp.controller;

import com.huir.GmaoApp.service.PasswordChangeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/password")
public class PasswordChangeController {

    @Autowired
    private PasswordChangeService passwordChangeService;

    @PostMapping("/send-code")
    public String sendVerificationCode(@RequestBody String email) {
        passwordChangeService.sendVerificationCode(email);
        return "Code envoyé à votre email.";
    }

    @PostMapping("/verify-code")
    public String verifyCodeAndChangePassword(@RequestParam String email,
                                              @RequestParam String code,
                                              @RequestParam String newPassword) {
        if (passwordChangeService.verifyCode(email, code)) {
            return passwordChangeService.updatePasswordAfterCodeVerification(email, newPassword);
        } else {
            return "Code de vérification invalide.";
        }
    }
}
