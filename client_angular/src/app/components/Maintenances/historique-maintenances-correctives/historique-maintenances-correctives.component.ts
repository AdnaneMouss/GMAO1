import { Component, OnInit } from '@angular/core';
import { MaintenanceCorrective } from "../../../models/maintenance-corrective";
import { MaintenanceCorrectiveService } from "../../../services/maintenance-corrective.service";
import {Equipement} from "../../../models/equipement";
import {EquipementService} from "../../../services/equipement.service";
import {UserService} from "../../../services/user.service";
import {User} from "../../../models/user";
import {Batiment} from "../../../models/batiment";
import {BatimentService} from "../../../services/batiment.service";
import {EtageService} from "../../../services/etage.service";
import {SalleService} from "../../../services/salle.service";
import {PieceDetachee} from "../../../models/piece-detachee";
import {InterventionService} from "../../../services/intervention.service";

@Component({
  selector: 'app-historique-maintenances-correctives',
  templateUrl: './historique-maintenances-correctives.component.html',
  styleUrl: './historique-maintenances-correctives.component.css'
})
export class HistoriqueMaintenancesCorrectivesComponent {
  maintenancesCorrectives: MaintenanceCorrective[] = [];
  filteredMaintenanceCorrectives: MaintenanceCorrective[] = [];
  isLoading: boolean = true;
  selectedMaintenance: MaintenanceCorrective | null = null;
  allPiecesDetachees: PieceDetachee[] = [];

  piecesByIntervention: { [key: number]: PieceDetachee[] } = {};

  errorMessage: string = '';
  updateSuccessful: boolean = false;
  addSuccessful: boolean = false;
  selectedStatut: string = '';
  selectedPriorite: string = '';
  selectedEquipement: string = '';
  selectedEquipementDetails: any;
  startDate: string = '';
  endDate: string = '';
  successMessage:string= '';
  equipements: Equipement[] = [];
  users: User[] = [];
  // Pagination variables
  currentPage: number = 1;
  itemsPerPage: number = 3;
  totalItems: number = 0;
  batiments: any[] = [];
  etages: any[] = [];
  salles: any[] = [];



  constructor(private maintenanceCorrectiveService: MaintenanceCorrectiveService,
              private interventionService: InterventionService) { }


  ngOnInit(): void {
    this.loadAllMaintenances();
  }

  openInterventionsModal(maintenance: MaintenanceCorrective) {
    this.selectedMaintenance = maintenance;
  }

  closeInterventionsModal() {
    this.selectedMaintenance = null;
  }

  getPiecesDetails(ids: number[] | undefined): PieceDetachee[] {
    if (!ids) return [];
    return this.allPiecesDetachees.filter(piece => ids.includes(piece.id));
  }


  loadAllMaintenances(): void {
    this.maintenanceCorrectiveService.getAllMaintenances()
      .subscribe(
        (data: MaintenanceCorrective[]) => {
          // Filter only EN_COURS or EN_ATTENTE
          const relevantStatuses = ['TERMINEE', 'ANNULEE'];
          const filtered = data.filter(m => relevantStatuses.includes(m.statut));

          this.maintenancesCorrectives = filtered;
          this.filteredMaintenanceCorrectives = filtered;
          this.totalItems = filtered.length;
          this.isLoading = false;
          this.applyFilters();
        },
        error => {
          console.error('Error fetching maintenance correctives', error);
          this.isLoading = false;
        }
      );
  }


  // Apply filters
  applyFilters(): void {
    let filtered = this.maintenancesCorrectives.filter(maintenance => {
      const matchesStatut = this.selectedStatut ? maintenance.statut === this.selectedStatut : true;
      const matchesPriorite = this.selectedPriorite ? maintenance.priorite === this.selectedPriorite : true;
      const matchesEquipement = this.selectedEquipement
        ? maintenance.equipementNom.toLowerCase().includes(this.selectedEquipement.toLowerCase())
        : true;
      const matchesDate = (this.startDate && this.endDate) ?
        new Date(maintenance.dateCreation) >= new Date(this.startDate) && new Date(maintenance.dateCreation) <= new Date(this.endDate) : true;

      return matchesStatut && matchesPriorite && matchesEquipement && matchesDate;
    });

    this.totalItems = filtered.length;
    this.paginate(filtered);
  }

  paginate(data: MaintenanceCorrective[]): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.filteredMaintenanceCorrectives = data.slice(startIndex, startIndex + this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= Math.ceil(this.totalItems / this.itemsPerPage)) {
      this.currentPage = page;
      this.applyFilters();
    }
  }

  getPiecesForIntervention(interventionId: number): void {
    if (this.piecesByIntervention[interventionId]) return; // prevent re-fetch

    this.interventionService.getPiecesByInterventionId(interventionId).subscribe({
      next: (pieces) => {
        this.piecesByIntervention[interventionId] = pieces;
        console.log('pieces:', this.piecesByIntervention);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des pièces détachées :', err);
      }
    });
  }


  formatDateWithIntl(date: string | undefined): string {
    if (!date) {
      return 'Date non disponible'; // Or provide a default string if date is undefined
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return 'Invalid Date'; // Return fallback if date parsing fails
    }

    const formatter = new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
    return formatter.format(parsedDate);
  }


  protected readonly Math = Math;
  protected readonly onreset = onreset;
}
