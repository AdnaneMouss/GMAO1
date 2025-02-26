import { Component, OnInit } from '@angular/core';
import { maintenance } from '../../../models/mainteance';
import { MaintenanceService } from '../../../services/maintenance.service';

@Component({
  selector: 'app-maintenances-preventives',
  templateUrl: './maintenances-preventives.component.html',
  styleUrl: './maintenances-preventives.component.css'
})
export class MaintenancesPreventivesComponent implements OnInit {
  maintenance: maintenance[] = [];
  selectedFilter: string = '';
  errorMessage: string = '';
  isSearchOpen = false;
  searchTerm = '';
  showPanel: boolean = false;
  filteredMaintenace = [...this.maintenance];


  newMaintenance: maintenance = {
      id: 0,
      equipement: '',
      departement: '',
      personneResponsable: '',
      frequence: '',
      dateIntervention: new Date(),
      dureeEstimee: 0,
      uniteDuree: '',
      piecesRechange: '',
      quantitePieces: 0,
      localisation: '',
      statut: '',
      imageEquipement:''
  };
 

  constructor(private maintenanceService: MaintenanceService) { }

  ngOnInit(): void {
    this.fetchMaintenances();
}

fetchMaintenances(): void {
    this.maintenanceService.getAllMaintenances().subscribe({
      next: (data) => {
        this.maintenance = data;
        //this.filteredMaintenances = data;
      },
      error: (err) => {
        console.error('Error fetching maintenance:', err);
        this.errorMessage = 'Failed to load maintenance';
      }
    });
}
togglePanel(): void {
  this.showPanel = !this.showPanel; // Toggle the panel visibility
}
addMaintenance(): void {
  // Procéder directement à l'ajout de la maintenance
  this.maintenanceService.createMaintenance(this.newMaintenance).subscribe({
    next: () => {
      alert('Maintenance added successfully.');
      this.fetchMaintenances(); // Rafraîchir la liste des maintenances
      this.resetNewMaintenance(); // Réinitialiser le formulaire
      this.showPanel = false; // Masquer le panneau après l'ajout
    },
    error: (err) => {
      console.error('Error adding maintenance:', err); // Affiche toute l'erreur dans la console
      if (err && err.error) {
        console.error('Error details:', err.error);
        this.errorMessage = `Failed to add maintenance: ${err.error.message || 'No specific error message'}`;
      } else if (err && err.status) {
        this.errorMessage = `Failed to add maintenance: HTTP status ${err.status} - ${err.statusText}`;
      } else {
        this.errorMessage = 'Failed to add maintenance: Unknown error';
      }
    }
  });
}


resetNewMaintenance(): void {
  this.newMaintenance = {
    id: 0,
    equipement: '',
    departement: '',
    personneResponsable: '',
    frequence: '',
    dateIntervention: new Date(),
    dureeEstimee: 0,
    uniteDuree: '',
    piecesRechange: '',
    quantitePieces: 0,
    localisation: '',
    statut: '',
    imageEquipement:''
  };
}

deleteMaintenance(id: number): void {
  this.maintenanceService.deleteMaintenance(id).subscribe(
    response => {
      // Logique après la suppression réussie
      this.addMaintenance();  // Recharger la liste des maintenances
    },
    error => {
      console.error('Erreur lors de la suppression :', error);
    }
  );
}


viewDetails(id: number): void {
  // Logic to view details
  console.log('Voir les détails pour la maintenance id:', id);
}



 //getMaintenance(): void {
   // this.maintenanceService.getAllMaintenances().subscribe((data: maintenance[]) => {
     /// this.maintenance = data;
      //this.filteredMaintenace=data;
    //});
  //}
//filterMaintenancesByStatus() {
  //if (this.selectedFilter) {
   // this.filteredMaintenace = this.maintenance.filter(e => e.statut === this.selectedFilter);
  ///} else {
    //this.filteredMaintenace = [...this.maintenance]; 
  //}
//}



}
//deleteMaintenance(id: number): void {
  //if (confirm(`Are you sure you want to delete the maintenance record with ID ${id}?`)) {
    ///this.maintenanceService.deleteMaintenance(id).subscribe({
      ///next: () => {
        //this.fetchMaintenances(); // Rafraîchir la liste des maintenances après suppression
        //alert('Maintenance deleted successfully.');
      //},
      //error: (err) => {
        //console.error('Error deleting maintenance:', err);
        //this.errorMessage = 'Failed to delete maintenance';
      //}
    ///});
  //}

//}
////viewDetails(id: number): void {
 // console.log('Voir les détails pour la maintenance id:', id);
//}

 