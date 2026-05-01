import { Component, OnInit } from '@angular/core';
import { Equipement } from '../../models/equipement';  // Equipement model
import { AttributEquipements } from '../../models/attribut-equipement';  // AttributEquipements model
import { TypesEquipements } from '../../models/types-equipements';
import {TypesEquipementsService} from "../../services/types-equipements.service";
import {EquipementService} from "../../services/equipement.service";
import {Batiment} from "../../models/batiment";
import {Etage} from "../../models/etage";
import {Salle} from "../../models/salle";
import {Service} from "../../models/service";
import {BatimentService} from "../../services/batiment.service";
import {ServiceService} from "../../services/service.service";
import {EtageService} from "../../services/etage.service";  // TypesEquipements model

@Component({
  selector: 'app-equipement-form',
  templateUrl: './equipement-form.component.html',
  styleUrls: ['./equipement-form.component.css']
})
export class EquipementFormComponent implements OnInit {
  // This is the equipement object to bind to the form
  equipement: Equipement[]=[];
  newEquipement: Equipement = {
    attributsEquipement: [],
    batimentId: 0,
    batimentNom: "",
    batimentNum: 0,
    etageId: 0,
    etageNum: 0,
    salleId: 0,
    salleNum: 0,
    sallePrefixe: "",
    serviceId: 0,
    serviceNom: "",
    typeEquipementId: 0,
    typeEquipementNom: "",
    id: 0,
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
    coutAchat: 0,
    valeurSuivi: 0,
    labelSuivi: '',
    attributsValeurs: [],

    // If you need to dynamically bind attribute values from form inputs, add this:
    attributs: {} // <--- key = attributId (number), value = string
  };

  equipementAny: { [key: string]: any } = {};

  showAddPanel: boolean = false;
  selectedFile: File | null = null;
  equipementAdded: boolean = false;
  successMessage: string = '';
  typesEquipements: TypesEquipements[] = [];
  attributs: { id: number; nom: string; type: string; unite?: string }[] = [];

  services: Service[] = [];
  batiments: Batiment[] = [];
  etages: Etage[] = [];
  salles: Salle[] = [];
  selectedBatimentId: number | null = null;
  selectedEtageId: number | null = null;
  errorMessage: string = '';
  imageError: string = '';
  numeroSerieTaken: boolean = false;


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
    this.typesEquipementsService.getActifs().subscribe((types: TypesEquipements[]) => {
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




  resetNewEquipement(): void {
    this.newEquipement = {
      attributsEquipement: [],
      batimentId: 0,
      batimentNom: "",
      batimentNum: 0,
      etageId: 0,
      etageNum: 0,
      salleId: 0,
      salleNum: 0,
      sallePrefixe: "",
      serviceId: 0,
      typeEquipementId: 0,
      typeEquipementNom: "",
      id: 0,
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
      coutAchat: 0,
      serviceNom: '',
      valeurSuivi: 0,
      labelSuivi: '',
      attributsValeurs: []
    };

    this.selectedFile = null;
    this.imageError = '';
    this.errorMessage = '';
  }
  addEquipement(): void {
    this.errorMessage = '';
    console.log('Button triggered');

    const equipementData: any = {
      nom: this.newEquipement.nom,
      description: this.newEquipement.description,
      numeroSerie: this.newEquipement.numeroSerie,
      modele: this.newEquipement.modele,
      marque: this.newEquipement.marque,
      dateAchat: this.newEquipement.dateAchat,
      garantie: this.newEquipement.garantie,
      coutAchat: this.newEquipement.coutAchat,
      serviceNom: this.newEquipement.serviceNom,
      batimentNom: this.newEquipement.batimentNom,
      etageNum: this.newEquipement.etageNum,
      salleNum: this.newEquipement.salleNum,
      typeEquipementNom: this.newEquipement.typeEquipementNom,
      attributsValeurs: this.attributs.map(attr => ({
        attributId: attr.id,
        valeur: (this.newEquipement as any)[attr.nom] || ''
      }))
    };

    const fileToSend = this.selectedFile === null ? undefined : this.selectedFile;
    console.log('Sending to backend:', equipementData);

    this.equipementService.createEquipementWithImage(equipementData, fileToSend).subscribe(
      (response) => {
        console.log('Équipement ajouté avec succès:', response);
        this.equipement.push(response);
        this.resetNewEquipement();
        this.equipementAdded = true;
        this.showAddPanel = false;
        this.successMessage = 'Équipement ajouté avec succès.';

        setTimeout(() => {
          this.equipementAdded = false;
        }, 3000);
      },
      (error) => {
        console.error('Erreur lors de l\'ajout de l\'équipement:', error);

        if (error.status === 409 && error.error) {
          const field = error.error.field;
          const message = error.error.message;

          this.errorMessage = message;

          if (field === 'numeroSerie') {
            this.numeroSerieTaken = true;
          }
        } else {
          this.errorMessage = 'Une erreur s\'est produite lors de l\'ajout de l\'équipement.';
        }
      }
    );
  }

  selectedAttributs: AttributEquipements[] = [];

  onTypeSelected(event: any) {
    const selectedTypeId = +event.target.value;
    console.log("Type sélectionné ID:", selectedTypeId);

    const selectedType = this.typesEquipements.find(t => t.id === selectedTypeId);
    if (selectedType) {
      this.selectedAttributs = selectedType.attributs;
      console.log("Attributs dynamiques:", this.selectedAttributs);
    } else {
      console.warn("Type non trouvé !");
      this.selectedAttributs = [];
    }
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
        console.log("Services:",this.services);
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




  getEquipementProperty(key: string): any {
    return (this.equipement as Record<string, any>)[key];
  }

  setEquipementProperty(key: string, value: any): void {
    (this.equipement as Record<string, any>)[key] = value;
  }


}
