package com.huir.GmaoApp.dto;

import lombok.Data;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Collection;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.huir.GmaoApp.model.*;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.MapKeyColumn;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.persistence.Transient;



@Data
public class MaintenanceDTO {
		
private Long id;
private LocalDate dateProchainemaintenance; 
private LocalDate dateDebutPrevue;
private LocalDate dateFinPrevue;
private long dureeIntervention; 
private Priorite priorite;
private Statut statut;
private repetitiontype repetitiontype;
private String commentaires;
private String documentPath;
@Enumerated(EnumType.STRING) // Ajout de l'enum ActionMaintenance
private ActionMaintenance action;
private String autreAction;
private User user;
private LocalDate startDate;
private LocalDate endDate;
private String repetitionType; // Type de répétition en français
private Map<String, Boolean> selectedDayss; // Jours sélectionnés
private Map<String, Boolean> selectedMonth; // Mois sélectionné (pour "MENSUEL")
private Date startDaterep;
private Date endDaterep;
private List<String> selectedjours;
private List<String> selectedmois;
private Date  daterepetition;

private Long equipementId; 
private String equipementNom; 
private String labelsuivie;
private Double valeursuivie;
private String nextRepetitionDatesString;

@Column(name = "statuts_repetition_json", columnDefinition = "TEXT") 
private String statutsRepetitionJson;

private long repetition;
private String frequence;
private int seuil; // et non pas "double"
private  String nonSeuil;
private Long attributId; // id de attributs_equipements sélectionné


@JsonProperty("next_repetition_dates")
private List<LocalDate> nextRepetitionDates;

private String maintenanceType; 

private List<RepetitionInstanceDTO> repetitions;





// Listes prédéfinies
private List<String> availableDays = DaysOfWeek.DAYS; // Jours de la semaine
private List<String> availableMonths = Months.MONTHS; // Mois de l'année
public MaintenanceDTO(Maintenance maintenance ) {
				this.id = maintenance.getId();
				this.dateProchainemaintenance = maintenance.getDateProchainemaintenance();
				this.dateDebutPrevue = maintenance .getDateDebutPrevue();
				this.dateFinPrevue = maintenance.getDateFinPrevue();
				this.priorite = maintenance.getPriorite();
				this.statut = maintenance.getStatut();
				this.commentaires = maintenance.getCommentaires();
				this.documentPath=  maintenance.getDocumentPath();
				this.frequence=maintenance.getFrequence();
				this.dureeIntervention = calculerDureeIntervention(this.dateDebutPrevue, this.dateFinPrevue);
			
				this.action = maintenance.getAction();  // Assurez-vous que l'objet Maintenance a ce champ.
		        this.autreAction = maintenance.getAutreAction();  
		        this.user=maintenance.getUser();
		         this.repetitiontype=maintenance.getRepetitiontype();
		         this.startDaterep = maintenance.getStartDaterep();
		         this.equipementId=maintenance.getEquipementId();
		         this.valeursuivie=maintenance.getValeurSuivi();
		         this.labelsuivie=maintenance.getLabelSuivi();
		         this.nextRepetitionDates = calculateRepetitionDates(startDaterep, endDaterep, repetitiontype, selectedjours, selectedmois);
                 this.equipementNom=maintenance.getEquipementNom();
		       

		         this.selectedjours = maintenance.getSelectedjours();
		         this.selectedmois = maintenance.getSelectedmois();
		         

		         this.endDaterep=maintenance.getEndDaterep();
		         
		         this.daterepetition = calculerDateRepetition(this.startDaterep,this.endDaterep,this.repetitiontype);
		         this.seuil=maintenance.getSeuil();
		         this.nonSeuil=maintenance.getNonSeuil();
		         this.nextRepetitionDates = maintenance.getNextRepetitionDates();

		      
		        
		         
		        
		       
		       
				
					}  
		public MaintenanceDTO() {}
		
	
		
		
		

		
		 
		
		
		
		
