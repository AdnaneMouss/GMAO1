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
  selectedService: any = {}; // Initialize with an empty object
  showAddSuccessMessage: boolean = false;
  showEditSuccessMessage: boolean = false;
  showAddForm: boolean = false;
  searchTermNom = '';
  filteredServices = [...this.services];
  errorMessage: string = '';
  showEditForm: boolean = false;
  imageError: string | null = null;
  selectedFile: File | null = null;  // To store the selected file for upload
  isLoading: boolean = false; // Loading state for API requests
  serviceTaken: boolean = false;


  constructor(private serviceService: ServiceService) {}

  ngOnInit(): void {
    this.getServices();
  }

  // Function to show loading spinner while getting services
  getServices(): void {
    this.isLoading = true;  // Set loading state
    this.serviceService.getAllServices().subscribe(
      (data: Service[]) => {
        this.services = data;
        this.filteredServices = [...this.services];
        this.isLoading = false;  // Stop loading after response
      },
      (error) => {
        this.errorMessage = 'Failed to load services. Please try again later.';
        this.isLoading = false;  // Stop loading if error occurs
      }
    );
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
    this.showAddForm = false;
    this.showEditForm = false;
    this.resetForm();
  }

  resetForm(): void {
    this.newService = { id: 0, nom: '', description: '', image: '' };
    this.errorMessage = ''; // Reset error message
    this.selectedService = null;
    this.serviceTaken=false;
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

  addService(): void {
    if (!this.newService.nom) {
      this.errorMessage = 'Le nom du service est requis!';
      return;
    }

    // Block submission if there's an image error
    if (this.imageError) {
      this.errorMessage = 'Veuillez sélectionner une image valide avant d\'ajouter le service.';
      return;
    }

    this.isLoading = true; // Show loading spinner while making the request

    this.serviceService.createServiceWithImage(
      {
        nom: this.newService.nom,
        description: this.newService.description || '' // Ensure description is always defined
      },
      this.selectedFile || undefined // If no file, pass undefined
    ).subscribe(
      (response) => {
        this.services.push(response);
        this.resetForm();
        this.getServices();

        // Show success message
        this.showAddSuccessMessage = true;
        this.showAddForm = false;

        // Hide success message after 3 seconds
        setTimeout(() => {
          this.showAddSuccessMessage = false;
        }, 3000);

        this.isLoading = false; // Stop loading after success
      },
      (error) => {
        if (error.status === 409) {
          this.serviceTaken = true;
          this.errorMessage = 'Un service avec ce nom existe déjà';
        } else {
          this.errorMessage = 'Échec de la création du service. Veuillez réessayer.';
        }
        this.isLoading = false; // Stop loading on error
      }
    );
  }

  updateService(): void {
    if (!this.selectedService || this.selectedService.id === undefined) {
      this.errorMessage = 'Aucun service sélectionné pour la mise à jour!';
      return;
    }

    if (!this.selectedService.nom) {
      this.errorMessage = 'Le nom du service est obligatoire';
      return;
    }

    // Block update if there's an image error
    if (this.imageError) {
      this.errorMessage = 'Veuillez sélectionner une image valide avant de mettre à jour le service.';
      return;
    }

    const fileToSend = this.selectedFile === null ? undefined : this.selectedFile;

    this.isLoading = true;  // Show loading spinner while making the request
    this.serviceService.updateService(this.selectedService.id, this.selectedService, fileToSend)
      .subscribe(
        (updatedService) => {
          const index = this.services.findIndex(service => service.id === updatedService.id);
          if (index !== -1) {
            this.services[index] = updatedService;
          }
          this.resetForm();
          this.getServices();

          // Show the success message
          this.showEditSuccessMessage = true;

          // Hide the success message after 3 seconds
          setTimeout(() => {
            this.showEditSuccessMessage = false;
          }, 3000);

          this.isLoading = false;  // Stop loading after success
        },
        (error) => {
          // Check for 409 Conflict error and set the specific message
          if (error.status === 409) {
            this.serviceTaken = true;
            this.errorMessage = 'Un service avec ce nom existe déjà';
          } else {
            this.errorMessage = 'Échec de la mise à jour du service.';
          }
          this.isLoading = false;  // Stop loading on error
        }
      );
  }

  editService(service: Service): void {
    this.selectedService = { ...service }; // Clone the object to avoid direct mutations
    this.showEditForm = true; // Show the form
    this.errorMessage = ''; // Reset errors
  }

  getImageUrl(imagePath: string): string {
    return `${environment.apiUrl}${imagePath}`;
  }
}
