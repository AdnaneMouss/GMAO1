import {Service} from "./service";

export interface Attribut {
  nom: string;
  valeur: string;
}

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
  service: Service,

}

