import { Component, OnInit } from '@angular/core';
import { TypesEquipementsService } from '../../../services/types-equipements.service';
import { TypesEquipements } from '../../../models/types-equipements';
import { AttributEquipements } from '../../../models/attribut-equipement';
import { AttributEquipementService } from '../../../services/attribut-equipement.service';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-types-equipements',
  templateUrl: './types-equipements.component.html',
  styleUrls: ['./types-equipements.component.css']
})
export class TypesEquipementsComponent implements OnInit {
  errorMessage: string = '';
  typesEquipementsActifs: TypesEquipements[] = [];
  typesEquipementsInactifs: TypesEquipements[] = [];
  searchTermNom = '';
  typeIdToArchive: number | null | undefined;
  showTrash: boolean = false;
  selectionModeOn: boolean = true;
  bulkMode = false;
  selectedTypeIds: number[] = [];
  bulkRestoreError: string | null = null;
  isBulkRestored: boolean = false;
  isBulkArchived: boolean = false;
  typeTakenBulk: boolean = false;
  viewMode: 'table' | 'card' = 'card'; // default to table

  showConfirmationModal: boolean = false;
  showToolTip: boolean = false;
  filteredTypes = [...this.typesEquipementsActifs];
  attributes: AttributEquipements[] = [];
  showAddForm: boolean = false;
  isRestored: boolean = false;
  isArchived: boolean = false;
  showTooltip: boolean = false;
  impossibleToArchive: boolean = false;
  newAttribute: AttributEquipements = {
    obligatoire: true,
    actif: true, // Add actif here
    id: 0,
    nom: '',
    attributEquipementType: 'STRING',
    typeEquipement: {} as TypesEquipements,
  };
  isLoading: boolean = true;
  newType: TypesEquipements = { id: 0, type: '', image: '',actif: true, attributs: [] };
  showEditTypeForm: boolean = false;
  showAddTypeForm: boolean = false;
  selectedType: any = {};
  typeTaken: boolean = false;
  attributTaken: boolean = false;
  attributeAdded: boolean = false;
  attributeUpdated: boolean = false;
  selectedTypeToArchive: any = null;
  typeAdded: boolean = false;
  typeUpdated: boolean = false;
  editingAttribute: AttributEquipements = { id: 0, obligatoire: true, actif: true, nom: '', attributEquipementType: 'STRING', typeEquipement: { id: 0, type: '', image: '',actif: true, attributs: [] } };
  selectedFile: File | null = null;
  showAttributesPanel = false;
  imageError: string = '';
  constructor(
    private typesEquipementsService: TypesEquipementsService,
    private attributEquipementService: AttributEquipementService
  ) {}

  ngOnInit(): void {
    this.getActifTypes();
    this.getInactifTypes();
  }

  resetForm(): void {
    this.newType = {attributs: [], id: 0, type: '', image: '', actif: true};
    this.selectedType = null;
    this.selectedFile = null;
    this.typeTaken=false;
    this.typeTakenBulk=false;
    this.imageError='';
  }


  toggleView(mode: 'table' | 'card') {
    this.viewMode = mode;
    this.selectionModeOn = this.viewMode != "table";
  }

  getImageUrl(imagePath: string): string {
    return `${environment.apiUrl}${imagePath}`;  // Use the apiUrl dynamically
  }

  getActifTypes(): void {
    this.typesEquipementsService.getActifs().subscribe(data => {
      this.typesEquipementsActifs = data;
      this.filteredTypes = data;
    });
  }

  getInactifTypes(): void {
    this.typesEquipementsService.getInactifs().subscribe(data => {
      this.typesEquipementsInactifs = data;
    });
  }

  restaurerType(id: number): void {
    this.errorMessage='';
    this.typesEquipementsService.restaurer(id).subscribe(
      (response) => {
        console.log('Response from restaurer:', response);  // Check what comes from the backend
        this.isRestored = true;
        this.getInactifTypes();
        this.getActifTypes();
        this.showTrash = false;  // Close the trash modal after action
        this.resetForm();
        setTimeout(() => {
          this.isRestored = false;
        }, 3000);
      },
      (error) => {
        if (error.status != 200) {
        this.typeTaken = true;
        this.errorMessage = 'Un type actif avec ce nom existe déjà!';
      }
      }
    );
  }

