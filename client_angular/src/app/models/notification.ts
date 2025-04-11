export interface Notification {
    id: number;
    message: string;
    createdAt: string;  // Peut-être de type string (ISO 8601 date format) ou Date si vous manipulez les dates
    seen: boolean;



  
   // maintenanceId: number;  // Si vous avez un lien avec l'ID de maintenance
  }
  