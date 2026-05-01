package com.huir.GmaoApp.model;

public enum Type {
    PIECES_DETACHEES,       // Fournit des pièces de rechange
    EQUIPEMENTS_MEDICAUX,   // Fournit des équipements (IRM, moniteurs, etc.)
    EQUIPEMENTS_HOSPITALIERS, // Fournit des lits, fauteuils, mobiliers médicaux
    CONSOMMABLES,           // Gants, seringues, désinfectants, etc.
    SERVICES_TECHNIQUES,    // Maintenance, calibration, installation
    MULTI_CATEGORIE         // Fournisseur polyvalent
}