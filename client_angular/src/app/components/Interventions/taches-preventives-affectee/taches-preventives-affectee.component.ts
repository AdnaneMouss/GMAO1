import { Component, OnInit } from '@angular/core';
import { maintenance } from '../../../models/maintenance';
import { PieceDetachee } from '../../../models/piece-detachee';
import { MaintenanceService } from '../../../services/maintenance.service';
import { InterventionService } from '../../../services/intervention.service';
import { PieceDetacheeService } from '../../../services/piece-detachee.service';
import { Router } from '@angular/router';
import { InterventionPreventiceService } from '../../../services/interventionPreventice.service ';

import { ChangeDetectorRef } from '@angular/core';
import { Equipement } from '../../../models/equipement';
import { EquipementService } from '../../../services/equipement.service';
import { User } from '../../../models/user';
import { UserService } from '../../../services/user.service';
import { Batiment } from '../../../models/batiment';
import { BatimentService } from '../../../services/batiment.service';

import { TypesEquipements } from '../../../models/types-equipements';
import { Salle } from '../../../models/salle';
import { Etage } from '../../../models/etage';
import { Service } from '../../../models/service';
import { RepetitionType } from '../../../models/RepetitionType';
import { delay, interval, Observable, of, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../../../services/NotificationService';
import { AttributEquipements } from '../../../models/attribut-equipement';
import { AuthService } from '../../../services/auth.service';
import { Intervention } from '../../../models/intervention';

@Component({
  selector: 'app-taches-preventives-affectee',
  templateUrl: './taches-preventives-affectee.component.html',
  styleUrls: ['./taches-preventives-affectee.component.css']
})
export class TachesPreventivesAffecteeComponent implements OnInit{

  technicienId: number = 0;

  maintenance: maintenance[] = [];
  selectedFilter: string = '';
  isSortedAZ: boolean = true;
  errorMessage: string = '';
  isSearchOpen = false;
  searchTerm = '';
  message: string = '';
  filteredMaintenace = [...this.maintenance];
  equipements: Equipement[] = [];
  typesEquipements: TypesEquipements[] = []
  users  :User[]  =[];
  selectedFile: File | null = null;  // Déclarer selectedFile ici ICI
  isValid: boolean = true;
  batiments:Batiment[]=[];
  indicateurs: [] = [];
  maintenanceType: 'frequence' | 'indicateur' = 'frequence';
  showJournalierForm = false;
  dropdownOpen: boolean = false;
  selectedForm: string| null = null;
  selectedAction: string = '';
  customAction: string = '';
  filteredResponsableUsers: any[] = [];
  filteredTechnicienUsers: any[] = [];
  selectedStatus: string = '';
  selectedPriorite: string = '';

  currentPage: number = 0;
  pageSize: number = 15 // 20 éléments par page

  selectedAttribut: any;
  selectedEquipementId: number | null = null;

  filteredMaintenances = [...this.maintenance];
  currentTechnicienId: number | null = null;

  showConfirmation: boolean = false;
  actionType: 'start' | 'complete' = 'start';
  currentMaintenanceId: number | null = null;

  confirmationMessage: string = '';
  dateDebutFiltre: string | null = null;
dateFinFiltre: string | null = null;

  technicianId: number | null = null;
  interventions: Intervention[] = [];
  piecesByIntervention: { [key: number]: PieceDetachee[] } = {};


  filters = {
    typeIntervention: '',
    equipementMaintenu: '',
    priorite: '',
    startDate: null,
    endDate: null
  };

  // For intervention form
  showInterventionForm: boolean = false;
  intervention: {
    maintenanceId: number;
    maintenanceStatut: string;
    remarques: string;
    technicienId: number;
    description: string;
    duree: number;
    id: number;
    photos: any[];
    typeIntervention: string;
    piecesDetachees: number[];
  } = {
    description: "",
    duree: 0,
    id: 0,
    maintenanceId: 0,
    maintenanceStatut: 'EN_ATTENTE',
    photos: [],
    remarques: "",
    technicienId: 0,
    typeIntervention: 'CORRECTIVE',
    piecesDetachees: []
  };










generatedDates: Date[] = [];












// Méthode appelée lors du changement d'attribut
onAttributChange(attribut: any) {
  this.selectedAttribut = attribut;

}





  selectedMois: { [key: string]: boolean } = {
    Janvier: false,
    Février: false,
    Mars: false,
    Avril: false,
    Mai: false,
    Juin: false,
    Juillet: false,
    Août: false,
    Septembre: false,
    Octobre: false,
    Novembre: false,
    Décembre: false,


  };
  getMois(): string[] {
    return Object.keys(this.selectedMois);
  }



  joursSemaine: string[] = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  moisAnnee: string[] = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];


  selectedAttributs: AttributEquipements[] = [];


  closeForm() {
    this.selectedForm= null; // Ferme le formulaire
  }
  newMaintenance: maintenance = {
    equipement: {
      id: 0,
      image: '',
      nom: '',
      description: '',
      numeroSerie: '',
      modele: '',
      marque: '',
      statut: '',
      actif: true,
      dateAchat: '',
      dateMiseEnService: '',
      garantie: '',
      dateDerniereMaintenance: '',
      frequenceMaintenance: '',
      historiquePannes: '',
      coutAchat: '',
      serviceNom: '',
      typeEquipement: { id: undefined, type: '', image: '', attributs: [] }, // Initial empty type
      service: {} as Service,
      piecesDetachees: [],
      salle: {} as Salle,
      etage: {} as Etage,
      batiment: {} as Batiment,
      valeurSuivi: 0,
      labelSuivi: '',
      attributsValeurs: []
    },
    batiment: {
      id: 0,
      numBatiment: 0,
      intitule: '',
      etages: [],
    },

    user: {
      id: 0,
      nom: '',
      civilite: 'M',
      email: '',
      username: '',
      password: '',
      gsm: '',
      image: '',
      role: 'ADMIN',
      actif: true,
      dateInscription: '',
      Intervention: {} as Intervention
    },
    id: 0,
    dureeIntervention: 0,
    dateDebutPrevue: new Date(''), // Initialisé en tant qu'objet Date
    dateFinPrevue: new Date(''), // Initialisé en tant qu'objet Date
    dateProchainemaintenance: new Date(''),
    commentaires: '',
    documentPath: null,
    statut: 'EN_ATTENTE',
    priorite: 'NORMALE',
    repetitiontype: 'Ne_pas_repeter',
    frequence: '',
    action: 'VERIFICATION_PERFORMANCES',
    autreAction: '',
    startDaterep: new Date(''),
    selectedjours: [],
    selectedmois: [],
    repetition: 0,
    seuil: 0,
    endDaterep: new Date(''),
    equipementId: null,


    indicateurs: [],
    indice: {
      nomIndice: '',
      seuilIndice: 0
    },

    selectedDays: {}, // Exemple : { "LUNDI": true, "MARDI": false }
    selectedMonth: {}, // Exemple : { "JANVIER": true, "FÉVRIER": false }
    repetitionType: 'TOUS_LES_SEMAINES',
    startDate: new Date(''),
    endDate: new Date(''),
    RepetitionType: RepetitionType.NE_SE_REPETE_PAS,
    message: '',
    NonSeuil: '',
    equipementBatiment: "", equipementEtage: 0, equipementSalle: 0
  };



  onEquipementChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const equipementId = Number(target.value);

    if (!equipementId) {
      this.selectedAttributs = [];
      return;
    }

    this.equipementService.getAttributsByEquipementId(equipementId).subscribe({
      next: (attributs) => {
        // Filter attributes where type === 'number'
        this.selectedAttributs = attributs.filter(attr => attr.attributEquipementType === 'NUMBER');
        console.log("attributs:", this.selectedAttributs);
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des attributs', error);
        this.selectedAttributs = [];
      }
    });
  }





  nextRepetitionDates: Date[] = [];


  showPanel = false; // Controls the panel visibility
  searchVisible: boolean = false;
  maintenances: any[] = []; // Tableau pour stocker les maintenances


  constructor(private maintenanceService: MaintenanceService, private cdr: ChangeDetectorRef,private equipementService: EquipementService,private userService: UserService, batimentservice:BatimentService,  private route: ActivatedRoute,private toastr: ToastrService,private http: HttpClient,private notificationService: NotificationService, private authService: AuthService,  private interventionService: InterventionService,
    private PieceDetacheeService: PieceDetacheeService,
    private InterventionPreventiceService:InterventionPreventiceService,

    private router: Router ) { }

  validateDates() {
    if (this.newMaintenance.dateDebutPrevue && this.newMaintenance.dateFinPrevue) {
      const debut = new Date(this.newMaintenance.dateDebutPrevue);
      const fin = new Date(this.newMaintenance.dateFinPrevue);

      if (debut >= fin) {
        this.errorMessage = 'La date de début doit être avant la date de fin.';
        this.isValid = false;
      } else {
        this.errorMessage = '';
        this.isValid = true;
      }
    }
  }

  filtrerParDateAujourdhui() {
    const aujourdhui = new Date().toISOString().split('T')[0];
    this.filteredMaintenace = this.maintenances.filter(m =>
      m.dateDebutPrevue?.startsWith(aujourdhui)
    );
  }
  getNextRepetitionDates(dates: Date[]): Date[] {
    if (!dates) return [];
    const today = new Date();
    return dates.filter(date => new Date(date) >= today);
  }
  getLabelForDate(date: Date): string | null {
    // exemple simple, personnalise selon tes besoins
    const today = new Date();
    if (new Date(date).toDateString() === today.toDateString()) {
      return 'Aujourdhui';
    }
    return null;
  }



  filtrerParPlageDate() {
    if (this.dateDebutFiltre && this.dateFinFiltre) {
      const debut = new Date(this.dateDebutFiltre);
      const fin = new Date(this.dateFinFiltre);

      this.filteredMaintenace = this.maintenances.filter(m => {
        const date = new Date(m.dateDebutPrevue);
        return date >= debut && date <= fin;
      });
    }
  }
  resetFiltre() {
    this.dateDebutFiltre = null;
    this.dateFinFiltre = null;
    this.filteredMaintenace = [...this.maintenances]; // ou juste this.maintenances si tu n’as pas besoin de copie
  }



  get paginatedMaintenances() {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredMaintenace.slice(startIndex, endIndex);
  }
  getMin(a: number, b: number): number {
    return Math.min(a, b);
  }
  getTotalPages(): number {
    return Math.ceil(this.filteredMaintenace.length / this.pageSize);
  }



  submitForm() {
    this.validateDates(); // Vérifie les dates avant d'envoyer
    if (!this.isValid) {
      return; // Stoppe la soumission si les dates sont incorrectes
    }

    // Ici, tu peux ajouter la logique d'ajout (envoi des données au backend)
    console.log('Maintenance ajoutée', this.newMaintenance);
  }
  confirmDelete(maintenanceId: number) {
    const isConfirmed = window.confirm('Êtes-vous sûr de vouloir supprimer cette maintenance ?');
    if (isConfirmed) {
      this.deleteMaintenance(maintenanceId);
    }
  }
  filterResponsableUsers(users: any[]): any[] {
    return users.filter(user => user.role?.trim().toLowerCase() === 'responsable');
  }
  filterTechnicienUsers(users: any[]): any[] {
    return users.filter(user => user.role?.trim().toLowerCase() === 'technicien');
  }
  trackByFn(index: number, user: any): any {
    return user.id; // Utilise un identifiant unique pour chaque utilisateur
  }




  filterMaintenancesByStatus() {
    console.log("Maintenances Data:", this.maintenances);  // Vérifier si la donnée des maintenances est correcte

    if (this.selectedStatus) {
      // Filtrer en fonction du statut sélectionné
      this.filteredMaintenace = this.maintenances.filter(e => e.statut === this.selectedStatus);
      console.log("Filtered Maintenances:", this.filteredMaintenace);  // Afficher les maintenances filtrées
      console.log("Selected Status:", this.selectedStatus);  // Afficher le statut sélectionné
    } else {
      // Réinitialiser la liste filtrée si aucun statut n'est sélectionné
      this.filteredMaintenace = [...this.maintenances];
      console.log("No status selected, showing all maintenances:", this.filteredMaintenace);
    }
  }


  filterMaintenancesByPriorite() {
    console.log("Maintenances Data:", this.maintenances);  // Vérifier si la donnée des maintenances est correcte

    if (this.selectedPriorite) {
      // Filtrer en fonction de la priorité sélectionnée
      this.filteredMaintenace = this.maintenances.filter(e => e.priorite === this.selectedPriorite);
      console.log("Filtered Maintenances:", this.filteredMaintenace);  // Afficher les maintenances filtrées
      console.log("Selected Priorite:", this.selectedPriorite);  // Afficher la priorité sélectionnée
    } else {
      // Réinitialiser la liste filtrée si aucune priorité n'est sélectionnée
      this.filteredMaintenace = [...this.maintenances];
      console.log("No priorite selected, showing all maintenances:", this.filteredMaintenace);
    }
  }

  ngOnInit(): void {
    // 1. Récupérer d'abord l'utilisateur connecté
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.technicienId = user.id;
    console.log("ID user connecté:", this.technicienId);

    // 2. Ensuite charger les maintenances pour cet utilisateur
    this.getMaintenancesByTechnicien(this.technicienId);

    // 3. Charger les autres données (optionnel)
    this.chargerEquipements();
    this.chargerUsers();
    //this.filteredMaintenace = this.maintenances;
    this.loadPiecesDetachees();
    this.loadTechnicianInterventions();


  }

  loadTechnicianInterventions(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.technicianId = user.id;

    if (!this.technicianId) {
      console.error('ID technicien non trouvé');
      return;
    }
    this.InterventionPreventiceService.getInterventionsByTechnician(this.technicianId)
    .subscribe({
      next: (data: Intervention[]) => {
        this.interventions = data.filter(intervention =>
          intervention.maintenanceId && intervention.maintenanceStatut === 'TERMINEE'
        );

        // Charge les pièces pour chaque intervention
        this.interventions.forEach(intervention => {
          this.loadPiecesForIntervention(intervention.id);
        });
      },
      error: (err) => {
        console.error('Erreur lors du chargement des interventions:', err);
      }
    });
}
loadPiecesForIntervention(interventionId: number): void {
  this.InterventionPreventiceService.getPiecesByInterventionId(interventionId)
    .subscribe({
      next: (pieces) => {
        this.piecesByIntervention[interventionId] = pieces;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des pièces:', err);
      }
    });
}
filteredInterventions(): Intervention[] {
  return this.interventions.filter(intervention => {
    const matchesEquipement = this.filters.equipementMaintenu
      ? intervention.equipementMaintenu.toLowerCase().includes(this.filters.equipementMaintenu.toLowerCase())
      : true;

    const matchesPriorite = this.filters.priorite
      ? intervention.maintenancePriorite === this.filters.priorite
      : true;

    const matchesType = this.filters.typeIntervention
      ? intervention.typeIntervention === this.filters.typeIntervention
      : true;

    return matchesEquipement && matchesPriorite && matchesType;
  });
}

  loadPiecesDetachees(): void {
    this.PieceDetacheeService.getAllPiecesDetachees().subscribe({
      next: (pieces) => {
        this.piecesList = pieces;
        console.log('Pièces détachées chargées:', this.piecesList);
      },
      error: (err) => {
        console.error('Erreur chargement pièces détachées:', err);
        this.toastr.error('Erreur lors du chargement des pièces détachées');
      }
    });
  }
  getMaintenancesByTechnicien(technicienId: number): void {
    if (!technicienId) {
      console.error("Aucun ID technicien fourni");
      return;
    }

    this.maintenanceService.getAllMaintenances().subscribe({
      next: (data) => {
        // Filtrage côté frontend
        this.maintenances = data.filter(m =>
          m.user?.id === technicienId &&
          !['ANNULEE', 'TERMINEE'].includes(m.statut)
        );

        this.filteredMaintenace = [...this.maintenances];
        console.log("Maintenances filtrées:", this.maintenances);
      },
      error: (err) => {
        console.error("Erreur lors du chargement des maintenances", err);
      }
    });
  }

  loadTechnicienMaintenances(): void {
    // 1. Récupérer l'ID du technicien connecté
    this.currentTechnicienId = this.authService.getCurrentUser()?.id || null;

    if (!this.currentTechnicienId) {
      console.error('Aucun technicien connecté identifié');
      return;
    }
  }


  getPaginatedMaintenances(): any[] {
    const startIndex = this.currentPage * this.pageSize;
    return this.filteredMaintenace.slice(startIndex, startIndex + this.pageSize);
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.getTotalPages()) {
      this.currentPage = page;
    }
  }
  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.getTotalPages() - 1) {
      this.currentPage++;
    }
  }











  checkUpcomingMaintenances(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);






        // Vérifier les répétitions de maintenance


  }








  onActionChange() {
    console.log('Action sélectionnée :', this.newMaintenance.action);

    // Réinitialiser autreAction si l'utilisateur ne choisit pas "AUTRE"
    if (this.newMaintenance.action !== 'AUTRE') {
        this.newMaintenance.autreAction = '';
    }
}
  chargerMaintenance(): void {
    this.maintenanceService.getAllMaintenances().subscribe({
      next: (data) => {
        this.maintenances = data;
        this.filteredMaintenace=data;
        console.log("maintenance chargés :", this.maintenances);
        console.log("maintenances filtrées chargés :", this.filteredMaintenace);
      },
      error: (err) => {
        console.error("Erreur lors du chargement des maintenances", err);
      }
    });
  }


  chargerEquipements(): void {
    this.equipementService.getAllEquipements().subscribe({
      next: (data) => {
        this.equipements = data;
        console.log("Équipements chargés :", this.equipements); // Pour vérifier si les données arrivent bien
      },
      error: (err) => {
        console.error("Erreur lors du chargement des équipements", err);
      }
    });
  }

  chargerUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        console.log("users chargés :", this.users);
      },
      error: (err) => {
        console.error("Erreur lor s du chargement des users", err);
      }
    });
  }





















  fetchMaintenances(): void {
    this.maintenanceService.getAllMaintenances().subscribe({
      next: (data) => {
        console.log("Données reçues:", data); // 🔍 Vérifie si des données arrivent
        this.maintenances = data;
        this.filteredMaintenace =data;
      },
      error: (err) => {
        this.errorMessage = "Erreur lors du chargement des maintenances.";
        console.error(err);
      }
    });
  }













