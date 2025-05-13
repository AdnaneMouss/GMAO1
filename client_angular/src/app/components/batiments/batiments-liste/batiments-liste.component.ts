import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Batiment } from '../../../models/batiment';
import { BatimentService } from '../../../services/batiment.service';
import { EtageService } from '../../../services/etage.service';
import {Service} from "../../../models/service";
import {Etage} from "../../../models/etage";
import {Salle} from "../../../models/salle";
import {SalleService} from "../../../services/salle.service";

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import {TypesEquipements} from "../../../models/types-equipements";

@Component({
  selector: 'app-batiments-liste',
  templateUrl: './batiments-liste.component.html',
  styleUrls: ['./batiments-liste.component.css']
})
export class BatimentsListeComponent implements OnInit {
  impossibleToArchive: boolean = false;
  batimentsActifs: Batiment[] = [];
  batimentsInActifs: Batiment[] = [];
  searchTermNom: string = '';
  isBulkRestored: boolean= false;
  isBulkArchived: boolean= false;
  bulkRestoreError: string | null = null;
  batimentTakenBulk: boolean = false;
  bulkMode: boolean = false;
  selectedBatimentIds: number[] = [];
  selectedBatimentToArchive: any = null;
  etages: any[] = [];
  selectedEtage: any | null = null;
  salles: any[] = [];
  filteredBatiments = [...this.batimentsActifs];
  errorMessage: string = '';
  batimentTaken: boolean=false;
  showForm: boolean = false;
  showEditForm: boolean = false;
  newBatiment: Batiment = {id:0, numBatiment: 1, intitule: '', etages: []};
  batimentUpdated: boolean = false;
  batimentAdded: boolean = false;
  selectedBatiment: any = {};
  isLoading: boolean = false;

  isRestored: boolean = false;
  isArchived: boolean = false;
  batIdToArchive: number | null | undefined;
  showTrash: boolean = false;
  showConfirmationModal: boolean = false;
  constructor(private router: Router, private batimentService: BatimentService, private etageService: EtageService, private salleService: SalleService) { }

  ngOnInit(): void {
    this.getInactifs();
    this.getActifs();
  }

  goToEtages(batimentId: number): void {
    this.router.navigate(['/batiment', batimentId, 'etages']);
  }

  getActifs(): void {
    this.batimentService.getAllBatiments().subscribe(data => {
      this.batimentsActifs = data;
      this.filteredBatiments = data;
    });
  }

  getInactifs(): void {
    this.batimentService.getBatimentsInactifs().subscribe(data => {
      this.batimentsInActifs = data;
    });
  }

  restaurerBatiment(id: number): void {
    this.batimentService.restaurerBatiment(id).subscribe(
      (response) => {
        console.log('Response from restaurer:', response);  // Check what comes from the backend
        this.isRestored = true;
        this.getInactifs();
        this.getActifs();
        this.showTrash = false;  // Close the trash modal after action
        this.resetForm();
        setTimeout(() => {
          this.isRestored = false;
        }, 3000);
      },
      (error) => {
        if (error.status != 200) {
          this.batimentTaken = true;
          this.errorMessage = 'Un bâtiment actif avec ce nom ou ce numéro existe déjà!';
        }
      }
    );
  }

  archiverBatiment(id: number): void {
    this.batimentService.archiverBatiment(id).subscribe(
      (response) => {
        console.log('Response from archiver:', response);  // Check what comes from the backend
        this.isArchived = true;  // Flag to show the type has been archived
        this.getActifs();
        this.getInactifs();
        this.showTrash = false;  // Close the trash modal after action

        setTimeout(() => {
          this.isArchived = false;
        }, 3000);  // Hide the success flag after 3 seconds
      },
      (error) => {
        if (error.status === 400) {
          this.impossibleToArchive = true;
          this.errorMessage = error.error.message || "Impossible d’archiver ce bâtiment.";
        } else {
          this.errorMessage = "Une erreur inattendue s'est produite. Veuillez réessayer.";
        }}
    );
  }


  restaurerSelection(): void {
    this.errorMessage='';
    if (this.selectedBatimentIds.length === 0) return;

    this.bulkRestoreError = null;
    this.batimentService.restaurerMultiple(this.selectedBatimentIds).subscribe(
      (response) => {
        this.isBulkRestored = true;
        this.getInactifs();
        this.getActifs();
        this.showTrash=false;
        this.resetForm();
        this.selectedBatimentIds = [];
        console.log("",this.isBulkRestored);
        setTimeout(() => {
          this.isBulkRestored = false;
        }, 3000);
      },
      (error) => {
        if (error.status != 200) {
          this.batimentTakenBulk = true;
          this.errorMessage = 'Un ou plusieurs bâtiments actifs portant les mêmes informations existent déjà!';
        }
      }
    );
  }

  archiverSelection(): void {
    if (this.selectedBatimentIds.length === 0) return;

    this.batimentService.archiverMultiple(this.selectedBatimentIds).subscribe(
      (response) => {
        console.log('Archive successful:', response);
        this.getInactifs();
        this.getActifs();
        this.selectedBatimentIds = [];  // Reset selected IDs after archiving
        this.showTrash = false;
        this.isBulkArchived = true;
        setTimeout(() => {
          this.isArchived = false;
        }, 3000);  // Hide the success flag after 3 seconds
      },
      (error) => {
        if (error.status === 400) {
          this.impossibleToArchive = true;
          this.errorMessage = error.error.message || "Impossible d’archiver ces bâtiments.";
        } else {
          this.errorMessage = "Une erreur inattendue s'est produite. Veuillez réessayer.";
        }
        }
    );
      }



