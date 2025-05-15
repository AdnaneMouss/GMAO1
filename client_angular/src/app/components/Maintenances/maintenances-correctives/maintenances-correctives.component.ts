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
  selector: 'app-maintenances-correctives',
  templateUrl: './maintenances-correctives.component.html',
  styleUrls: ['./maintenances-correctives.component.css']
})
export class MaintenancesCorrectivesComponent implements OnInit {
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
    this.getEquipements();
    this.fetchMaintenances();
    this.setCurrentUser();
    this.loadBatiments();
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


  loadBatiments() {
    this.batimentService.getAllBatiments().subscribe(data => {
      this.batiments = data;
      console.log("batiments:", this.batiments);
    });
  }

  loadEtages(batimentId: number) {
    this.batimentService.getEtagesByBatimentId(batimentId).subscribe(data => {
      this.etages = data;
    });
  }


  onBatimentChange(): void {
    // Reset dependent selections
    this.etages = [];
    this.salles = [];
    this.equipements = [];

    this.selectedEtage = 0;
    this.selectedSalle = 0;

    // Load next level
    this.loadEtages(this.selectedBatiment);

    // Update new maintenance object
    this.newMaintenance.equipementBatiment = this.selectedBatiment?.toString() ?? '';
  }

  onEtageChange(): void {
    // Reset dependent selections
    this.salles = [];
    this.equipements = [];

    this.selectedSalle = 0;

    // Load next level
    this.loadSalles(this.selectedEtage);

    // Update new maintenance object
    this.newMaintenance.equipementEtage = this.selectedEtage;
  }

  onSalleChange(): void {
    // Reset equipements before loading
    this.equipements = [];
    this.selectedEquipementDetails = null;
    // Load equipements for the selected salle
    this.loadEquipements(this.selectedSalle);

    // Update new maintenance object
    this.newMaintenance.equipementSalle = this.selectedSalle;
  }

  onEquipementChange(): void {
    // Find the selected equipement by name
    this.selectedEquipementDetails = this.equipements.find(
      equipement => equipement.nom === this.newMaintenance.equipementNom
    ) || null;

    // Auto-set the maintenance title
    if (this.selectedEquipementDetails) {
      this.newMaintenance.titre = `Maintenance de l’équipement ${this.selectedEquipementDetails.nom}`;
    } else {
      this.newMaintenance.titre = '';
    }
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



  loadSalles(etageId: number) {
    this.etageService.getSallesByEtageId(etageId).subscribe(data => {
      this.salles = data;
    });
  }

  loadEquipements(salleId: number) {
    this.equipementService.getEquipementsBySalle(salleId).subscribe(data => {
      this.equipements = data;
    });
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

  getEquipements(): void {
    this.equipementService.getAllEquipements().subscribe((data: Equipement[]) => {
      this.equipements = data;
  });
}

  fetchMaintenances(): void {
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
          // Filter only EN_COURS or EN_ATTENTE
          const relevantStatuses = ['EN_COURS', 'EN_ATTENTE'];
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


  openAddModal() {
    this.showModal = true;
  }

  openUpdatePanel(maintenance: any): void {
    this.selectedMaintenance = { ...maintenance }; // Create a copy of the maintenance object
    this.showUpdatePanel = true; // Open the modal
    this.onBatimentChange();
  }

  // Example method to close the modal
  closeAddModal() {
    this.showModal = false;
    this.showUpdatePanel = false;
    this.resetNewMaintenance();
  }


  addMaintenance(): void {
    if (!this.newMaintenance.titre || !this.newMaintenance.equipementNom) {
      alert("Titre et équipement sont obligates !");
      return;
    }

    this.setCurrentUser();

    // Ensure both creeParNom and creeParId are set
    this.newMaintenance.creeParNom = this.currentUser?.nom || '';
    this.newMaintenance.creeParId = this.currentUser?.id || 0;

    if (this.currentUser) {
      console.log('User Nom:', this.currentUser.nom);
    } else {
      console.log("No user logged in, 'creeParNom' will not be set.");
    }

    // 🔍 LOG de debug complet pour l'objet maintenance
    console.log("🛰️ Maintenance envoyée au backend :", this.newMaintenance);
    console.log("🧩 Equipement sélectionné :", this.newMaintenance.equipementNom);

    this.maintenanceCorrectiveService.createMaintenance(this.newMaintenance)
      .subscribe(
        (addedMaintenance) => {
          this.maintenancesCorrectives.unshift(addedMaintenance);
          this.applyFilters();
          this.fetchMaintenances();
          this.resetNewMaintenance();
          this.showModal = false;
          this.addSuccessful = true;
          this.successMessage = "Maintenance ajoutée avec succès";
        },
        (error) => {
          console.error('Erreur lors de l\'ajout de l\'utilisateur:', error);

          // Handle different types of errors
          if (error.status === 409 && error.error) {

            const message = error.error.message;

              this.equipementTaken = true;
              this.errorMessage = message;
            }

        }
      );
  }


  updateMaintenance(): void {
    // Check if the selected maintenance exists and is properly selected
    if (!this.selectedMaintenance || this.selectedMaintenance.id === undefined) {
      this.errorMessage = 'Aucune maintenance sélectionnée pour la mise à jour!';
      return;
    }

    // Check for missing required fields
    if (!this.selectedMaintenance.titre || !this.selectedMaintenance.equipementNom) {
      this.errorMessage = 'Les champs titre et équipement sont obligatoires';
      return;
    }

    // Ensure both creeParNom and creeParId are set
    this.setCurrentUser();
    this.selectedMaintenance.creeParNom = this.currentUser?.nom || '';
    this.selectedMaintenance.creeParId = this.currentUser?.id || 0;

    // 🔍 LOG de debug complet pour l'objet maintenance
    console.log("🛰️ Maintenance envoyée au backend :", this.selectedMaintenance);
    console.log("🧩 Equipement sélectionné :", this.selectedMaintenance.equipementNom);

    // Call the service to update the maintenance
    this.maintenanceCorrectiveService.updateMaintenanceCorrective(
      this.selectedMaintenance.id,
      this.selectedMaintenance
    ).subscribe(
      (updatedMaintenance) => {
        // Find and update the maintenance in the list
        const index = this.maintenancesCorrectives.findIndex(
          maintenance => maintenance.id === updatedMaintenance.id
        );
        if (index !== -1) {
          this.maintenancesCorrectives[index] = updatedMaintenance;
        }

this.resetNewMaintenance();

        this.updateSuccessful = true;
        this.showUpdatePanel = false;
        this.successMessage = 'Maintenance mise à jour avec succès';
        this.loadAllMaintenances();
        // Hide the success message after 3 seconds
        setTimeout(() => {
          this.updateSuccessful = false;
        }, 3000);
      },
      (error) => {
        console.error('Erreur lors de l\'ajout de l\'utilisateur:', error);

        // Handle different types of errors
        if (error.status === 409 && error.error) {

          const message = error.error.message;

          this.equipementTaken = true;
          this.errorMessage = message;
        }

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