togglePanel(): void {
  this.showPanel = !this.showPanel; // Toggle the panel visibility
}








selectedPieces: number[] = [];  // Array to hold selected pieces
piecesList: PieceDetachee[] = [];  // Array that will contain all available pieces for the dropdown









deleteMaintenance(id: number) {
  this.maintenanceService.deleteMaintenance(id).subscribe({
    next: () => {
      console.log("Maintenance supprimée avec succès");

      // Supprimer la maintenance de la liste
      this.maintenances = this.maintenances.filter(m => m.id !== id);
    },
    error: (err) => {
      console.error("Erreur lors de la suppression de la maintenance", err);
    }
  });
}



viewDetails(id: number): void {
  // Logic to view details
  console.log('Voir les détails pour la maintenance id:', id);
}
isLoading = false;
onSubmit(): void {
  this.isLoading = true;
  console.log('Données soumises:', this.maintenance);

  // Créer la maintenance
  this.maintenanceService.createMaintenance(this.newMaintenance).subscribe(
    (response) => {
      console.log('Réponse de l\'API:', response);
    },
    (error) => {
      console.error('Erreur lors de la soumission:', error);
    }
  );

  // Récupérer les dates de répétition
  this.maintenanceService.getNextRepetitionDates(this.newMaintenance).subscribe(
    (response) => {
      if (response.nextRepetitionDates) {
        this.nextRepetitionDates = response.nextRepetitionDates;
      } else {
        console.warn('Aucune date de répétition trouvée.');
        this.nextRepetitionDates = []; // Initialiser à un tableau vide
      }
      this.isLoading = false;
    },
    (error) => {
      console.error('Erreur lors de la récupération des dates de répétition', error);
      this.isLoading = false;
    }
  );
}



