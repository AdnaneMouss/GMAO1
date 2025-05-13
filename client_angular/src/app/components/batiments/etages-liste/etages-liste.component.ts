import { Etage } from "../../../models/etage";
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EtageService } from "../../../services/etage.service";
import { BatimentService } from "../../../services/batiment.service";
import {Batiment} from "../../../models/batiment";

@Component({
  selector: 'app-etages-liste',
  templateUrl: './etages-liste.component.html',
  styleUrls: ['./etages-liste.component.css']
})
export class EtagesListeComponent implements OnInit {
  etages: Etage[] = [];
  batimentId!: number;
  selectedBatiment: any = {};
  newEtage: Partial<Etage> = { id: 0, num: 0 };
  showEtageForm: boolean = false;
  errorMessage: string = '';
  isBulkRestored: boolean= false;
  isBulkArchived: boolean= false;
  bulkRestoreError: string | null = null;
  etageTakenBulk: boolean = false;
  bulkMode: boolean = false;
  selectedEtageIds: any = {};
  selectedEtageToArchive: any = null;
  etagesInactifs: Etage[] = [];
  etagesActifs: Etage[] = [];
  showEditForm: boolean = false;
  selectedEtage: any = {};
  isRestored: boolean = false;
  isArchived: boolean = false;
  showTrash: boolean = false;
  showConfirmationModal: boolean = false;
  etageAdded: boolean = false;
  etageUpdated: boolean = false;
  impossibleToArchive: boolean = false;
  etageTaken: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private etageService: EtageService,
    private batimentService: BatimentService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.batimentId = +this.route.snapshot.paramMap.get('id')!;
    this.getActifs();
    this.getInactifs();

