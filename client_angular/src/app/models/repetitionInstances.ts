import { maintenance } from "./maintenance";

 
 export interface repetitionInstances{
 id: number;
  dateRepetition: string | Date;
	 
	     
	  statut: 'EN_ATTENTE' | 'EN_COURS' | 'TERMINEE' | 'ANNULEE'; 

	  
	    maintenanceId: number;
 }