import { ActionMaintenance } from "./ActionMaintenance";
import { Batiment } from "./batiment";
import { Equipement } from "./equipement";
import { Indicateur } from "./Indicateur";
import { RepetitionType } from "./RepetitionType";
import { User } from "./user";

export interface maintenance{
 
  id: number;
 dureeIntervention: number;
  dateDebutPrevue: Date;
  dateFinPrevue: Date;
  dateProchainemaintenance: Date;
  documentPath: File | null;
  commentaires: string;
  statut: 'EN_ATTENTE' | 'EN_COURS' | 'TERMINEE' | 'ANNULEE'; 
  priorite: 'FAIBLE' | 'NORMALE' | 'URGENTE' ; 
  equipement: Equipement;
  user :User;
  frequence:'JOURNALIER' | 'HEBDOMADAIRE' | 'MENSUEL' | 'TRIMESTRIEL' | 'SEMESTRIEL' | 'ANNUEL' |''   |null ; 
  batiment:Batiment;
  indicateurs?: Indicateur[];
  action :  'VERIFICATION_PERFORMANCES' |'NETTOYAGE_EQUIPEMENTS' |'CALIBRATION_EQUIPEMENTS' |
  'TEST_SECURITE' |
  'AUTRE' |
  'REMPLACEMENT_PIECES' |
  'INSPECTION_VISUELLE' |
  'CONTROLE_CONNECTIVITE' |
  'VERIFICATION_SAUVEARDES' |
  'FORMATION_ENTRETIEN';
  autreAction: string ;
  selectedjours: string[];
  selectedmois: string[];
  repetitiontype:  'TOUS_LES_JOURS'|     'Ne_pas_repeter'| 
  'TOUS_LES_SEMAINES' |  
  'MENSUEL' |            
  'ANNUEL';
  startDaterep: Date; 
  endDaterep: Date; 
  daterepetition?:Date;
  nextRepetitionDates?: Date[];
  RepetitionType:RepetitionType;
  repetition:number;
  seuil:number;
  message:'',
  equipementId: number;

  




  startDate?: Date;
  endDate?: Date;
  selectedDays: { [key: string]: boolean };  // Exemple : { "LUNDI": true, "MARDI": false }
  selectedMonth: { [key: string]: boolean }; // Exemple : { "JANVIER": true, "FÉVRIER": false }
  repetitionType:  'TOUS_LES_JOURS'|    'Ne_pas_repeter'|  
  'TOUS_LES_SEMAINES' |  
  'MENSUEL' |            
  'ANNUEL';
 


}  

  


