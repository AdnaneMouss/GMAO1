package com.huir.GmaoApp.controller;

import com.huir.GmaoApp.dto.EquipementDTO;
import com.huir.GmaoApp.dto.ServiceDTO;
import com.huir.GmaoApp.model.Equipement;
import com.huir.GmaoApp.model.Services;
import com.huir.GmaoApp.model.User;
import com.huir.GmaoApp.repository.ServicesRepository;
import com.huir.GmaoApp.service.ServicesService;
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
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = "http://localhost:4200")
public class ServicesController {

    @Autowired
    private ServicesService serviceService;
    @Autowired
    private ServicesRepository servicesRepository;

    // Get all services
    @GetMapping
    public List<ServiceDTO> getAllServices() {
        return serviceService.findAllServices().stream()
                .map(ServiceDTO::new)
                .collect(Collectors.toList());
    }

    // Get service by ID
    @GetMapping("/{id}")
    public ResponseEntity<Services> getServiceById(@PathVariable Long id) {
        Optional<Services> service = serviceService.findServiceById(id);
        return service.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createServiceWithImage(
            @RequestParam(value = "file", required = false) MultipartFile file,  // File is now optional
            @RequestParam("nom") String nom,
            @RequestParam(value = "description", required = false) String description) {

        // Check if service with the given name already exists
        if (serviceService.existsByNom(nom)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Ce nom est déjà utilisé.");
        }

        // Create the service entity
        Services service = new Services();
        service.setNom(nom);
        service.setDescription(description);

        // Handle image upload if a file is provided
        if (file != null && !file.isEmpty()) {
            try {
                String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
                Path filePath = Paths.get("uploads", fileName);
                Files.createDirectories(filePath.getParent());
                Files.write(filePath, file.getBytes());

                // Set the image URL
                service.setImage(fileName);
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Image upload failed");
            }
        }

        // Save the service to the database
        Services savedService = serviceService.saveService(service);

        // Return the saved service data
        return ResponseEntity.ok(new ServiceDTO(savedService));
    }


    @PutMapping("/{id}")
    public ResponseEntity<?> updateService(
            @PathVariable Long id,
            @RequestParam(value = "imageFile", required = false) MultipartFile imageFile,
            @RequestParam("nom") String nom,
            @RequestParam(value = "description", required = false) String description) {

        Optional<Services> existingUserOpt = servicesRepository.findById(id);
        if (!existingUserOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        Services existingService = existingUserOpt.get();
        if (nom != null && !existingService.getNom().equals(nom)) {
            Optional<Services> serviceExists = Optional.ofNullable(servicesRepository.findByNom(nom));
            if (serviceExists.isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of("field", "nom", "message", "Ce nom de service est déjà utilisé."));
            }
        }

        ServiceDTO serviceDTO = new ServiceDTO();
        serviceDTO.setNom(nom);
        serviceDTO.setDescription(description);

        ServiceDTO updatedService = serviceService.updateService(id, imageFile, serviceDTO);
        return updatedService != null ? ResponseEntity.ok(updatedService) : ResponseEntity.notFound().build();
    }


    // Delete service
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteService(@PathVariable Long id) {
        serviceService.deleteService(id);
        return ResponseEntity.noContent().build();
    }
}
