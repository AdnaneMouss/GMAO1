import { Component, OnInit } from '@angular/core';
import { MaintenanceCorrective } from "../../../models/maintenance-corrective";
import { MaintenanceCorrectiveService } from "../../../services/maintenance-corrective.service";
import {Equipement} from "../../../models/equipement";
import {EquipementService} from "../../../services/equipement.service";
import {UserService} from "../../../services/user.service";
import {User} from "../../../models/user";

@Component({
  selector: 'app-maintenances-correctives',
  templateUrl: './maintenances-correctives.component.html',
  styleUrls: ['./maintenances-correctives.component.css']
})
export class MaintenancesCorrectivesComponent implements OnInit {
  maintenanceCorrectives: MaintenanceCorrective[] = [];
  filteredMaintenanceCorrectives: MaintenanceCorrective[] = [];
  isLoading: boolean = true;
  showModal: boolean = false;

  // Filter variables
  searchKeyword: string = '';
  selectedStatut: string = '';
  selectedPriorite: string = '';
  selectedEquipement: string = '';
  startDate: string = '';
  endDate: string = '';
  equipements: Equipement[] = [];
  users: User[] = [];
  // Pagination variables
  currentPage: number = 1;
  itemsPerPage: number = 3;
  totalItems: number = 0;
  currentUser: User | null = null;  // To store the current logged-in user


  // Form for adding new maintenance 
  newMaintenance: MaintenanceCorrective = {
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
              private userService: UserService) {}

  ngOnInit(): void {
    this.loadAllMaintenances();
    this.getEquipements();
    this.fetchUsers();
    this.setCurrentUser();
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

  fetchUsers(): void {
    this.userService.getAllUsers().subscribe((data: User[]) => {
      this.users = data.filter(user => user.role === 'TECHNICIEN');
      console.log(this.users);
    });
  }


  loadAllMaintenances(): void {
    this.maintenanceCorrectiveService.getAllMaintenances()
      .subscribe(
        (data: MaintenanceCorrective[]) => {
          this.maintenanceCorrectives = data;
          this.filteredMaintenanceCorrectives = data;
          this.totalItems = data.length;
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

  // Example method to close the modal
  closeAddModal() {
    this.showModal = false;
  }


  addMaintenance(): void {
    if (!this.newMaintenance.titre || !this.newMaintenance.equipementNom) {
      alert("Titre et équipement sont obligates !");
      return;
    }

    this.setCurrentUser();

    // Ensure both creeParNom and creeParId are set
    this.newMaintenance.creeParNom = this.currentUser?.nom || '';
    this.newMaintenance.creeParId = this.currentUser?.id || 0; // Ensure the user id is assigned

    if (this.currentUser) {
      console.log('User Nom:', this.currentUser.nom); // Vérifie si 'nom' est bien accessible
    } else {
      console.log("No user logged in, 'creeParNom' will not be set.");
    }

    this.maintenanceCorrectiveService.createMaintenance(this.newMaintenance)
      .subscribe(
        (addedMaintenance) => {
          this.maintenanceCorrectives.unshift(addedMaintenance);
          this.applyFilters();

          // Reset form avec le bon 'creeParNom' pour les futurs ajouts
          this.newMaintenance = {
            equipementBatiment: "", equipementEtage: 0, equipementSalle: 0,
            affecteAId: 0,
            creeParId: 0,  // Reset the creeParId after adding
            affecteANom: '',
            creeParNom: this.currentUser?.nom || 'h' ,
            dateCreation: "",
            id: 0,
            interventions: [],
            titre: '',
            description: '',
            statut: 'EN_ATTENTE',
            priorite: 'NORMALE',
            equipementNom: ''
          };

          this.showModal = false; // Ferme la modal après l'ajout réussi
        },
        error => {
          console.error('Error adding maintenance corrective', error);
        }
      );
  }


  // Apply filters
  applyFilters(): void {
    let filtered = this.maintenanceCorrectives.filter(maintenance => {
      const matchesStatut = this.selectedStatut ? maintenance.statut === this.selectedStatut : true;
      const matchesPriorite = this.selectedPriorite ? maintenance.priorite === this.selectedPriorite : true;
      const matchesEquipement = this.selectedEquipement ? maintenance.equipementNom.includes(this.selectedEquipement) : true;
      const matchesDate = (this.startDate && this.endDate) ?
        new Date(maintenance.dateCreation) >= new Date(this.startDate) && new Date(maintenance.dateCreation) <= new Date(this.endDate) : true;
      const matchesSearch = this.searchKeyword ? maintenance.titre.includes(this.searchKeyword) || (maintenance.description && maintenance.description.includes(this.searchKeyword)) : true;

      return matchesStatut && matchesPriorite && matchesEquipement && matchesDate && matchesSearch;
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
}