onFileSelected(event: any) {
  const file = event.target.files[0]; // Récupérer le fichier
  if (file) {
    this.newMaintenance.documentPath = file; // Assigner le fichier à newMaintenance
  }
}


showDetails(maintenance: any) {
  console.log("Détails de la maintenance :", maintenance);
  // Vous pouvez ouvrir une modale ou afficher les détails dans une autre section
  alert(`Détails de la maintenance :\n
    Description : ${maintenance.Description}\n
    Date Début : ${maintenance.dateDebutPrevue}\n
    Date Fin : ${maintenance.dateFinPrevue}\n
    Statut : ${maintenance.statut}\n
    Priorité : ${maintenance.priorite}`);
}




// Fonction pour afficher le formulaire correspondant à l'option sélectionnée


// Fermer le menu si on clique en dehors




 //getMaintenance(): void {
   // this.maintenanceService.getAllMaintenances().subscribe((data: maintenance[]) => {
     /// this.maintenance = data;
      //this.filteredMaintenace=data;
    //});
  //}
//filterMaintenancesByStatus() {
  //if (this.selectedFilter) {
   // this.filteredMaintenace = this.maintenance.filter(e => e.statut === this.selectedFilter);
  ///} else {
    //this.filteredMaintenace = [...this.maintenance];
  //}
