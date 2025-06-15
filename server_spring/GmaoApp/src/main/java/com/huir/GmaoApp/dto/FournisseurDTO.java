package com.huir.GmaoApp.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.hibernate.annotations.CreationTimestamp;

import com.huir.GmaoApp.model.Contrat;
import com.huir.GmaoApp.model.Fournisseur;
import com.huir.GmaoApp.model.Type;

import jakarta.persistence.Column;


public class FournisseurDTO {
    private Long id;
    private String nom;
    private String codepostal;
    private String adresse;
    private String email;
    private String telephone;
	private boolean actif = true;
    private List<ContratDTO> contrats;
    private String image;
    private Type type;
    @Column(updatable = false)
    @CreationTimestamp
    private LocalDateTime dateajout;
    
    
    public FournisseurDTO() {
       
        
    }

    public FournisseurDTO(Fournisseur f) {
        this.id = f.getId();
        this.nom = f.getNom();
        this.codepostal = f.getCodepostal();
        this.adresse = f.getAdresse();
        this.email = f.getEmail();
        this.image = f.getImage();
        this.type=f.getType();
		this.actif=f.isActif();
        this.telephone = f.getTelephone();
        this.contrats = f.getContrats() != null
                ? f.getContrats().stream()
                      .map(ContratDTO::new)
                      .collect(Collectors.toList())
                : null;
        this.dateajout=f.getDateajout();
    }

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getNom() {
		return nom;
	}

	public void setNom(String nom) {
		this.nom = nom;
	}

	public String getCodepostal() {
		return codepostal;
	}

	public void setCodepostal(String codepostal) {
		this.codepostal = codepostal;
	}

	public String getAdresse() {
		return adresse;
	}

	public void setAdresse(String adresse) {
		this.adresse = adresse;
	}


	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getTelephone() {
		return telephone;
	}

	public void setTelephone(String telephone) {
		this.telephone = telephone;
	}

	public List<ContratDTO> getContrats() {
		return contrats;
	}

	public void setContrats(List<ContratDTO> contrats) {
		this.contrats = contrats;
	}

	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}

	public Type getType() {
		return type;
	}

	public void setType(Type type) {
		this.type = type;
	}
	
	
  
}
