import {Service} from "./service";
import {Attribut} from "./attribut"

export interface Equipement {
  id?: number;
  image: string;
  nom: string;
  description: string;
  numeroSerie: string;
  modele: string;
  marque: string;
  localisation: string;
  statut: string;
  dateAchat: string;
  dateMiseEnService: string;
  garantie: string;
  dateDerniereMaintenance: string;
  frequenceMaintenance: string;
  historiquePannes: string;
  coutAchat: string;
  attributs: Attribut[];
  serviceNom: string;
  serviceDetails?: Service;
}