//}

//dat de la prpchaine  maittenance


daysOfWeek = [
  { value: 0, label: 'Dimanche' },
  { value: 1, label: 'Lundi' },
  { value: 2, label: 'Mardi' },
  { value: 3, label: 'Mercredi' },
  { value: 4, label: 'Jeudi' },
  { value: 5, label: 'Vendredi' },
  { value: 6, label: 'Samedi' }
];


eventTime: string = '';
  eventDate: string = '';
  repeatCount: number = 1;

  endDate: string = '';



//}
////viewDetails(id: number): void {
 // console.log('Voir les détails pour la maintenance id:', id);

 toggleDropdown(): void {
  this.dropdownOpen = !this.dropdownOpen;
}
showForm(formId: string): void {
  this.selectedForm = formId;
  this.dropdownOpen = false;
}


toggleJourSelection(jour: string, event: Event): void {
  const checkbox = event.target as HTMLInputElement;

  // Vérifie si `selectedjours` existe, sinon l'initialise
  if (!this.newMaintenance.selectedjours) {
    this.newMaintenance.selectedjours = [];
  }

  if (checkbox.checked) {
    if (!this.newMaintenance.selectedjours.includes(jour)) {
      this.newMaintenance.selectedjours.push(jour);
    }
  } else {
    this.newMaintenance.selectedjours = this.newMaintenance.selectedjours.filter(j => j !== jour);
  }

  console.log("Jours sélectionnés après modification :", this.newMaintenance.selectedjours);
}



