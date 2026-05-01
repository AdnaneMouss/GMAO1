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
import {MaintenanceCorrective} from "./maintenance-corrective";

export interface Equipement {
  id: number;
  image: string;
  nom: string;
  description: string;
  numeroSerie: string;
  modele: string;
  marque: string;
  statut: string;
  serviceNom: string;
  serviceId: number;
  dateAchat: string; // ISO date string (ex: '2024-05-10')
  dateMiseEnService: string;
  dateDerniereMaintenance: string;
  coutAchat: number;
  batimentNom: string;
  batimentId: number;
  batimentNum: number;
  etageNum: number;
  etageId: number;
  salleNum: number;
  salleId: number;
  sallePrefixe: string;
  garantie: string;
  typeEquipementNom: string;
  typeEquipementId: number;
  actif: boolean;
  labelSuivi: string;
  valeurSuivi: number;
  attributsValeurs: AttributEquipementValeur[];
  attributsEquipement: AttributEquipements[];
  attributs?: { [key: number]: string }

}
