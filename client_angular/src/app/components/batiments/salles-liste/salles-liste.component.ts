import {Etage} from "../../../models/etage";
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {EtageService} from "../../../services/etage.service";
import {Salle} from "../../../models/salle";
import {SalleService} from "../../../services/salle.service";
import {Batiment} from "../../../models/batiment";

@Component({
  selector: 'app-salles-liste',
  templateUrl: './salles-liste.component.html',
  styleUrl: './salles-liste.component.css'
})
export class SallesListeComponent implements OnInit {
  sallesActives: Salle[] = [];
  sallesInactives: Salle[] = [];
  etageId!: number;
  selectedEtage: any = {};
  selectedSalle: any = {};
  newSalle: Partial<Salle> = { num: 0, prefixe:'' };
  showSalleForm: boolean = false;
  showEditForm: boolean = false;
  errorMessage: string = '';
  isBulkRestored: boolean= false;
  isBulkArchived: boolean= false;
  bulkRestoreError: string | null = null;
  salleTakenBulk: boolean = false;
  bulkMode: boolean = false;
  isRestored: boolean = false;
  isArchived: boolean = false;
  showTrash: boolean = false;
  showConfirmationModal: boolean = false;
  showForm: boolean = false;
  selectedSalleIds: number[] = [];
  selectedSalleToArchive: any = null;
  salleUpdated: boolean = false;
  salleAdded: boolean = false;
  salleTaken: boolean = false;
  impossibleToArchive: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private etageService: EtageService,
    private salleService: SalleService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.etageId = +this.route.snapshot.paramMap.get('id')!;
    this.getActifs();
    this.getInactifs();
    this.etageService.getEtageById(this.etageId).subscribe({
      next: (etage) => {
        this.selectedEtage = etage;
        console.log("", this.selectedEtage)
      }
    });
  }

  goBack(): void {
    const batimentId = this.selectedEtage?.batimentId;
  console.log("batiment id:", batimentId);
    if (!batimentId) {
      console.error("batimentId is undefined — cannot navigate back.");
      return;
    }

    this.router.navigate(['/batiment', batimentId, 'etages']);
  }

  resetSalleForm(): void {
    this.newSalle = { num: 0, prefixe:'' };
    this.salleUpdated=false;
    this.salleAdded=false;
    this.salleTaken=false;
    this.errorMessage = '';
  }

  addSalle(): void {
    this.errorMessage = '';

    // Only include the ID of the batiment to avoid sending nested data
    const salleToCreate: Partial<Salle> = {
      id: 0,
      num: this.newSalle.num,
      prefixe: this.newSalle.prefixe,
      etageId: this.etageId,
    };

    console.log('Sending to backend:', salleToCreate);

    this.salleService.createSalle(salleToCreate as Salle).subscribe({
      next: (savedSalle: Salle) => {
        console.log('Étage ajouté avec succès:', savedSalle);
        this.sallesActives.push(savedSalle);
        this.salleAdded=true;
        this.resetSalleForm();
        this.showSalleForm = false;
      },
      error: (error) => {
        console.error('Erreur lors de l\'ajout de l\'étage:', error);
        if (error.status !== 200) {
          this.errorMessage = 'Une salle avec ces informations existe déjà ou le format est incorrect.';
        }
      }
    });
  }



  getActifs(): void {
    this.etageService.getSallesByEtageId(this.etageId).subscribe(
      data => this.sallesActives = data,
      error => console.error('Error loading etages', error)
    );
  }


  getInactifs(): void {
    this.etageService.getSallesInactivesByEtageId(this.etageId).subscribe(
      data => this.sallesInactives = data,
      error => console.error('Error loading etages', error)
    );
  }

  updateSalle(): void {
    console.log('Sending to backend:', this.selectedSalle);
    this.errorMessage = '';
    this.salleTaken = false;

    // Sanity checks 🔒
    if (!this.selectedSalle || this.selectedSalle.id === undefined) {
      this.errorMessage = 'Aucun bâtiment sélectionné pour la mise à jour!';
      return;
    }
    if (!this.selectedSalle.etageId) {
      this.errorMessage = "L'étage associé est requis.";
      return;
    }


    if (!this.selectedSalle.num || !this.selectedSalle.prefixe) {
      this.errorMessage = 'Tous les champs sont obligatoires.';
      return;
    }

    // API call 🔁
    this.salleService.updateSalle(this.selectedSalle.id, this.selectedSalle)
      .subscribe({
        next: (updatedSalle) => {
          // Replace updated item in the actifs list 🛠️
          const index = this.sallesInactives.findIndex(s => s.id === updatedSalle.id);
          if (index !== -1) {
            this.sallesInactives[index] = updatedSalle;
          }

          // Reset UI and feedback 💫
          this.resetSalleForm();
          this.getActifs();
          this.getInactifs();

          this.salleUpdated = true;
          this.showEditForm = false;

          setTimeout(() => {
            this.salleUpdated = false;
          }, 3000);
        },
        error: (error) => {
          if (error.status !=200) {
            this.salleTaken = true;
            this.errorMessage = 'Une salle avec les mêmes informations existe déjà.';
          } else {
            this.errorMessage = 'Échec de la mise à jour de la salle.';
          }
          console.error('Update failed:', error);
        }
      });
  }


  toggleForm(): void{
    this.resetSalleForm();
    this.showEditForm=false;
    this.showForm=false;
  }

  editSalle(salle: Salle): void {
    this.selectedSalle = { ...salle }; // Clone to avoid modifying original before saving
    this.showEditForm = true;
  }


  restaurerSalle(id: number): void {
    this.salleService.restaurer(id).subscribe(
      (response) => {
        console.log('Response from restaurer:', response);  // Check what comes from the backend
        this.isRestored = true;
        this.getInactifs();
        this.getActifs();
        this.showTrash = false;  // Close the trash modal after action
        this.resetSalleForm();
        setTimeout(() => {
          this.isRestored = false;
        }, 3000);
      },
      (error) => {
        if (error.status != 200) {
          this.salleTaken = true;
          this.errorMessage = 'Une salle active avec ce nom ou ce numéro existe déjà!';
        }
      }
    );
  }

  archiverBatiment(id: number): void {
    this.salleService.archiver(id).subscribe(
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
    if (this.selectedSalleIds.length === 0) return;

    this.bulkRestoreError = null;
    this.salleService.restaurerMultiple(this.selectedSalleIds).subscribe(
      (response) => {
        this.isBulkRestored = true;
        this.getInactifs();
        this.getActifs();
        this.showTrash=false;
        this.resetSalleForm();
        this.selectedSalleIds = [];
        console.log("",this.isBulkRestored);
        setTimeout(() => {
          this.isBulkRestored = false;
        }, 3000);
      },
      (error) => {
        if (error.status != 200) {
          this.salleTakenBulk = true;
          this.errorMessage = 'Un ou plusieurs bâtiments actifs portant les mêmes informations existent déjà!';
        }
      }
    );
  }

  archiverSelection(): void {
    if (this.selectedSalleIds.length === 0) return;

    this.salleService.archiverMultiple(this.selectedSalleIds).subscribe(
      (response) => {
        console.log('Archive successful:', response);
        this.getInactifs();
        this.getActifs();
        this.selectedSalleIds = [];  // Reset selected IDs after archiving
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
      this.selectedSalleIds = [];
    }
  }


  isSelected(type: any): boolean {
    return this.selectedSalleIds.includes(type.id);
  }

  toggleSelection(id: number): void {
    const index = this.selectedSalleIds.indexOf(id);
    if (index > -1) {
      this.selectedSalleIds.splice(index, 1);
    } else {
      this.selectedSalleIds.push(id);
    }
  }

  selectAll() {
    this.selectedSalleIds = this.sallesInactives.map(salle => salle.id);
  }

  resetSelection() {
    this.selectedSalleIds = [];
  }


  toggleTrash() {
    this.showTrash = !this.showTrash;
    if (this.showTrash) {
      this.getInactifs();
    }
  }
}
