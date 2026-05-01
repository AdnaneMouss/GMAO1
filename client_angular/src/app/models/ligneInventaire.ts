
import {Inventaire} from "./inventaire";
import {PieceDetachee} from "./piece-detachee"; // Assuming you have a PieceDetachee model

export interface LigneInventaire {
  id?: number;
  inventaire?: Inventaire; // Or just the ID if you’re being lightweight
  nomPiece?: string;
  stockTheorique: number;
  stockPhysique: number;
  ecart: number;
  commentaire: string;
}
