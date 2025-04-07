import { Component, OnInit } from '@angular/core';
import { Equipement } from '../models/equipement';  // Equipement model
import { AttributEquipements } from '../models/attribut-equipement';  // AttributEquipements model
import { TypesEquipements } from '../models/types-equipements';
import {TypesEquipementsService} from "../services/types-equipements.service";
import {EquipementService} from "../services/equipement.service";
import {Batiment} from "../models/batiment";
import {Etage} from "../models/etage";
import {Salle} from "../models/salle";
import {Service} from "../models/service";
import {BatimentService} from "../services/batiment.service";
import {ServiceService} from "../services/service.service";
import {EtageService} from "../services/etage.service";  // TypesEquipements model

@Component({
  selector: 'app-equipement-form',
  templateUrl: './equipement-form.component.html',
  styleUrls: ['./equipement-form.component.css']
})
export class EquipementFormComponent implements OnInit {
  // This is the equipement object to bind to the form
  equipement: Equipement = {
    id:0,
    image: '',
    nom: '',
    description: '',
    numeroSerie: '',
    modele: '',
    marque: '',
    statut: '',
    actif: true,
    dateAchat: '',
    dateMiseEnService: '',
    garantie: '',
    dateDerniereMaintenance: '',
    frequenceMaintenance: '',
    historiquePannes: '',
    coutAchat: '',
    serviceNom: '',
    typeEquipement: { id: undefined, type: '', image: '', attributs: [] },  // Initial empty type
    service: {} as Service,
    piecesDetachees: [],
    salle: {} as Salle,
    etage: {} as Etage,
    batiment: {} as Batiment,
    valeurSuivi:0,
    labelSuivi:'',
    attributsValeurs: []
  };

  typesEquipements: TypesEquipements[] = [];

  services: Service[] = [];
  batiments: Batiment[] = [];
  etages: Etage[] = [];
  salles: Salle[] = [];
  selectedBatimentId: number | null = null;
  selectedEtageId: number | null = null;

  attributsForSelectedType: AttributEquipements[] = [];

  // Static attributes for Equipement model that are always present
  staticAttributes: string[] = [
    'Nom', 'Description', 'Numéro de série', 'Modèle', 'Marque',
    'Statut', 'Date achat', 'Garantie', 'Fréquence de maintenance', 'Coût achat', 'Service', 'Bâtiment', 'Etage', 'Salle'
  ];


  requiredFields: string[] = [
    'Nom', 'Numéro de série', 'Modèle', 'Marque',
    'Date achat', 'Garantie', 'Coût achat',
    'Fréquence de maintenance', 'Service', 'Bâtiment', 'Etage', 'Salle'
  ];


  isRequired(attribute: string): boolean {
    return this.requiredFields.includes(attribute);
  }

  isModalOpen: boolean= false;
  constructor(
    private equipementService: EquipementService,
    private typesEquipementsService: TypesEquipementsService,
    private batimentService: BatimentService,
    private servicesService: ServiceService,
    private etageService: EtageService
  ) {}

  ngOnInit():
    void {
    this.typesEquipementsService.getTypesEquipements().subscribe((types: TypesEquipements[]) => {
      this.typesEquipements = types;
    });
    this.loadBatiments();
    this.loadServices();
  }
  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  loadBatiments(): void {
    this.batimentService.getAllBatiments().subscribe(
      (data) => {
        this.batiments = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des bâtiments', error);
      }
    );
  }

  loadServices(): void {
    this.servicesService.getAllServices().subscribe(
      (data) => {
        this.services = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des services', error);
      }
    );
  }

  loadEtagesByBatiment(batimentId: number): void {
    this.batimentService.getEtagesByBatimentId(batimentId).subscribe(
      (data) => {
        this.etages = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des étages', error);
      }
    );
  }

  loadSallesByEtage(etageId: number): void {
    this.etageService.getSallesByEtageId(etageId).subscribe(
      (data) => {
        this.salles = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des étages', error);
      }
    );
  }

  onBatimentChange(event: Event): void {
    const target = event.target as HTMLSelectElement;  // Cast event.target to HTMLSelectElement
    this.selectedBatimentId = +target.value; // Convert the value to a number (if your ID is numeric)
    this.loadEtagesByBatiment(this.selectedBatimentId); // Load etages based on the selected batiment
  }

  onEtageChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedEtageId = +target.value;
    this.loadSallesByEtage(this.selectedEtageId);
  }


  // Method to handle type selection and fetch corresponding attributes
  onTypeSelect(typeId: number | undefined): void {
    if (typeId !== undefined) {
      // Fetch attributes based on the selected type ID
      this.typesEquipementsService.getAttributesByTypeId(typeId).subscribe((attributes: AttributEquipements[]) => {
        this.attributsForSelectedType = attributes;  // Store the fetched attributes
      });
    } else {
      this.attributsForSelectedType = [];  // If no type selected, reset attributes
    }
  }

  // Method to handle form submission and create a new Equipement
  onSubmit(): void {
      // Prepare the equipement object to be sent to the backend
      const equipementToSubmit: Equipement = {
        ...this.equipement,
        // Make sure the selected type, batiment, etage, and salle are correctly assigned
        service: this.services.find(service => service.nom === this.equipement.serviceNom) || {} as Service,
        batiment: this.batiments.find(batiment => batiment.intitule === this.equipement.batiment.intitule) || {} as Batiment,
        etage: this.etages.find(etage => etage.num === this.equipement.etage.num) || {} as Etage,
        salle: this.salles.find(salle => salle.num === this.equipement.salle.num) || {} as Salle
      };

      // Call the service method to send the request
      this.equipementService.createEquipement(equipementToSubmit).subscribe(
        (response) => {
          console.log('Equipement created successfully', response);
          // Handle success, e.g., show a success message, close modal, reset form, etc.
          this.closeModal();
        },
        (error) => {
          console.error('Error creating equipement', error);
          // Handle error, e.g., show an error message
        }
      );
  }

  getEquipementProperty(key: string): any {
    return (this.equipement as Record<string, any>)[key];
  }

  setEquipementProperty(key: string, value: any): void {
    (this.equipement as Record<string, any>)[key] = value;
  }


}
