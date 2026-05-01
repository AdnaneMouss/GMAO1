import { Component, OnInit } from '@angular/core';
import { Service } from "../../../models/service";
import { ServiceService } from "../../../services/service.service";
import { environment } from "../../../../environments/environment";
import {AttributEquipements} from "../../../models/attribut-equipement";
import {TypesEquipements} from "../../../models/types-equipements";

@Component({
  selector: 'app-categories-equipements',
  templateUrl: './categories-equipements.component.html',
  styleUrls: ['./categories-equipements.component.css']
})
export class CategoriesEquipementsComponent implements OnInit {

  service: Service = this.initService();
  searchQuery: string = '';
  selectedServiceToArchive: any = null;
  showForm: boolean = false;
  newService: Service = { id: 0, nom: '', description: '', image: '', actif: true };
  selectedService: any = {}; // Initialize with an empty object
  showAddSuccessMessage: boolean = false;
  showEditSuccessMessage: boolean = false;
  showAddForm: boolean = false;
  serviceTakenBulk: boolean = false;
  bulkMode = false;
  searchTermNom = '';
  viewMode: 'table' | 'card' = 'card';
  selectionModeOn: boolean = true;
  errorMessage: string = '';
  showEditForm: boolean = false;
  imageError: string | null = null;
  selectedFile: File | null = null;  // To store the selected file for upload
  isLoading: boolean = false; // Loading state for API requests
  serviceTaken: boolean = false;
  showTrash: boolean = false;
  selectedServiceIds: number[] = [];
  bulkRestoreError: string | null = null;
  isBulkRestored: boolean = false;
  isBulkArchived: boolean = false;
  servicesActifs: Service[] = [];
  servicesInactifs: Service[] = [];
  showConfirmationModal: boolean = false;
  showToolTip: boolean = false;
  filteredServices = [...this.servicesActifs];
  isRestored: boolean = false;
  isArchived: boolean = false;
  showTooltip: boolean = false;
  impossibleToArchive: boolean = false;

  constructor(private serviceService: ServiceService) {}

  ngOnInit(): void {
    this.getServices();
    this.getInactifServices();
  }



  toggleView(mode: 'table' | 'card') {
    this.viewMode = mode;
    this.selectionModeOn = this.viewMode != "table";
  }

  filterServicesByName() {
    this.filteredServices = this.servicesActifs.filter(service =>
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
    this.newService = {actif: false, id: 0, nom: '', description: '', image: '' };
    this.errorMessage = ''; // Reset error message
    this.selectedFile= null;
    this.selectedService = null;
    this.serviceTaken=false;
    this.serviceTakenBulk = false;
    this.impossibleToArchive = false;
    this.showEditForm= false;
    this.showAddForm = false;
  }

  private initService(): Service {
    return {actif: false, id: 0, nom: '', description: '', image: '' };
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
        this.servicesActifs.push(response);
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
          const index = this.servicesActifs.findIndex(service => service.id === updatedService.id);
          if (index !== -1) {
            this.servicesActifs[index] = updatedService;
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

  getServices(): void {
    this.serviceService.getAllServices().subscribe(data => {
      this.servicesActifs = data;
      this.filteredServices = data;
    });
  }

  getInactifServices(): void {
    this.serviceService.getServicesInactifs().subscribe(data => {
      this.servicesInactifs = data;
    });
  }

  restaurerService(id: number): void {
    this.errorMessage='';
    this.serviceService.restaurerService(id).subscribe(
      (response) => {
        console.log('Response from restaurer:', response);  // Check what comes from the backend
        this.isRestored = true;
        this.getInactifServices();
        this.getServices();
        this.showTrash = false;  // Close the trash modal after action
        this.resetForm();
        setTimeout(() => {
          this.isRestored = false;
        }, 3000);
      },
      (error) => {
        if (error.status != 200) {
          this.serviceTaken = true;
          this.errorMessage = 'Un service actif avec ce nom existe déjà!';
        }
      }
    );
  }

  restaurerSelection(): void {
    this.errorMessage='';
    if (this.selectedServiceIds.length === 0) return;

    this.bulkRestoreError = null;
    this.serviceService.restaurerMultiple(this.selectedServiceIds).subscribe(
      (response) => {
        this.isBulkRestored = true;
        this.getInactifServices();
        this.getServices();
        this.showTrash=false;
        this.resetForm();
        this.selectedServiceIds = [];
        console.log("",this.isBulkRestored);
        setTimeout(() => {
          this.isBulkRestored = false;
        }, 3000);
      },
      (error) => {
        if (error.status != 200) {
          this.serviceTakenBulk = true;
          this.errorMessage = 'Un ou plusieurs services actifs portant les mêmes noms existent déjà!';
        }
      }
    );
  }

  archiverSelection(): void {
    if (this.selectedServiceIds.length === 0) return;

    this.serviceService.archiverMultiple(this.selectedServiceIds).subscribe(
      (response: any) => {
        this.getInactifServices();
        this.getServices();
        this.selectedServiceIds = [];
        this.showTrash = false;
        this.isBulkArchived = true;
        this.errorMessage = '';
        setTimeout(() => {
          this.isBulkArchived = false;
        }, 3000);
      },
      (error) => {
        if (error.status === 400) {
          this.impossibleToArchive = true;
          this.errorMessage = error.error.message || "Impossible d’archiver ces types.";
        } else {
          this.errorMessage = "Une erreur inattendue s'est produite. Veuillez réessayer.";
        }
      }
    );
  }

  toggleBulkMode(): void {
    this.bulkMode = !this.bulkMode;
    if (!this.bulkMode) {
      this.selectedServiceIds = [];
    }
  }


  isSelected(type: any): boolean {
    return this.selectedServiceIds.includes(type.id);
  }

  toggleSelection(id: number): void {
    const index = this.selectedServiceIds.indexOf(id);
    if (index > -1) {
      this.selectedServiceIds.splice(index, 1);
    } else {
      this.selectedServiceIds.push(id);
    }
  }

  selectAll() {
    this.selectedServiceIds = this.servicesInactifs.map(service => service.id);
  }

  resetSelection() {
    this.selectedServiceIds = [];
  }


  archiverType(id: number): void {
    this.serviceService.archiverService(id).subscribe(
      (response) => {
        console.log('Response from archiver:', response);
        this.isArchived = true;
        this.errorMessage = ''; // Clear previous errors

        this.getInactifServices();
        this.getServices();
        this.showTrash = false;

        setTimeout(() => {
          this.isArchived = false;
        }, 3000);
      },
      (error) => {
        console.error('Erreur lors de l\'archivage', error);

        if (error.status === 400) {
          this.impossibleToArchive = true;
          this.errorMessage = error.error.message || "Impossible d’archiver ce type.";
        } else {
          this.errorMessage = "Une erreur inattendue s'est produite. Veuillez réessayer.";
        }


      }
    );
  }



  toggleTrash() {
    this.showTrash = !this.showTrash;
    if (this.showTrash) {
      this.getInactifServices();
    }
    this.resetForm();
  }
}
