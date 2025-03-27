package com.huir.GmaoApp.controller;

import com.huir.GmaoApp.dto.UserDTO;
import com.huir.GmaoApp.model.Civilite;
import com.huir.GmaoApp.model.Role;
import com.huir.GmaoApp.model.User;
import com.huir.GmaoApp.repository.UserRepository;
import com.huir.GmaoApp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {

    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;

    // Get all users
    @GetMapping
    public List<User> getAllUsers() {
        return userService.findAllUsers();
    }

    // Get user by ID
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        Optional<User> user = userService.findUserById(id);
        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createUserWithImage(@RequestParam(value = "file", required = false) MultipartFile file,
                                                 @RequestParam("nom") String nom,
                                                 @RequestParam("email") String email,
                                                 @RequestParam("username") String username,
                                                 @RequestParam("password") String password,
                                                 @RequestParam("gsm") String gsm,
                                                 @RequestParam("civilite") String civilite,
                                                 @RequestParam("role") String role) {


        if (userService.existsByUsername(username)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("field", "username", "message", "Ce nom d'utilisateur est déjà utilisé."));
        }

        if (userService.existsByEmail(email)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("field", "email", "message", "Cet email est déjà utilisé."));
        }

        if (userService.existsByPhone(gsm)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("field", "gsm", "message", "Ce numéro est déjà utilisé."));
        }

        // Create the user
        User user = new User();
        user.setNom(nom);
        user.setEmail(email);
        user.setUsername(username);
        user.setPassword(password);  // You might want to hash the password
        user.setGsm(gsm);
        user.setCivilite(Civilite.valueOf(civilite));  // assuming Civilite is an enum
        user.setRole(Role.valueOf(role));  // assuming Role is an enum

        try {
            // Handle image upload
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            // Save the file in the static/uploads folder within the resources
            Path filePath = Paths.get("uploads", fileName);  // Just save to 'uploads' directly (relative to project root)
            Files.createDirectories(filePath.getParent());
            Files.write(filePath, file.getBytes());

            // Set the image URL in the user
            String imageUrl = fileName;
            user.setImage(imageUrl);

            // Save the user to the database
            User savedUser = userService.addUser(user);

            // Return the saved user data along with its image URL
            return ResponseEntity.ok(new UserDTO(savedUser)); // assuming you have a UserDTO

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Image upload failed");
        }
    }


    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(
            @PathVariable Long id,
            @RequestParam(value = "username", required = false) String username,
            @RequestParam(value = "email", required = false) String email,
            @RequestParam(value = "nom", required = false) String nom,
            @RequestParam(value = "gsm", required = false) String gsm,
            @RequestParam(value = "password", required = false) String password,
            @RequestParam(value = "role", required = false) String role,
            @RequestParam(value = "actif", required = false) Boolean actif,
            @RequestParam(value = "civilite", required = false) String civilite,
            @RequestParam(value = "imageFile", required = false) MultipartFile imageFile) {

        // Fetch the current user from the database
        Optional<User> existingUserOpt = userRepository.findById(id);
        if (!existingUserOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        User existingUser = existingUserOpt.get();

        // Check if the username has changed and if the new username already exists
        if (username != null && !existingUser.getUsername().equals(username)) {
            Optional<User> usernameExists = userRepository.findByUsername(username);
            if (usernameExists.isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of("field", "username", "message", "Ce nom d'utilisateur est déjà utilisé."));
            }
        }

        // Check if the email has changed and if the new email already exists
        if (email != null && !existingUser.getEmail().equals(email)) {
            Optional<User> emailExists = userRepository.findByEmail(email);
            if (emailExists.isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of("field", "email", "message", "Cet email est déjà utilisé."));
            }
        }

        if (gsm != null && !existingUser.getGsm().equals(gsm)) {
            Optional<User> gsmExists = userRepository.findByGsm(gsm);
            if (gsmExists.isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of("field", "gsm", "message", "Ce numéro de téléphone est déjà utilisé."));
            }
        }

        // Update the user with the new values, only if they were provided (no null checks)
        if (nom != null) existingUser.setNom(nom);
        if (email != null) existingUser.setEmail(email);
        if (username != null) existingUser.setUsername(username);
        if (gsm != null) existingUser.setGsm(gsm);
        if (password != null) existingUser.setPassword(password);  // Remember to hash the password before saving
        if (role != null) existingUser.setRole(Role.valueOf(role));
        if (civilite != null) existingUser.setCivilite(Civilite.valueOf(civilite));
        if (actif != null) existingUser.setActif(actif);

        // Handle image upload if provided
        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                // Generate a unique filename for the image
                String fileName = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();
                // Save the file in the static/uploads folder within the resources
                Path filePath = Paths.get("uploads", fileName);  // Just save to 'uploads' directly (relative to project root)
                Files.createDirectories(filePath.getParent());
                Files.write(filePath, imageFile.getBytes());

                // Set the image URL in the user
                String imageUrl = fileName;
                existingUser.setImage(imageUrl);  // Assuming your User entity has a setImage method

            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Image upload failed");
            }
        }

        // Save the updated user in the database
        userRepository.save(existingUser);

        return ResponseEntity.ok(existingUser);  // Return the updated user
    }




    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User utilisateur) {
        UserDTO foundUser = userService.findByEmailAndPassword(utilisateur.getEmail(), utilisateur.getPassword());

        if (foundUser != null) {
            // Return user type with the DTO
            return ResponseEntity.ok().body(foundUser);
        } else {
            // Return 401 if credentials are invalid
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }
    // Delete user
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