  toggleBulkMode(): void {
    this.bulkMode = !this.bulkMode;
    if (!this.bulkMode) {
      this.selectedBatimentIds = [];
    }
  }


  isSelected(type: any): boolean {
    return this.selectedBatimentIds.includes(type.id);
  }

  toggleSelection(id: number): void {
    const index = this.selectedBatimentIds.indexOf(id);
    if (index > -1) {
      this.selectedBatimentIds.splice(index, 1);
    } else {
      this.selectedBatimentIds.push(id);
    }
  }

  selectAll() {
    this.selectedBatimentIds = this.batimentsInActifs.map(batiment => batiment.id);
  }

  resetSelection() {
    this.selectedBatimentIds = [];
  }


  toggleTrash() {
    this.showTrash = !this.showTrash;
    if (this.showTrash) {
      this.getInactifs();
    }
  }
  filterBatimentsByName(): void {
    this.filteredBatiments = this.batimentsActifs.filter(batiment =>
      batiment.intitule.toLowerCase().includes(this.searchTermNom.toLowerCase())
    );
  }

  resetForm(): void {
    this.newBatiment = {id:0, numBatiment: 0, intitule: '', etages: []};
    this.showForm = false;
    this.batimentAdded=false;
    this.batimentUpdated=false;
    this.batimentTaken = false;
    this.batimentTakenBulk = false;
  }

  addBatiment(): void {
    this.errorMessage = '';
    this.batimentService.createBatiment(this.newBatiment).subscribe(
      (savedBatiment: Batiment) => {
        console.log('Service ajouté avec succès:', savedBatiment);
        this.batimentsActifs.push(savedBatiment);
        this.filterBatimentsByName();
        this.batimentAdded=true;
        this.resetForm();
      },
      (error) => {
        console.error('Erreur lors de l\'ajout du batiment:', error);
        if (error.status != 200) {
          this.errorMessage = 'Un batiment avec ces informations existe déjà.';
        }
      }
    );
  }

  updateBatiment(): void {
    console.log('Sending to backend:', this.selectedBatiment);
    this.errorMessage = '';
    this.batimentTaken = false;

    // Sanity checks 🔒
    if (!this.selectedBatiment || this.selectedBatiment.id === undefined) {
      this.errorMessage = 'Aucun bâtiment sélectionné pour la mise à jour!';
      return;
    }

    if (!this.selectedBatiment.numBatiment || !this.selectedBatiment.intitule) {
      this.errorMessage = 'Tous les champs sont obligatoires.';
      return;
    }

    // API call 🔁
    this.batimentService.updateBatiment(this.selectedBatiment.id, this.selectedBatiment)
      .subscribe({
        next: (updatedBatiment) => {
          // Replace updated item in the actifs list 🛠️
          const index = this.batimentsActifs.findIndex(b => b.id === updatedBatiment.id);
          if (index !== -1) {
            this.batimentsActifs[index] = updatedBatiment;
          }

          // Reset UI and feedback 💫
          this.resetForm();
          this.getActifs();
          this.getInactifs();

          this.batimentUpdated = true;
          this.showEditForm = false;

          setTimeout(() => {
            this.batimentUpdated = false;
          }, 3000);
        },
        error: (error) => {
          if (error.status !=200) {
            this.batimentTaken = true;
            this.errorMessage = 'Un bâtiment avec les mêmes informations existe déjà.';
          } else {
            this.errorMessage = 'Échec de la mise à jour du bâtiment.';
          }
          console.error('Update failed:', error);
        }
      });
  }


  toggleForm(): void{
    this.resetForm();
    this.showEditForm=false;
    this.showForm=false;
  }

  editBatiment(bat: Batiment): void {
    this.selectedBatiment = { ...bat }; // Clone to avoid modifying original before saving
    this.showEditForm = true;
  }

  exportExcel(): void {
    const data: any[] = [];

    this.batimentsActifs.forEach((batiment) => {
      batiment.etages.forEach((etage, etageIndex) => {
        etage.salles.forEach((salle, salleIndex) => {
          data.push({
            'Nom Bâtiment': etageIndex === 0 && salleIndex === 0 ? batiment.intitule : '',
            'Numéro Étage': salleIndex === 0 ? etage.num : '',
            'Numéro Salle': salle.num
          });
        });


        if (etage.salles.length === 0) {
          data.push({
            'Nom Bâtiment': etageIndex === 0 ? batiment.intitule : '',
            'Numéro Étage': etage.num,
            'Numéro Salle': ''
          });
        }
      });


      if (batiment.etages.length === 0) {
        data.push({
          'Nom Bâtiment': batiment.intitule,
          'Numéro Étage': '',
          'Numéro Salle': ''
        });
      }
    });

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

    // Auto-width pour un affichage propre
    const wsCols = [
      { wch: 20 }, // Nom Bâtiment
      { wch: 15 }, // Numéro Étage
      { wch: 15 }  // Numéro Salle
    ];
    worksheet['!cols'] = wsCols;

    const workbook: XLSX.WorkBook = {
      Sheets: { 'Bâtiments': worksheet },
      SheetNames: ['Bâtiments']
    };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    saveAs(blob, 'Batiments.xlsx');
  }


}
