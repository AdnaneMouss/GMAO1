package com.huir.GmaoApp.dto;

import com.huir.GmaoApp.model.Intervention;
import com.huir.GmaoApp.model.MaintenanceCorrective;
import com.huir.GmaoApp.model.TypeIntervention;
import com.huir.GmaoApp.service.PieceDetacheeService;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterventionDTO {
    private Long id;
    private Long technicienId;
    private String typeIntervention;
    private String description;
    private Long duree;
    private Long maintenanceId;
    private String maintenanceStatut;
    private String maintenancePriorite;
    private String equipementMaintenu;
    private String dateCommencement;
    private String dateCloture;
    private String dateCreation;
    private List<PhotosInterventionDTO> photos;
    private List<InterventionPieceDetacheeDTO> piecesDetachees;
    private String remarques;
    private String maintenanceType;


    public InterventionDTO(Intervention intervention) {
        this.id = intervention.getId();
        this.technicienId = intervention.getTechnicien() != null ? intervention.getTechnicien().getId() : null;
        this.typeIntervention = intervention.getType() != null ? intervention.getType().name() : null;
        this.description = intervention.getDescription();
        this.duree = intervention.getDuree();
        this.remarques = intervention.getRemarques();
        this.equipementMaintenu = (intervention.getMaintenanceCorrective() != null &&
                intervention.getMaintenanceCorrective().getEquipement() != null &&
                intervention.getMaintenanceCorrective().getEquipement().getNom() != null)
                ? intervention.getMaintenanceCorrective().getEquipement().getNom()
                : null;
                
                this.id = intervention.getId();
                this.technicienId = intervention.getTechnicien() != null ? intervention.getTechnicien().getId() : null;
                this.typeIntervention = intervention.getType() != null ? intervention.getType().name() : null;
                this.description = intervention.getDescription();
                this.duree = intervention.getDuree();
                this.remarques = intervention.getRemarques();
                this.equipementMaintenu = (intervention.getMaintenance() != null &&
                        intervention.getMaintenance().getEquipement() != null &&
                        intervention.getMaintenance().getEquipement().getNom() != null)
                        ? intervention.getMaintenance().getEquipement().getNom()
                        : null;

                
        // Map photos if available
        this.photos = intervention.getPhotos() != null
                ? intervention.getPhotos().stream()
                .map(photo -> new PhotosInterventionDTO(photo.getId(), photo.getUrl()))
                .collect(Collectors.toList())
                : null;

        // Extract maintenance-related details if available
        this.maintenanceId = intervention.getMaintenanceCorrective() != null
                ? intervention.getMaintenanceCorrective().getId()
                : null;

        // Maintenance status
        this.maintenanceStatut = intervention.getMaintenanceCorrective() != null
                ? intervention.getMaintenanceCorrective().getStatut().name()
                : null;

        // Maintenance priority (added the missing field)
        this.maintenancePriorite = intervention.getMaintenanceCorrective() != null
                ? intervention.getMaintenanceCorrective().getPriorite().name() // Assuming Priorite is an enum
                : null;

        // Handling dates (converted to String)
        this.dateCommencement = intervention.getMaintenanceCorrective() != null && intervention.getMaintenanceCorrective().getDateCommencement() != null
                ? intervention.getMaintenanceCorrective().getDateCommencement().toString() // Convert LocalDateTime to String
                : null;

        this.dateCloture = intervention.getMaintenanceCorrective() != null && intervention.getMaintenanceCorrective().getDateCloture() != null
                ? intervention.getMaintenanceCorrective().getDateCloture().toString() // Convert LocalDateTime to String
                : null;

        this.dateCreation = intervention.getMaintenanceCorrective() != null && intervention.getMaintenanceCorrective().getDateCreation() != null
                ? intervention.getMaintenanceCorrective().getDateCreation().toString() // Convert LocalDateTime to String
                : null;
                
                
                
                
                this.maintenanceId = intervention.getMaintenance() != null
                        ? intervention.getMaintenance().getId()
                        : null;

                // Maintenance status
                this.maintenanceStatut = intervention.getMaintenance() != null
                        ? intervention.getMaintenance().getStatut().name()
                        : null;

                // Maintenance priority (added the missing field)
                this.maintenancePriorite = intervention.getMaintenance() != null
                        ? intervention.getMaintenance().getPriorite().name() // Assuming Priorite is an enum
                        : null;

              
          

        this.piecesDetachees = intervention.getInterventionPieces() != null
                ? intervention.getInterventionPieces().stream()
                .map(ipd -> InterventionPieceDetacheeDTO.builder()
                        .pieceDetacheeId(ipd.getPieceDetachee().getId())
                        .pieceNom(ipd.getPieceDetachee().getNom()) // Adjust based on your fields
                        .pieceReference(ipd.getPieceDetachee().getReference()) // If you have this
                        .quantiteUtilisee(ipd.getQuantiteUtilisee())
                        .build())
                .collect(Collectors.toList())
                : null;


    }


	public Long getId() {
		return id;
	}


	public void setId(Long id) {
		this.id = id;
	}


	public Long getTechnicienId() {
		return technicienId;
	}


	public void setTechnicienId(Long technicienId) {
		this.technicienId = technicienId;
	}


	public String getTypeIntervention() {
		return typeIntervention;
	}


	public void setTypeIntervention(String typeIntervention) {
		this.typeIntervention = typeIntervention;
	}


	public String getDescription() {
		return description;
	}


	public void setDescription(String description) {
		this.description = description;
	}


	public Long getDuree() {
		return duree;
	}


	public void setDuree(Long duree) {
		this.duree = duree;
	}


	public Long getMaintenanceId() {
		return maintenanceId;
	}


	public void setMaintenanceId(Long maintenanceId) {
		this.maintenanceId = maintenanceId;
	}


	public String getMaintenanceStatut() {
		return maintenanceStatut;
	}


	public void setMaintenanceStatut(String maintenanceStatut) {
		this.maintenanceStatut = maintenanceStatut;
	}


	public String getMaintenancePriorite() {
		return maintenancePriorite;
	}


	public void setMaintenancePriorite(String maintenancePriorite) {
		this.maintenancePriorite = maintenancePriorite;
	}


	public String getEquipementMaintenu() {
		return equipementMaintenu;
	}


	public void setEquipementMaintenu(String equipementMaintenu) {
		this.equipementMaintenu = equipementMaintenu;
	}


	public String getDateCommencement() {
		return dateCommencement;
	}


	public void setDateCommencement(String dateCommencement) {
		this.dateCommencement = dateCommencement;
	}


	public String getDateCloture() {
		return dateCloture;
	}


	public void setDateCloture(String dateCloture) {
		this.dateCloture = dateCloture;
	}


	public String getDateCreation() {
		return dateCreation;
	}


	public void setDateCreation(String dateCreation) {
		this.dateCreation = dateCreation;
	}


	public List<PhotosInterventionDTO> getPhotos() {
		return photos;
	}


	public void setPhotos(List<PhotosInterventionDTO> photos) {
		this.photos = photos;
	}


	public List<InterventionPieceDetacheeDTO> getPiecesDetachees() {
		return piecesDetachees;
	}


	public void setPiecesDetachees(List<InterventionPieceDetacheeDTO> piecesDetachees) {
		this.piecesDetachees = piecesDetachees;
	}


	public String getRemarques() {
		return remarques;
	}


	public void setRemarques(String remarques) {
		this.remarques = remarques;
	}


	public String getMaintenanceType() {
		return maintenanceType;
	}


	public void setMaintenanceType(String maintenanceType) {
		this.maintenanceType = maintenanceType;
	}
    
    
}
