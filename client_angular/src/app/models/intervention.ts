import { PhotosIntervention } from "./photos-intervention";
import { MaintenanceCorrective } from "./maintenance-corrective";
import {PieceDetachee} from "./piece-detachee";

export interface Intervention {
  id: number;
  technicienId: number;
  typeIntervention: 'PREVENTIVE' | 'CORRECTIVE';
  description: string;
  duree: number;
  maintenanceId: number;
  maintenanceStatut: 'EN_ATTENTE' | 'EN_COURS' | 'TERMINEE' | 'ANNULEE';
  maintenancePriorite: 'NORMALE' | 'URGENTE' | 'FAIBLE';  // New field for priority
  dateCommencement: string | undefined;  // New field for commencement date (string format)
  dateCloture: string | undefined;       // New field for closure date (string format)
  dateCreation: string | undefined;      // New field for creation date (string format)
  equipementMaintenu: string;
  remarques: string;
  photos: PhotosIntervention[];  // List of photos linked to the intervention
  piecesDetachees?: number[];

}
