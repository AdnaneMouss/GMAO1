package com.huir.GmaoApp.model;

import java.util.Arrays;

public enum ActionMaintenance {
    VERIFICATION_PERFORMANCES("Vérification performances"),
    NETTOYAGE_EQUIPEMENTS("Nettoyage équipements"),
    CALIBRATION_EQUIPEMENTS("Calibration équipements"),
    TEST_SECURITE("Test sécurité"),
    MISE_A_JOUR("Mise à jour"),
    REMPLACEMENT_PIECES("Remplacement pièces"),
    INSPECTION_VISUELLE("Inspection visuelle"),
    CONTROLE_CONNECTIVITE("Contrôle connectivité"),
    VERIFICATION_SAUVEARDES("Vérification sauvegardes"), // Correction ici
    FORMATION_ENTRETIEN("Formation entretien"),
    AUTRE("Autre");

    private final String label;

    ActionMaintenance(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }

    @Override
    public String toString() {
        return label;
    }

   
}
