package com.huir.GmaoApp.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Period;
import java.time.temporal.ChronoUnit;

import com.huir.GmaoApp.model.Contrat;

public class ContratDTO {
    private Long id;
    private String numeroContrat;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private String type;
    private BigDecimal montant;
    private String dureeFormatee;
    private Long dureeEnJours;
    private String fichierPdf;
    
    public ContratDTO() {
    
    }
    public ContratDTO(Contrat c) {
        this.id = c.getId();
        this.numeroContrat = c.getNumeroContrat();
        this.dateDebut = c.getDateDebut();
        this.dateFin = c.getDateFin();
        this.type = c.getType();
        this.montant = c.getMontant();
       
        this.fichierPdf = c.getFichierPdf();
        this.dureeFormatee = calculerDureeFormatee(c.getDateDebut(), c.getDateFin());
        this.dureeEnJours = calculerDureeEnJours(c.getDateDebut(), c.getDateFin());
    }
    

    private String calculerDureeFormatee(LocalDate debut, LocalDate fin) {
        if (debut != null && fin != null && !fin.isBefore(debut)) {
            Period period = Period.between(debut, fin);
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

    private Long calculerDureeEnJours(LocalDate debut, LocalDate fin) {
        if (debut != null && fin != null) {
            return ChronoUnit.DAYS.between(debut, fin);
        }
        return null;
    }

  

   


	public Long getId() {
		return id;
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


	public String getDureeFormatee() {
		return dureeFormatee;
	}


	public void setDureeFormatee(String dureeFormatee) {
		this.dureeFormatee = dureeFormatee;
	}


	public Long getDureeEnJours() {
		return dureeEnJours;
	}


	public void setDureeEnJours(Long dureeEnJours) {
		this.dureeEnJours = dureeEnJours;
	}
	public String getFichierPdf() {
		return fichierPdf;
	}
	public void setFichierPdf(String fichierPdf) {
		this.fichierPdf = fichierPdf;
	}

	
 
}
