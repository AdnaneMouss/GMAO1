import {Equipement} from "./equipement";
import {TypesEquipements} from "./types-equipements";
import {AttributEquipements} from "./attribut-equipement";

export interface AttributEquipementValeur {
  id: number;
  valeur: string;
  attributEquipement: AttributEquipements;
  typeEquipement: TypesEquipements;
  equipement: Equipement;
}
