package com.huir.GmaoApp.controller;

import com.huir.GmaoApp.dto.BatimentDTO;
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
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = "http://localhost:4200")
public class ServicesController {

    @Autowired
    private ServicesService serviceService;
    @Autowired
    private ServicesRepository servicesRepository;
    @Autowired
    private ServicesRepository equipementRepository;

    // Get all services
    @GetMapping
    public List<ServiceDTO> getServicesActifs() {
        return serviceService.getServicesActifs().stream()
                .map(ServiceDTO::new)
                .collect(Collectors.toList());
    }

    @GetMapping("/inactifs")
    public List<ServiceDTO> getServicesInactifs() {
        return serviceService.getServicesInactifs().stream()
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

    @PutMapping("/{id}/archiver")
    public ResponseEntity<Map<String, String>> archiverService(@PathVariable Long id) {
        Services service = servicesRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service non trouvé"));

        boolean hasLinkedEquipements = equipementRepository.existsByNom(service);
        if (hasLinkedEquipements) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Impossible d’archiver : ce service est lié à au moins un équipement.");
        }

        service.setActif(false);
        servicesRepository.save(service);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Service archivé avec succès");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/archiver-multiple")
    public ResponseEntity<Map<String, Object>> archiverServices(@RequestBody List<Long> ids) {
        List<Services> services = servicesRepository.findAllById(ids);
        List<String> archived = new ArrayList<>();
        List<String> skipped = new ArrayList<>();

        for (Services service : services) {
            boolean isLinked = equipementRepository.existsByNom(service);
            if (isLinked) {
                skipped.add("Service " + service.getNom() + " lié à des équipements");
                continue;
            }

            service.setActif(false);
            servicesRepository.save(service);
            archived.add("Service ID " + service.getId());
        }

        Map<String, Object> response = new HashMap<>();
        response.put("archivés", archived);
        response.put("ignorés", skipped);
        response.put("message", "Archivage terminé avec succès.");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/restaurer")
    public ResponseEntity<?> restaurerService(@PathVariable Long id) {
        Services service = servicesRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service non trouvé"));

        if (serviceService.existsByNomAndActifTrue(service.getNom())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Un service actif avec ce nom existe déjà.");
        }

        service.setActif(true);
        servicesRepository.save(service);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Service restauré avec succès");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/restaurer-multiple")
    public ResponseEntity<?> restaurerServices(@RequestBody List<Long> ids) {
        List<Services> services = servicesRepository.findAllById(ids);
        List<String> conflicts = new ArrayList<>();

        for (Services service : services) {
            if (serviceService.existsByNomAndActifTrue(service.getNom())) {
                conflicts.add("Nom déjà utilisé : " + service.getNom());
                continue;
            }

            service.setActif(true);
        }

        if (!conflicts.isEmpty()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(conflicts);
        }

        servicesRepository.saveAll(services);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Services restaurés avec succès");
        return ResponseEntity.ok(response);
    }





}
