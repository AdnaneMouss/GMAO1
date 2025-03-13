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

            // If a new image is uploaded, handle it
            if (imageFile != null && !imageFile.isEmpty()) {
                try {
                    // Delete the old image (if exists)
                    if (service.getImage() != null) {
                        File oldImage = new File("uploads/" + service.getImage());
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
                    service.setImage(filename);
                } catch (IOException e) {
                    throw new RuntimeException("Error while saving image", e);
                }
            }

            serviceRepository.save(service);
            return new ServiceDTO(service);
        } else {
            return null;
        }
    }


    // Delete a Services
    public void deleteService(Long id) {
        serviceRepository.deleteById(id);
    }
}
