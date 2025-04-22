package com.huir.GmaoApp.service;

import com.huir.GmaoApp.model.User;
import com.huir.GmaoApp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class PasswordChangeService {

    @Autowired
    private JavaMailSender emailSender;

    @Autowired
    private UserRepository userRepository;

    private final Map<String, String> codeStorage = new HashMap<>();

    // Method to generate a random 6-digit code
    public String generateRandomCode() {
        SecureRandom random = new SecureRandom();
        return String.format("%06d", random.nextInt(1000000));
    }

    // Send the code and store it temporarily
    public void sendVerificationCode(String email) {
        String code = generateRandomCode();
        codeStorage.put(email, code); // Store the code for the user

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Password Change Verification Code");
        message.setText("Your verification code is: " + code);
        emailSender.send(message);
    }

    // Verify the code with the user's email
    public boolean verifyCode(String email, String code) {
        return codeStorage.containsKey(email) && codeStorage.get(email).equals(code);
    }

    // Change the password after successful verification
    public String updatePasswordAfterCodeVerification(String email, String newPassword) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isEmpty()) {
            return "Utilisateur introuvable.";
        }

        User user = optionalUser.get();
        user.setPassword(newPassword);
        userRepository.save(user);

        codeStorage.remove(email); // Remove used code
        return "Mot de passe modifié avec succès.";
    }
}
