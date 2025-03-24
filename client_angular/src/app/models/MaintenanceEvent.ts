export interface MaintenanceEvent {
    id: number;
    startDate: Date;
    endDate: Date;
    repetition_type: 
    'Ne_pas_repeter'|
    'TOUS_LES_JOURS'|       
    'TOUS_LES_SEMAINES'|    
    'MENSUEL'|             
    'ANNUEL' ;
    
  
    
    
    
    
    // Vous pouvez également utiliser un enum ici
    selectedDays: { [key: string]: boolean };
    selectedMonth: { [key: string]: boolean };
  }