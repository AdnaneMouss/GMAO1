import {Etage} from "./etage";

export interface Batiment {
  id: number;
  numBatiment: number;
  intitule: string;
  etages: Etage[];  // List of Etages in the Batiment
}
