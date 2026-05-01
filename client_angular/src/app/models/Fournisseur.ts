import { contrat } from "./contrat";

export interface Fournisseur {
  id: number;
  nom: string;
  adresse: string;
  email: string;
  telephone: string;
  codepostal:number;
  image:string;
 contrats: contrat[];
 type :
   'PIECES_DETACHEES' |         // Fournisseur de pièces de rechange
 'EQUIPEMENTS_MEDICAUX' |
'EQUIPEMENTS_HOSPITALIERS' | // Fournisseur de mobilier hospitalier (lits, fauteuils, etc.)
  'CONSOMMABLES' |           // Fournisseur de consommables (gants, seringues, etc.)
 'SERVICES_TECHNIQUES' |   // Prestataire technique (maintenance, calibration)
  'MULTI_CATEGORIE'
  actif: boolean;
  dateajout: string;

}
