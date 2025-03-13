package com.huir.GmaoApp.controller;

import com.huir.GmaoApp.dto.UserDTO;
import com.huir.GmaoApp.model.User;
import com.huir.GmaoApp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {

    @Autowired
    private UserService userService;

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

    @PostMapping("/add")
    public ResponseEntity<String> addUser(@RequestParam("file") MultipartFile file, @RequestBody UserDTO utilisateurDTO) {
        try {
            // Call the service to handle user creation and image upload
            userService.addUser(utilisateurDTO, file);
            return ResponseEntity.ok("User successfully created with image: " + utilisateurDTO.getImage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Image upload failed: " + e.getMessage());
        }
    }


    @PutMapping("/{id}")
    public UserDTO updateUser(@PathVariable Long id, @RequestBody UserDTO userDTO) {
        return userService.updateUser(id, userDTO);
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
