package com.huir.GmaoApp.service;

import com.huir.GmaoApp.dto.UserDTO;
import com.huir.GmaoApp.model.User;
import com.huir.GmaoApp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public UserService( UserRepository userRepository) {

        this.userRepository = userRepository;
    }

    @Transactional
    public void addUser(UserDTO utilisateurDTO) {
        User utilisateur = new User();
        utilisateur.setNom(utilisateurDTO.getNom());
        utilisateur.setEmail(utilisateurDTO.getEmail());
        utilisateur.setPassword(utilisateurDTO.getPassword());
        utilisateur.setImage(utilisateurDTO.getImage());
        utilisateur.setGsm(utilisateurDTO.getGsm());
        utilisateur.setRole(utilisateurDTO.getRole());
        utilisateur.setUsername(utilisateurDTO.getUsername());
        utilisateur.setCivilite(utilisateurDTO.getCivilite());
        utilisateur.setDateInscription(LocalDateTime.now());
        userRepository.save(utilisateur);
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
