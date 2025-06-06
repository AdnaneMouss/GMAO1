package com.huir.GmaoApp.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Period;
import java.time.temporal.ChronoUnit;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Transient;

@Entity
public class Contrat {
	 @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;

	    private String numeroContrat;
	  
	    private LocalDate dateDebut;
	
	    private LocalDate dateFin;
	    private String type;
	    private BigDecimal montant;

	    @ManyToOne
	    @JoinColumn(name = "fournisseur_id")
	    private Fournisseur fournisseur;
	    @Column(name = "fichier_pdf")
	    private String fichierPdf;

	    @Transient
	    private Long fournisseurId;
	    
	    
	    @Transient
	    private String dureeFormatee;
	    
	    public String getDureeFormatee() {
	        if (dateDebut != null && dateFin != null && !dateFin.isBefore(dateDebut)) {
	            Period period = Period.between(dateDebut, dateFin);
	            StringBuilder sb = new StringBuilder();
	            if (period.getYears() > 0) {
	                sb.append(period.getYears()).append(" an").append(period.getYears() > 1 ? "s" : "");
	            }
	            if (period.getMonths() > 0) {
	                if (sb.length() > 0) sb.append(", ");
	                sb.append(period.getMonths()).append(" mois");
	            }
	            if (period.getDays() > 0) {
	                if (sb.length() > 0) sb.append(", ");
	                sb.append(period.getDays()).append(" jour").append(period.getDays() > 1 ? "s" : "");
	            }
	            return sb.toString();
	        }
	        return null;
	    }
	    // Exemple : pour aussi garder le nombre total de jours (facultatif)
	    @Transient
	    public Long getDureeEnJours() {
	        if (dateDebut != null && dateFin != null) {
	            return java.time.temporal.ChronoUnit.DAYS.between(dateDebut, dateFin);
	        }
	        return null;
	    }


		public Long getId() {
			return id;
		}

		
		  public String getFichierPdf() {
		        return fichierPdf;
		    }

		    public void setFichierPdf(String fichierPdf) {
		        this.fichierPdf = fichierPdf;
		    }
		public void setId(Long id) {
			this.id = id;
		}

		public String getNumeroContrat() {
			return numeroContrat;
		}

		public void setNumeroContrat(String numeroContrat) {
			this.numeroContrat = numeroContrat;
		}

		public LocalDate getDateDebut() {
			return dateDebut;
		}

		public void setDateDebut(LocalDate dateDebut) {
			this.dateDebut = dateDebut;
		}

		public LocalDate getDateFin() {
			return dateFin;
		}
		

	
		public void setDateFin(LocalDate dateFin) {
			this.dateFin = dateFin;
		}

		public String getType() {
			return type;
		}

		public void setType(String type) {
			this.type = type;
		}

		public BigDecimal getMontant() {
			return montant;
		}

		public void setMontant(BigDecimal montant) {
			this.montant = montant;
		}

		public Fournisseur getFournisseur() {
			return fournisseur;
		}

		public void setFournisseur(Fournisseur fournisseur) {
			this.fournisseur = fournisseur;
		}
		public Long getFournisseurId() {
			return fournisseurId;
		}
		public void setFournisseurId(Long fournisseurId) {
			this.fournisseurId = fournisseurId;
		}
		
		
	    
	    
	    
}
