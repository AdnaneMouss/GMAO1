import { Component, OnInit } from '@angular/core';
import { Intervention } from "../../../models/intervention";
import { InterventionService } from "../../../services/intervention.service";
import { PhotosIntervention } from '../../../models/photos-intervention';
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-interventions-precedentes',
  templateUrl: './interventions-precedentes.component.html',
  styleUrls: ['./interventions-precedentes.component.css']
})
export class InterventionsPrecedentesComponent implements OnInit {
  filters = {
    typeIntervention: '',
    equipementMaintenu:'',
    priorite: '',
    startDate: null,
    endDate: null
  };
  interventions: Intervention[] = [];  // Array to hold the list of interventions
  technicianId: number = 0;  // Variable to store the technician ID
  selectedPhotos: PhotosIntervention[] = [];
  showPhotoModal: boolean = false;

  constructor(private interventionService: InterventionService) {}

  ngOnInit(): void {
    // Retrieve technicianId from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.technicianId = user.id;  // Assuming the ID is stored as 'id' in user object

    // Now call the service to fetch interventions
    this.getInterventionsByTechnician(this.technicianId);
  }

  getInterventionsByTechnician(technicianId: number): void {
    this.interventionService.getInterventionsByTechnician(technicianId).subscribe(
      (data: Intervention[]) => {

        // Filter the interventions where maintenance.statut === 'TERMINEE'
        this.interventions = data.filter(intervention =>
          intervention.maintenanceId && intervention.maintenanceStatut === 'TERMINEE'

        );
        console.log(technicianId)
      },
      (error) => {
        console.error('Error fetching interventions:', error);  // Handle errors
      }
    );
  }

  viewPhotos(intervention: Intervention): void {
    console.log("Photos disponibles :", intervention.photos);
    if (intervention.photos.length > 0) {
      this.selectedPhotos = intervention.photos;
      this.showPhotoModal = true;
    } else {
      console.log("Aucune photo disponible");
    }
  }

  getImageUrl(imagePath: string): string {
    return `${environment.apiUrl}${imagePath}`;
  }

  filteredInterventions() {
    return this.interventions.filter(intervention => {

      return (
   (this.filters.equipementMaintenu ? intervention.equipementMaintenu.toLowerCase().includes(this.filters.equipementMaintenu.toLowerCase()) : true) &&
    (this.filters.priorite ? intervention.maintenancePriorite.toLowerCase().includes(this.filters.priorite.toLowerCase()) : true) &&
    (this.filters.typeIntervention ? intervention.typeIntervention.toLowerCase().includes(this.filters.priorite.toLowerCase()) : true)
      );
    });
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