toggleMoisSelection(mois: string, event: Event) {
  const checkbox = event.target as HTMLInputElement; // Assure que c'est bien une case à cocher
  if (!this.newMaintenance.selectedmois) {
    this.newMaintenance.selectedmois = []; // Initialise si c'est null
  }

  if (checkbox.checked) {
    this.newMaintenance.selectedmois.push(mois);
  } else {
    this.newMaintenance.selectedmois = this.newMaintenance.selectedmois.filter(m => m !== mois);
  }
}


checkMaintenanceStartDate(): void {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Ignore l'heure pour la comparaison

  this.filteredMaintenace.forEach(maintenance => {
    const startDate = new Date(maintenance.startDaterep);
    startDate.setHours(0, 0, 0, 0); // Ignore l'heure pour la comparaison

    if (startDate.getTime() === today.getTime()) {
      this.showNotification(`La maintenance ${maintenance.id} commence aujourd'hui !`);
    }
  });
}

showNotification(message: string): void {
  this.toastr.info(message, 'Notification', {
    timeOut: 5000, // Durée d'affichage de la notification (5 secondes)
    positionClass: 'toast-top-right', // Position de la notification
    closeButton: true, // Bouton de fermeture
    progressBar: true // Barre de progression
  });
}


onNotificationClick(notification: any): void {
  // Ici, tu peux décider de l'action à effectuer quand une notification est cliquée.
  // Par exemple, naviguer vers une page de détails, afficher un modal, etc.

  console.log('Notification cliquée:', notification);





}










