package com.huir.GmaoApp.service;

import com.huir.GmaoApp.model.CodeDetails;
import com.huir.GmaoApp.model.User;
import com.huir.GmaoApp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class PasswordChangeService {

    @Autowired
    private JavaMailSender emailSender;

    @Autowired
    private UserRepository userRepository;

    private final Map<String, CodeDetails> codeStorage = new HashMap<>();  // Store codes with expiration time

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // Method to generate a random 6-digit code
    public String generateRandomCode() {
        SecureRandom random = new SecureRandom();
        return String.format("%06d", random.nextInt(1000000));
    }

    // Send the code and store it temporarily with expiration time (5 minutes)
    public void sendVerificationCode(String email) {
        String code = generateRandomCode();
        LocalDateTime expirationTime = LocalDateTime.now().plusMinutes(1); // 5-minute expiration
        CodeDetails codeDetails = new CodeDetails(code, expirationTime);
        codeStorage.put(email, codeDetails); // Store the code with expiration

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Password Change Verification Code");
        message.setText("Your verification code is: " + code);
        emailSender.send(message);
    }

    // Verify the code with the user's email and check if it's expired
    public boolean verifyCode(String email, String code) {
        CodeDetails codeDetails = codeStorage.get(email);

        if (codeDetails == null || codeDetails.isExpired()) {
            codeStorage.remove(email); // Clean up expired or invalid codes
            return false;  // Code is either missing or expired
        }

        return codeDetails.getCode().equals(code);  // Check if the code matches
    }

    // Change the password after successful verification
    public String updatePasswordAfterCodeVerification(String email, String currentPassword, String newPassword) {
        // Find the user by email
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isEmpty()) {
            return "Utilisateur introuvable.";  // User not found
        }

        User user = optionalUser.get();


        // Hash the new password before saving it
        String hashedPassword = passwordEncoder.encode(newPassword);
        user.setPassword(hashedPassword);

        userRepository.save(user);  // Save the updated user with the new password

        codeStorage.remove(email);  // Remove the used or expired code
        return "Mot de passe modifié avec succès.";  // Password updated successfully
    }

    public String checkCurrentPassword(String currentPassword, String email) {

        Optional<User> optionalUser = userRepository.findByEmail(email);

        if (optionalUser.isEmpty()) {
            return "Utilisateur introuvable.";  // User not found
        }

        User user = optionalUser.get();
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            return "Le mot de passe actuel est incorrect.";  // Current password is incorrect
        }

        // Optionally: return a success message if everything is okay
        return "Mot de passe vérifié avec succès.";  // Password verified successfully
    }

}