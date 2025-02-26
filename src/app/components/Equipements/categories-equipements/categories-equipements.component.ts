import {Component, OnInit} from '@angular/core';
import {Service} from "../../../models/service";
import {ServiceService} from "../../../services/service.service";

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
  searchTermNom = '';
  filteredServices = [...this.services];
  errorMessage: string = '';  // Ajout du message d'erreur

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
    this.errorMessage = ''; // Réinitialiser le message d'erreur
  }

  resetForm(): void {
    this.newService = { id: 0, nom: '', description: '', image: '' };
    this.showForm = false;
    this.errorMessage = '';
  }

  private initService(): Service {
    return { id: 0, nom: '', description: '', image: '' };
  }

  addService(): void {
    this.errorMessage = ''; // Réinitialise l'erreur avant chaque tentative

    this.serviceService.createService(this.newService).subscribe(
      (savedService: Service) => {
        console.log('Service ajouté avec succès:', savedService);
        this.services.push(savedService);
        this.filterServicesByName();
        this.resetForm();
      },
      (error) => {
        console.error('Erreur lors de l\'ajout du service:', error);
        if (error.status != 200) {
          this.errorMessage = 'Ce service exsite déjà. Veuillez en choisir un autre.';
        }
      }
    );
  }
}
