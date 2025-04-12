package com.huir.GmaoApp.dto;

import com.huir.GmaoApp.model.AttributEquipements;
import com.huir.GmaoApp.model.Equipement;
import lombok.*;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EquipementDTO {
    private Long id;
    private String image;
    private String nom;
    private String description;
    private String numeroSerie;
    private String modele;
    private String marque;
    private String statut;
    private String serviceNom;
    private LocalDate dateAchat;
    private LocalDate dateMiseEnService;
    private String garantie;
    private LocalDate dateDerniereMaintenance;
    private String frequenceMaintenance;
    private String responsableMaintenanceNom;
    private List<String> ordresTravail;
    private List<String> piecesDetachees;
    private String historiquePannes;
    private Double coutAchat;
    
    private String labelSuivi;  // Label suivi
    private double valeurSuivi; // Valeur suivie

    // Nouveaux champs ajoutés
    private String typeEquipement;
    private String codeBarre;
    private boolean actif;

    // Liste des attributs dynamiques
    private List<AttributEquipementValeurDTO> attributs;
    private List<AttributEquipements> attributsEquipement;
    

    // Champs pour les relations Batiment, Etage et Salle
    private String batimentNom;
    private Integer etageNum;
    private Integer salleNum;

    // Constructor to map Equipement to EquipementDTO
    public EquipementDTO(Equipement equipement) {
        this.id = equipement.getId();
        this.nom = equipement.getNom();
        this.description = equipement.getDescription();
        this.numeroSerie = equipement.getNumeroSerie();
        this.modele = equipement.getModele();
        this.marque = equipement.getMarque();
        this.statut = equipement.getStatut();
        this.dateAchat = equipement.getDateAchat();
        this.dateMiseEnService = equipement.getDateMiseEnService();
        this.garantie = equipement.getGarantie();
        this.dateDerniereMaintenance = equipement.getDateDerniereMaintenance();
        this.frequenceMaintenance = equipement.getFrequenceMaintenance();
        this.historiquePannes = equipement.getHistoriquePannes();
        this.coutAchat = equipement.getCoutAchat();
        this.image = equipement.getImage();
        this.actif = equipement.isActif();
        this.typeEquipement = equipement.getTypeEquipement() != null ? equipement.getTypeEquipement().getType() : null;
        this.labelSuivi= equipement.getLabelSuivi();
        this.valeurSuivi=equipement.getValeurSuivi();
        // Map the service and responsible maintenance details
        this.serviceNom = equipement.getService() != null ? equipement.getService().getNom() : null;
       // this.responsableMaintenanceNom = equipement.getResponsableMaintenance() != null
         //       ? equipement.getResponsableMaintenance().getNom()
           //     : null;
        
     //   this.piecesDetachees = equipement.getPiecesDetachees() != null ? equipement.getPiecesDetachees().stream()
       //         .map(piece -> piece.getNom()) // assuming PieceDetachee has a "nom" field
              //  .collect(Collectors.toList()) : Collections.emptyList();

        // Mapping des attributs dynamiques
        //this.attributs = equipement.getAttributsValeurs() != null ? equipement.getAttributsValeurs().stream()
          //      .map(AttributEquipementValeurDTO::new)
            //    .collect(Collectors.toList()) : Collections.emptyList();

// Assuming equipement.getEtage().getBatiment() is how you access the associated building (Batiment)
        this.batimentNom = equipement.getBatiment() != null ? equipement.getBatiment().getIntitule() : null;
        this.etageNum = equipement.getEtage() != null ? equipement.getEtage().getNum() : null;
        this.salleNum = equipement.getSalle() != null ? equipement.getSalle().getNum() : null;

    }

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}

	public String getNom() {
		return nom;
	}

	public void setNom(String nom) {
		this.nom = nom;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getNumeroSerie() {
		return numeroSerie;
	}

	public void setNumeroSerie(String numeroSerie) {
		this.numeroSerie = numeroSerie;
	}

	public String getModele() {
		return modele;
	}

	public void setModele(String modele) {
		this.modele = modele;
	}

	public String getMarque() {
		return marque;
	}

	public void setMarque(String marque) {
		this.marque = marque;
	}

	public String getStatut() {
		return statut;
	}

	public void setStatut(String statut) {
		this.statut = statut;
	}

	public String getServiceNom() {
		return serviceNom;
	}

	public void setServiceNom(String serviceNom) {
		this.serviceNom = serviceNom;
	}

	public LocalDate getDateAchat() {
		return dateAchat;
	}

	public void setDateAchat(LocalDate dateAchat) {
		this.dateAchat = dateAchat;
	}

	public LocalDate getDateMiseEnService() {
		return dateMiseEnService;
	}

	public void setDateMiseEnService(LocalDate dateMiseEnService) {
		this.dateMiseEnService = dateMiseEnService;
	}

	public String getGarantie() {
		return garantie;
	}

	public void setGarantie(String garantie) {
		this.garantie = garantie;
	}

	public LocalDate getDateDerniereMaintenance() {
		return dateDerniereMaintenance;
	}

	public void setDateDerniereMaintenance(LocalDate dateDerniereMaintenance) {
		this.dateDerniereMaintenance = dateDerniereMaintenance;
	}

	public String getFrequenceMaintenance() {
		return frequenceMaintenance;
	}

	public void setFrequenceMaintenance(String frequenceMaintenance) {
		this.frequenceMaintenance = frequenceMaintenance;
	}

	public String getResponsableMaintenanceNom() {
		return responsableMaintenanceNom;
	}

	public void setResponsableMaintenanceNom(String responsableMaintenanceNom) {
		this.responsableMaintenanceNom = responsableMaintenanceNom;
	}

	public List<String> getOrdresTravail() {
		return ordresTravail;
	}

	public void setOrdresTravail(List<String> ordresTravail) {
		this.ordresTravail = ordresTravail;
	}

	public List<String> getPiecesDetachees() {
		return piecesDetachees;
	}

	public void setPiecesDetachees(List<String> piecesDetachees) {
		this.piecesDetachees = piecesDetachees;
	}

	public String getHistoriquePannes() {
		return historiquePannes;
	}

	public void setHistoriquePannes(String historiquePannes) {
		this.historiquePannes = historiquePannes;
	}

	public Double getCoutAchat() {
		return coutAchat;
	}

	public void setCoutAchat(Double coutAchat) {
		this.coutAchat = coutAchat;
	}

	public String getLabelSuivi() {
		return labelSuivi;
	}

	public void setLabelSuivi(String labelSuivi) {
		this.labelSuivi = labelSuivi;
	}

	public double getValeurSuivi() {
		return valeurSuivi;
	}

	public void setValeurSuivi(double valeurSuivi) {
		this.valeurSuivi = valeurSuivi;
	}

	public String getTypeEquipement() {
		return typeEquipement;
	}

	public void setTypeEquipement(String typeEquipement) {
		this.typeEquipement = typeEquipement;
	}

	public String getCodeBarre() {
		return codeBarre;
	}

	public void setCodeBarre(String codeBarre) {
		this.codeBarre = codeBarre;
	}

	public boolean isActif() {
		return actif;
	}

	public void setActif(boolean actif) {
		this.actif = actif;
	}

	public List<AttributEquipementValeurDTO> getAttributs() {
		return attributs;
	}

	public void setAttributs(List<AttributEquipementValeurDTO> attributs) {
		this.attributs = attributs;
	}

	public String getBatimentNom() {
		return batimentNom;
	}

	public void setBatimentNom(String batimentNom) {
		this.batimentNom = batimentNom;
	}

	public Integer getEtageNum() {
		return etageNum;
	}

	public void setEtageNum(Integer etageNum) {
		this.etageNum = etageNum;
	}

	public Integer getSalleNum() {
		return salleNum;
	}

	public void setSalleNum(Integer salleNum) {
		this.salleNum = salleNum;
	}

	public List<AttributEquipements> getAttributsEquipement() {
		return attributsEquipement;
	}

	public void setAttributsEquipement(List<AttributEquipements> attributsEquipement) {
		this.attributsEquipement = attributsEquipement;
	}
	
	
    
      
    
    
}
