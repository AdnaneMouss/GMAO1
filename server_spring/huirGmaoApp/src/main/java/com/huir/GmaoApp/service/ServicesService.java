package com.huir.GmaoApp.service;

import com.huir.GmaoApp.dto.EquipementDTO;
import com.huir.GmaoApp.dto.ServiceDTO;
import com.huir.GmaoApp.model.Services;
import com.huir.GmaoApp.repository.ServicesRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.management.ServiceNotFoundException;
import java.util.List;
import java.util.Optional;

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

    public ServiceDTO updateservice(Long id, ServiceDTO serviceDTO) {
        Optional<Services> optionalservice = serviceRepository.findById(id);
        System.out.println(optionalservice.get());
        if (optionalservice.isPresent()) {
            Services service = optionalservice.get();

            // Update service fields using serviceDTO values
            service.setNom(serviceDTO.getNom());
            service.setImage(serviceDTO.getImage());
            serviceRepository.save(service);

            return new ServiceDTO(service);
        }
        else{
            throw new EntityNotFoundException("entity services not found ");
        }
    }
    // Delete a Services
    public void deleteService(Long id) {
        serviceRepository.deleteById(id);
    }
}
