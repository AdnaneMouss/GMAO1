import {User} from "./user";
import {LigneInventaire} from "./ligneInventaire";

export interface Inventaire {
  id?: number;
  dateInventaire?: string; // ISO string for LocalDateTime
  responsableNom?: string;
  responsableId?: number;
  statut?: 'CORRIGE' | 'NON_CORRIGE'
  lignes?: LigneInventaire[];
}