startTask(id: number): void {
  this.maintenanceService.startTask(id).subscribe(
    (updatedMaintenance) => {
      // Mettre à jour à la fois maintenances et filteredMaintenace
      const index = this.maintenances.findIndex(m => m.id === id);
      if (index !== -1) {
        this.maintenances[index] = updatedMaintenance;
        this.filteredMaintenace = [...this.maintenances];
      }
      this.toastr.success('Tâche commencée avec succès');
    },
    (error) => {
      console.error('Error starting task:', error);
      this.toastr.error('Erreur lors du démarrage de la tâche');
    }
  );
}


markAsCompleted(id: number): void {
  this.maintenanceService.markAsCompleted(id).subscribe(
    (updatedMaintenance) => {
      const index = this.maintenances.findIndex(m => m.id === id);
      if (index !== -1) {
        this.maintenances[index] = updatedMaintenance;
      }
      // Trigger the intervention form after marking as completed
      this.openInterventionForm(id);
    },
    (error) => {
      console.error('Error marking task as completed:', error);
    }
  );
}


markAsCompletedd(id: number): void {
  this.maintenanceService.markAsCompleted(id).subscribe(
    (updatedMaintenance) => {
      const index = this.maintenances.findIndex(m => m.id === id);
      if (index !== -1) {
        this.maintenances[index] = updatedMaintenance;
      }
      // Trigger the intervention form after marking as completed
      this.openInterventionForm(id);
    },
    (error) => {
      console.error('Error marking task as completed:', error);
    }
  );
}

