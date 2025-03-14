package com.huir.GmaoApp.dto;
public class IndicateurDTO {
    private String nom;
    private String valeur;

    // Constructeurs
    public IndicateurDTO(String nom, String valeur) {
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
