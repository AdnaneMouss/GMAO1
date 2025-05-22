package com.huir.GmaoApp.service;
import org.springframework.stereotype.Service;

import com.huir.GmaoApp.dto.EquipementDTO;
import com.huir.GmaoApp.dto.RapportDTO;
import com.huir.GmaoApp.model.DateUtils;
import com.huir.GmaoApp.model.Equipement;
import com.huir.GmaoApp.model.Maintenance;
import com.huir.GmaoApp.repository.EquipementRepository;
import com.huir.GmaoApp.repository.MaintenanceRepository;
import com.itextpdf.text.Image;
import com.itextpdf.text.pdf.PdfWriter;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.net.URL;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;



import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfWriter;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;

@Service
public class RapportEquipement {

	 private final EquipementRepository equipementRepository;
	    private final MaintenanceRepository maintenanceRepository;

	    public RapportEquipement(EquipementRepository equipementRepository, MaintenanceRepository maintenanceRepository) {
	        this.equipementRepository = equipementRepository;
	        this.maintenanceRepository = maintenanceRepository;
	    }

	    public RapportDTO generateRapportHebdo(Date dateDebut, Date dateFin) {
	        // Si dates non fournies, on prend la semaine précédente
	        if (dateDebut == null || dateFin == null) {
	            dateDebut = DateUtils.getLundiSemainePrecedente();
	            dateFin = DateUtils.getDimancheSemainePrecedente();
	        }

	      
	        

	        RapportDTO rapport = new RapportDTO();
	        rapport.setPeriodeDebut(dateDebut);
	        rapport.setPeriodeFin(dateFin);
	       // rapport.setEquipements(equipements.stream().map(this::convertToDTO).collect(Collectors.toList()));
	      //  rapport.setMaintenances(maintenances.stream().map(this::convertToDTO).collect(Collectors.toList()));
	        rapport.setDateGeneration(new Date());

	        // Calcul des statistiques
	        

	        return rapport;
	    }

	    public RapportDTO generateRapportMensuel(Date dateDebut, Date dateFin) {
	        // Si dates non fournies, prendre le mois précédent
	        if (dateDebut == null || dateFin == null) {
	            dateDebut = DateUtils.getPremierJourMoisPrecedent();
	            dateFin = DateUtils.getDernierJourMoisPrecedent();
	        }

	        // Récupération des données
	      
	      

	        // Construction du rapport
	        RapportDTO rapport = new RapportDTO();
	        rapport.setPeriodeDebut(dateDebut);
	        rapport.setPeriodeFin(dateFin);
	        //rapport.setEquipements(equipements.stream().map(this::convertToDTO).collect(Collectors.toList()));
	        rapport.setDateGeneration(new Date());

	        // Statistiques
	        rapport.setTotalEquipements((int) equipementRepository.count());
	       
	        // Tu peux ajouter d'autres stats ici, ex. :
	        // rapport.setTotalMaintenances(maintenances.size());

	        return rapport;
	    }

	    
	    public byte[] generateFicheEquipementPDF(Long equipementId) {
	        Equipement equipement = equipementRepository.findById(equipementId)
	                .orElseThrow(() -> new RuntimeException("Équipement non trouvé"));

	        try {
	            ByteArrayOutputStream baos = new ByteArrayOutputStream();
	            Document document = new Document();
	            PdfWriter.getInstance(document, baos);
	            document.open();

	            // Logo (dans src/main/resources/logo.png)
	            

	            // Titre
	            Font fontTitre = new Font(Font.FontFamily.HELVETICA, 16, Font.BOLD);
	            Paragraph titre = new Paragraph("Fiche Équipement", fontTitre);
	            titre.setAlignment(Element.ALIGN_CENTER);
	            document.add(titre);
	            document.add(Chunk.NEWLINE);

	            // Données de l'équipement
	            Font font = new Font(Font.FontFamily.HELVETICA, 12);
	            document.add(new Paragraph("Nom : " + equipement.getNom(), font));
	            document.add(new Paragraph("Date d'achat : " + equipement.getDateAchat(), font));
	            document.add(new Paragraph("Coût d'achat : " + equipement.getCoutAchat() + " €", font));
	            document.add(new Paragraph("Statut : " + equipement.getStatut(), font));

	            document.close();
	            return baos.toByteArray();

	        } catch (Exception e) {
	            throw new RuntimeException("Erreur lors de la génération du PDF", e);
	        }
	    }
	



	 

	}
