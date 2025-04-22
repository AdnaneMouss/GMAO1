package com.huir.GmaoApp.model;

import java.time.LocalDate;

public class Report {
	
	
	private String type; // Type du rapport, par exemple 'weekly' ou 'monthly'
    private LocalDate startDate; // Date de début du rapport
    private LocalDate endDate; // Date de fin du rapport
    private byte[] fileContent; // Contenu du fichier (PDF/Excel)
    
    
    
 // Constructeur
    public Report(String type, LocalDate startDate, LocalDate endDate, byte[] fileContent) {
        this.type = type;
        this.startDate = startDate;
        this.endDate = endDate;
        this.fileContent = fileContent;
    }



	public String getType() {
		return type;
	}



	public void setType(String type) {
		this.type = type;
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



	public byte[] getFileContent() {
		return fileContent;
	}



	public void setFileContent(byte[] fileContent) {
		this.fileContent = fileContent;
	}
    
    

}
