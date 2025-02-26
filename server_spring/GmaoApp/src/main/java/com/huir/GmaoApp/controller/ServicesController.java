package com.huir.GmaoApp.controller;

import com.huir.GmaoApp.dto.EquipementDTO;
import com.huir.GmaoApp.dto.ServiceDTO;
import com.huir.GmaoApp.model.Equipement;
import com.huir.GmaoApp.model.Services;
import com.huir.GmaoApp.repository.ServicesRepository;
import com.huir.GmaoApp.service.ServicesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
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
    public List<ServiceDTO> getAllEquipements() {
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
    public ResponseEntity<?> createService(@RequestBody ServiceDTO serviceDTO) {
        if (serviceService.existsByNom(serviceDTO.getNom())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Ce nom est déjà utilisé.");
        }

        Services service = new Services();
        service.setNom(serviceDTO.getNom());
        service.setImage(serviceDTO.getImage());
        service.setDescription(serviceDTO.getDescription());

        Services savedService = serviceService.saveService(service);
        return ResponseEntity.ok(new ServiceDTO(savedService));
    }


    @PutMapping("/{id}")
    public ServiceDTO updateUser(@PathVariable Long id, @RequestBody ServiceDTO serviceDTO) {
        return serviceService.updateservice(id, serviceDTO);
    }

    // Delete service
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteService(@PathVariable Long id) {
        serviceService.deleteService(id);
        return ResponseEntity.noContent().build();
    }
}
