package com.huir.GmaoApp.model;


import jakarta.persistence.*;

@Entity
@Table(name = "attributs")
public class Attribut {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nom;
    private String valeur;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "equipement_id")
    private Equipement equipement;  // Link to the Equipement

    public Attribut(String nom, String valeur, Equipement equipement) {
    }

    public Attribut() {

    }

    // Getters and setters
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

    public String getValeur() {
        return valeur;
    }

    public void setValeur(String valeur) {
        this.valeur = valeur;
    }

    public Equipement getEquipement() {
        return equipement;
    }

    public void setEquipement(Equipement equipement) {
        this.equipement = equipement;
    }
}
