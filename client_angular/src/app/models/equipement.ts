import { Service } from "./service";
import { Attribut } from "./attribut";
import { TypesEquipements } from "./types-equipements";
import { OrdreTravail } from "./ordre-travail";
import { PieceDetachee } from "./piece-detachee";
import { Salle } from "./salle";
import { Etage } from "./etage";
import { Batiment } from "./batiment";
import { User } from "./user";
import {AttributEquipementValeur} from "./attribut-equipement-valeur";
import { AttributEquipements } from "./attribut-equipement";

export interface Equipement {
  id: number;
  image: string;
  nom: string;
  description: string;
  numeroSerie: string;
  modele: string;
  marque: string;
  statut: string;
  actif: boolean;
  dateAchat: string;
  dateMiseEnService: string;
  garantie: string;
  dateDerniereMaintenance: string;
  frequenceMaintenance: string;
  historiquePannes: string;
  coutAchat: string;
  serviceNom: string;
  typeEquipement: TypesEquipements;
  service: Service;
  piecesDetachees: PieceDetachee[];
  salle: Salle;
  etage: Etage;
  batiment: Batiment;
  attributsValeurs: AttributEquipementValeur[];

  [key: string]: any;
  valeurSuivi: 0,
  labelSuivi:'',



}