openConfirmationDialog(action: 'start' | 'complete', maintenanceId: number): void {
  this.actionType = action;
  this.currentMaintenanceId = maintenanceId;

  if (action === 'start') {
    this.confirmationMessage = 'Êtes-vous sûr de vouloir commencer cette tâche ?';
  } else if (action === 'complete') {
    this.confirmationMessage = 'Êtes-vous sûr de vouloir marquer cette tâche comme terminée ?';
  }

  this.showConfirmation = true;
}
confirmAction(): void {
  if (this.actionType === 'start' && this.currentMaintenanceId !== null) {
    this.startTask(this.currentMaintenanceId); // Utilisez startTaskk() au lieu de startTask()
  } else if (this.actionType === 'complete' && this.currentMaintenanceId !== null) {
    this.markAsCompleted(this.currentMaintenanceId);
  }
  this.showConfirmation = false;
}


cancelAction(): void {
  this.showConfirmation = false;
}

openInterventionForm(maintenanceId: number): void {
  console.log('Opening intervention form for maintenance:', maintenanceId);
  this.showInterventionForm = true;
  this.intervention.maintenanceId = maintenanceId;
  this.intervention.technicienId = this.technicienId;
}

 // Method to handle file input change
 onFileChange(event: any): void {
  this.selectedFile = event.target.files[0]; // Capture the selected file
}
submitIntervention(): void {
  if (this.selectedFile) {
    // Prepare the intervention data along with the file for upload
    const interventionData = {
      description: this.intervention.description,
      remarques: this.intervention.remarques,
      maintenanceId: this.intervention.maintenanceId,
      technicienId: this.intervention.technicienId,
      piecesDetachees: this.selectedPieces,
    };

    // Call the service method to send the data along with the file
    this.InterventionPreventiceService.createIntervention(interventionData, this.selectedFile).subscribe(
      (newIntervention) => {
        console.log('Intervention added successfully:', newIntervention);
        this.showInterventionForm = false;  // Hide the form after submission
        this.router.navigate(['/interventionsP/liste']);
      },
      (error) => {
        console.error('Error creating intervention:', error);
      }
    );
  }
}


onPiecesChange(event: Event): void {
  const selectedOptions = (event.target as HTMLSelectElement).selectedOptions;
  this.selectedPieces = Array.from(selectedOptions).map(opt => Number(opt.value));
}









}
