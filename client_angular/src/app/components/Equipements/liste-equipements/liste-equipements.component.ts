import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
//@ts-ignore
import { saveAs } from 'file-saver';
import { EquipementService } from '../../../services/equipement.service';
import { FormsModule } from '@angular/forms';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { Equipement } from '../../../models/equipement';
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
import {AttributEquipements} from "../../../models/attribut-equipement";
import {TypesEquipements} from "../../../models/types-equipements";
import {TypesEquipementsService} from "../../../services/types-equipements.service";
import {environment} from "../../../../environments/environment";
import {Etage} from "../../../models/etage";
import {Salle} from "../../../models/salle";
import {Batiment} from "../../../models/batiment";
import {User} from "../../../models/user";

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
  // Existing variables
  currentPage: number = 1;
  itemsPerPage: number = 5;  // You can change this number
  showForm: boolean = false;
  startDate: string = '';
  endDate: string = '';
  viewMode: 'table' | 'card' = 'table'; // default to table
  selectionModeOn: boolean = false;
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
  errorMessage: string = '';
  selectedType: TypesEquipements | null = null;
  selectedTypeId: number | null = null;
  typesEquipements: TypesEquipements[] = [];
  attributes: AttributEquipements[] = [];
  statuts = [
    { label: 'En service', value: 'En service' },
    { label: 'En panne', value: 'En panne' },
    { label: 'Hors service', value: 'Hors service' },
    { label: 'En maintenance', value: 'En maintenance' }
  ];
  selectedEquipement: Equipement | null = null; // Store selected user details
  showEditPanel: boolean = false;
  isEditing: boolean = false;
  equipementsAttributs: { [key: number]: Map<string, string> } = {};

  constructor(
    private equipementService: EquipementService,
    private typesEquipementsService: TypesEquipementsService
  ) {}


  ngOnInit(): void {
    this.getEquipements();
    this.getTypesEquipements(); // Fetch Types Equipements on component initialization
    this.filteredEquipements = this.getEquipementsForPage();
  }


  toggleView(mode: 'table' | 'card') {
    this.viewMode = mode;
    this.selectionModeOn = this.viewMode != "table";
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

  filterByPurchaseDate() {
    this.filteredEquipements = this.equipements.filter(e => {
      const purchaseDate = new Date(e.dateAchat);
      const from = this.startDate ? new Date(this.startDate) : null;
      const to = this.endDate ? new Date(this.endDate) : null;

      return (!from || purchaseDate >= from) && (!to || purchaseDate <= to);
    });
  }

  enableEditingEquipment(): void {
    this.isEditing = true;
  }
  closeEquipmentPanel(): void {
    this.isEditing = false;
    this.showEditPanel=false;
    this.resetForm();
  }


  getEquipements(): void {
    this.equipementService.getAllEquipements().subscribe((data: Equipement[]) => {
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

  getImageUrl(imagePath: string): string {
    return `${environment.apiUrl}${imagePath}`;
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


  getEquipementsForPage(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.equipements.slice(startIndex, endIndex);
  }

  nextPage(): void {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
      this.filteredEquipements = this.getEquipementsForPage();
    }
  }

  // Function to go to the previous page
  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.filteredEquipements = this.getEquipementsForPage();
    }
  }

  // Get the total number of pages
  getTotalPages(): number {
    return Math.ceil(this.equipements.length / this.itemsPerPage);
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




  saveEquipement(): void {
    this.errorMessage = '';
    this.equipementService.createEquipement(this.equipement).subscribe(
      (savedEquipement: Equipement) => {
        this.getEquipements();
        this.resetForm();
        this.message = 'Équipement ajouté avec succès!';
      },
      (error) => {
        console.error('Erreur lors de l\'ajout du service:', error);
        if (error.status != 200) {
          this.errorMessage = 'Cet équipement exsite déjà. Veuillez en choisir un autre.';
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
      typeEquipement: '',
      attributsValeurs: []  // Assuming this is an empty array initially

      }
    };






  getTypesEquipements(): void {
    this.typesEquipementsService.getActifs().subscribe((data: TypesEquipements[]) => {
      this.typesEquipements = data;
    });
  }

  onTypeSelect(typeId: number | null): void {
    if (typeId !== null) {
      this.typesEquipementsService.getAttributesByTypeId(typeId).subscribe((attributes) => {
        this.attributes = attributes;
        this.selectedType = this.typesEquipements.find(type => type.id === typeId) || null;
      });
    } else {
      this.selectedType = null; // Explicitly set to null if no type is selected
    }
  }




  // Helper method to dynamically generate input fields based on attribute type
  getInputType(attribute: AttributEquipements): string {
    switch (attribute.attributEquipementType) {
      case 'STRING': return 'text';
      case 'NUMBER': return 'number';
      case 'DATE': return 'date';
      case 'BOOLEAN': return 'checkbox';
      case 'FLOAT': return 'number';
      case 'ENUM': return 'select'; // For ENUM, you'll need to handle this specially based on values
      case 'LONGTEXT': return 'textarea';
      default: return 'text';
    }
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
      'Statut': equipement.statut,
      'Date Achat': equipement.dateAchat,
      'Date Mise en Service': equipement.dateMiseEnService,
      'Date Dernière Maintenance': equipement.dateDerniereMaintenance,
      'Coût Achat (€)': equipement.coutAchat,
    };


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
