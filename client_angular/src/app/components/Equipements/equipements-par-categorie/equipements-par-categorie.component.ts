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
        this.serviceName = service.nom; // Assuming the API returns { nom: 'Service Name' }
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


  getEquipements() {
    const serviceId = this.route.snapshot.paramMap.get('serviceId');
    if (serviceId) {
      this.equipementService.getEquipementsByService(serviceId).subscribe(data => {
        this.equipements = data;
        this.filteredEquipements= this.equipements;
      });
    }
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
