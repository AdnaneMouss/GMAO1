package com.huir.GmaoApp.model;
public enum frequence {
    JOURNALIER,
    HEBDOMADAIRE,
    MENSUEL,
    TRIMESTRIEL,
    SEMESTRIEL,
    ANNUEL;
    
    public static frequence fromString(String value) {
        if (value == null || value.isEmpty()) {
            return null;  // ou retour de la valeur par défaut si tu veux
        }
        return frequence.valueOf(value.toUpperCase());
    }
}

