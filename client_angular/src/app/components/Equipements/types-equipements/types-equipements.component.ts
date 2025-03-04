import { Component, OnInit } from '@angular/core';
import { TypesEquipementsService } from '../../../services/types-equipements.service';
import { TypesEquipements } from '../../../models/types-equipements';
import { AttributEquipements } from '../../../models/attribut-equipement';
import { AttributEquipementService } from '../../../services/attribut-equipement.service';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-types-equipements',
  templateUrl: './types-equipements.component.html',
  styleUrls: ['./types-equipements.component.css']
})
export class TypesEquipementsComponent implements OnInit {
  errorMessage: string = '';
  typesEquipements: TypesEquipements[] = [];
  searchTermNom = '';
  filteredTypes = [...this.typesEquipements];
  selectedTypeEquipement: TypesEquipements = { attributs: [], id: 0, image: "", type: "" };
  attributes: AttributEquipements[] = [];
  showAddForm: boolean = false;
  newAttribute: AttributEquipements = {
    obligatoire: true,
    actif: true, // Add actif here
    id: 0,
    nom: '',
    attributEquipementType: 'STRING',
    typeEquipement: { id: 0, type: '', image: '', attributs: [] }
  };

  newType: TypesEquipements = { id: 0, type: '', image: '', attributs: [] };
  showTypeForm: boolean = false;


  editingAttribute: AttributEquipements = { id: 0, obligatoire: true, actif: true, nom: '', attributEquipementType: 'STRING', typeEquipement: { id: 0, type: '', image: '', attributs: [] } };

  constructor(
    private typesEquipementsService: TypesEquipementsService,
    private attributEquipementService: AttributEquipementService
  ) {}

  ngOnInit(): void {
    this.getServices();
  }

  getServices(): void {
    this.typesEquipementsService.getTypesEquipements().subscribe(data => {
      this.typesEquipements = data;
      this.filteredTypes = data;
    });
  }

  addNewType(): void {
    this.errorMessage='';
    if (this.newType.type.trim()) {
      this.typesEquipementsService.createType(this.newType).subscribe(
        (data) => {
          this.typesEquipements.push(data);
          this.filteredTypes = [...this.typesEquipements];
          this.newType = { id: 0, type: '', image: '', attributs: [] };
          this.showTypeForm = false;
        },
        (error) => {
          console.error('Erreur lors de l\'ajout du type d\'équipement :', error);
          if (error.status != 200) {
            this.errorMessage = 'Un type avec le même nom existe.';
          }
        }
      );
    } else {
      console.error('Le nom du type d\'équipement est requis');
    }
  }


  filterByType(): void {
    this.filteredTypes = this.typesEquipements.filter(type =>
      type.type.toLowerCase().includes(this.searchTermNom.toLowerCase())
    );
  }

  getAttributes(typeId: number): void {
    if (typeId) {
      this.typesEquipementsService.getAttributesByTypeId(typeId).subscribe(data => {
        this.attributes = data;
        this.selectedTypeEquipement = this.typesEquipements.find(type => type.id === typeId) || { attributs: [], id: 0, image: "", type: "" };
      });
    } else {
      console.error('Invalid typeId:', typeId);
    }
  }

  closeAttributesPanel(): void {
    this.selectedTypeEquipement = { attributs: [], id: 0, image: "", type: "" };
    this.attributes = [];
  }

  addNewAttribute(): void {
    this.errorMessage = '';

    if (this.selectedTypeEquipement.id && this.newAttribute.nom && this.newAttribute.attributEquipementType) {
      this.newAttribute.typeEquipement = this.selectedTypeEquipement;

      this.attributEquipementService.createAttributEquipement(this.newAttribute).subscribe(
        (data) => {
          this.attributes.push(data);
          this.selectedTypeEquipement.attributs.push(data);

          // Reset the form but keep it reactive
          this.newAttribute = { obligatoire: true, actif: true, id: 0, nom: '', attributEquipementType: 'STRING', typeEquipement: { id: 0, type: '', image: '', attributs: [] } };
        },
        (error) => {
          console.error('Erreur lors de l\'ajout du type d\'équipement :', error);

          // Prevent page reload and show error message dynamically
          if (error.status !== 200) {
            this.errorMessage = 'Un attribut avec le même nom existe.';
          }
        }
      );
    } else {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires.';
      console.error('Invalid attribute data');
    }
  }


  // Handle editing an attribute
  editAttribute(attribute: AttributEquipements): void {
    this.editingAttribute = { ...attribute };
  }

// For closing the edit panel when done
  closeEditPanel(): void {
    this.editingAttribute = { id: 0, obligatoire: true, actif: true, nom: '', attributEquipementType: 'STRING', typeEquipement: { id: 0, type: '', image: '', attributs: [] } };
  }


// Handle form submission for modifying an attribute
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
          const typeIndex = this.typesEquipements.findIndex(type => type.id === this.selectedTypeEquipement.id);
          if (typeIndex !== -1) {
            const type = this.typesEquipements[typeIndex];
            const attrIndex = type.attributs.findIndex(attr => attr.id === data.id);
            if (attrIndex !== -1) {
              type.attributs[attrIndex] = data;
            }
          }

          // Clear the editing form after update
          this.editingAttribute = { id: 0, obligatoire: true, actif: true, nom: '', attributEquipementType: 'STRING', typeEquipement: { id: 0, type: '', image: '', attributs: [] } };
        },
        error => {
          console.error('Error updating attribute:', error);

          // Check if the error is related to a duplicate name
          if (error.status!=200) {
            this.errorMessage = 'Un attribut avec ce nom existe déjà.';
          }
        }
      );
    } else {
      console.error('Invalid attribute data');
      this.errorMessage = 'Données invalides.';
    }
  }

  // Convert the attribute type to a human-readable label
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

this.typesEquipements.forEach((type) => {
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
