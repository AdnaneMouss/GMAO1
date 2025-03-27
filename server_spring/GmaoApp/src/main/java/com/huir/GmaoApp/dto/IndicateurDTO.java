package com.huir.GmaoApp.dto;

import java.io.IOException;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.ObjectMapper;

import aj.org.objectweb.asm.TypeReference;


    
   
public class IndicateurDTO {
    private String nom;
    private String valeur;

    

    // Constructeur avec arguments, utilisé si vous souhaitez utiliser @JsonCreator
    @JsonCreator
    public IndicateurDTO(@JsonProperty("nom") String nom, @JsonProperty("valeur") String valeur) {
        this.nom = nom;
        this.valeur = valeur;
    }
 // Constructeur sans argument
    public IndicateurDTO() {
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
