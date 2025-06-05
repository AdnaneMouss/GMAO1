import { Component, OnInit } from '@angular/core';
import { MaintenanceCorrective } from "../../../models/maintenance-corrective";
import { MaintenanceCorrectiveService } from "../../../services/maintenance-corrective.service";
import {Equipement} from "../../../models/equipement";
import {EquipementService} from "../../../services/equipement.service";
import {UserService} from "../../../services/user.service";
import {User} from "../../../models/user";
import {BatimentService} from "../../../services/batiment.service";
import {EtageService} from "../../../services/etage.service";

@Component({
  selector: 'app-accepter-demandes-maintenances',
  templateUrl: './accepter-demandes-maintenances.component.html',
  styleUrl: './accepter-demandes-maintenances.component.css'
})
export class AccepterDemandesMaintenancesComponent implements OnInit {
  maintenancesCorrectives: MaintenanceCorrective[] = [];
  filteredMaintenanceCorrectives: MaintenanceCorrective[] = [];
  isLoading: boolean = true;
  showModal: boolean = false;
  maintenanceToCancel: number | null = null;
  equipementTaken: boolean = false;
  selectedTaskId: number = 0;
  // Filter variables
  searchKeyword: string = '';
  showUpdatePanel: boolean = false;
  errorMessage: string = '';
  approvalSuccessful: boolean = false;
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


  newMaintenance: Partial<MaintenanceCorrective> = {
    affecteAId: 0,
    creeParId: this.currentUser?.id
  };



  constructor(private maintenanceCorrectiveService: MaintenanceCorrectiveService,
              private equipementService: EquipementService,
              private userService: UserService,
              private batimentService: BatimentService,
              private etageService: EtageService,) { }


  ngOnInit(): void {
    this.loadAllMaintenances();
    this.setCurrentUser();
    this.fetchTech();
  }



  resetNewMaintenance(): void {
    this.newMaintenance = {
      demandeeParId: 0, demandeeParNom: "",
      equipementBatiment: "", equipementEtage: 0, equipementSalle: 0,
      affecteANom: "", creeParNom: "",
      affecteAId: 0, creeParId: 0, dateCreation: "", id: 0, interventions: [],
      titre: '',
      description: '',
      statut: 'EN_ATTENTE',
      priorite: 'NORMALE',
      equipementNom: ''
    };
    this.selectedEquipement = '';
    this.selectedBatiment = 0;
    this.selectedSalle = 0;
    this.selectedEtage = 0;
    this.equipementTaken= false;
    this.errorMessage='';

  }







  cancelTask(id: number): void {
    this.maintenanceCorrectiveService.cancelTask(id).subscribe(
      (updatedMaintenance) => {
        const index = this.maintenancesCorrectives.findIndex(m => m.id === id);
        if (index !== -1) {
          this.maintenancesCorrectives[index] = updatedMaintenance;
          this.loadAllMaintenances();
          this.maintenanceToCancel=null;
        }
      },
      (error) => {
        console.error('Error cancelling task:', error);
      }
    );
  }

  confirmCancelTask(id: number): void {
    this.maintenanceToCancel = id;
  }

  cancelCancelTask(): void {
    this.maintenanceToCancel = null;
  }




  setCurrentUser(): void {
    const user = localStorage.getItem('user');
    if (user) {
      this.currentUser = JSON.parse(user); // Parse the stored user info
      // Check if currentUser is valid before accessing 'nom'
      if (this.currentUser && this.currentUser.nom) {
        this.newMaintenance.creeParNom = this.currentUser.nom;
        console.log(this.currentUser.nom);
      } else {
        console.error("User object does not contain a valid 'nom'.");
      }
    } else {
      console.error("No user found in localStorage.");
    }
  }

  fetchTech(): void {
    this.userService.getAllUsers().subscribe((data: User[]) => {
      this.users = data.filter(user => user.role === 'TECHNICIEN'); // Filter technicians
      this.technicianWorkloads = {};  // Object to store workloads by technician ID

      // Now, we fetch the workload for each technician
      this.users.forEach(user => {
        this.maintenanceCorrectiveService.getTechnicianWorkload(user.id)
          .subscribe((workload) => {
            // Store the workload in the technicianWorkloads map
            this.technicianWorkloads[user.id] = workload;  // Use technician ID as the key
            console.log(`Technician ${user.nom} workload:`, workload); // Log workload for testing
          });
      });
    });
  }
  loadAllMaintenances(): void {
    this.maintenanceCorrectiveService.getAllMaintenances()
      .subscribe(
        (data: MaintenanceCorrective[]) => {
          const relevantStatuses = ['DEMANDEE'];

          const filtered = data.filter(m =>
            relevantStatuses.includes(m.statut)
          );

          this.maintenancesCorrectives = filtered;
          this.filteredMaintenanceCorrectives = filtered;
          console.log('hhh:', filtered);
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

  openAddModal(taskId: number) {
      this.selectedTaskId = taskId;
       this.showModal = true;
    }




  // Example method to close the modal
  closeAddModal() {
    this.showModal = false;
    this.resetNewMaintenance();
  }



  approveMaintenanceTask(): void {
    const taskId = this.selectedTaskId; // this should be set from the context (e.g., clicked item, modal, etc.)

    if (!taskId) {
      console.error('🚫 No task ID selected for approval.');
      return;
    }

    this.maintenanceCorrectiveService.approveRequest(taskId, this.newMaintenance).subscribe({
      next: (response) => {
        console.log('✅ Maintenance approved successfully:', response);
        this.loadAllMaintenances();
        this.resetNewMaintenance();
        this.closeAddModal();
        this.approvalSuccessful=true;
        this.successMessage = 'Maintenance approuvée avec succès';
        this.loadAllMaintenances();
        // Hide the success message after 3 seconds
        setTimeout(() => {
          this.approvalSuccessful = false;
        }, 3000);
      },
      error: (error) => {
        console.error('❌ Error approving maintenance task:', error);
      }
    });
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
