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

@Component({
  selector: 'app-historique-demandes',
  templateUrl: './historique-demandes.component.html',
  styleUrl: './historique-demandes.component.css'
})
export class HistoriqueDemandesComponent implements OnInit {

  maintenancesCorrectives: MaintenanceCorrective[] = [];
  filteredMaintenanceCorrectives: MaintenanceCorrective[] = [];
  isLoading: boolean = true;
  showModal: boolean = false;
  maintenanceToCancel: number | null = null;
  equipementTaken: boolean = false;

  // Filter variables
  searchKeyword: string = '';
  showUpdatePanel: boolean = false;
  errorMessage: string = '';
  updateSuccessful: boolean = false;
  addSuccessful: boolean = false;
  selectedStatut: string = '';
  selectedPriorite: string = '';
  selectedEquipement: string = '';
  selectedEquipementDetails: any;
  selectedMaintenance: MaintenanceCorrective | null = null;
  startDate: string = '';
  endDate: string = '';
  successMessage:string= '';
  equipements: Equipement[] = [];
  users: User[] = [];
  // Pagination variables
  currentPage: number = 1;
  itemsPerPage: number = 3;
  totalItems: number = 0;
  currentUser: User | null = null;  // To store the current logged-in user
  batiments: any[] = [];
  etages: any[] = [];
  salles: any[] = [];

  // Variables de sélection
  selectedBatiment: number = 0;
  selectedEtage: number = 0;
  selectedSalle: number = 0;

  technicianWorkload: number = 0;
  technicianWorkloads: { [key: number]: number } = {};  // Object to store workloads by technician ID


  // Form for adding new maintenance
  newMaintenance: MaintenanceCorrective = {
    demandeeParId: 0, demandeeParNom: "",
    equipementBatiment: "", equipementEtage: 0, equipementSalle: 0,
    affecteANom: "", creeParNom: "",
    affecteAId: 0,creeParId:0, dateCreation: "", id: 0, interventions: [],
    titre: '',
    description: '',
    statut: 'EN_ATTENTE',
    priorite: 'NORMALE',
    equipementNom: ''
  };



  constructor(private maintenanceCorrectiveService: MaintenanceCorrectiveService,
              private equipementService: EquipementService,
              private userService: UserService,
              private batimentService: BatimentService,
              private etageService: EtageService,) { }


  ngOnInit(): void {
    this.loadAllMaintenances();
    this.setCurrentUser();
    this.loadBatiments();
  }






  loadBatiments() {
    this.batimentService.getAllBatiments().subscribe(data => {
      this.batiments = data;
      console.log("batiments:", this.batiments);
    });
  }



  setCurrentUser(): void {
    const user = localStorage.getItem('user');
    if (user) {
      this.currentUser = JSON.parse(user); // Parse the stored user info
      // Check if currentUser is valid before accessing 'nom'
      if (this.currentUser && this.currentUser.id) {
        this.newMaintenance.demandeeParNom = this.currentUser.nom;
        this.newMaintenance.demandeeParId = this.currentUser.id; // store ID for later use
        console.log("User ID:", this.currentUser.id);
      }
      else {
        console.error("User object does not contain a valid 'nom'.");
      }
    } else {
      console.error("No user found in localStorage.");
    }
  }


  loadAllMaintenances(): void {
    this.maintenanceCorrectiveService.getAllMaintenances()
      .subscribe(
        (data: MaintenanceCorrective[]) => {
          const relevantStatuses = ['ANNULEE', 'TERMINEE'];

          const filtered = data.filter(m =>
            relevantStatuses.includes(m.statut) &&
            m.demandeeParId === this.currentUser?.id
          );

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

  autoSelectTechnicien() {
    if (this.users.length > 0) {
      let randomIndex = Math.floor(Math.random() * this.users.length);
      this.newMaintenance.affecteAId = this.users[randomIndex].id;
    }
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
