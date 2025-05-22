package com.huir.GmaoApp.controller;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import com.huir.GmaoApp.dto.EquipementDTO;
import com.huir.GmaoApp.dto.RapportDTO;
import com.huir.GmaoApp.dto.StatsDTO;
import com.huir.GmaoApp.service.EquipementService;
import com.huir.GmaoApp.service.RapportEquipement;

import org.springframework.http.ResponseEntity;
import java.util.Date;
import java.util.List;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfWriter;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;



@RestController
@RequestMapping("/api/rapports-equipements")
@CrossOrigin(origins = "*")
public class RapportEquipementController {

    private final EquipementService equipementService;
    private final RapportEquipement rapportService;

    public RapportEquipementController(EquipementService equipementService, RapportEquipement rapportService) {
        this.equipementService = equipementService;
        this.rapportService = rapportService;
    }

   

    // Génération rapport hebdomadaire
    @GetMapping("/rapport-hebdomadaire")
    public ResponseEntity<RapportDTO> generateRapportHebdo(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date dateDebut,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date dateFin) {
        
        RapportDTO rapport = rapportService.generateRapportHebdo(dateDebut, dateFin);
        return ResponseEntity.ok(rapport);
    }

    // Génération rapport mensuel
    @GetMapping("/rapport-mensuel")
    public ResponseEntity<RapportDTO> generateRapportMensuel(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date dateDebut,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date dateFin) {
        
        RapportDTO rapport = rapportService.generateRapportMensuel(dateDebut, dateFin);
        return ResponseEntity.ok(rapport);
    }

    // Export PDF équipement
    @GetMapping("/export-pdf/{id}")
    public ResponseEntity<byte[]> exportFicheEquipementPDF(@PathVariable Long id) {
        byte[] pdfContent = rapportService.generateFicheEquipementPDF(id);
        return ResponseEntity.ok()
                .header("Content-Type", "application/pdf")
                .header("Content-Disposition", "attachment; filename=\"fiche_equipement_" + id + ".pdf\"")
                .body(pdfContent);
    }
    
    
}