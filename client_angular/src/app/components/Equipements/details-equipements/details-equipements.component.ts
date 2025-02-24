import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { EquipementService } from '../../../services/equipement.service';
import {Equipement} from "../../../models/equipement";
import {ServiceService} from "../../../services/service.service";
import {Service} from "../../../models/service";

@Component({
  selector: 'app-details-equipements',
  templateUrl: './details-equipements.component.html',
  styleUrls: ['./details-equipements.component.css']
})
export class DetailsEquipementsComponent implements OnInit {
  equipement: Equipement | undefined;
  errorMessage: string = '';
  isEditMode: boolean = false;  // Toggle edit mode
  services: Service[] = [];

  constructor(
    private equipementService: EquipementService,
    private serviceService: ServiceService,
    private route: ActivatedRoute,
    private router: Router  // To navigate after save
  ) { }

  ngOnInit(): void {
    const equipementId = +this.route.snapshot.paramMap.get('id')!;  // Get equipement ID from route params
    this.fetchEquipementDetails(equipementId);
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

  fetchEquipementDetails(id: number): void {
    this.equipementService.getEquipementById(id).subscribe({
      next: (data) => {
        this.equipement = data;
        console.log(this.equipement.service.nom)
      },
      error: (err) => {
        console.error('Error fetching  details:', err);
        this.errorMessage = 'Failed to load equipement details';
      }
    });
  }

  // Toggle to edit mode
  enableEditMode(): void {
    this.isEditMode = true;
  }


  saveChanges(): void {
    if (this.equipement) {
      this.equipementService.updateEquipement(this.equipement.id!, this.equipement).subscribe({
        next: (updatedEquipement) => {
          this.equipement = updatedEquipement;
          this.isEditMode = false;  // Disable edit mode after saving
          this.router.navigate(['/equipements/liste']);  // Redirect after saving
        },
        error: (err) => {
          console.error('Error updating equipement:', err);
          this.errorMessage = 'Failed to update equipement details';
        }
      });
    }
  }
}
