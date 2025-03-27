import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {EquipementService} from "../../../services/equipement.service";
import {Equipement} from "../../../models/equipement";
import {ServiceService} from "../../../services/service.service";

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
  searchTermNum = '';
  searchTermNom = '';
  selectedStatus: string = '';
  sortColumn: string = '';
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

  sortTable(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
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

  getAttributs(equipementId: number) {
    const attributsMap = this.equipementsAttributs[equipementId];

    // Check if it's a plain object
    if (typeof attributsMap === 'object' && !Array.isArray(attributsMap)) {
      return Object.entries(attributsMap).map(([key, value]) => ({ key, value }));
    }

    // If it's a Map, you can use .entries()
    if (attributsMap instanceof Map) {
      return Array.from(attributsMap.entries()).map(([key, value]) => ({ key, value }));
    }

    return [];
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

  filterEquipementsByName() {
    this.filteredEquipements = this.equipements.filter(equipement =>
      equipement.nom.toLowerCase().includes(this.searchTermNom.toLowerCase())
    );
  }

  filterEquipementsByNumSerie() {
    this.filteredEquipements = this.equipements.filter(equipement =>
      equipement.numeroSerie && equipement.numeroSerie.toLowerCase().includes(this.searchTermNum.toLowerCase())
    );
  }

  filterEquipementsByStatus() {
    if (this.selectedStatus) {
      this.filteredEquipements = this.equipements.filter(e => e.statut === this.selectedStatus);
    } else {
      this.filteredEquipements = [...this.equipements]; // Réinitialiser si aucun statut sélectionné
    }
  }
}
