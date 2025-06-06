package com.huir.GmaoApp.model;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

@Entity
public class Fournisseur {
	
	
	 @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;

	    private String nom;
	    private Type type;
	    private String codepostal;
	    private String adresse;
	    private String email;
	    private String telephone;
	   
	    @Column
	    private String image;
	    @Column(updatable = false)
	    @CreationTimestamp
	    private LocalDate dateajout;
	    @JsonIgnore
	    @OneToMany(mappedBy = "fournisseur", fetch = FetchType.EAGER)
	    private List<Contrat> contrats ;
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
		
		public String getImage() {
			return image;
		}

		public LocalDate getDateajout() {
			return dateajout;
		}
		public void setDateajout(LocalDate dateajout) {
			this.dateajout = dateajout;
		}
		public void setImage(String image) {
			this.image = image;
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
		public List<Contrat> getContrats() {
			return contrats;
		}
		public void setContrats(List<Contrat> contrats) {
			this.contrats = contrats;
		}
		public Type getType() {
			return type;
		}
		public void setType(Type type) {
			this.type = type;
		}

		

}
