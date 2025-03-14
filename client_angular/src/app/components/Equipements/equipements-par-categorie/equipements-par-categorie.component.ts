import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {EquipementService} from "../../../services/equipement.service";
import {Equipement} from "../../../models/equipement";
import {ServiceService} from "../../../services/service.service";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-equipements-par-categorie',
  templateUrl: './equipements-par-categorie.component.html',
  styleUrl: './equipements-par-categorie.component.css'
})
export class EquipementsParCategorieComponent implements OnInit{

  equipements: any[] = [];
  showForm: boolean = false;
  filteredEquipements = [...this.equipements];
  message: string = '';
  equipement: Equipement = this.initEquipement();
  searchTermNum = '';
  searchTermNom = '';
  selectedStatus: string = '';
  viewMode: 'table' | 'card' = 'table'; // default to table
  sortColumn: string = '';
  startDate: string='';
  endDate: string='';
  isEditing: boolean = false;
  showEditPanel: boolean = false;
  selectedEquipement: Equipement | null = null; // Store selected user details
  sortDirection: 'asc' | 'desc' = 'asc';
  serviceName: string = '';
  equipementsAttributs: { [key: number]: Map<string, string> } = {};
  constructor(
    private route: ActivatedRoute,
    private equipementService: EquipementService,
    private serviceService: ServiceService
  ) {
  }

  ngOnInit(): void {
    this.getEquipements();
    this.getServiceName();
  }

  getServiceName() {
    const serviceId = this.route.snapshot.paramMap.get('serviceId');
    if (serviceId) {
      this.serviceService.getServiceById(serviceId).subscribe(service => {
        this.serviceName = service.nom;
      });
    }
  }

  applyAllFilters() {
    this.filteredEquipements = this.equipements.filter(e => {
      const nomMatch = this.searchTermNom
        ? e.nom.toLowerCase().includes(this.searchTermNom.toLowerCase())
        : true;

      const numSerieMatch = this.searchTermNum
        ? e.numeroSerie && e.numeroSerie.toLowerCase().includes(this.searchTermNum.toLowerCase())
        : true;

      const statusMatch = this.selectedStatus
        ? e.statut === this.selectedStatus
        : true;

      const dateAchat = new Date(e.dateAchat);
      const start = this.startDate ? new Date(this.startDate) : null;
      const end = this.endDate ? new Date(this.endDate) : null;

      const dateMatch = (!start || dateAchat >= start) && (!end || dateAchat <= end);

      return nomMatch && numSerieMatch && statusMatch && dateMatch;
    });
  }


  getImageUrl(imagePath: string): string {
    return `${environment.apiUrl}${imagePath}`;
  }


  sortTable(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }

  viewDetails(eqId: number): void {
    this.equipementService.getEquipementById(eqId).subscribe({
      next: (eq) => {
        this.selectedEquipement = { ...eq }; // Clone the object to prevent unwanted changes
        this.showEditPanel = true;
        this.isEditing = false; // Ensure it's in view mode by default
      },
      error: (err) => {
        console.error('Error fetching user details:', err);
      }
    });
  }



  getEquipements(): void {
    const serviceId = Number(this.route.snapshot.paramMap.get('serviceId'));
    this.equipementService.getEquipementsByService(serviceId).subscribe((data: Equipement[]) => {
      console.log(this.equipements);
      this.equipements = data;
      this.filteredEquipements = data;

      // Vérifier si l'ID est défini avant de passer à la fonction
      data.forEach((equipement) => {
        if (equipement.id !== undefined) {
          this.getAttributsByEquipement(equipement.id); // Appeler la fonction uniquement si id est défini
        }
      });
    });
  }

  toggleView(mode: 'table' | 'card') {
    this.viewMode = mode;
  }


  getAttributsByEquipement(equipementId: number): void {
    this.equipementService.getAttributsByEquipement(equipementId).subscribe(
      (attributs: Map<string, string>) => {
        // Associe les attributs sous forme de Map à l'équipement correspondant
        this.equipementsAttributs[equipementId] = attributs;
        console.log(this.equipementsAttributs);
      },
      (error) => {
        console.error('Erreur lors de la récupération des attributs : ', error);
      }
    );
  }

  getAttributs(equipementId: number) {
    const attributs = this.equipementsAttributs[equipementId];

    // If it's an array of objects with a `nom` and a value, return it as key-value
    if (Array.isArray(attributs)) {
      return attributs.map(attr => ({ key: attr.nom, value: attr.valeur || '-' }));
    }

    if (typeof attributs === 'object' && !Array.isArray(attributs)) {
      return Object.entries(attributs).map(([key, value]) => ({ key, value }));
    }

    if (attributs instanceof Map) {
      return Array.from(attributs.entries()).map(([key, value]) => ({ key, value }));
    }

    return [];
  }
  enableEditingEquipment(): void {
    this.isEditing = true;
  }
  closeEquipmentPanel(): void {
    this.isEditing = false;
    this.showEditPanel=false;
    this.resetForm();
  }

  resetForm(): void {
    this.equipement = this.initEquipement();
    this.showForm = false;  // Hide the form after submission
  }

  private initEquipement(): Equipement {
    return {
      batimentId: 0,
      batimentNum: 0,
      etageId: 0,
      garantie: "",
      salleId: 0,
      sallePrefixe: "",
      serviceId: 0,
      typeEquipementId: 0,
      attributsEquipement: [],
      batimentNom: "", etageNum: 0, salleNum: 0,
      serviceNom: "",
      id: 0,
      image: '',
      nom: '',
      description: '',
      numeroSerie: '',
      modele: '',
      marque: '',
      statut: '',
      actif: false,  // Default value for 'actif'
      dateAchat: '',
      dateMiseEnService: '',
      dateDerniereMaintenance: '',
      coutAchat: 0,
      valeurSuivi:0,
      labelSuivi:'',
      typeEquipementNom: '',
      attributsValeurs: []  // Assuming this is an empty array initially

    }
  };

}
