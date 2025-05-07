import { Component, OnInit } from '@angular/core';
import { MaintenanceService } from '../../../services/maintenance.service';
import { maintenance } from '../../../models/maintenance';

@Component({
  selector: 'app-historique-maintenances',
  templateUrl: './historique-maintenances.component.html',
  styleUrls: ['./historique-maintenances.component.css']
})
export class HistoriqueMaintenancesComponent implements OnInit {
  maintenances: maintenance[] = []; // Liste complète des maintenances
  terminatedMaintenances: maintenance[] = []; // Liste des maintenances terminées

  errorMessage: string = '';
  sortField: 'date' | 'priority' = 'date';
  sortOrder: 'recent' | 'oldest' = 'recent';
  selectedMaintenance: any = null;

  ngOnInit(): void {
    this.loadMaintenances();
  }
  constructor(private maintenanceService: MaintenanceService) {}
   // Charger toutes les maintenances
   loadMaintenances(): void {
    this.maintenanceService.getAllMaintenances().subscribe({
      next: (data) => {
        this.maintenances = data;
        this.filterTerminatedMaintenances(); // Filtrer les maintenances terminées
      },
      error: (err) => {
        this.errorMessage = "Erreur lors du chargement des maintenances.";
        console.error(err);
      }
    });
  }

  // Filtrer les maintenances terminées
  filterTerminatedMaintenances(): void {
    this.terminatedMaintenances = this.maintenances.filter(m => m.statut === 'TERMINEE');
  }

  
openModal(maintenance: any): void {
  this.selectedMaintenance = maintenance;
}

closeModal(): void {
  this.selectedMaintenance = null;
}


  // Tri par date
  sortByDate(order: 'recent' | 'oldest'): void {
    this.sortField = 'date';
    this.sortOrder = order;
    
    this.terminatedMaintenances.sort((a, b) => {
      const dateA = new Date(a.dateFinPrevue).getTime();
      const dateB = new Date(b.dateFinPrevue).getTime();
      
      return order === 'recent' ? dateB - dateA : dateA - dateB;
    });
  }

  // Tri par priorité (exemple supplémentaire)
  
}