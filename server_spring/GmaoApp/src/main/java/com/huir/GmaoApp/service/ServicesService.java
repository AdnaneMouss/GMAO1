package com.huir.GmaoApp.service;

import com.huir.GmaoApp.dto.EquipementDTO;
import com.huir.GmaoApp.dto.ServiceDTO;
import com.huir.GmaoApp.dto.UserDTO;
import com.huir.GmaoApp.model.Services;
import com.huir.GmaoApp.model.User;
import com.huir.GmaoApp.repository.ServicesRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.management.ServiceNotFoundException;
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
public class ServicesService {

    @Autowired
    private ServicesRepository serviceRepository;


    public Services saveService(Services service) {
        if (serviceRepository.existsByNom(service.getNom())) {
            throw new IllegalArgumentException("Un service avec ce nom existe déjà !");
        }
        return serviceRepository.save(service);
    }


    // Find a Services by ID
    public Optional<Services> findServiceById(Long id) {
        return serviceRepository.findById(id);
    }

    public boolean existsByNom(String nom) {
        return serviceRepository.existsByNom(nom);
    }

    // Get all Servicess
    public List<Services> findAllServices() {
        return serviceRepository.findAll();
    }

    @Transactional
    public ServiceDTO updateService(Long id, MultipartFile imageFile, ServiceDTO serviceDTO) {
        Optional<Services> optionalServices = serviceRepository.findById(id);

        if (optionalServices.isPresent()) {
            Services service = optionalServices.get();

            // Update text fields
            service.setNom(serviceDTO.getNom());
            service.setDescription(serviceDTO.getDescription());

            try {
                // If a new image is uploaded, handle it
                if (imageFile != null && !imageFile.isEmpty()) {

                    // Delete old image if exists
                    if (service.getImage() != null) {
                        Files.deleteIfExists(Paths.get("uploads", service.getImage()));
                    }

                    // Generate unique filename
                    String filename = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();
                    Path imagePath = Paths.get("uploads", filename);

                    // Ensure directory exists
                    Files.createDirectories(imagePath.getParent());

                    // Save new image
                    Files.write(imagePath, imageFile.getBytes());

                    // Update entity
                    service.setImage(filename);
                }

                serviceRepository.save(service);
                return new ServiceDTO(service);

            } catch (IOException e) {
                throw new RuntimeException("Error while saving image", e);
            }

        } else {
            return null;
        }
    }
    // Delete a Services
    public void deleteService(Long id) {
        serviceRepository.deleteById(id);
    }
}
