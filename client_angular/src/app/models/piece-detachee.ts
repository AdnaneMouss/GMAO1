import { Equipement } from "./equipement";
import { Intervention } from "./intervention";
import {AchatPiece} from "./achatPiece";

export interface PieceDetachee {
  id: number;
  nom: string;
  description: string;
  reference: string;
  fournisseurNom: string;
  fournisseurId: number;
  quantiteMinimale: number;
  historiqueUtilisation: string;
  image: string;
  quantiteStock?: number;
  achats?: AchatPiece[];
}
