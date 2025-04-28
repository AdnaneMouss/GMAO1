package com.huir.GmaoApp.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.CascadeType;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorColumn;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapKeyColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.persistence.Transient;
import jakarta.validation.constraints.AssertTrue;

import com.huir.GmaoApp.dto.IndicateurDTO;
import com.huir.GmaoApp.model.*;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.DayOfWeek;
import java.time.Instant;
import java.time.LocalDate;
import java.time.Month;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor


public class Maintenance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateDebutPrevue;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateFinPrevue;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateProchainemaintenance;
    
    @Column(name = "type_maintenance")
    private String typeMaintenance = "PREVENTIVE";

    @AssertTrue(message = "La date de début doit être antérieure à la date de fin.")
    public boolean isDateDebutAvantDateFin() {
        if (dateDebutPrevue == null || dateFinPrevue == null) {
            return true; // Ne pas déclencher l'erreur si l'une des dates est null
        }
        return dateDebutPrevue.isBefore(dateFinPrevue);
    }

    private long dureeIntervention;

    @Enumerated(EnumType.STRING)
    private Priorite priorite;

    @Enumerated(EnumType.STRING)
    private Statut statut;

    private String commentaires;

    @Enumerated(EnumType.STRING)
    private repetitiontype repetitiontype;

    private long repetition;
    
    

    public String getTypeMaintenance() {
		return typeMaintenance;
	}

	public void setTypeMaintenance(String typeMaintenance) {
		this.typeMaintenance = typeMaintenance;
	}

	private int seuil;
	private  String nonSeuil;
	
	
	// ✅ Ajout de noms uniques pour éviter le conflit Jackson
    @JsonBackReference("user-creePar")
    @ManyToOne
    @JoinColumn(name = "created_by")
    private User creePar;

    @JsonBackReference("user-affecteA")
    @ManyToOne
    @JoinColumn(name = "technicien_id")
    private User affecteA;
	

    @ManyToOne(fetch = FetchType.EAGER)
    @JsonManagedReference // Gestion de la relation parent
    @JoinColumn(name = "responsable_maintenance_id")
    private User responsableMaintenance;

    @ManyToOne(fetch = FetchType.EAGER)
    @JsonManagedReference // Gestion de la relation parent
    @JoinColumn(name = "technicien_maintenance_id_id")
    private User user;

    @Enumerated(EnumType.STRING)
    private frequence frequence;

    @ManyToOne(fetch = FetchType.EAGER)
    @JsonManagedReference // Gestion de la relation parent
    @JoinColumn(name = "service_id")
    private Services service;

    @ManyToOne(fetch = FetchType.EAGER)
    @JsonManagedReference // Gestion de la relation parent
    @JoinColumn(name = "salle_id")
    private Salle salle;

    @ManyToOne(fetch = FetchType.EAGER)
    @JsonManagedReference // Gestion de la relation parent
    @JoinColumn(name = "etage_id")
    private Etage etage;

    @ManyToOne(fetch = FetchType.EAGER)
    @JsonManagedReference // Gestion de la relation parent
    @JoinColumn(name = "batiment_id")
    private Batiment batiment;

    @ManyToOne
    @JoinColumn(name = "equipement_id")
    @JsonBackReference // Référence bidirectionnelle évitée ici
    private Equipement equipement;

    @JsonIgnore
    private String documentPath;

    @Enumerated(EnumType.STRING)
    private ActionMaintenance action;

    private String autreAction;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "event_id")
    @JsonManagedReference // Gestion de la relation parent
    private Event event;



	    
	    
	     
	    
	    
	    @Temporal(TemporalType.DATE) // Stocker uniquement la date (sans l'heure)
	    private Date startDaterep; // Date de début

	    private Date endDaterep; // Date de fin
	    
	    private String selectedjours;	
	    private String selectedmois;
	    
	    @Column(name = "next_repetition_dates")
	    private String nextRepetitionDates;
	    
	    
	    @Transient
	    public List<LocalDate> getNextRepetitionDatesAsList() {
	        if (nextRepetitionDates == null || nextRepetitionDates.trim().isEmpty()) {
	            return new ArrayList<>();
	        }
	        return Arrays.stream(nextRepetitionDates.split(","))
	                     .map(LocalDate::parse)
	                     .collect(Collectors.toList());
	    }

	    public void setNextRepetitionDatesAsList(List<LocalDate> dates) {
	        if (dates == null || dates.isEmpty()) {
	            this.nextRepetitionDates = null;
	        } else {
	            this.nextRepetitionDates = dates.stream()
	                                          .map(LocalDate::toString)
	                                          .collect(Collectors.joining(","));
	        }
	    }
	    
	    private List<LocalDate> calculateRepetitionDates(
	    	    LocalDate start,
	    	    LocalDate end,
	    	    repetitiontype repetitiontype,
	    	    List<String> selectedjours,
	    	    List<String> selectedmois) {
	    	    
	    	    List<LocalDate> result = new ArrayList<>();
	    	    if (start == null || repetitiontype == null) {
	    	        return result;
	    	    }
	    	    
	    	    // Convertir et normaliser les listes de jours/mois
	    	    List<String> joursList = selectedjours != null ? 
	    	    	    selectedjours.stream()
	    	    	                 .map(String::trim)
	    	    	                 .map(String::toUpperCase)
	    	    	                 .collect(Collectors.toList()) : 
	    	    	    Collections.emptyList();

	    	    	List<String> moisList = selectedmois != null ? 
	    	    	    selectedmois.stream()
	    	    	                .map(String::trim)
	    	    	                .map(String::toUpperCase)
	    	    	                .collect(Collectors.toList()) : 
	    	    	    Collections.emptyList();


	    	    LocalDate current = start;
	    	    
	    	    switch (repetitiontype) {
	    	        case TOUS_LES_JOURS:
	    	            while (end == null || !current.isAfter(end)) {
	    	                result.add(current);
	    	                current = current.plusDays(1);
	    	            }
	    	            break;
	    	            
	    	        case TOUS_LES_SEMAINES:
	    	            while (end == null || !current.isAfter(end)) {
	    	                // Convertir le jour de la semaine en français pour la comparaison
	    	                String jourSemaine = convertDayToFrench(current.getDayOfWeek());
	    	                if (joursList.contains(jourSemaine)) {
	    	                    result.add(current);
	    	                }
	    	                current = current.plusDays(1);
	    	            }
	    	            break;
	    	            
	    	        case MENSUEL:
	    	            while (end == null || !current.isAfter(end)) {
	    	                // Convertir le mois en français pour la comparaison
	    	                String mois = convertMonthToFrench(current.getMonth());
	    	                if (moisList.contains(mois)) {
	    	                    result.add(current);
	    	                }
	    	                current = current.plusMonths(1);
	    	            }
	    	            break;
	    	            
	    	        case ANNUEL:
	    	            while (end == null || !current.isAfter(end)) {
	    	                result.add(current);
	    	                current = current.plusYears(1);
	    	            }
	    	            break;
	    	            
	    	        case Ne_pas_repeter:
	    	        default:
	    	            result.add(start);
	    	            break;
	    	    }
	    	    
	    	    return result;
	    	}
	    
	    public void setSelectedjours(List<String> jours) {
	        this.selectedjours = jours != null ? 
	            String.join(",", jours.stream()
	                                 .map(String::trim)
	                                 .map(String::toUpperCase)
	                                 .collect(Collectors.toList())) : 
	            null;
	    }

	    public List<String> getSelectedjours() {
	        if (this.selectedjours == null || this.selectedjours.isEmpty()) {
	            return new ArrayList<>();
	        }
	        return Arrays.stream(this.selectedjours.split(","))
	                    .map(String::trim)
	                    .map(String::toUpperCase)
	                    .collect(Collectors.toList());
	    }

	    // Faites de même pour selectedmois
	    public void setSelectedmois(List<String> mois) {
	        this.selectedmois = mois != null ? 
	            String.join(",", mois.stream()
	                               .map(String::trim)
	                               .map(String::toUpperCase)
	                               .collect(Collectors.toList())) : 
	            null;
	    }

	    public List<String> getSelectedmois() {
	        if (this.selectedmois == null || this.selectedmois.isEmpty()) {
	            return new ArrayList<>();
	        }
	        return Arrays.stream(this.selectedmois.split(","))
	                    .map(String::trim)
	                    .map(String::toUpperCase)
	                    .collect(Collectors.toList());
	    }
	    @PrePersist
	    @PreUpdate
	    private void calculateNextRepetitionDates() {
	        if (this.repetitiontype != null && this.startDaterep != null) {
	            List<LocalDate> dates = calculateRepetitionDates(
	                startDaterep.toInstant().atZone(ZoneId.systemDefault()).toLocalDate(),
	                endDaterep != null ? endDaterep.toInstant().atZone(ZoneId.systemDefault()).toLocalDate() : null,
	                repetitiontype,
	                getSelectedjours(),
	                getSelectedmois()
	            );
	            this.setNextRepetitionDatesAsList(dates);
	        }
	    }
	    
	    private String convertDayToFrench(DayOfWeek day) {
	        switch (day) {
	            case MONDAY:    return "LUNDI";
	            case TUESDAY:   return "MARDI";
	            case WEDNESDAY: return "MERCREDI";
	            case THURSDAY: return "JEUDI";
	            case FRIDAY:    return "VENDREDI";
	            case SATURDAY:  return "SAMEDI";
	            case SUNDAY:    return "DIMANCHE";
	            default:        return "";
	        }
	    }

	    private String convertMonthToFrench(Month month) {
	        switch (month) {
	            case JANUARY:   return "JANVIER";
	            case FEBRUARY:  return "FÉVRIER";
	            case MARCH:    return "MARS";
	            case APRIL:    return "AVRIL";
	            case MAY:      return "MAI";
	            case JUNE:     return "JUIN";
	            case JULY:     return "JUILLET";
	            case AUGUST:   return "AOÛT";
	            case SEPTEMBER: return "SEPTEMBRE";
	            case OCTOBER:  return "OCTOBRE";
	            case NOVEMBER: return "NOVEMBRE";
	            case DECEMBER: return "DÉCEMBRE";
	            default:       return "";
	        }
	    }

	    
	
	   
	    
	 
	  

	    
	    public void setEquipementId(Long equipementId) {
	        this.equipement = new Equipement();
	        this.equipement.setId(equipementId);  // Lier uniquement l'ID
	    }

	    public Long getEquipementId() {
	        return equipement != null ? equipement.getId() : null;
	    }
	    
	    public void setValeurSuivi(double valeurSuivi) {
	        this.equipement = new Equipement();
	        this.equipement.setValeurSuivi(valeurSuivi);  // Lier uniquement l'ID
	    }

	    public Double getValeurSuivi() {
	        return equipement != null ? equipement.getValeurSuivi() : null;
	    }
	    
	    
	    public void setLabelsuivi(String labelsuivi) {
	        this.equipement = new Equipement();
	        this.equipement.setLabelSuivi(labelsuivi);  // Lier uniquement l'ID
	    }

	    public String getLabelSuivi() {
	        return equipement != null ? equipement.getLabelSuivi() : null;
	    }

	 

	    
	       
	   
	    
	  
		
		public void setEquipement(Equipement equipement) {
			this.equipement = equipement;
		}
		
	   
	    
	    
	    

	
		
	
		
		


		
	
	
	
	
		
		

		          
		       
		
		
	       
	             


	public String getNonSeuil() {
			return nonSeuil;
		}

		public void setNonSeuil(String nonSeuil) {
			this.nonSeuil = nonSeuil;
		}

	public Date getStartDaterep() {
			return startDaterep;
		}
		public void setStartDaterep(Date startDaterep) {
			this.startDaterep = startDaterep;
		}
		public Date getEndDaterep() {
			return endDaterep;
		}
		public void setEndDaterep(Date endDaterep) {
			this.endDaterep = endDaterep;
		}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getDocumentPath() {
		return documentPath;
	}
	public void setDocumentPath(String documentPath) {
		this.documentPath = documentPath;
	}	
	public LocalDate getDateDebutPrevue() {
		return dateDebutPrevue;
	}
	public void setDateDebutPrevue(LocalDate dateDebutPrevue) {
		this.dateDebutPrevue = dateDebutPrevue;
	}
	public LocalDate getDateFinPrevue() {
		return dateFinPrevue;
	}
	public void setDateFinPrevue(LocalDate dateFinPrevue) {
		this.dateFinPrevue = dateFinPrevue;
	}
	public LocalDate getDateProchainemaintenance() {
		return dateProchainemaintenance;
	}
	public void setDateProchainemaintenance(LocalDate dateProchainemaintenance) {
		this.dateProchainemaintenance = dateProchainemaintenance;
	}
	public Priorite getPriorite() {
		return priorite;
	}
	public void setPriorite(Priorite priorite) {
		this.priorite = priorite;
	}
	public Statut getStatut() {
		return statut;
	}
	public void setStatut(Statut statut) {
		this.statut = statut;
	}
	public String getCommentaires() {
		return commentaires;
	}
	public void setCommentaires(String commentaires) {
		this.commentaires = commentaires;
	}
	
	
	
	    
	
	
	
	
	
	
	public void setDureeIntervention(long dureeIntervention) {
		this.dureeIntervention = dureeIntervention;
	}
	
	 
	 
	
	 

	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	public long getDureeIntervention() {
        if (dateDebutPrevue != null && dateFinPrevue != null) {
            return ChronoUnit.DAYS.between(dateDebutPrevue, dateFinPrevue); // Calcul de la durée en jours
        }
        return 0;
    }
	
	

	
	public ActionMaintenance getAction() {
	        return action;
	    }

	    public void setAction(ActionMaintenance action) {
	        this.action = action;
	    }
		public String getAutreAction() {
			return autreAction;
		}
		public void setAutreAction(String autreAction) {
			this.autreAction = autreAction;
		}
		
		public User getUser() {
			return user;
		}
		public void setUser(User user) {
			this.user = user;
		}
		public Event getEvent() {
			return event;
		}
		public void setEvent(Event event) {
			this.event = event;
		}
		public repetitiontype getRepetitiontype() {
			return repetitiontype;
		}
		public void setRepetitiontype(repetitiontype repetitiontype) {
			this.repetitiontype = repetitiontype;
		}
		public void setRepetition(long repetition) {
			this.repetition = repetition;
		}

		

		public int getSeuil() {
			return seuil;
		}

		public void setSeuil(int seuil) {
			this.seuil = seuil;
		}

		public User getResponsableMaintenance() {
			return responsableMaintenance;
		}

		public void setResponsableMaintenance(User responsableMaintenance) {
			this.responsableMaintenance = responsableMaintenance;
		}

		public frequence getFrequence() {
			return frequence;
		}

		public void setFrequence(frequence frequence) {
			this.frequence = frequence;
		}

		public Services getService() {
			return service;
		}

		public void setService(Services service) {
			this.service = service;
		}

		public Salle getSalle() {
			return salle;
		}

		public void setSalle(Salle salle) {
			this.salle = salle;
		}

		public Etage getEtage() {
			return etage;
		}

		public void setEtage(Etage etage) {
			this.etage = etage;
		}

		public Batiment getBatiment() {
			return batiment;
		}

		public void setBatiment(Batiment batiment) {
			this.batiment = batiment;
		}

		public Equipement getEquipement() {
			return equipement;
		}

		public void setSelectedjours(String selectedjours) {
			this.selectedjours = selectedjours;
		}

		public void setSelectedmois(String selectedmois) {
			this.selectedmois = selectedmois;
		}
		
		
		
		
	

	    
	    
	   
	   
	    
	    
}
	   
	  
	    
	   
	
	
	

	   
	    
	   
	  
	  