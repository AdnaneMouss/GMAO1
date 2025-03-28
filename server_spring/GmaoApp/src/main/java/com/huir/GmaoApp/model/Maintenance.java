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
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.validation.constraints.AssertTrue;

import com.huir.GmaoApp.dto.IndicateurDTO;
import com.huir.GmaoApp.model.User;

import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@DiscriminatorColumn(name = "type_maintenance")
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
	  
	 @Column(name = "indicateurs")
	  private String indicateurs; 
	 
	 
	 /////HADI////
	 private long repetition;
	
	 
	 
	 
	  
	// Relation avec le responsable de maintenance
	  @ManyToOne(fetch = FetchType.EAGER)
	    @JsonBackReference
	    @JoinColumn(name = "responsable_maintenance_id")
	    private User responsableMaintenance;
	  
	  @ManyToOne(fetch = FetchType.EAGER)
	    @JsonBackReference
	    @JoinColumn(name = "technicien_maintenance_id_id")
	    private User user;
	  
	  

	  @Enumerated(EnumType.STRING)
	    private frequence frequence;
	 
	  
	  
	// Relation avec le service auquel appartient l’équipement
	    @ManyToOne(fetch = FetchType.EAGER)
	    @JsonBackReference
	    private Services service;
	    
	 // Relationship with Salle (Each equipment is in a room)
	    @ManyToOne(fetch = FetchType.EAGER)
	    @JoinColumn(name = "salle_id")
	    private Salle salle;

	    // Relationship with Etage (Each room is in a floor)
	    @ManyToOne(fetch = FetchType.EAGER)
	    @JoinColumn(name = "etage_id")
	    private Etage etage;
	    

	    public frequence getFrequence() {
			return frequence;
		}
		public void setFrequence(frequence frequence) {
			this.frequence = frequence;
		}
		// Relationship with Batiment (Each floor is in a building)
	    @ManyToOne(fetch = FetchType.EAGER)
	    @JoinColumn(name = "batiment_id")
	    private Batiment batiment;
	    
	    @ManyToOne(fetch = FetchType.EAGER)
	    @JoinColumn(name = "equipement_id")
	    @JsonBackReference
	    @JsonIgnore
	    private Equipement equipement;
	    @JsonIgnore
	    public String documentPath;
	    
	    @Enumerated(EnumType.STRING)
	    private ActionMaintenance action;
	  
	    private String autreAction;
	    
	    @ManyToOne(fetch = FetchType.EAGER)
	    @JoinColumn(name = "event_id")
	    @JsonBackReference
	    private Event event;
	    
	    
	    
	     
	    
	    
	    @Temporal(TemporalType.DATE) // Stocker uniquement la date (sans l'heure)
	    private Date startDaterep; // Date de début

	    @Temporal(TemporalType.DATE) // Stocker uniquement la date (sans l'heure)
	    private Date endDaterep; // Date de fin
	    
	    private String selectedjours;	
	    private String selectedmois;
	    
	    
	    private List<Date> nextRepetitionDates;
	    
	    
	    ///////////////
	   
	    
	    public List<Date> getNextRepetitionDates() {
	        return nextRepetitionDates;
	    }

	    public void setNextRepetitionDates(List<Date> nextRepetitionDates) {
	        this.nextRepetitionDates = nextRepetitionDates;
	    }
	  

	   
	 

	    
	    
	   
	    
	  
		public List<String> getSelectedjours() {
	        if (this.selectedjours != null && !this.selectedjours.isEmpty()) {
	            return Arrays.asList(this.selectedjours.split(",")); // Convertir en liste
	        }
	        return new ArrayList<>();
	    }
	    // Setter qui transforme la liste en chaîne
	    public void setSelectedjours(List<String> selectedjours) {
	        this.selectedjours = String.join(",", selectedjours); // Convertir en string
	    }
	    
	    
	    public List<String> getSelectedmois() {
	        if (this.selectedmois != null && !this.selectedmois.isEmpty()) {
	            return Arrays.asList(this.selectedmois.split(",")); // Convertir en liste
	        }
	        return new ArrayList<>();
	    }
	    // Setter qui transforme la liste en chaîne
	    public void setSelectedmois(List<String> selectedmois) {
	        this.selectedmois = String.join(",", selectedmois); // Convertir en string
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
	
	
	////////////////////////
	
	// public Date getDateRepetition() {
	  //      if (startDaterep == null || repetitiontype == null) {
	    //        return null; // Aucune répétition si la date de début ou le type de répétition est manquant
	      //  }
	        
	       // Calendar calendar = Calendar.getInstance();
	       // calendar.setTime(startDaterep);
	        
	        //switch (repetitiontype) {
	          //  case TOUS_LES_JOURS:
	            //    calendar.add(Calendar.DAY_OF_MONTH, 1);
	              //  break;
	            //case TOUS_LES_SEMAINES:
	              //  calendar.add(Calendar.WEEK_OF_YEAR, 1);
	               // break;
	            //case MENSUEL:
	              //  calendar.add(Calendar.MONTH, 1);
	               // break;
	            //case ANNUEL:
	              //  calendar.add(Calendar.YEAR, 1);
	               // break;
	            //case Ne_pas_repeter:
	            //default:
	              //  return null; // Pas de répétition
	        //}
	        
	     //   Date daterepetition = calendar.getTime();
	        
	        // Vérifier si la date de répétition dépasse la date de fin
	       // if (endDaterep != null && daterepetition.after(endDaterep)) {
	         //   return null; // La répétition ne doit pas dépasser la date de fin
	        //}
	        
	       // return daterepetition;
	    //}
	    
	
	
	
	
	
	
	public void setDureeIntervention(long dureeIntervention) {
		this.dureeIntervention = dureeIntervention;
	}
	//public void setDaterepetition(Date daterepetition) {
		//this.daterepetition = daterepetition;
	//}
	
	public void calculateRepetitionDates() {
	    if (startDaterep == null || endDaterep == null || repetitiontype == null) {
	        this.nextRepetitionDates = null; // Si les données sont manquantes
	        return;
	    }

	    List<Date> repetitionDates = new ArrayList<>();
	    Calendar calendar = Calendar.getInstance();
	    calendar.setTime(startDaterep);

	    // Ajouter la première date de répétition
	    repetitionDates.add(calendar.getTime());

	    // Calculer les dates de répétition
	    while (calendar.getTime().before(endDaterep)) {
	        switch (repetitiontype) {
	            case TOUS_LES_JOURS:
	                calendar.add(Calendar.DAY_OF_MONTH, 1);
	                break;
	            case TOUS_LES_SEMAINES:
	                if (selectedjours != null && !selectedjours.isEmpty()) {
	                    // Gestion des jours sélectionnés
	                    String[] joursSelectionnes = selectedjours.split(",");
	                    Calendar tempCalendar = (Calendar) calendar.clone();
	                    
	                    for (String jour : joursSelectionnes) {
	                        int dayOfWeek = convertDayToCalendarConstant(jour.trim());
	                        tempCalendar.set(Calendar.DAY_OF_WEEK, dayOfWeek);
	                        
	                        // Si le jour calculé est après le jour actuel et avant endDate
	                        if (tempCalendar.getTime().after(calendar.getTime()) && 
	                            !tempCalendar.getTime().after(endDaterep)) {
	                            repetitionDates.add(tempCalendar.getTime());
	                        }
	                    }
	                    
	                    // Passer à la semaine suivante
	                    calendar.add(Calendar.WEEK_OF_YEAR, 1);
	                    calendar.set(Calendar.DAY_OF_WEEK, Calendar.MONDAY); // Commencer par le lundi
	                } else {
	                    // Comportement par défaut (toutes les semaines le même jour)
	                    calendar.add(Calendar.WEEK_OF_YEAR, 1);
	                }
	                break;
	            case MENSUEL:
	                calendar.add(Calendar.MONTH, 1);
	                break;
	            case ANNUEL:
	                calendar.add(Calendar.YEAR, 1);
	                break;
	            case Ne_pas_repeter:
	            default:
	                this.nextRepetitionDates = repetitionDates;
	                return;
	        }

	        if (repetitiontype != repetitiontype.TOUS_LES_SEMAINES && 
	            !calendar.getTime().after(endDaterep)) {
	            repetitionDates.add(calendar.getTime());
	        }
	    }

	    this.nextRepetitionDates = repetitionDates;
	}

	// Méthode utilitaire pour convertir le jour en constante Calendar
	private int convertDayToCalendarConstant(String day) {
	    switch (day.toUpperCase()) {
	        case "LUNDI": return Calendar.MONDAY;
	        case "MARDI": return Calendar.TUESDAY;
	        case "MERCREDI": return Calendar.WEDNESDAY;
	        case "JEUDI": return Calendar.THURSDAY;
	        case "VENDREDI": return Calendar.FRIDAY;
	        case "SAMEDI": return Calendar.SATURDAY;
	        case "DIMANCHE": return Calendar.SUNDAY;
	        default: return Calendar.MONDAY; // Valeur par défaut
	    }
	}
	 
	 ///////////HHHADDII///////////////
	 
	public Date getRepetition() {
	    if (startDaterep == null || endDaterep == null || repetitiontype == null) {
	        return null; // Si les données sont manquantes
	    }

	    // Si la répétition est désactivée, retourner null
	    if (repetitiontype == repetitiontype.Ne_pas_repeter) {
	        return null;
	    }

	    // Créer une instance de Calendar pour manipuler les dates
	    Calendar calendar = Calendar.getInstance();
	    calendar.setTime(startDaterep);

	    // Calculer la prochaine date en fonction du type de répétition
	    switch (repetitiontype) {
	        case TOUS_LES_JOURS:
	            calendar.add(Calendar.DAY_OF_MONTH, 1); // Ajouter 1 jour
	            break;
	        case TOUS_LES_SEMAINES:
	            if (selectedjours != null && !selectedjours.isEmpty()) {
	                // Trouver le prochain jour sélectionné dans la semaine
	                Date nextDate = findNextSelectedDay(calendar);
	                if (nextDate != null) {
	                    return nextDate;
	                }
	                // Si aucun jour valide trouvé dans cette semaine, passer à la semaine suivante
	                calendar.add(Calendar.WEEK_OF_YEAR, 1);
	                calendar.set(Calendar.DAY_OF_WEEK, Calendar.MONDAY);
	                nextDate = findNextSelectedDay(calendar);
	                return (nextDate != null && !nextDate.after(endDaterep)) ? nextDate : null;
	            } else {
	                // Comportement par défaut (toutes les semaines le même jour)
	                calendar.add(Calendar.WEEK_OF_YEAR, 1);
	            }
	            break;
	        case MENSUEL:
	            calendar.add(Calendar.MONTH, 1); // Ajouter 1 mois
	            break;
	        case ANNUEL:
	            calendar.add(Calendar.YEAR, 1); // Ajouter 1 an
	            break;
	        default:
	            return null; // Cas par défaut (Ne_pas_repeter déjà géré)
	    }

	    // Vérifier que la date calculée ne dépasse pas endDaterep
	    Date nextDate = calendar.getTime();
	    if (nextDate.after(endDaterep)) {
	        return null; // Si la date dépasse endDaterep, retourner null
	    }

	    return nextDate; // Retourner la prochaine date de maintenance
	}

	// Méthode helper pour trouver le prochain jour sélectionné
	private Date findNextSelectedDay(Calendar calendar) {
	    String[] joursSelectionnes = selectedjours.split(",");
	    Calendar tempCalendar = (Calendar) calendar.clone();
	    Date currentDate = calendar.getTime();
	    
	    for (String jour : joursSelectionnes) {
	        int dayOfWeek = convertDayToCalendarConstant(jour.trim());
	        tempCalendar.set(Calendar.DAY_OF_WEEK, dayOfWeek);
	        
	        // Si le jour calculé est après la date actuelle
	        if (tempCalendar.getTime().after(currentDate) && 
	            !tempCalendar.getTime().after(endDaterep)) {
	            return tempCalendar.getTime();
	        }
	    }
	    return null;
	}

	// Méthode utilitaire pour convertir le jour en constante Calendar (identique à la précédente)
		
	 //////////////////////////
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	public long getDureeIntervention() {
        if (dateDebutPrevue != null && dateFinPrevue != null) {
            return ChronoUnit.DAYS.between(dateDebutPrevue, dateFinPrevue); // Calcul de la durée en jours
        }
        return 0;
    }
	
	

	public void setIndicateurs(List<IndicateurDTO> indicateurs) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            this.indicateurs = objectMapper.writeValueAsString(indicateurs);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
           
        }
    }
	
	 public List<IndicateurDTO> getIndicateurs() {
	        ObjectMapper objectMapper = new ObjectMapper();
	        try {
	            return objectMapper.readValue(this.indicateurs, new TypeReference<List<IndicateurDTO>>() {});
	        } catch (JsonProcessingException e) {
	            e.printStackTrace();
	            return null;
	        }
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
		
		
	

	    
	    
	   
	   
	    
	    
}
	   
	  
	    
	   
	
	
	

	   
	    
	   
	  
	  