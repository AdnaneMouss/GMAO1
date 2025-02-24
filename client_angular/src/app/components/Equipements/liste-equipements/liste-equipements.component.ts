import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
//@ts-ignore
import { saveAs } from 'file-saver';
import { EquipementService } from '../../../services/equipement.service';
import { FormsModule } from '@angular/forms';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { Equipement, Attribut } from '../../../models/equipement';
import { PanelModule } from "primeng/panel";
import { CardModule } from "primeng/card";
import { DropdownModule } from "primeng/dropdown";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { MatFormField } from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { MatOption } from "@angular/material/autocomplete";
import { MatSelect } from "@angular/material/select";
import { MatTable } from "@angular/material/table";
import { MatCard, MatCardContent, MatCardHeader } from "@angular/material/card";
import {Router, RouterLink} from "@angular/router";
import {Service} from "../../../models/service";

@Component({
  selector: 'app-liste-equipements',
  templateUrl: './liste-equipements.component.html',
  imports: [
    FormsModule,
    NgForOf,
    PanelModule,
    CardModule,
    DropdownModule,
    ButtonModule,
    InputTextModule,
    MatFormField,
    MatIcon,
    MatOption,
    MatSelect,
    NgClass,
    MatTable,
    MatCard,
    MatCardHeader,
    MatCardContent,
    NgIf,
    RouterLink,
  ],
  standalone: true,
  styleUrl: './liste-equipements.component.css'
})
export class ListeEquipementsComponent implements OnInit {

  // Add this variable to control form visibility
  showForm: boolean = false;
  equipement: Equipement = this.initEquipement();
  equipements: Equipement[] = [];
  filteredEquipements = [...this.equipements];
  message: string = '';
  isSortedAZ: boolean = true;
  searchTermNum = '';
  searchTermNom = '';
  // Sorting
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  selectedStatus: string = '';

  // Dropdown options for 'statut'
  statuts = [
    { label: 'En service', value: 'En service' },
    { label: 'En panne', value: 'En panne' },
    { label: 'Hors service', value: 'Hors service' },
    { label: 'En maintenance', value: 'En maintenance' }
  ];

  constructor(private equipementService: EquipementService, private router: Router) {}

  ngOnInit(): void {
    this.getEquipements();
  }

