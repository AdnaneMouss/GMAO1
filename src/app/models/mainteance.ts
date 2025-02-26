export interface maintenance{
  id?: number;
  equipement: string;
  departement: string;
  personneResponsable: string;
  frequence: string;
  dateIntervention: Date;
  dureeEstimee: number;
  uniteDuree: string;
  piecesRechange: string;
  quantitePieces: number;
  localisation: string;
  statut: string;
  imageEquipement:string
}