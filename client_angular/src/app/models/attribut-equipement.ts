import {TypesEquipements} from "./types-equipements";

export interface AttributEquipements {
  id?: number;
  nom: string;
  obligatoire: boolean;
  actif: boolean;
  attributEquipementType: 'STRING' | 'NUMBER' | 'DATE' | 'BOOLEAN' | 'FLOAT' | 'ENUM' | 'LONGTEXT';
  typeEquipement: TypesEquipements; // Full object
}
