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
    private List<PieceDetacheeDTO> piecesDetachees;
    private String remarques;



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

        // Map PieceDetachee if available
        this.piecesDetachees = intervention.getPiecesDetachees() != null
                ? intervention.getPiecesDetachees().stream()
                .map(pieceDetachee -> new PieceDetacheeDTO(pieceDetachee))
                .collect(Collectors.toList())
                : null;
    }
}
