import {Intervention} from "./intervention";

export interface MaintenanceCorrective {
  id: number;
  titre: string;
  description: string;
  statut: 'EN_ATTENTE' | 'EN_COURS' | 'TERMINEE' | 'ANNULEE';
  priorite: 'FAIBLE' | 'NORMALE' | 'URGENTE';
  dateCreation: string; // ISO 8601 format date string
  dateCloture?: string; // ISO 8601 format date string, optional
  dateCommencement?: string; // ISO 8601 format date string, optional
  affecteAId: number; // ID of the user assigned to the ticket
  affecteANom: string; // ID of the user assigned to the ticket
  creeParNom: string; // ID of the user assigned to the ticket
  creeParId: number; // ID of the user assigned to the ticket
  equipementNom: string;
  equipementBatiment: string;
  equipementSalle: number;
  equipementEtage: number;
  interventions: Intervention[]; // A list of interventions associated with this maintenance
}
