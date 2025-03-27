import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { MaintenanceCorrectiveService } from "../../../services/maintenance-corrective.service";
import { MaintenanceCorrective } from "../../../models/maintenance-corrective";
import { InterventionService } from "../../../services/intervention.service";
import { Intervention } from "../../../models/intervention";

@Component({
  selector: 'app-taches-affectees',
  templateUrl: './taches-affectees.component.html',
  styleUrls: ['./taches-affectees.component.css']
})
export class TachesAffecteesComponent implements OnInit {
  filters = {
    titre: '',
    equipementNom: '',
    equipementBatiment: '',
    equipementEtage: '',
    equipementSalle: '',
    statut: '',
    priorite: '',
    startDate: null,
    endDate: null
  };
  maintenances: MaintenanceCorrective[] = [];
  showConfirmation: boolean = false;
  actionType: 'start' | 'complete' = 'start';
  currentMaintenanceId: number | null = null;
  confirmationMessage: string = '';
  technicienId: number = 0;

  // For intervention form
  showInterventionForm: boolean = false;
  intervention: {
    maintenanceId: number;
    maintenanceStatut: string;
    remarques: string;
    technicienId: number;
    description: string;
    duree: number;
    id: number;
    photos: any[];
    typeIntervention: string
  } = {
    description: "",
    duree: 0,
    id: 0,
    maintenanceId: 0,
    maintenanceStatut: 'EN_ATTENTE',
    photos: [],
    remarques: "",
    technicienId: 0,
    typeIntervention: 'CORRECTIVE'
  };

  // Add a variable for file input
  selectedFile: File | null = null;

  constructor(
    private maintenanceService: MaintenanceCorrectiveService,
    private interventionService: InterventionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.technicienId = user.id;
    this.getMaintenancesByTechnicien(this.technicienId);
  }

  getMaintenancesByTechnicien(technicienId: number): void {
    this.maintenanceService.getMaintenancesByTechnicien(technicienId).subscribe(
      (data: MaintenanceCorrective[]) => {
        // Filter out maintenances with status "ANNULEE" or "TERMINEE"
        this.maintenances = data.filter(maintenance => maintenance.statut !== 'ANNULEE' && maintenance.statut !== 'TERMINEE');
      },
      (error) => {
        console.error('Error fetching maintenances:', error);
      }
    );
  }



  filteredMaintenances() {
    return this.maintenances.filter(maintenance => {
      // Date filter logic
      const creationDate = new Date(maintenance.dateCreation);
      const startDate = this.filters.startDate ? new Date(this.filters.startDate) : null;
      const endDate = this.filters.endDate ? new Date(this.filters.endDate) : null;

      const dateInRange = (!startDate || creationDate >= startDate) && (!endDate || creationDate <= endDate);

      return (
        (this.filters.titre ? maintenance.titre.toLowerCase().includes(this.filters.titre.toLowerCase()) : true) &&
        (this.filters.equipementNom ? maintenance.equipementNom.toLowerCase().includes(this.filters.equipementNom.toLowerCase()) : true) &&
        (this.filters.equipementBatiment ? maintenance.equipementBatiment.toLowerCase().includes(this.filters.equipementBatiment.toLowerCase()) : true) &&
        (this.filters.statut ? maintenance.statut.toLowerCase().includes(this.filters.statut.toLowerCase()) : true) &&
        (this.filters.priorite ? maintenance.priorite.toLowerCase().includes(this.filters.priorite.toLowerCase()) : true) &&
        dateInRange // Check if the intervention date is in the selected range
      );
    });
  }

  startTask(id: number): void {
    this.maintenanceService.startTask(id).subscribe(
      (updatedMaintenance) => {
        const index = this.maintenances.findIndex(m => m.id === id);
        if (index !== -1) {
          this.maintenances[index] = updatedMaintenance;
        }
      },
      (error) => {
        console.error('Error starting task:', error);
      }
    );
  }

  markAsCompleted(id: number): void {
    this.maintenanceService.markAsCompleted(id).subscribe(
      (updatedMaintenance) => {
        const index = this.maintenances.findIndex(m => m.id === id);
        if (index !== -1) {
          this.maintenances[index] = updatedMaintenance;
        }
        // Trigger the intervention form after marking as completed
        this.openInterventionForm(id);
      },
      (error) => {
        console.error('Error marking task as completed:', error);
      }
    );
  }

  openConfirmationDialog(action: 'start' | 'complete', maintenanceId: number): void {
    this.actionType = action;
    this.currentMaintenanceId = maintenanceId;

    if (action === 'start') {
      this.confirmationMessage = 'Êtes-vous sûr de vouloir commencer cette tâche ?';
    } else if (action === 'complete') {
      this.confirmationMessage = 'Êtes-vous sûr de vouloir marquer cette tâche comme terminée ?';
    }

    this.showConfirmation = true;
  }

  confirmAction(): void {
    if (this.actionType === 'start' && this.currentMaintenanceId !== null) {
      this.startTask(this.currentMaintenanceId);
    } else if (this.actionType === 'complete' && this.currentMaintenanceId !== null) {
      this.markAsCompleted(this.currentMaintenanceId);
    }
    this.showConfirmation = false;
  }

  cancelAction(): void {
    this.showConfirmation = false;
  }

  openInterventionForm(maintenanceId: number): void {
    this.showInterventionForm = true;
    this.intervention.maintenanceId = maintenanceId;
    this.intervention.technicienId = this.technicienId;
  }

  // Method to handle file input change
  onFileChange(event: any): void {
    this.selectedFile = event.target.files[0]; // Capture the selected file
  }

  submitIntervention(): void {
    if (this.selectedFile) {
      // Prepare the intervention data along with the file for upload
      const interventionData = {
        description: this.intervention.description,
        remarques: this.intervention.remarques,
        maintenanceId: this.intervention.maintenanceId,
        technicienId: this.intervention.technicienId
      };

      // Call the service method to send the data along with the file
      this.interventionService.createIntervention(interventionData, this.selectedFile).subscribe(
        (newIntervention) => {
          console.log('Intervention added successfully:', newIntervention);
          this.showInterventionForm = false;  // Hide the form after submission
          this.router.navigate(['/interventions/liste']);
        },
        (error) => {
          console.error('Error creating intervention:', error);
        }
      );
    }
  }

  formatDateWithIntl(date: string | undefined): string {
    if (!date) {
      return 'Date non disponible'; // Or provide a default string if date is undefined
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return 'Invalid Date'; // Return fallback if date parsing fails
    }

    const formatter = new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
    return formatter.format(parsedDate);
  }
}
