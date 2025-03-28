package com.huir.GmaoApp.dto;

import lombok.Data;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.huir.GmaoApp.model.ActionMaintenance;
import com.huir.GmaoApp.model.DaysOfWeek;
import com.huir.GmaoApp.model.Maintenance;
import com.huir.GmaoApp.model.Months;
import com.huir.GmaoApp.model.Priorite;
import com.huir.GmaoApp.model.Statut;
import com.huir.GmaoApp.model.User;
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
private frequence frequence;
@JsonDeserialize(as = ArrayList.class)
private List<IndicateurDTO> indicateurs;
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

////HADI////
private long repetition;

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
				this.repetition = calculerRepetition(this.startDaterep, this.endDaterep, this.repetitiontype);
				this.action = maintenance.getAction();  // Assurez-vous que l'objet Maintenance a ce champ.
		        this.autreAction = maintenance.getAutreAction();  
		        this.user=maintenance.getUser();
		         this.repetitiontype=maintenance.getRepetitiontype();
		         this.startDaterep=maintenance.getEndDaterep();
		         this.endDaterep=maintenance.getEndDaterep();
		         this.selectedjours=maintenance.getSelectedjours(); 
		         this.selectedmois=maintenance.getSelectedmois();
		         this.daterepetition = calculerDateRepetition(this.startDaterep,this.endDaterep,this.repetitiontype);
		       
		         
		        
		       
		       
				
					}  
		public MaintenanceDTO() {}
		
		////////////HADI///////////////
		
		public Long getId() {
			return id;
		}
		public long getRepetition() {
			
			        if (startDaterep == null || endDaterep == null || repetitiontype == null) {
			            return 0; // Si les données sont manquantes, retourner 0
			        }

			        // Si la répétition est désactivée, retourner 1 (seulement la date de début)
			        if (repetitiontype == repetitiontype.Ne_pas_repeter) {
			            return 1;
			        }

			        // Créer une instance de Calendar pour manipuler les dates
			        Calendar calendar = Calendar.getInstance();
			        calendar.setTime(startDaterep);

			        long count = 1; // Commencer à 1 pour inclure la date de début

			        // Calculer les dates de répétition en fonction du type de répétition
			        while (true) {
			            switch (repetitiontype) {
			                case TOUS_LES_JOURS:
			                    calendar.add(Calendar.DAY_OF_MONTH, 1); // Ajouter 1 jour
			                    break;
			                case TOUS_LES_SEMAINES:
			                    calendar.add(Calendar.WEEK_OF_YEAR, 1); // Ajouter 1 semaine
			                    break;
			                case MENSUEL:
			                    calendar.add(Calendar.MONTH, 1); // Ajouter 1 mois
			                    break;
			                case ANNUEL:
			                    calendar.add(Calendar.YEAR, 1); // Ajouter 1 an
			                    break;
			                default:
			                    return count; // Cas par défaut (Ne_pas_repeter déjà géré)
			            }

			            // Vérifier que la date calculée ne dépasse pas endDaterep
			            Date nextDate = calendar.getTime();
			            if (nextDate.after(endDaterep)) {
			                break; // Si la date dépasse endDaterep, arrêter la boucle
			            }

			            count++; // Incrémenter le compteur
			        }

			        return count; // Retourner le nombre de dates de maintenance
			    
		}
		public void setRepetition(long repetition) {
			this.repetition = repetition;
			
			
			
			
		}
		public void setId(Long id) {
			this.id = id;
		}
		/////HADI/////////
		private long calculerRepetition(Date startDaterep, Date endDaterep, repetitiontype repetitiontype) {
		    if (startDaterep == null || endDaterep == null || repetitiontype == null) {
		        return 0; // Si les données sont manquantes, retourner 0
		    }

		    // Si la répétition est désactivée, retourner 1 (seulement la date de début)
		    if (repetitiontype == repetitiontype.Ne_pas_repeter) {
		        return 1;
		    }

		    Calendar calendar = Calendar.getInstance();
		    calendar.setTime(startDaterep);
		    long count = 1; // Commencer à 1 pour inclure la date de début

		    if (repetitiontype == repetitiontype.TOUS_LES_SEMAINES && selectedjours != null && !selectedjours.isEmpty()) {
		        // Cas spécial pour les semaines avec jours sélectionnés
		        return calculerRepetitionHebdomadaire(calendar, endDaterep);
		    }

		    // Calcul standard pour les autres types de répétition
		    while (true) {
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
		            default:
		                return count;
		        }

		        Date nextDate = calendar.getTime();
		        if (nextDate.after(endDaterep)) {
		            break;
		        }
		        count++;
		    }

		    return count;
		}

		private long calculerRepetitionHebdomadaire(Calendar startCalendar, Date endDaterep) {
		    long count = 1; // Compter la date de départ
		    Calendar calendar = (Calendar) startCalendar.clone();

		    // D'abord compter les jours restants dans la semaine de départ
		    count += compterJoursSelectionnesDansSemaine(calendar, endDaterep);

		    // Ensuite compter les semaines complètes
		    calendar.add(Calendar.WEEK_OF_YEAR, 1);
		    calendar.set(Calendar.DAY_OF_WEEK, Calendar.MONDAY); // Début de semaine

		    while (true) {
		        boolean semaineComplete = true;
		        Calendar semaineCalendar = (Calendar) calendar.clone();
		        
		        // Vérifier si toute la semaine est avant endDate
		        semaineCalendar.add(Calendar.DAY_OF_WEEK, 6); // Aller au dimanche
		        if (semaineCalendar.getTime().after(endDaterep)) {
		            break;
		        }

		        // Compter les jours de cette semaine
		        long joursDansSemaine = compterJoursSelectionnesDansSemaine(calendar, endDaterep);
		        if (joursDansSemaine == selectedjours.size()) {
		            count += joursDansSemaine;
		        } else {
		            // Semaine partielle (dernière semaine)
		            count += joursDansSemaine;
		            break;
		        }

		        calendar.add(Calendar.WEEK_OF_YEAR, 1);
		    }

		    return count;
		}

		private long compterJoursSelectionnesDansSemaine(Calendar calendar, Date endDaterep) {
		    if (selectedjours == null || selectedjours.isEmpty()) {
		        return 0;
		    }

		    long count = 0;
		    Date currentDate = calendar.getTime();
		    Calendar tempCalendar = (Calendar) calendar.clone();

		    for (String jour : selectedjours) {
		        int dayOfWeek = convertDayToCalendarConstant(jour.trim());
		        tempCalendar.set(Calendar.DAY_OF_WEEK, dayOfWeek);
		        
		        Date jourDate = tempCalendar.getTime();
		        if (jourDate.after(currentDate) && !jourDate.after(endDaterep)) {
		            count++;
		        }
		    }

		    return count;
		
		}
		
		
		public List<String> getSelectedjours() {
			return selectedjours;
		}
		public void setSelectedjours(List<String> selectedjours) {
			this.selectedjours = selectedjours;
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
		
		public frequence getFrequence() {
			return frequence;
		}
		public void setFrequence(frequence frequence) {
			this.frequence = frequence;
		}
		public long getDureeIntervention() {
		    if (dateDebutPrevue != null && dateFinPrevue != null) {
		        // Calculer la différence en jours entre la date de début et la date de fin
		        return ChronoUnit.DAYS.between(dateDebutPrevue, dateFinPrevue);
		    }
		    return 0; // Si l'une des dates est nulle, retourner 0
		}

	
		
		 private long calculerDureeIntervention(LocalDate debut, LocalDate fin) {
			    if (debut != null && fin != null) {
			        return ChronoUnit.DAYS.between(debut, fin);
			    }
			    return 0; // Si l'une des dates est nulle, on retourne 0
			}
		 public List<IndicateurDTO> getIndicateurs() {
		        return indicateurs;
		    }

		    public void setIndicateurs(List<IndicateurDTO> indicateurs) {
		        this.indicateurs = indicateurs;
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
		public void setSelectedmois(List<String> selectedmois) {
			this.selectedmois = selectedmois;
		}
		
		
		///////////////////////////////////
		
		public Date calculerDateRepetition(Date startDaterep, Date endDaterep, repetitiontype repetitiontype) {
		    if (startDaterep == null || repetitiontype == null) {
		        return null;
		    }

		    Calendar calendar = Calendar.getInstance();
		    calendar.setTime(startDaterep);

		    switch (repetitiontype) {
		        case TOUS_LES_JOURS:
		            calendar.add(Calendar.DAY_OF_MONTH, 1);
		            break;
		        case TOUS_LES_SEMAINES:
		            if (selectedjours != null && !selectedjours.isEmpty()) {
		                // Utilisation directe de la List<String>
		                Date nextDate = findNextSelectedDay(calendar);
		                if (nextDate != null) {
		                    return (endDaterep == null || !nextDate.after(endDaterep)) ? nextDate : null;
		                }
		                calendar.add(Calendar.WEEK_OF_YEAR, 1);
		                calendar.set(Calendar.DAY_OF_WEEK, Calendar.MONDAY);
		                nextDate = findNextSelectedDay(calendar);
		                return (nextDate != null && (endDaterep == null || !nextDate.after(endDaterep))) ? nextDate : null;
		            } else {
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
		            return null;
		    }

		    Date daterepetition = calendar.getTime();
		    if (endDaterep != null && daterepetition.after(endDaterep)) {
		        return null;
		    }
		    return daterepetition;
		}

		private Date findNextSelectedDay(Calendar calendar) {
		    if (selectedjours == null || selectedjours.isEmpty()) {
		        return null;
		    }
		    
		    Calendar tempCalendar = (Calendar) calendar.clone();
		    Date currentDate = calendar.getTime();
		    
		    // Parcourir directement la List<String>
		    for (String jour : selectedjours) {
		        int dayOfWeek = convertDayToCalendarConstant(jour.trim());
		        tempCalendar.set(Calendar.DAY_OF_WEEK, dayOfWeek);
		        
		        if (tempCalendar.getTime().after(currentDate)) {
		            return tempCalendar.getTime();
		        }
		    }
		    return null;
		}

		private int convertDayToCalendarConstant(String day) {
		    switch (day.toUpperCase()) {
		        case "LUNDI": return Calendar.MONDAY;
		        case "MARDI": return Calendar.TUESDAY;
		        case "MERCREDI": return Calendar.WEDNESDAY;
		        case "JEUDI": return Calendar.THURSDAY;
		        case "VENDREDI": return Calendar.FRIDAY;
		        case "SAMEDI": return Calendar.SATURDAY;
		        case "DIMANCHE": return Calendar.SUNDAY;
		        default: return Calendar.MONDAY;
		    }
		}
		
		
		          

		  

		// Getters et Setters inchangés
		public Date getDaterepetition() {
		    return daterepetition;
		}

		public void setDaterepetition(Date daterepetition) {
		    this.daterepetition = daterepetition;
		}
		    }
		
		
		
		
		
		
		 
		
		      
		      

		 
		
		
		      
		     
		

		
		
	
		



		  

		    
		  
		   
		
		
						    
						    
						    