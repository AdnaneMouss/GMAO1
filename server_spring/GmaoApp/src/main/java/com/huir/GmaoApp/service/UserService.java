package com.huir.GmaoApp.service;

import com.huir.GmaoApp.dto.UserDTO;
import com.huir.GmaoApp.model.User;
import com.huir.GmaoApp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
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

    @Transactional
    public void addUser(UserDTO utilisateurDTO, MultipartFile file) {
        try {
            // Generate a unique filename using UUID
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            // Define the upload path (here we store files under the 'uploads' directory in the project root)
            Path filePath = Paths.get("uploads", fileName);
            // Create the necessary directories if they do not exist
            Files.createDirectories(filePath.getParent());
            // Write the file to disk
            Files.write(filePath, file.getBytes());

            // Set the image URL or file path for the user
            String imageUrl = fileName;  // You can use a relative URL or the filename
            utilisateurDTO.setImage(imageUrl);  // Store the image filename in your DTO

            // Convert DTO to entity
            User utilisateur = new User();
            utilisateur.setNom(utilisateurDTO.getNom());
            utilisateur.setEmail(utilisateurDTO.getEmail());
            utilisateur.setPassword(utilisateurDTO.getPassword());
            utilisateur.setImage(utilisateurDTO.getImage());  // Set the image path
            utilisateur.setGsm(utilisateurDTO.getGsm());
            utilisateur.setRole(utilisateurDTO.getRole());
            utilisateur.setUsername(utilisateurDTO.getUsername());
            utilisateur.setCivilite(utilisateurDTO.getCivilite());
            utilisateur.setDateInscription(LocalDateTime.now());

            // Save user to the database
            userRepository.save(utilisateur);

        } catch (IOException e) {
            throw new RuntimeException("Image upload failed", e);
        }
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
    public UserDTO updateUser(Long id, UserDTO userDTO) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            // Update user fields
            user.setNom(userDTO.getNom());
            user.setEmail(userDTO.getEmail());
            user.setGsm(userDTO.getGsm());
            user.setImage(userDTO.getImage());
            user.setRole(userDTO.getRole());
            user.setActif(userDTO.isActif());
            user.setUsername(userDTO.getUsername());
            user.setCivilite(userDTO.getCivilite());
            user.setDateInscription(LocalDateTime.now());
            // Save updated user entity
            userRepository.save(user);
            return new UserDTO(user);
        } else {
            return null; // User not found
        }
    }
}
