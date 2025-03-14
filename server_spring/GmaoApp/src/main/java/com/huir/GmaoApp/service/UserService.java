package com.huir.GmaoApp.service;

import com.huir.GmaoApp.dto.UserDTO;
import com.huir.GmaoApp.model.Services;
import com.huir.GmaoApp.model.User;
import com.huir.GmaoApp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    private final EmailService emailService;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    
    public UserService(UserRepository userRepository, EmailService emailService) {

        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    public User addUser(User user) {
        return userRepository.save(user);
    }

    // Find a user by ID
    public Optional<User> findUserById(Long id) {
        return userRepository.findById(id);
    }

    // Find a user by email
    public Optional<User> findUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }


    public UserDTO findByEmailAndPassword(String email, String password) {
        Optional<User> utilisateurOpt = userRepository.findByEmail(email);
        if (utilisateurOpt.isPresent()) {
            User utilisateur = utilisateurOpt.get();

            // Compare the raw password with the hashed one
            if (passwordEncoder.matches(password, utilisateur.getPassword())) {
                return new UserDTO(utilisateur); // Return DTO if password matches
            }
        }
        return null; // Return null if not found or password doesn't match
    }

    // Get all users
    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    // Delete a user
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    @Transactional
    public UserDTO updateUser(Long id, MultipartFile imageFile, UserDTO userDTO) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            // Update user fields
            user.setNom(userDTO.getNom());
            user.setEmail(userDTO.getEmail());
            user.setGsm(userDTO.getGsm());
            user.setRole(userDTO.getRole());
            user.setActif(userDTO.isActif());
            user.setUsername(userDTO.getUsername());
            user.setCivilite(userDTO.getCivilite());
            user.setDateInscription(LocalDateTime.now());

            // If a new image is uploaded, handle it
            if (imageFile != null && !imageFile.isEmpty()) {
                try {
                    // Delete the old image (if exists)
                    if (user.getImage() != null) {
                        File oldImage = new File("uploads/" + user.getImage());
                        if (oldImage.exists()) {
                            oldImage.delete();
                        }
                    }

                    // Generate a unique image filename
                    String filename = UUID.randomUUID().toString() + "_" + imageFile.getOriginalFilename();
                    Path imagePath = Paths.get("uploads/" + filename);

                    // Save the new image
                    Files.copy(imageFile.getInputStream(), imagePath, StandardCopyOption.REPLACE_EXISTING);

                    // Update entity with new image path
                    user.setImage(filename);
                } catch (IOException e) {
                    throw new RuntimeException("Error while saving image", e);
                }
            }

            // Save updated user entity
            userRepository.save(user);
            return new UserDTO(user);
        } else {
            return null; // User not found
        }
    }

    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }


    public boolean existsByPhone(String gsm) {
        return userRepository.existsByGsm(gsm);
    }

    public boolean updateNotifications(Long userId, boolean notifications) {
        Optional<User> optionalUser = userRepository.findById(userId);

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setNotifications(notifications);
            userRepository.save(user);

            // 👉 Send email ONLY if notifications are turned ON
            if (notifications && user.getEmail() != null) {
                String subject = "Notifications activées dans GMAO";
                String body = "Bonjour " + user.getNom() + ",\n\n"
                        + "Vous avez activé les notifications dans votre espace GMAO.\n"
                        + "Vous recevrez désormais des alertes importantes liées à vos équipements et maintenances.\n\n"
                        + "Merci de votre confiance.\n\n"
                        + "Cordialement,\nL'équipe GMAO";

                emailService.sendEmail(user.getEmail(), subject, body);
            }

            return true;
        }

        return false; // User not found
    }


    public User updateUserField(Long id, String fieldName, String newValue) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        switch (fieldName) {
            case "nom":
                user.setNom(newValue);
                break;
            case "email":
                user.setEmail(newValue);
                break;
            case "gsm":
                user.setGsm(newValue);
                break;
            case "username":
                user.setUsername(newValue);
                break;
            case "image":
                user.setImage(newValue);
                break;
            default:
                throw new IllegalArgumentException("Champ '" + fieldName + "' non supporté ou non modifiable.");
        }

        return userRepository.save(user);
    }

public void deactivateAcc(Long id){
    User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));

    user.setActif(false);
    userRepository.save(user);
}


}
