import { Salle } from './salle';
import {TypesEquipements} from "./types-equipements";
import {Batiment} from "./batiment";  // Make sure to import the Salle model

export interface Etage {
  id: number;
  num: number;
  salles: Salle[];
  batiment: Batiment;
}