		public List<RepetitionInstanceDTO> getRepetitions() {
			return repetitions;
		}
		public void setRepetitions(List<RepetitionInstanceDTO> repetitions) {
			this.repetitions = repetitions;
		}
		public String getMaintenanceType() {
			return maintenanceType;
		}
		public void setMaintenanceType(String maintenanceType) {
			this.maintenanceType = maintenanceType;
		}
		public Long getAttributId() {
			return attributId;
		}
		public void setAttributId(Long attributId) {
			this.attributId = attributId;
		}
		public String getStatutsRepetitionJson() {
			return statutsRepetitionJson;
		}
		public void setStatutsRepetitionJson(String statutsRepetitionJson) {
			this.statutsRepetitionJson = statutsRepetitionJson;
		}
		public String getEquipementNom() {
			return equipementNom;
		}
		public void setEquipementNom(String equipementNom) {
			this.equipementNom = equipementNom;
		}
		public List<LocalDate> getNextRepetitionDates() {
			return nextRepetitionDates;
		}
		public void setNextRepetitionDates( List<LocalDate> nextRepetitionDates) {
			this.nextRepetitionDates = nextRepetitionDates;
		}
		// Getter et setter
	    public Long getEquipementId() {
	        return equipementId;
	    }

	    public void setEquipementId(Long equipementId) {
	        this.equipementId = equipementId;
	    }

		
		public Long getId() {
			return id;
		}
		
	
		public String getNonSeuil() {
			return nonSeuil;
		}
		public void setNonSeuil(String nonSeuil) {
			this.nonSeuil = nonSeuil;
		}
		public int getSeuil() {
			return seuil;
		}
		public void setSeuil(int seuil) {
			this.seuil = seuil;
		}
		
		
		
		public void setId(Long id) {
			this.id = id;
		}
		
		
		
		
		
		
		
		
		
		
	
		
		public List<String> getSelectedjours() {
			return selectedjours;
		}
		public String getFrequence() {
			return frequence;
		}
		public void setFrequence(String frequence) {
			this.frequence = frequence;
		}
		public String getDocumentPath() {
			return documentPath;
		}
		public void setDocumentPath(String documentPath) {
			this.documentPath = documentPath;
		}
		
