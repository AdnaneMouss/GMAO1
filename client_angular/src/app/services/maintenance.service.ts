import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { maintenance } from '../models/maintenance';
import { RepetitionType } from '../models/RepetitionType';
import { repetitionInstances } from '../models/repetitionInstances';


@Injectable({
  providedIn: 'root',
})
export class MaintenanceService {
  private apiUrl = 'http://localhost:8080/api/maintenances'; // Remplace par l'URL de ton backend

  constructor(private http: HttpClient) {}

  getAllMaintenances(): Observable<maintenance[]> {
    return this.http.get<maintenance[]>(this.apiUrl);
  }
  getMaintenanceById(id: number): Observable<maintenance> {
    return this.http.get<maintenance>(`${this.apiUrl}/${id}`);
  }

  
  //createMaintenance(maintenance: Maintenance): Observable<Maintenance> {
    //return this.http.post<Maintenance>(this.apiUrl, maintenance);
  //}
  createMaintenance(maintenance: maintenance): Observable<maintenance> {
    return this.http.post<maintenance>(`${this.apiUrl}/add`, maintenance);
   }
 // createMaintenance(maintenance: FormData): Observable<any> {
   // return this.http.post(`${this.apiUrl}/add`, maintenance);
  //}

  
   
  updateMaintenance(id: number, maintenance: Partial<maintenance>): Observable<maintenance> {
    return this.http.put<maintenance>(`${this.apiUrl}/${id}`, maintenance);
  } 

  updateMaintenanceP(id: number, maintenance: Partial<maintenance>): Observable<maintenance> {
  return this.http.put<maintenance>(`${this.apiUrl}/${id}`, maintenance);
}

  
  
  

  deleteMaintenance(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  getFilteredMaintenances(filters: { priority: string, status: string }): Observable<any> {
    const params = new HttpParams()
      .set('priority', filters.priority)
      .set('status', filters.status);
  
    return this.http.get<any>('/api/maintenancePeriodique', { params });
  }

  // Méthode pour obtenir les dates de répétition
  getNextRepetitionDates(maintenance: maintenance): Observable<maintenance> {
    return this.http.post<maintenance>(`${this.apiUrl}/next-dates`, maintenance);
  }

    // Fetch maintenances by technician ID
// Dans MaintenanceService
getMaintenancesByTechnicien(technicienId: number): Observable<maintenance[]> {
  return this.http.get<maintenance[]>(`${this.apiUrl}/Technicien/${technicienId}`);
}


changerStatutEnTermine(id: number): Observable<any> {
  return this.http.patch(`${this.apiUrl}/${id}`, { statut: 'ANNULEE' });
}

cancelTask(id: number): Observable<maintenance> {
    return this.http.post<maintenance>(`${this.apiUrl}/${id}/cancel`, {});
  }




 // Start a maintenance task
  startTask(id: number): Observable<maintenance> {
    return this.http.post<maintenance>(`${this.apiUrl}/${id}/start`, {});
  }
 

  //startTask(id: number, repetitionDate?: string): Observable<maintenance> {
    //const body = repetitionDate ? { repetitionDate } : {};
    //return this.http.put<maintenance>(`${this.apiUrl}/${id}/start`, body);
  //}

   

  

 

  // Mark a maintenance task as completed
    markAsCompleted(id: number): Observable<maintenance> {
      return this.http.put<maintenance>(`${this.apiUrl}/${id}/complete`, {});
    }

    
  

    

startRepetition(id: number): Observable<void> {
  return this.http.put<void>(`http://localhost:8080/api/repetitions/${id}/start`, {});
}



getRepetitionInstances(): Observable<repetitionInstances[]> {
    return this.http.get<repetitionInstances[]>(this.apiUrl);
  }



   getAllRepetitions(): Observable<repetitionInstances[]> {
    return this.http.get<repetitionInstances[]>(`${this.apiUrl}/repetitions`);
  }

  // ✅ Récupérer les répétitions par maintenanceId
  getRepetitionsByMaintenanceId(maintenanceId: number): Observable<repetitionInstances[]> {
    return this.http.get<repetitionInstances[]>(`${this.apiUrl}/repetitions/maintenance/${maintenanceId}`);
  }
  

  
    



  
}









 
