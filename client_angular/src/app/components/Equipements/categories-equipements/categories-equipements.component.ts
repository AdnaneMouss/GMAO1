import { Component, OnInit } from '@angular/core';
import { Service } from "../../../models/service";
import { ServiceService } from "../../../services/service.service";
import { environment } from "../../../../environments/environment";

@Component({
  selector: 'app-categories-equipements',
  templateUrl: './categories-equipements.component.html',
  styleUrls: ['./categories-equipements.component.css']
})
export class CategoriesEquipementsComponent implements OnInit {

  services: Service[] = [];
  service: Service = this.initService();
  searchQuery: string = '';
  showForm: boolean = false;
  newService: Service = { id: 0, nom: '', description: '', image: '' };
  selectedService: Service | null = null; // Track service being updated
  searchTermNom = '';
  filteredServices = [...this.services];
  errorMessage: string = '';

  imageError: string | null = null;
  selectedFile: File | null = null;  // To store the selected file for upload

  constructor(private serviceService: ServiceService) {}

  ngOnInit(): void {
    this.getServices();
  }

  getServices(): void {
    this.serviceService.getAllServices().subscribe((data: Service[]) => {
      this.services = data;
      this.filteredServices = [...this.services];
    });
  }

  filterServicesByName() {
    this.filteredServices = this.services.filter(service =>
      service.nom.toLowerCase().includes(this.searchTermNom.toLowerCase())
    );
  }

  sortBynom(): void {
    this.filteredServices.sort((a, b) => a.nom.localeCompare(b.nom));
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    this.errorMessage = ''; // Reset error message
    this.selectedService = null; // Reset selected service when toggling the form
  }

  resetForm(): void {
    this.newService = { id: 0, nom: '', description: '', image: '' };
    this.selectedService = null;
    this.showForm = false;
    this.errorMessage = '';
    this.selectedFile = null;  // Clear selected file
  }

  private initService(): Service {
    return { id: 0, nom: '', description: '', image: '' };
  }

  // Handle file input
  onImageSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Vérifier le type de fichier (optionnel)
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        this.imageError = "Seuls les fichiers JPG, JPEG et PNG sont acceptés.";
        this.selectedFile = null;
        return;
      }

      // Vérifier la taille (ex: max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        this.imageError = "La taille de l'image ne doit pas dépasser 5MB.";
        this.selectedFile = null;
        return;
      }

      this.imageError = null; // Aucune erreur
      this.selectedFile = file;
    }
  }
  // Method to create service and upload image
  addService(): void {
    if (!this.newService.nom || !this.selectedFile) {
      this.errorMessage = 'Nom, description, and image are required!';
      return;
    }

    this.serviceService.createServiceWithImage(this.newService, this.selectedFile)
      .subscribe(
        (response) => {
          this.services.push(response);  // Add the newly created service to the list
          this.resetForm();
          this.getServices();
        },
        (error) => {
          this.errorMessage = 'Failed to create service. Please try again.';
        }
      );
  }


  getImageUrl(imagePath: string): string {
    return `${environment.apiUrl}${imagePath}`;  // Use the apiUrl dynamically
  }

}
