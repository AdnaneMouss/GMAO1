package com.huir.GmaoApp.dto;

import java.util.List;
import java.util.stream.Collectors;

import com.huir.GmaoApp.model. InterventionPreventive;


public class InterventionPreventiveDTO {

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



    public InterventionPreventiveDTO(InterventionPreventive InterventionPreventive) {
        this.id = InterventionPreventive.getId();
        this.technicienId = InterventionPreventive.getTechnicien() != null ? InterventionPreventive.getTechnicien().getId() : null;
        this.typeIntervention = InterventionPreventive.getType() != null ? InterventionPreventive.getType().name() : null;
        this.description =  InterventionPreventive.getDescription();
        this.duree =  InterventionPreventive.getDuree();
        this.remarques =  InterventionPreventive.getRemarques();
        this.equipementMaintenu = ( InterventionPreventive.getMaintenance() != null &&
                 InterventionPreventive.getMaintenance().getEquipement() != null &&
                 InterventionPreventive.getMaintenance().getEquipement().getNom() != null)
                ?  InterventionPreventive.getMaintenance().getEquipement().getNom()
                : null;

       


        // Extract maintenance-related details if available
        this.maintenanceId =  InterventionPreventive.getMaintenance() != null
                ?  InterventionPreventive.getMaintenance().getId()
                : null;

        // Maintenance status
        this.maintenanceStatut =  InterventionPreventive.getMaintenance() != null
                ?  InterventionPreventive.getMaintenance().getStatut().name()
                : null;

        // Maintenance priority (added the missing field)
        this.maintenancePriorite =  InterventionPreventive.getMaintenance() != null
                ?  InterventionPreventive.getMaintenance().getPriorite().name() // Assuming Priorite is an enum
                : null;

                
                
        // Handling dates (converted to String)
        this.dateCommencement =  InterventionPreventive.getMaintenance() != null &&  InterventionPreventive.getMaintenance().getDateDebutPrevue() != null
                ?  InterventionPreventive.getMaintenance().getDateDebutPrevue().toString() // Convert LocalDateTime to String STR
                : null;

        this.dateCloture =  InterventionPreventive.getMaintenance() != null &&  InterventionPreventive.getMaintenance().getDateFinPrevue() != null
                ?  InterventionPreventive.getMaintenance().getDateFinPrevue().toString() // Convert LocalDateTime to String
                : null;

      
               // this.piecesDetachees = InterventionPreventive.getInterventionPieces() != null
                //	    ? InterventionPreventive.getInterventionPieces().stream()
                	//        .map(ipd -> {
                	  //          return new InterventionPieceDetacheeDTO(
                	    //            ipd.getPieceDetachee().getId(),
                	      //          ipd.getPieceDetachee().getNom(),
                	        //        ipd.getPieceDetachee().getReference(),
                	          //      ipd.getQuantiteUtilisee()
                	           // );
                	        //})
                	        //.collect(Collectors.toList())
                	    //: null;
    }
}


            


