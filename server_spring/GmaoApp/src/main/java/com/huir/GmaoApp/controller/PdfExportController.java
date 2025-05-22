package com.huir.GmaoApp.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.huir.GmaoApp.dto.InterventionDTO;
import com.huir.GmaoApp.model.Intervention;
import com.huir.GmaoApp.model.User;
import com.huir.GmaoApp.service.InterventionService;
import com.huir.GmaoApp.service.PdfExportService;
import com.huir.GmaoApp.service.UserService;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/pdf")
public class PdfExportController {

    private final PdfExportService pdfExportService;
    private final UserService userService;
    private final InterventionService interventionService;

    public PdfExportController(PdfExportService pdfExportService, UserService userService, InterventionService interventionService) {
        this.pdfExportService = pdfExportService;
        this.userService = userService;
        this.interventionService = interventionService;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<byte[]> exportUserReport(@PathVariable Long userId) throws Exception {
        Optional<User> userOptional = userService.findUserById(userId);
        User user = userOptional.orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        List<InterventionDTO> interventionDTOs = interventionService.getInterventionsByTechnicien(userId);

        List<Intervention> interventions = interventionDTOs.stream()
            .map(this::convertDtoToEntity)
            .collect(Collectors.toList());

        byte[] pdfContents = pdfExportService.generateUserReportPdf(user, interventions);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"fiche_utilisateur_"  + ".pdf\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfContents);
    }

    private Intervention convertDtoToEntity(InterventionDTO dto) {
        Intervention i = new Intervention();
      
        i.setDescription(dto.getDescription());
        i.setRemarques(dto.getRemarques());
        // Ajoutez d'autres champs selon ce que contient votre DTO
        return i;
    }

}