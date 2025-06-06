package com.huir.GmaoApp.controller;

import java.io.IOException;
import java.math.BigDecimal;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.nio.file.Path;
import java.nio.file.Paths;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.huir.GmaoApp.model.Contrat;
import com.huir.GmaoApp.model.Fournisseur;
import com.huir.GmaoApp.repository.FournisseurRepository;
import com.huir.GmaoApp.service.ContratService;

@RestController
@RequestMapping("/api/contrats")
public class ContratController {

    @Autowired
    private ContratService contratService;

    @Autowired
    private FournisseurRepository fournisseurRepository;
    @GetMapping("/fournisseur/{id}")
    public List<Contrat> getByFournisseur(@PathVariable Long id) {
        return contratService.getContratsByFournisseur(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        contratService.deleteContrat(id);
    }

    @PostMapping
    public Contrat saveContrat(@RequestBody Contrat contrat) {
        // Associer le fournisseur à partir de l'ID transmis
        if (contrat.getFournisseurId() != null) {
            Fournisseur fournisseur = fournisseurRepository.findById(contrat.getFournisseurId())
                    .orElseThrow(() -> new RuntimeException("Fournisseur non trouvé"));
            contrat.setFournisseur(fournisseur);
        }

        return contratService.saveContrat(contrat);
    }
    
    
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Contrat uploadContratAvecFichier(
            @RequestParam("numeroContrat") String numeroContrat,
            @RequestParam("dateDebut") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateDebut,
            @RequestParam("dateFin") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFin,
            @RequestParam("type") String type,
            @RequestParam("montant") BigDecimal montant,
            @RequestParam("fournisseurId") Long fournisseurId,
            @RequestParam(value = "file", required = false) MultipartFile file
    ) throws IOException {

        Contrat contrat = new Contrat();
        contrat.setNumeroContrat(numeroContrat);
        contrat.setDateDebut(dateDebut);
        contrat.setDateFin(dateFin);
        contrat.setType(type);
        contrat.setMontant(montant);
        contrat.setFournisseurId(fournisseurId);

        // Associer le fournisseur
        Fournisseur fournisseur = fournisseurRepository.findById(fournisseurId)
                .orElseThrow(() -> new RuntimeException("Fournisseur non trouvé"));
        contrat.setFournisseur(fournisseur);

        // Gérer le fichier PDF
        if (file != null && !file.isEmpty()) {
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path uploadDir = Paths.get("uploads/contrats");
            Files.createDirectories(uploadDir);
            Path filePath = uploadDir.resolve(fileName);
            Files.write(filePath, file.getBytes());
            contrat.setFichierPdf(fileName);
        }

        return contratService.saveContrat(contrat);
    }
    @GetMapping("/api/pdf/{filename:.+}")
    public ResponseEntity<Resource> getPdf(@PathVariable String filename) {
        try {
            Path file = Paths.get("C:/Users/yigvyu/Desktop/pdfs").resolve(filename);
            Resource resource = new UrlResource(file.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                .body(resource);

        } catch (MalformedURLException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }


    

   
}
