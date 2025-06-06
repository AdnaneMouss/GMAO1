import { Fournisseur } from "./Fournisseur";

 
 
 export interface contrat {
 id: number;
  numeroContrat: string;
  dateDebut: Date;
  dateFin: Date;
 
  type: string;
  montant: number;
  fournisseur: Fournisseur;
  fournisseurId:number;
  fichierPdf?: string;
 }