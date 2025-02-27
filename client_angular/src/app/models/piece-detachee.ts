import { Equipement } from "./equipement";
import { Intervention } from "./intervention";

export interface PieceDetachee {
  id: number;
  nom: string;
  description: string;
  reference: string;
  fournisseur: string;
  coutUnitaire: number;
  quantiteStock: number;
  quantiteMinimale: number;
  dateAchat: string;  // Format YYYY-MM-DD
  datePeremption: string;
  historiqueUtilisation: string;
  image: string;
}
