import { PhotosIntervention } from "./photos-intervention";
import {InterventionPieceDetachee} from "./intervention-pieces";

export interface Intervention {
  id: number;
  technicienId: number;
  typeIntervention: 'PREVENTIVE' | 'CORRECTIVE';
  description: string;
  duree: number;
  maintenanceId: number;
  maintenanceStatut: 'EN_ATTENTE' | 'EN_COURS' | 'TERMINEE' | 'ANNULEE';
  maintenancePriorite: 'NORMALE' | 'URGENTE' | 'FAIBLE';
  dateCommencement: string | undefined;
  dateCloture: string | undefined;
  dateCreation: string | undefined;
  equipementMaintenu: string;
  remarques: string;
  photos: PhotosIntervention[];
  piecesDetachees: InterventionPieceDetachee[];  // Integrating InterventionPieceDetachee here
}