		public LocalDate getDateProchainemaintenance() {
			return dateProchainemaintenance;
		}
		public void setDateProchainemaintenance(LocalDate dateProchainemaintenance) {
			this.dateProchainemaintenance = dateProchainemaintenance;
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
		public void setDureeIntervention(long dureeIntervention) {
			this.dureeIntervention = dureeIntervention;
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
		
		
		@Transient
		public String getNextRepetitionDatesAsString() {
		    if (nextRepetitionDates == null || nextRepetitionDates.isEmpty()) {
		        return "";
		    }
		    return nextRepetitionDates.stream()
		        .map(LocalDate::toString)  // Convertir chaque date en chaîne
		        .collect(Collectors.joining(","));  // Joindre les dates avec une virgule
		}



		
		
		public long getDureeIntervention() {
		    if (dateDebutPrevue != null && dateFinPrevue != null) {
		        // Calculer la différence en jours entre la date de début et la date de fin
		        return ChronoUnit.DAYS.between(dateDebutPrevue, dateFinPrevue);
		    }
		    return 0; // Si l'une des dates est nulle, retourner 0
		}
		  private static final Map<String, Integer> MOIS_MAP = Map.ofEntries(
			        Map.entry("janvier", 0),
			        Map.entry("fevrier", 1),
			        Map.entry("mars", 2),
			        Map.entry("avril", 3),
			        Map.entry("mai", 4),
			        Map.entry("juin", 5),
			        Map.entry("juillet", 6),
			        Map.entry("aout", 7),
			        Map.entry("septembre", 8),
			        Map.entry("octobre", 9),
			        Map.entry("novembre", 10),
			        Map.entry("decembre", 11)
			    );

			    private static final Map<String, Integer> DAY_MAP = Map.ofEntries(
			        Map.entry("dimanche", 0),
			        Map.entry("lundi", 1),
			        Map.entry("mardi", 2),
			        Map.entry("mercredi", 3),
			        Map.entry("jeudi", 4),
			        Map.entry("vendredi", 5),
			        Map.entry("samedi", 6)
			    );
			    public List<LocalDate> calculateRepetitionDates(
			    	    Date startDaterep,
			    	    Date endDaterep,
			    	    repetitiontype repetitiontype,
			    	    List<String> selectedjours,
			    	    List<String> selectedmois
			    	) {
			    	    if (startDaterep == null || endDaterep == null || repetitiontype == null) {
			    	        System.out.println("Données manquantes pour calculer les dates de répétition.");
			    	        return Collections.emptyList();
			    	    }

			    	    List<LocalDate> repetitionDates = new ArrayList<>();
			    	    Calendar currentDate = Calendar.getInstance();
			    	    currentDate.setTime(startDaterep);
			    	    Calendar endDate = Calendar.getInstance();
			    	    endDate.setTime(endDaterep);

			    	    // Convertir les mois sélectionnés en numéros
			    	    List<Integer> selectedMoisNumbers = selectedmois != null ? 
			    	        selectedmois.stream()
			    	            .map(String::toLowerCase)
			    	            .map(MOIS_MAP::get)
			    	            .filter(Objects::nonNull)
			    	            .collect(Collectors.toList()) : 
			    	        Collections.emptyList();

			    	    System.out.println("Mois sélectionnés convertis: " + selectedMoisNumbers);

			    	    // Convertir les jours sélectionnés en numéros
			    	    List<Integer> selectedDaysNumbers = selectedjours != null ? 
			    	        selectedjours.stream()
			    	            .map(String::toUpperCase)
			    	            .map(DAY_MAP::get)
			    	            .filter(Objects::nonNull)
			    	            .collect(Collectors.toList()) : 
			    	        Collections.emptyList();

			    	    System.out.println("Jours sélectionnés convertis: " + selectedDaysNumbers);

			    	    if (repetitiontype == repetitiontype.TOUS_LES_SEMAINES && !selectedDaysNumbers.isEmpty()) {
			    	        // Cas des répétitions hebdomadaires avec jours spécifiques
			    	        while (!currentDate.after(endDate)) {
			    	            int currentDay = currentDate.get(Calendar.DAY_OF_WEEK) - 1;

			    	            if (selectedDaysNumbers.contains(currentDay)) {
			    	             //   repetitionDates.add((Collection<? extends String>) currentDate.getTime());
			    	            }

			    	            currentDate.add(Calendar.DATE, 1);
			    	        }
			    	    } else if (repetitiontype == repetitiontype.MENSUEL && !selectedMoisNumbers.isEmpty()) {
			    	        // Cas des répétitions mensuelles avec jours spécifiques
			    	        while (!currentDate.after(endDate)) {
			    	            int currentMonth = currentDate.get(Calendar.MONTH);

			    	            if (selectedMoisNumbers.contains(currentMonth)) {
			    	                int currentDay = currentDate.get(Calendar.DAY_OF_WEEK) - 1;

			    	                if (selectedDaysNumbers.isEmpty() || selectedDaysNumbers.contains(currentDay)) {
			    	             //       repetitionDates.add((Collection<? extends String>) currentDate.getTime());
			    	                }
			    	            }

			    	            currentDate.add(Calendar.MONTH, 1);
			    	        }
			    	    } else {
			    	        // Pour les autres types de répétitions
			    	        while (!currentDate.after(endDate)) {
			    	           // repetitionDates.addAll((Collection<? extends String>) currentDate.getTime());

			    	            switch (repetitiontype) {
			    	                case TOUS_LES_JOURS:
			    	                    currentDate.add(Calendar.DATE, 1);
			    	                    break;
			    	                case TOUS_LES_SEMAINES:
			    	                    currentDate.add(Calendar.DATE, 7);
			    	                    break;
			    	                case MENSUEL:
			    	                    currentDate.add(Calendar.MONTH, 1);
			    	                    break;
			    	                case ANNUEL:
			    	                    currentDate.add(Calendar.YEAR, 1);
			    	                    break;
			    	               
			    	            }
			    	        }
			    	    }
						return repetitionDates;

			    	    
			    	}
		
		
		
		
		 private long calculerDureeIntervention(LocalDate debut, LocalDate fin) {
			    if (debut != null && fin != null) {
			        return ChronoUnit.DAYS.between(debut, fin);
			    }
			    return 0; // Si l'une des dates est nulle, on retourne 0
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
		public LocalDate getStartDate() {
			return startDate;
		}
		public void setStartDate(LocalDate startDate) {
			this.startDate = startDate;
		}
		public LocalDate getEndDate() {
			return endDate;
		}
		public void setEndDate(LocalDate endDate) {
			this.endDate = endDate;
		}
		public String getRepetitionType() {
			return repetitionType;
		}
		public void setRepetitionType(String repetitionType) {
			this.repetitionType = repetitionType;
		}
		
		
		public String getNextRepetitionDatesString() {
			return nextRepetitionDatesString;
		}
		public void setNextRepetitionDatesString(String nextRepetitionDatesString) {
			this.nextRepetitionDatesString = nextRepetitionDatesString;
		}
		public Map<String, Boolean> getSelectedDayss() {
			return selectedDayss;
		}
		public void setSelectedDayss(Map<String, Boolean> selectedDayss) {
			this.selectedDayss = selectedDayss;
		}
		
		public Map<String, Boolean> getSelectedMonth() {
			return selectedMonth;
		}
		public void setSelectedMonth(Map<String, Boolean> selectedMonth) {
			this.selectedMonth = selectedMonth;
		}
		public repetitiontype getRepetitiontype() {
			return repetitiontype;
		}
		public void setRepetitiontype(repetitiontype repetitiontype) {
			this.repetitiontype = repetitiontype;
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
		public List<String> getSelectedmois() {
			return selectedmois;
		}
		
		
		// Dans MaintenanceDTO
		public void setSelectedjours(List<String> selectedjours) {
		    this.selectedjours = selectedjours != null ?
		        selectedjours.stream()
		                    .map(String::trim)
		                    .map(String::toUpperCase)
		                    .collect(Collectors.toList()) :
		        new ArrayList<>();
		}

		public void setSelectedmois(List<String> selectedmois) {
		    this.selectedmois = selectedmois != null ?
		        selectedmois.stream()
		                   .map(String::trim)
		                   .map(String::toUpperCase)
		                   .collect(Collectors.toList()) :
		        new ArrayList<>();
		}
		
		
		
		
		
		
		///////////////////////////////////
		
		
		
		public String getLabelsuivie() {
			return labelsuivie;
		}
		public void setLabelsuivie(String labelsuivie) {
			this.labelsuivie = labelsuivie;
		}
		public Double getValeursuivie() {
			return valeursuivie;
		}
		public void setValeursuivie(Double valeursuivie) {
			this.valeursuivie = valeursuivie;
		}
		public Date calculerDateRepetition(Date startDaterep, Date endDaterep, repetitiontype repetitiontype) {
		        if (startDaterep == null || repetitiontype == null) {
		            return null; // Pas de calcul si la date de début ou le type de répétition est manquant
		        }

		        Calendar calendar = Calendar.getInstance();
		        calendar.setTime(startDaterep);

		        switch (repetitiontype) {
		            case TOUS_LES_JOURS:
		                calendar.add(Calendar.DAY_OF_MONTH, 1);
		                break;
		            case TOUS_LES_SEMAINES:
		                calendar.add(Calendar.WEEK_OF_YEAR, 1);
		                break;
		            case MENSUEL:
		                calendar.add(Calendar.MONTH, 1);
		                break;
		            case ANNUEL:
		                calendar.add(Calendar.YEAR, 1);
		                break;
		            case Ne_pas_repeter:
		            default:
		                return null; // Pas de répétition
		        }

		        Date daterepetition = calendar.getTime();

		        // Vérifier si la date de répétition dépasse la date de fin
		        if (endDaterep != null && daterepetition.after(endDaterep)) {
		            return null; // La répétition ne doit pas dépasser la date de fin
		        }

		        return daterepetition;
		    }

		   
		   
			public Date getDaterepetition() {
		        return daterepetition;
		    }

		    public void setDaterepetition(Date daterepetition) {
		        this.daterepetition = daterepetition;
		    }
		    
		    public List<LocalDate> parseNextRepetitionDates(String raw) {
		        if (raw == null || raw.isBlank()) return Collections.emptyList();
		        return Arrays.stream(raw.split(","))
		                     .map(String::trim)
		                     .map(LocalDate::parse)
		                     .collect(Collectors.toList());
		    }
		    public String stringifyDates(List<LocalDate> dates) {
		        return dates.stream()
		                    .map(LocalDate::toString)
		                    .collect(Collectors.joining(","));
		    }
		    
		    


			
		    
		    
		    
		
		    }
		
		
		
		
		
		
		 
		
		      
		      

		 
		
		
		      
		     
		

		
		
	
		



		  

		    
		  
		   
		
		
						    
						    
						    