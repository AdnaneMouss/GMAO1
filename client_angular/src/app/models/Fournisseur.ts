import { contrat } from "./contrat";

export interface Fournisseur {
  id?: number;
  nom: string;
  adresse?: string;
  email?: string;
  telephone?: string;
  codepostal:number;
  image:string;
 contrats?: contrat[];
 type :
	
	
	'pharmaceutique'|
    'equipement'|
   'consommable'|
  'service';

    dateajout: string;

}
