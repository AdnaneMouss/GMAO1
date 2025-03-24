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
  errorMessage: string = ''; // Message d'erreur

  constructor(private maintenanceService: MaintenanceService) {}

  ngOnInit(): void {
    this.loadMaintenances(); // Charger les maintenances au démarrage
  }

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
}