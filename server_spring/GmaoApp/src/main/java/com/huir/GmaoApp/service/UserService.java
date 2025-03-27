package com.huir.GmaoApp.service;

import com.huir.GmaoApp.dto.UserDTO;
import com.huir.GmaoApp.model.Services;
import com.huir.GmaoApp.model.User;
import com.huir.GmaoApp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
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

    public UserService( UserRepository userRepository) {

        this.userRepository = userRepository;
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
            if (utilisateur.getPassword().equals(password)) {
                return new UserDTO(utilisateur); // Renvoie un DTO à la place de l'entité
            }
        }
        return null; // Retourne null si l'utilisateur n'est pas trouvé ou si le mot de passe est incorrect
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


}
