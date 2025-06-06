import { AttributEquipementValeur } from './attribut-equipement-valeur';
import { Batiment } from './batiment';
import { Equipement } from './equipement';
import { Etage } from './etage';
import { PieceDetachee } from './piece-detachee';
import { Salle } from './salle';
import { Service } from './service';
import { TypesEquipements } from './types-equipements';

export interface CoutMaintenance {

  equipement: Equipement;
  cost: number;

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
    batimentNom?: string;
    etageNum?: number;
    salleNum?: number;
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
