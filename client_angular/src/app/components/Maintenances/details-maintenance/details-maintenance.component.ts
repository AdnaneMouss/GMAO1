import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MaintenanceService } from '../../../services/maintenance.service';
import { maintenance } from '../../../models/mainteance';
import { Service } from '../../../models/service';
import { ServiceService } from '../../../services/service.service';

@Component({
  selector: 'app-details-maintenance',
  templateUrl: './details-maintenance.component.html',
  styleUrl: './details-maintenance.component.css'
})
export class DetailsMaintenanceComponent implements OnInit {
  maintenance: maintenance | undefined;
    errorMessage: string = '';
    isEditMode: boolean = false;  // Toggle edit mode
    services: Service[] = [];
  
constructor(
    private maintenanceService: MaintenanceService,
    private serviceService: ServiceService,
    private route: ActivatedRoute,
    private router: Router  // To navigate after save
  ) { }
  ngOnInit(): void {
    const maintenanceId = +this.route.snapshot.paramMap.get('id')!;  // Get equipement ID from route params
    this.fetchMaintenanceDetails(maintenanceId);
    this.getAllServices();
  }
  getAllServices(): void {
    this.serviceService.getAllServices().subscribe(
      (data: Service[]) => {
        this.services = data;
      },
      (error) => {
        console.error('Error fetching services:', error);
      }
    );
  }
  fetchMaintenanceDetails(id: number): void {
    this.maintenanceService.getMaintenanceById(id).subscribe({
      next: (data) => {
        this.maintenance = data;
        console.log(this.maintenance.statut)
      },
      error: (err) => {
        console.error('Error fetching  details:', err);
        this.errorMessage = 'Failed to load mainteance details';
      }
    });
  }
  enableEditMode(): void {
    this.isEditMode = true;
  }
  saveChanges(): void {
    if (this.maintenance) {
      this.maintenanceService.updateMaintenance(this.maintenance.id!, this.maintenance).subscribe({
        next: (updateMaintenance) => {
          this.maintenance = updateMaintenance;
          this.isEditMode = false;  // Disable edit mode after saving
          this.router.navigate(['/maintenances/preventives']);  // Redirect after saving
        },
        error: (err) => {
          console.error('Error updating maintenance:', err);
          this.errorMessage = 'Failed to update mainytenance details';
        }
      });
    }
  }
}

 



 