  getEquipements(): void {
    this.equipementService.getAllEquipements().subscribe((data: Equipement[]) => {
      this.equipements = data;
      this.filteredEquipements=data;
    });
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


  addAttribut() {
    if (!this.equipement.attributs) {
      this.equipement.attributs = [];
    }
    const existingAttributes = this.equipement.attributs.map(attr => attr.nom.toLowerCase());
    if (existingAttributes.includes('marque') || existingAttributes.includes('modèle')) {
      alert("L'attribut existe déjà !");
      return;
    }
    this.equipement.attributs.push({ nom: '', valeur: '' });
  }


  saveEquipement(): void {
    if (this.equipement.attributs.some(attr => !attr.nom || !attr.valeur)) {
      this.message = 'Erreur : Tous les attributs doivent être remplis.';
      return;
    }

    this.equipementService.createEquipement(this.equipement).subscribe(
      (savedEquipement: Equipement) => {
        this.getEquipements();
        this.resetForm();
        this.message = 'Équipement ajouté avec succès!';
      },
      (error) => {
        if (error.error && error.error.message.includes('Numéro de série déjà utilisé')) {
          this.message = 'Erreur : Ce numéro de série est déjà utilisé par un autre équipement.';
        } else {
          this.message = 'Erreur lors de l\'ajout de l\'équipement. Veuillez réessayer.';
        }
      }
    );
  }

  editEquipement(equipement: Equipement): void {
    this.equipement = { ...equipement };
  }

  resetForm(): void {
    this.equipement = this.initEquipement();
    this.showForm = false;  // Hide the form after submission
  }

  // Initialize an empty equipment object
  private initEquipement(): Equipement {
    return {
      id: 0,
      image: '',
      nom: '',
      description: '',
      numeroSerie: '',
      modele: '',
      marque: '',
      localisation: '',
      statut: '',
      dateAchat: '',
      dateMiseEnService: '',
      garantie: '',
      dateDerniereMaintenance: '',
      frequenceMaintenance: '',
      historiquePannes: '',
      coutAchat: '',
      attributs: [],
      service: { id: 0, nom: '', description: '', image: '' } // Ensure this matches your Service model structure
    };
  }


  // Toggle form visibility
  toggleForm(): void {
    this.showForm = !this.showForm;
  }

  // Sort the equipment list
  sortTable(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }




exportToExcel(): void {
  // Extract all unique attribute names dynamically
  const allAttributes = new Set<string>();
  this.equipements.forEach(equipement => {
    equipement.attributs.forEach(attr => allAttributes.add(attr.nom));
  });

  const attributeList = Array.from(allAttributes); // Convert Set to Array

  // Create data with separate attribute columns
  const worksheetData = this.equipements.map(equipement => {
    const rowData: any = {
      'ID': equipement.id,
      'Nom': equipement.nom,
      'Description': equipement.description,
      'Numéro de Série': equipement.numeroSerie,
      'Modèle': equipement.modele,
      'Marque': equipement.marque,
      'Localisation': equipement.localisation,
      'Statut': equipement.statut,
      'Date Achat': equipement.dateAchat,
      'Date Mise en Service': equipement.dateMiseEnService,
      'Garantie': equipement.garantie,
      'Date Dernière Maintenance': equipement.dateDerniereMaintenance,
      'Fréquence Maintenance': equipement.frequenceMaintenance,
      'Historique Pannes': equipement.historiquePannes,
      'Coût Achat (€)': equipement.coutAchat,
    };

    // Add separate columns for each attribute
    attributeList.forEach(attrName => {
      const attribute = equipement.attributs.find(attr => attr.nom === attrName);
      rowData[attrName] = attribute ? attribute.valeur : ''; // Assign value or empty if missing
    });

    return rowData;
  });

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);

  // Define header styles (dark green background, white bold text)
  const headerStyle = {
    font: { bold: true, color: { rgb: 'FFFFFF' } },
    fill: { fgColor: { rgb: '2E7D32' } }, // Dark Green
    alignment: { horizontal: 'center', vertical: 'center' },
    border: {
      top: { style: 'thin', color: { rgb: '000000' } },
      bottom: { style: 'thin', color: { rgb: '000000' } }
    }
  };

  // Define alternate row colors
  const evenRowStyle = { fill: { fgColor: { rgb: 'E8F5E9' } } }; // Light Green
  const oddRowStyle = { fill: { fgColor: { rgb: 'C8E6C9' } } }; // Slightly Darker Green

  // Define border style for all cells
  const borderStyle = {
    border: {
      top: { style: 'thin', color: { rgb: '000000' } },
      bottom: { style: 'thin', color: { rgb: '000000' } },
      left: { style: 'thin', color: { rgb: '000000' } },
      right: { style: 'thin', color: { rgb: '000000' } }
    }
  };

  // Get range of the sheet
  const range = XLSX.utils.decode_range(worksheet['!ref'] || '');

  // Apply styles
  for (let col = range.s.c; col <= range.e.c; col++) {
  const headerCell = XLSX.utils.encode_cell({ r: 0, c: col });
  if (worksheet[headerCell]) {
    worksheet[headerCell].s = headerStyle;
  }
}

// Apply styles to each row (alternating colors)
for (let row = 1; row <= range.e.r; row++) {
  for (let col = range.s.c; col <= range.e.c; col++) {
    const cell = XLSX.utils.encode_cell({ r: row, c: col });
    if (worksheet[cell]) {
      worksheet[cell].s = {
        ...borderStyle,
        ...(row % 2 === 0 ? evenRowStyle : oddRowStyle)
      };
    }
  }
}

// Adjust column widths
worksheet['!cols'] = [
  { wch: 5 },  // ID
  { wch: 20 }, // Nom
  { wch: 30 }, // Description
  { wch: 15 }, // Numéro de Série
  { wch: 15 }, // Modèle
  { wch: 15 }, // Marque
  { wch: 20 }, // Localisation
  { wch: 15 }, // Statut
  { wch: 15 }, // Date Achat
  { wch: 20 }, // Date Mise en Service
  { wch: 15 }, // Garantie
  { wch: 20 }, // Date Dernière Maintenance
  { wch: 20 }, // Fréquence Maintenance
  { wch: 25 }, // Historique Pannes
  { wch: 15 }, // Coût Achat (€)
  ...attributeList.map(() => ({ wch: 20 })) // Dynamic widths for attributes
];

const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, 'Equipements');

const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
saveAs(data, 'equipements_professionnel.xlsx');
}

}
