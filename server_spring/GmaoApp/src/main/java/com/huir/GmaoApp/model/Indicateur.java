package com.huir.GmaoApp.model;

import jakarta.persistence.Embeddable;

@Embeddable
public class Indicateur {
    private String nom;
    private String valeur;

    
    public Indicateur() {}

    public Indicateur(String nom, String valeur) {
        this.nom = nom;
        this.valeur = valeur;
    }

    // Getters et setters
    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }
  
    public String getValeur() {
        return valeur;
    }

    public void setValeur(String valeur) {
        this.valeur = valeur;
    }
}
