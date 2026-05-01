import {AttributEquipements} from "./attribut-equipement";

export interface TypesEquipements {
  id: number;
  type: string;
  image: string;
  actif: boolean;
  attributs: AttributEquipements[]; // Array of AttributEquipements
}