  restaurerSelection(): void {
    this.errorMessage='';
    if (this.selectedTypeIds.length === 0) return;

    this.bulkRestoreError = null;
    this.typesEquipementsService.restaurerMultiple(this.selectedTypeIds).subscribe(
      (response) => {
        this.isBulkRestored = true;
        this.getInactifTypes();
        this.getActifTypes();
        this.showTrash=false;
        this.resetForm();
        this.selectedTypeIds = [];
        console.log("",this.isBulkRestored);
        setTimeout(() => {
          this.isBulkRestored = false;
        }, 3000);
      },
      (error) => {
        if (error.status != 200) {
          this.typeTakenBulk = true;
          this.errorMessage = 'Un ou plusieurs types actifs portant les mêmes noms existent déjà!';
        }
      }
    );
  }

  archiverSelection(): void {
    if (this.selectedTypeIds.length === 0) return;

    this.typesEquipementsService.archiverMultiple(this.selectedTypeIds).subscribe(
      (response: any) => {
        this.getInactifTypes();
        this.getActifTypes();
        this.selectedTypeIds = [];
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
      this.selectedTypeIds = [];
    }
  }


  isSelected(type: any): boolean {
    return this.selectedTypeIds.includes(type.id);
  }

  toggleSelection(id: number): void {
    const index = this.selectedTypeIds.indexOf(id);
    if (index > -1) {
      this.selectedTypeIds.splice(index, 1);
    } else {
      this.selectedTypeIds.push(id);
    }
  }

  selectAll() {
    this.selectedTypeIds = this.typesEquipementsInactifs.map(type => type.id);
  }

  resetSelection() {
    this.selectedTypeIds = [];
  }


  archiverType(id: number): void {
    this.typesEquipementsService.archiver(id).subscribe(
      (response) => {
        console.log('Response from archiver:', response);
        this.isArchived = true;
        this.errorMessage = ''; // Clear previous errors

        this.getInactifTypes();
        this.getActifTypes();
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
      this.getInactifTypes();
    }
    this.resetForm();
  }

  addNewType(): void {
    this.errorMessage = '';

    // Check if the type name is valid
    if (!this.newType.type.trim()) {
      this.errorMessage = "Le nom du type d'équipement est requis";
      return;
    }

    // Block the request if there's an image error
    if (this.imageError) {
      this.errorMessage = 'Veuillez sélectionner une image valide avant d\'ajouter le type d\'équipement.';
      return;
    }

    const typeData: any = {
      type: this.newType.type
    };

    // If a file is selected, include it in the request; otherwise, set it to undefined
    const fileToSend = this.selectedFile === null ? undefined : this.selectedFile;

    // Include the file if it's available
    if (fileToSend) {
      typeData.file = fileToSend;
    } else {
      typeData.file = undefined; // You can choose to set it to undefined or omit it, depending on backend requirements.
    }

    // Perform the HTTP request
    this.isLoading = true; // Show loading spinner while making the request
    this.typesEquipementsService.createType(typeData).subscribe(
      (data) => {
        this.typesEquipementsActifs.push(data);
        this.typesEquipementsInactifs.push(data);
        this.filteredTypes = [...this.typesEquipementsActifs];
        this.typeAdded = true;
        this.showAddTypeForm = false;
        this.resetForm();
        // Hide the success message after 3 seconds
        setTimeout(() => {
          this.typeAdded = false;
        }, 3000);

        this.isLoading = false;  // Stop loading after success
      },
      (error) => {
        if (error.status != 200) {
          this.typeTaken = true;
          this.errorMessage = 'Un type avec le même nom existe.';
        } else {
          this.errorMessage = 'Échec de l\'ajout du type d\'équipement.';
        }
        this.isLoading = false;  // Stop loading on error
      }
    );
  }



  updateType(): void {
    if (!this.selectedType || this.selectedType.id === undefined) {
      this.errorMessage = 'Aucun type sélectionné pour la mise à jour!';
      return;
    }

    if (!this.selectedType.type) {
      this.errorMessage = 'Le nom du type est obligatoire';
      return;
    }

    // Block update if there's an image error
    if (this.imageError) {
      this.errorMessage = 'Veuillez sélectionner une image valide avant de mettre à jour le type d\'équipement.';
      return;
    }

    const fileToSend = this.selectedFile === null ? undefined : this.selectedFile;

    this.isLoading = true;  // Show loading spinner while making the request
    this.typesEquipementsService.updateType(this.selectedType.id, this.selectedType, fileToSend)
      .subscribe(
        (updatedService) => {
          const index = this.typesEquipementsActifs.findIndex(type => type.id === updatedService.id);
          if (index !== -1) {
            this.typesEquipementsActifs[index] = updatedService;
          }
          this.resetForm();
          this.getInactifTypes();
          this.getActifTypes();

          // Show the success message
          this.typeUpdated = true;
          this.showEditTypeForm = false;

          // Hide the success message after 3 seconds
          setTimeout(() => {
            this.typeUpdated = false;
          }, 3000);

          this.isLoading = false;  // Stop loading after success
        },
        (error) => {
          // Check for 409 Conflict error and set the specific message
          if (error.status === 409) {
            this.typeTaken = true;
            this.errorMessage = 'Un type avec le même nom existe.';
          } else {
            this.errorMessage = 'Échec de la mise à jour du type d\'équipement.';
          }
          this.isLoading = false;  // Stop loading on error
        }
      );
  }

// Handle file selection for updates
  onFileSelected(event: Event): void {
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

      this.imageError = ''; // Aucune erreur
      this.selectedFile = file;
    }
  }

// Open the edit form and prefill fields
  editType(type: TypesEquipements): void {
    this.selectedType = { ...type }; // Clone to avoid modifying original before saving
    this.showEditTypeForm = true;
  }



  filterByType(): void {
    this.filteredTypes = this.typesEquipementsActifs.filter(type =>
      type.type.toLowerCase().includes(this.searchTermNom.toLowerCase())
    );
  }

  getAttributes(typeId: number): void {
    if (typeId) {
      this.typesEquipementsService.getAttributesByTypeId(typeId).subscribe(data => {
        this.attributes = data;
        this.selectedType = this.typesEquipementsActifs.find(type => type.id === typeId) || { attributs: [], id: 0, image: "", type: "" };
        this.showAttributesPanel=true;
      });
    } else {
      console.error('Invalid typeId:', typeId);
    }
  }

  closeAttributesPanel(): void {
    this.selectedType = { attributs: [], id: 0, image: "", type: "" };
    this.attributes = [];
    this.showAddTypeForm = false;
    this.showAttributesPanel = false;
    this.attributTaken = false;
  }

  addNewAttribute(): void {
    this.errorMessage = '';

    if (this.selectedType.id && this.newAttribute.nom && this.newAttribute.attributEquipementType) {
      this.newAttribute.typeEquipement = this.selectedType;

      this.attributEquipementService.createAttributEquipement(this.newAttribute).subscribe(
        (data) => {
          this.attributes.push(data);
          this.selectedType.attributs.push(data);

          // Reset the form but keep it reactive
          this.newAttribute = { obligatoire: true, actif: true, id: 0, nom: '', attributEquipementType: 'STRING', typeEquipement: { id: 0, type: '', image: '', actif: true, attributs: [] } };
          this.attributeAdded = true;

          // Hide the success message after 3 seconds
          setTimeout(() => {
            this.attributeAdded = false;
          }, 3000);

          this.isLoading = false;  // Stop loading after success
        },

        (error) => {
          console.error('Erreur lors de l\'ajout du type d\'équipement :', error);

          // Prevent page reload and show error message dynamically
          if (error.status !== 200) {
            this.attributTaken = true;
            this.errorMessage = 'Un attribut avec le même nom existe.';
          }
        }
      );
    } else {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires.';
      console.error('Invalid attribute data');
    }
  }
  updateAttribute(): void {
    this.errorMessage = '';
    if (this.editingAttribute.id) {
      this.attributEquipementService.updateAttributEquipement(this.editingAttribute.id, this.editingAttribute).subscribe(
        data => {
          // Update the attributes list with the modified attribute
          const index = this.attributes.findIndex(attr => attr.id === data.id);
          if (index !== -1) {
            this.attributes[index] = data;
          }

          // Update the selected type's attributes as well
          const typeIndex = this.typesEquipementsActifs.findIndex(type => type.id === this.selectedType.id);
          if (typeIndex !== -1) {
            const type = this.typesEquipementsActifs[typeIndex];
            const attrIndex = type.attributs.findIndex(attr => attr.id === data.id);
            if (attrIndex !== -1) {
              type.attributs[attrIndex] = data;
            }
          }

          // Clear the editing form after update
          this.editingAttribute = {
            id: 0,
            obligatoire: true,
            actif: true,
            nom: '',
            attributEquipementType: 'STRING',
            typeEquipement: {id: 0, type: '', image: '', actif: true, attributs: []}
          };
          this.attributeUpdated = true;

          // Hide the success message after 3 seconds
          setTimeout(() => {
              this.attributeUpdated = false;
            }, 3000
          );
        },
        error => {
          console.error('Error updating attribute:', error);

          if (error.status !== 200) {
            this.attributTaken = true;
            this.errorMessage = 'Un attribut avec le même nom existe.';
          }
        }
      );
    } else {
      console.error('Invalid attribute data');
      this.errorMessage = 'Données invalides.';
    }
  }


  // Handle editing an attribute
  editAttribute(attribute: AttributEquipements): void {
    this.editingAttribute = { ...attribute };
    this.showAttributesPanel=false;
  }

// For closing the edit panel when done
  closeEditPanel(): void {
    this.editingAttribute = { id: 0, obligatoire: true, actif: true, nom: '', attributEquipementType: 'STRING', typeEquipement: { id: 0, type: '', image: '',actif: true, attributs: [] } };
    this.attributTaken=false;
  }

  toggleForm(): void {
    this.showAddForm = false;
    this.showEditTypeForm = false;
    this.showAddTypeForm = false;
    this.showAttributesPanel = false;
    this.resetForm();
  }


  getAttributeTypeLabel(type: string): string {
    switch (type) {
      case 'STRING': return 'Chaîne de caractères';
      case 'NUMBER': return 'Nombre';
      case 'DATE': return 'Date';
      case 'BOOLEAN': return 'Booléen (Vrai/Faux)';
      case 'FLOAT': return 'Nombre à virgule flottante';
      case 'ENUM': return 'Liste de valeurs';
      case 'LONGTEXT': return 'Texte long';
      default: return 'Type inconnu';
    }
  }

exportExcel(): void {
  const data: any[] = [];

this.typesEquipementsActifs.forEach((type) => {
  type.attributs.forEach((attr, index) => {
    data.push({
      'ID Type': index === 0 ? type.id : '',  // Only show for first row
      'Nom Type': index === 0 ? type.type : '', // Avoid redundant repetition
      'Attributs': attr.nom,
      'Type d’Attribut': this.getAttributeTypeLabel(attr.attributEquipementType),
      'Obligatoire?': attr.obligatoire ? 'Oui' : 'Non',
      'Actif?': attr.actif ? 'Oui' : 'Non'
    });
  });
});

const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

// Auto-width for better readability
const wsCols = [
  { wch: 10 }, // ID Type
  { wch: 20 }, // Nom Type
  { wch: 20 }, // Attribut
  { wch: 20 }, // Type d’Attribut
  { wch: 10 }, // Obligatoire
  { wch: 10 }  // Actif
];
worksheet['!cols'] = wsCols;

const workbook: XLSX.WorkBook = { Sheets: { 'Types d\'équipements': worksheet }, SheetNames: ['Types d\'équipements'] };
const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
saveAs(blob, 'Types_Equipements.xlsx');
}


}
