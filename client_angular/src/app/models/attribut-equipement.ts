import {TypesEquipements} from "./types-equipements";

export interface AttributEquipements {
  id?: number;
  nom: string;
  obligatoire: Boolean;
  actif: Boolean;
  attributEquipementType: 'STRING' | 'NUMBER' | 'DATE' | 'BOOLEAN' | 'FLOAT' | 'ENUM' | 'LONGTEXT';
  typeEquipement: TypesEquipements; // Full object
}