    this.batimentService.getBatimentById(this.batimentId).subscribe({
      next: (bat) => {
        console.log('Batiment reçu :', bat);
        this.selectedBatiment = bat; // ✅ Fix: assign directly, no spread
      },
      error: (err) => {
        console.error('Erreur lors du chargement du bâtiment :', err);
      }
    });
  }

  toggleTrash() {
    this.showTrash = !this.showTrash;
    if (this.showTrash) {
      this.getInactifs();
    }
  }

  toggleForm(): void{
    this.resetEtageForm();
    this.showEditForm=false;
    this.showEtageForm=false;
  }

  editEtage(etage: Etage): void {
    this.selectedEtage = { ...etage }; // Clone to avoid modifying original before saving
    this.showEditForm = true;
  }

  getActifs(): void {
    this.batimentService.getEtagesByBatimentId(this.batimentId).subscribe({
      next: (data) => this.etagesActifs = data,
      error: (err) => console.error('Erreur lors du chargement des étages :', err)
    });
  }

  getInactifs(): void {
    this.batimentService.getEtagesInactifsByBatimentId(this.batimentId).subscribe({
      next: (data) => this.etagesInactifs = data,
      error: (err) => console.error('Erreur lors du chargement des étages :', err)
    });
  }

  toggleBulkMode(): void {
    this.bulkMode = !this.bulkMode;
    if (!this.bulkMode) {
      this.selectedEtageIds = [];
    }
  }


  isSelected(type: any): boolean {
    return this.selectedEtageIds.includes(type.id);
  }

  toggleSelection(id: number): void {
    const index = this.selectedEtageIds.indexOf(id);
    if (index > -1) {
      this.selectedEtageIds.splice(index, 1);
    } else {
      this.selectedEtageIds.push(id);
    }
  }

  selectAll() {
    this.selectedEtageIds = this.etagesInactifs.map(etage => etage.id);
  }

  resetSelection() {
    this.selectedEtageIds = [];
  }

  resetEtageForm(): void {
    this.newEtage = { num: 0 };
    this.errorMessage='';
    this.etageAdded=false;
    this.etageUpdated=false;
    this.showEtageForm=false;
    this.showEditForm=false;
  }

  addEtage(): void {
    this.errorMessage = '';

    // Only include the ID of the batiment to avoid sending nested data
    const etageToCreate: Partial<Etage> = {
      id: 0,
      num: this.newEtage.num,
      batimentId:  this.batimentId
    };

    console.log('Sending to backend:', etageToCreate);

    this.etageService.createEtage(etageToCreate as Etage).subscribe({
      next: (savedEtage: Etage) => {
        console.log('Étage ajouté avec succès:', savedEtage);
        this.etages.push(savedEtage);
        this.getActifs();
        this.getInactifs();
        this.etageAdded = true;
        this.resetEtageForm();
        this.showEtageForm = false;
      },
      error: (error) => {
        console.error('Erreur lors de l\'ajout de l\'étage:', error);
        if (error.status !== 200) {
          this.errorMessage = 'Un étage avec ces informations existe déjà.';
        }
      }
    });
  }


  goToSalles(etageId: number): void {
    this.router.navigate(['/batiment', etageId, 'salles']);
  }

  restaurerEtage(id: number): void {
    this.etageService.restaurer(id).subscribe(
      (response) => {
        console.log('Response from restaurer:', response);  // Check what comes from the backend
        this.isRestored = true;
        this.getInactifs();
        this.getActifs();
        this.showTrash = false;  // Close the trash modal after action
        this.resetEtageForm();
        setTimeout(() => {
          this.isRestored = false;
        }, 3000);
      },
      (error) => {
        if (error.status != 200) {
          this.etageTaken = true;
          this.errorMessage = 'Un étage actif avec  ce numéro existe déjà!';
        }
      }
    );
  }

  archiverEtage(id: number): void {
    this.etageService.archiver(id).subscribe(
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
    if (this.selectedEtageIds.length === 0) return;

    this.bulkRestoreError = null;
    this.etageService.restaurerMultiple(this.selectedEtageIds).subscribe(
      (response) => {
        this.isBulkRestored = true;
        this.getInactifs();
        this.getActifs();
        this.showTrash=false;
        this.resetEtageForm();
        this.selectedEtageIds = [];
        console.log("",this.isBulkRestored);
        setTimeout(() => {
          this.isBulkRestored = false;
        }, 3000);
      },
      (error) => {
        if (error.status != 200) {
          this.etageTakenBulk = true;
          this.errorMessage = 'Un ou plusieurs étages actifs avec les mêmes numéros existent déjà!';
        }
      }
    );
  }

  archiverSelection(): void {
    if (this.selectedEtageIds.length === 0) return;

    this.etageService.archiverMultiple(this.selectedEtageIds).subscribe(
      (response) => {
        console.log('Archive successful:', response);
        this.getInactifs();
        this.getActifs();
        this.selectedEtageIds = [];  // Reset selected IDs after archiving
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


  updateEtage(): void {
    console.log('Sending to backend:', this.selectedEtage);
    this.errorMessage = '';
    this.etageTaken = false;

    // Sanity checks 🔒
    if (!this.selectedEtage || this.selectedEtage.id === undefined) {
      this.errorMessage = 'Aucun étage sélectionné pour la mise à jour!';
      return;
    }

    if (!this.selectedEtage.num) {
      this.errorMessage = 'Tous les champs sont obligatoires.';
      return;
    }

    // API call 🔁
    this.etageService.updateEtage(this.selectedEtage.id, this.selectedEtage)
      .subscribe({
        next: (updatedEtage) => {
          // Replace updated item in the actifs list 🛠️
          const index = this.etagesActifs.findIndex(e => e.id === updatedEtage.id);
          if (index !== -1) {
            this.etagesActifs[index] = updatedEtage;
          }

          // Reset UI and feedback 💫
          this.resetEtageForm();
          this.getActifs();
          this.getInactifs();

          this.etageUpdated = true;
          this.showEditForm = false;

          setTimeout(() => {
            this.etageUpdated = false;
          }, 3000);
        },
        error: (error) => {
          if (error.status !=200) {
            this.etageTaken = true;
            this.errorMessage = 'Un étage avec les mêmes informations existe déjà.';
          } else {
            this.errorMessage = 'Échec de la mise à jour.';
          }
          console.error('Update failed:', error);
        }
      });
  }



}
