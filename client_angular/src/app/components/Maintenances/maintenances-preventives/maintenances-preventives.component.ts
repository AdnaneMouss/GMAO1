import { Component, ElementRef, OnInit, Pipe } from '@angular/core';
import { MaintenanceService } from '../../../services/maintenance.service';
import * as XLSX from 'xlsx';
import 'jspdf-autotable';
import { ChangeDetectorRef } from '@angular/core';
import { Equipement } from '../../../models/equipement';
import { EquipementService } from '../../../services/equipement.service';
import { User } from '../../../models/user';
import { UserService } from '../../../services/user.service';
import { Batiment } from '../../../models/batiment';
import { BatimentService } from '../../../services/batiment.service';
import { maintenance } from '../../../models/maintenance';
import { TypesEquipements } from '../../../models/types-equipements';
import { Salle } from '../../../models/salle';
import { Etage } from '../../../models/etage';
import { Service } from '../../../models/service';
import { RepetitionType } from '../../../models/RepetitionType';
import { interval, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../../../services/NotificationService';
import { AttributEquipements } from '../../../models/attribut-equipement';
import { EtageService } from '../../../services/etage.service';
import { WebSocketService } from '../../../services/WebSocketService';
import { ChatService } from '../../../services/ChatService';
import { AuthService } from '../../../services/auth.service';



@Component({
  selector: 'app-maintenances-preventives',
  templateUrl: './maintenances-preventives.component.html',
  styleUrl: './maintenances-preventives.component.css'
})



export class MaintenancesPreventivesComponent implements OnInit {
  maintenance: maintenance[] = [];
  selectedFilter: string = '';
  isSortedAZ: boolean = true;
  errorMessage: string = '';
  isSearchOpen = false;
  searchTerm = '';
  message: string = '';
  searchText: string = '';
  isScrolling = false;

  filteredMaintenace = [...this.maintenance];
  equipements: Equipement[] = [];
  typesEquipements: TypesEquipements[] = []
  users  :User[]  =[];
  selectedFile: File | null = null;  // Déclarer selectedFile ici ICI
  isValid: boolean = true;
  updateSuccessful: boolean = false;
  addSuccessful: boolean = false;
  successMessage:string= '';
  showEditModal = false;
  showNotificationsPanel: boolean = false;
notificationCount: number = 0;
notifications: any[] = []; // Doit être alimenté depuis le backend
unreadMessagesCount: number = 0;

  dateDebutPrevue: string = '';     // Filtre sur la date de début prévue
  dateFinPrevue: string = '';       // Filtre sur la date de fin prévue

  batiments: any[] = [];
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
  notificationMessage: string = ''; // Variable pour stocker le message de notification

  notification: {id: number, message: string}[] = [];
  currentPage: number = 0;
  pageSize: number = 15 // 20 éléments par page
 
scrollTimeout: any;
 nextRepetitionDates: Date[] = [];
    nextRepetitionDatesAsList: Date[] = [];
  selectedAttribut: any;
  selectedEquipementId: number | null = null;
  selectedEquipement: string = '';
  selectedEquipementDetails: any;

  selectedBatiment: number = 0;
  selectedEtage: number = 0;
  selectedSalle: number = 0;
  etages: any[] = [];
  salles: any[] = [];
  editableDates: string[] = [];
  









private checkInterval: Subscription | undefined;


generatedDates: Date[] = [];
maintenanceToCancel: number | null = null;

showNotificationm: boolean = false;
notificationMessagecHAT: string = '';

  private unreadMessages: {[key: string]: number} = {};

selectedMaintenance: maintenance | null = null;
showUpdatePanel: boolean = false;
showModal: boolean = false;




showNotifications: boolean = false;

  selectedDays: { [key: string]: boolean } = {
    LUNDI: false,
    MARDI: false,
    MERCREDI: false,
    JEUDI: false,
    VENDREDI: false,
    SAMEDI: false,
    DIMANCHE: false,
  };

isExpanded = false;

toggleFormSize() {
  this.isExpanded = !this.isExpanded;
}
hasRepetitionDates(): boolean {
  return Array.isArray(this.selectedMaintenance?.nextRepetitionDatesAsList)
    && this.selectedMaintenance!.nextRepetitionDatesAsList!.length > 0;
}
handleDateChange(event: Event, index: number): void {
  const input = event.target as HTMLInputElement;
  const newDate = input.value;

  if (
    this.selectedMaintenance &&
    Array.isArray(this.selectedMaintenance.nextRepetitionDatesAsList)
  ) {
    this.selectedMaintenance.nextRepetitionDatesAsList[index] = newDate;

    console.log(`Date mise à jour à l'index ${index} : ${newDate}`);

    // Envoie de l'objet complet au backend
    this.maintenanceService.updateMaintenance(
      this.selectedMaintenance.id,
      this.selectedMaintenance // ✅ c'est bien un objet de type "maintenance"
    ).subscribe({
      next: () => console.log('Maintenance mise à jour avec succès'),
      error: (err) => console.error('Erreur lors de la mise à jour :', err)
    });
  }
}



selectMaintenance(maintenance: any): void {
    this.selectedMaintenance = maintenance;  // Affecte la maintenance sélectionnée
  }
  // Méthode pour mettre à jour le seuil à partir de l'attribut sélectionné
updateSeuilFromAttribut() {
  if (this.selectedAttribut && this.selectedAttribut.valeur) {
    // Convertit la valeur en nombre si possible
    const numericValue = parseFloat(this.selectedAttribut.valeur);
    if (!isNaN(numericValue)) {
      this.newMaintenance.seuil = numericValue;
    }
  }
}
// Méthode appelée lors du changement d'attribut
onAttributChange(attribut: any) {
  this.selectedAttribut = attribut;
  this.updateSeuilFromAttribut();
}


  // Implémentez ici la logique de filtrage de vos données en fonction des valeurs de `selectedEquipement`, `dateDebutPrevue`, et `dateFinPrevue`
  filteredMaintenances = this.maintenance;

applyFilters(): void {
  const filteredMaintenances = this.maintenances.filter(maintenance => {
    let match = true;

    // Filtrage par équipement
    if (this.selectedEquipement && !maintenance.equipement.toLowerCase().includes(this.selectedEquipement.toLowerCase())) {
      match = false;
    }

    // Filtrage par date de début prévue
    if (this.dateDebutPrevue && new Date(maintenance.dateDebutPrevue) < new Date(this.dateDebutPrevue)) {
      match = false;
    }

    // Filtrage par date de fin prévue
    if (this.dateFinPrevue && new Date(maintenance.dateFinPrevue) > new Date(this.dateFinPrevue)) {
      match = false;
    }

    return match;
  });

  // Mettre à jour la liste filtrée
  this.filteredMaintenances = filteredMaintenances;
  // Réinitialiser la pagination à la première page
  this.currentPage = 0;
}

selectedMoiss: { [key: string]: boolean } = {};



  getDays(): string[] {
    return Object.keys(this.selectedDays);
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
  return ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
}

  toggleDay(day: string): void {
    this.selectedDays[day] = !this.selectedDays[day];
    this.updateSelectedJours();
  }
 toggleMois(mois: string): void {
  this.selectedMoiss[mois] = !this.selectedMoiss[mois];
}


   updateSelectedJours(): void {
    this.newMaintenance.selectedjours = Object.keys(this.selectedDays)
      .filter(day => this.selectedDays[day]);
  }

  updateSelectedMois(): void {
    this.newMaintenance.selectedmois = Object.keys(this.selectedMois)
      .filter(mois => this.selectedMois[mois]);
  }
  joursSemaine: string[] = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  moisAnnee: string[] = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];


  selectedAttributs: AttributEquipements[] = [];
addRepetitionDate(): void {
  if (!this.newMaintenance.nextRepetitionDatesAsList) {
    this.newMaintenance.nextRepetitionDatesAsList = [];
  }
  this.newMaintenance.nextRepetitionDatesAsList.push('');
}




  closeForm() {
    this.selectedForm= null; // Ferme le formulaire
  }
  newMaintenance: maintenance = {
    equipement: {} as Equipement,
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
      Intervention: {
        id: 0,
        technicienId: 0,
        typeIntervention: 'PREVENTIVE',
        description: '',
        duree: 0,
        maintenanceId: 0,
        maintenanceStatut: 'EN_ATTENTE',
        maintenancePriorite: 'NORMALE',
        dateCommencement: undefined,
        dateCloture: undefined,
        dateCreation: undefined,
        equipementMaintenu: '',
        remarques: '',
        photos: [],
        piecesDetachees: []
      }
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
    equipementNom:'',


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



    this.selectedEquipementDetails = this.equipements.find(
      equipement => equipement.nom === this.newMaintenance.equipement.nom
    ) || null;

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


  onEquipementChanger(): void {
    // Find the selected equipement by name
    this.selectedEquipementDetails = this.equipements.find(
      equipement => equipement.nom === this.newMaintenance.equipement.nom
    ) || null;

  }
  onEquipementSelected() {
    const selected = this.equipements.find(e => e.id === this.newMaintenance.equipementId);
    if (selected) {
      this.newMaintenance.equipementNom = selected.nom;
      this.newMaintenance.equipement = selected; // si tu veux stocker tout l'objet
    }
  }

 
  



 
onToggleJour(jour: string, event: Event): void {
  const checked = (event.target as HTMLInputElement).checked;
  if (!this.newMaintenance.selectedjours) {
    this.newMaintenance.selectedjours = [];
  }

  if (checked) {
    if (!this.newMaintenance.selectedjours.includes(jour)) {
      this.newMaintenance.selectedjours.push(jour);
    }
  } else {
    this.newMaintenance.selectedjours = this.newMaintenance.selectedjours.filter(j => j !== jour);
  }
}

// Ajouter ou retirer un mois sélectionné
onToggleMois(mois: string, event: Event): void {
  const checked = (event.target as HTMLInputElement).checked;
  if (!this.newMaintenance.selectedmois) {
    this.newMaintenance.selectedmois = [];
  }

  if (checked) {
    if (!this.newMaintenance.selectedmois.includes(mois)) {
      this.newMaintenance.selectedmois.push(mois);
    }
  } else {
    this.newMaintenance.selectedmois = this.newMaintenance.selectedmois.filter(m => m !== mois);
  }
}


  showPanel = false; // Controls the panel visibility
  searchVisible: boolean = false;
  maintenances: any[] = []; // Tableau pour stocker les maintenances

 updateMaintenance() {
  if (!this.selectedMaintenance || !this.selectedMaintenance.id) return;
  
  // Préparer les données de répétition
  if (this.selectedMaintenance.repetitiontype !== 'Ne_pas_repeter') {
    this.selectedMaintenance.selectedjours = Object.keys(this.selectedDays)
      .filter(day => this.selectedDays[day]);
    
    // Pour les mois si c'est mensuel
    if (this.selectedMaintenance.repetitiontype === 'MENSUEL') {
      // Rien à faire car les mois sont déjà dans selectedMaintenance.selectedmois
    }
    
    // Calculer le nombre de répétitions
    this.calculateRepetitionDatesForUpdate();
  }
  const startDate = this.newMaintenance.startDaterep instanceof Date
        ? this.newMaintenance.startDaterep
        : new Date(this.newMaintenance.startDaterep);
  
      const endDate = this.newMaintenance.endDaterep instanceof Date
        ? this.newMaintenance.endDaterep
        : new Date(this.newMaintenance.endDaterep)
   this.nextRepetitionDates = this.calculateRepetitionDates(
      startDate,
      endDate,
      this.newMaintenance.repetitiontype,
      this.newMaintenance.selectedjours || []
     // this.newMaintenance.selectedmois || []
    );
    this.newMaintenance.nextRepetitionDates=this.nextRepetitionDates;
  this.maintenanceService.updateMaintenance(this.selectedMaintenance.id, this.selectedMaintenance)
    .subscribe({
      next: (updated) => {
        console.log('Maintenance mise à jour avec succès :', updated);
        this.closeEditModal();
        this.chargerMaintenance();
        this.toastr.success('Maintenance mise à jour avec succès');
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour :', err);
        this.toastr.error('Erreur lors de la mise à jour');
      }
    });
}
calculateRepetitionDatesForUpdate(): void {
  if (!this.selectedMaintenance) return;
  
  if (this.selectedMaintenance.startDaterep && this.selectedMaintenance.endDaterep) {
    const start = new Date(this.selectedMaintenance.startDaterep);
    const end = new Date(this.selectedMaintenance.endDaterep);
    
    switch(this.selectedMaintenance.repetitiontype) {
      case 'TOUS_LES_JOURS':
        this.selectedMaintenance.repetition = this.calculateDaysBetween(start, end);
        break;
      case 'TOUS_LES_SEMAINES':
        this.selectedMaintenance.repetition = this.calculateWeeksBetween(start, end);
        break;
      case 'MENSUEL':
        // Calcul spécial pour les mois sélectionnés
        this.selectedMaintenance.repetition = this.calculateSelectedMonthsBetween(
          start, 
          end, 
          this.selectedMaintenance.selectedmois || []
        );
        break;
      case 'ANNUEL':
        this.selectedMaintenance.repetition = this.calculateYearsBetween(start, end);
        break;
      default:
        this.selectedMaintenance.repetition = 0;
    }
  }
}
private calculateSelectedMonthsBetween(start: Date, end: Date, selectedMonths: string[]): number {
  if (selectedMonths.length === 0) return 0;
  
  const monthNames = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];
  
  let count = 0;
  let current = new Date(start);
  current.setDate(1); // Commencer au premier du mois
  
  while (current <= end) {
    const currentMonthName = monthNames[current.getMonth()];
    if (selectedMonths.includes(currentMonthName)) {
      count++;
    }
    current.setMonth(current.getMonth() + 1);
  }
  
  return count;
}
private calculateDaysBetween(start: Date, end: Date): number {
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

private calculateWeeksBetween(start: Date, end: Date): number {
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
}

private calculateMonthsBetween(start: Date, end: Date): number {
  let months = (end.getFullYear() - start.getFullYear()) * 12;
  months -= start.getMonth();
  months += end.getMonth();
  return months <= 0 ? 0 : months;
}

private calculateYearsBetween(start: Date, end: Date): number {
  return end.getFullYear() - start.getFullYear();
}
handleFrequenceChange() {
  if (!this.selectedMaintenance) return;
  
  // Réinitialiser les sélections
  if (this.selectedMaintenance.repetitiontype !== 'TOUS_LES_SEMAINES') {
    
  }
  
  if (this.selectedMaintenance.repetitiontype !== 'MENSUEL') {
    this.selectedMaintenance.selectedmois = [];
  }
  
  this.calculateRepetitionDatesForUpdate();
}
  toggleMoisSelection(mois: string, event: any) {
  const isChecked = event.target.checked;
  
  if (!this.newMaintenance.selectedmois) {
    this.newMaintenance.selectedmois = [];
  }
  
  if (isChecked) {
    if (!this.newMaintenance.selectedmois.includes(mois)) {
      this.newMaintenance.selectedmois.push(mois);
    }
  } else {
    this.newMaintenance.selectedmois = this.newMaintenance.selectedmois.filter(m => m !== mois);
  }
  
  this.calculateRepetitionDatesForUpdate();
}
  
  

  constructor(private maintenanceService: MaintenanceService,
    private cdr: ChangeDetectorRef,private equipementService: EquipementService,
    private userService: UserService, batimentservice:BatimentService,
    private router: Router,
     private route: ActivatedRoute,private toastr: ToastrService,
     private http: HttpClient,private notificationService: NotificationService,
     private batimentService: BatimentService ,
<<<<<<< HEAD

      
      private webSocketService: WebSocketService,
      private chatService: ChatService,
      private authService: AuthService,
      

      private etageService: EtageService) { }



=======
      private etageService: EtageService,
      private webSocketService: WebSocketService,
      private chatService: ChatService,
      private authService: AuthService,) { }
>>>>>>> a5c55b18f0be14a6db6c328e7858cf0302fafee9

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

  filterMaintenancesByEquipement() {
    console.log("Maintenances Data:", this.maintenances);
  
    let filtered = this.maintenances;
  
    // Filtrer par équipement sélectionné
    if (this.selectedEquipement) {
      filtered = filtered.filter(e => e.equipementNom === this.selectedEquipement);
      console.log("Filtered by selected equipment:", filtered);
    }
  
    // Filtrer par texte tapé dans la barre de recherche (insensible à la casse)
    if (this.searchText && this.searchText.trim() !== '') {
      const searchLower = this.searchText.toLowerCase();
      filtered = filtered.filter(e => e.equipementNom.toLowerCase().includes(searchLower));
      console.log("Filtered by search text:", filtered);
    }
  
    this.filteredMaintenace = filtered;
  }
  

  filterMaintenancesBydateDebutPrevue(){
    console.log("Maintenances Data:", this.maintenances);

    if (this.dateDebutPrevue) {
      // Filtrer en fonction de la priorité sélectionnée
      this.filteredMaintenace = this.maintenances.filter(e => e.dateDebutPrevue === this.dateDebutPrevue);
      console.log("Filtered Maintenances:", this.filteredMaintenace);  // Afficher les maintenances filtrées
      console.log("Selected date:", this.dateDebutPrevue);  // Afficher la priorité sélectionnée
    } else {
      // Réinitialiser la liste filtrée si aucune priorité n'est sélectionnée
      this.filteredMaintenace = [...this.maintenances];
      console.log("No priorite selected, showing all maintenances:", this.filteredMaintenace);
    }

  }

  filterMaintenancesBydatedateFinPrevue(){
    console.log("Maintenances Data:", this.maintenances);

    if (this.dateFinPrevue) {
      // Filtrer en fonction de la priorité sélectionnée
      this.filteredMaintenace = this.maintenances.filter(e => e.dateFinPrevue === this.dateFinPrevue);
      console.log("Filtered Maintenances:", this.filteredMaintenace);  // Afficher les maintenances filtrées
      console.log("Selected date:", this.dateFinPrevue);  // Afficher la priorité sélectionnée
    } else {
      // Réinitialiser la liste filtrée si aucune priorité n'est sélectionnée
      this.filteredMaintenace = [...this.maintenances];
      console.log("No priorite selected, showing all maintenances:", this.filteredMaintenace);
    }

  }
  resetDates() {
    this.dateDebutPrevue = '';
    this.dateFinPrevue = '';
    this.filteredMaintenace = [...this.maintenances]; // Réaffiche tout
    console.log("Dates réinitialisées. Toutes les maintenances affichées.");
  }
  terminerMaintenance(id: number) {
    this.maintenanceService.changerStatutEnTermine(id).subscribe(() => {
      const item = this.maintenances.find(m => m.id === id);
      if (item) {
        item.statut = 'ANNULEE';
      }
    }, error => {
      console.error('Erreur lors du changement de statut', error);
    });
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

  cancelTask(id: number): void {
    this.maintenanceService.cancelTask(id).subscribe(
      (updatedMaintenance) => {
        const index = this.maintenances.findIndex(m => m.id === id);
        if (index !== -1) {
          this.maintenances[index] = updatedMaintenance;
          this.chargerMaintenance();
          this.maintenanceToCancel=null;
        }
      },
      (error) => {
        console.error('Error cancelling task:', error);
      }
    );
  }
  
  

  confirmCancelTask(id: number): void {
    console.log('Confirm cancel task for ID:', id);
    this.maintenanceToCancel = id;
  }
  

  cancelCancelTask(id: number): void {
    this.maintenanceService.cancelTask(id).subscribe(() => {
      const item = this.maintenances.find(m => m.id === id);
      if (item) {
        item.statut = 'ANNULEE';
      }
    }, error => {
      console.error('Erreur lors du changement de statut', error);
    });
  }
  

  openAddModal() {
    this.showModal = true;
  }

  openEditModal(maintenance: any) {
  this.selectedMaintenance = { ...maintenance };
  
  // Initialiser les jours sélectionnés
  if (this.newMaintenance.selectedjours) {
    this.selectedDays = {
      'LUNDI': this.newMaintenance.selectedjours.includes('LUNDI'),
      'MARDI': this.newMaintenance.selectedjours.includes('MARDI'),
      'MERCREDI': this.newMaintenance.selectedjours.includes('MERCREDI'),
      'JEUDI': this.newMaintenance.selectedjours.includes('JEUDI'),
      'VENDREDI': this.newMaintenance.selectedjours.includes('VENDREDI'),
      'SAMEDI': this.newMaintenance.selectedjours.includes('SAMEDI'),
      'DIMANCHE': this.newMaintenance.selectedjours.includes('DIMANCHE')
    };
  }
  if (this.newMaintenance.repetitiontype === 'MENSUEL') {
    this.newMaintenance.selectedmois = this.newMaintenance.selectedmois || [];
  }
  
  this.showEditModal = true;
}
  
  

  closeEditModal() {
    this.showEditModal = false;
  }
  







  calculateRepetitionDates(startDate: Date, endDate: Date, repetitionType: string, selectedDays: string[]): Date[] {
    let dates: Date[] = [];

    if (!startDate || !endDate) return dates;

    // Cas sans répétition
    if (repetitionType === 'Ne_pas_repeter') {
        dates.push(new Date(startDate));
        return dates;
    }

    // Cas répétition hebdomadaire avec jours spécifiques
    if (repetitionType === 'TOUS_LES_SEMAINES' && selectedDays && selectedDays.length > 0) {
        return this.calculateWeeklyDatesWithSelectedDays(startDate, endDate, selectedDays);
    }

    // Autres cas de répétition
    let currentDate = new Date(startDate);
    dates.push(new Date(currentDate));

    while (currentDate < endDate) {
        switch (repetitionType) {
            case 'TOUS_LES_JOURS':
                currentDate.setDate(currentDate.getDate() + 1);
                break;
            case 'TOUS_LES_SEMAINES':
                currentDate.setDate(currentDate.getDate() + 7);
                break;
            case 'MENSUEL':
                currentDate.setMonth(currentDate.getMonth() + 1);
                break;
            case 'ANNUEL':
                currentDate.setFullYear(currentDate.getFullYear() + 1);
                break;
        }

        if (currentDate <= endDate) {
            dates.push(new Date(currentDate));
        }
    }

    return dates;
}

calculateWeeklyDatesWithSelectedDays(startDate: Date, endDate: Date, selectedDays: string[]): Date[] {
    const dates: Date[] = [];
    let currentDate = new Date(startDate);
    const end = new Date(endDate);

    // Mapping des jours sélectionnés vers les numéros JS (0=Dimanche, 1=Lundi, ..., 6=Samedi)
    const dayMap: { [key: string]: number } = {
        'D': 0,  // Dimanche
        'L': 1,  // Lundi
        'M': 2,  // Mardi
        'MER': 3, // Mercredi
        'J': 4,  // Jeudi
        'V': 5,  // Vendredi
        'S': 6   // Samedi
    };

    const targetDays: number[] = selectedDays.map(day => dayMap[day]).filter(d => d !== undefined);

    // Vérifier que targetDays n'est pas vide pour éviter une boucle infinie
    if (targetDays.length === 0) {
        console.warn('Aucun jour valide sélectionné pour la répétition hebdomadaire.');
        return dates;
    }

    // Parcourir chaque jour jusqu'à la date de fin
    while (currentDate <= end) {
        if (targetDays.includes(currentDate.getDay())) {
            dates.push(new Date(currentDate));
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
}

getDatesFromSelectedMonthsInRange(): Date[] {
  const start = this.newMaintenance.startDaterep;
  const end = this.newMaintenance.endDaterep;
  const selectedMonths = this.newMaintenance.selectedmois;

  if (!start || !end || !selectedMonths || selectedMonths.length === 0) {
    return [];
  }

  const startDate = new Date(start);
  const endDate = new Date(end);
  const result: Date[] = [];

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  let current = new Date(startDate);
  current.setDate(1); // pour toujours partir du premier du mois

  while (current <= endDate) {
    const currentMonthName = monthNames[current.getMonth()];
    if (selectedMonths.includes(currentMonthName)) {
      result.push(new Date(current));
    }

    // passer au mois suivant
    current.setMonth(current.getMonth() + 1);
  }

  return result;
}
filteredDates: Date[] = [];

updateFilteredDates() {
  this.filteredDates = this.getDatesFromSelectedMonthsInRange();
}
toggleMoisSelectionn(mois: string, event: any) {
  if (event.target.checked) {
    this.newMaintenance.selectedmois.push(mois);
  } else {
    this.newMaintenance.selectedmois = this.newMaintenance.selectedmois.filter(m => m !== mois);
  }
  this.updateFilteredDates(); // Mettre à jour les dates affichées
}















  ngOnInit(): void {
   this.startAutoCheck();
   const id = Number(this.route.snapshot.paramMap.get('id'));
   if (id) {
     this.fetchMaintenanceDetails(id);
   }
    this.chargerMaintenance();
    this.chargerEquipements();
    this.filteredMaintenace;
    this.chargerUsers();
    this.userService.getAllUsers().subscribe((data: any[]) => {
      console.log('Utilisateurs reçus:', data); // Vérifier la réponse de l'API
      this.users = data;
      // Appliquer les filtres

      this.filteredTechnicienUsers = this.filterTechnicienUsers(this.users);
      console.log('Utilisateurs techniciens:', this.filteredTechnicienUsers);
      this.filteredResponsableUsers = this.filterResponsableUsers(this.users);
      console.log('Utilisateurs responsables:', this.filteredResponsableUsers);
    });

    this.checkMaintenanceStartDate();
    this.chargerEquipements();
    this.loadBatiments();
    this.setupChatNotifications();
    window.addEventListener('scroll', this.handleScroll.bind(this));

<<<<<<< HEAD
     for (let mois of this.getMois()) {
    this.selectedMoiss[mois] = false;

    if (this.newMaintenance?.nextRepetitionDatesAsList) {
    this.editableDates = this.newMaintenance.nextRepetitionDatesAsList.map(dateStr =>
      new Date(dateStr).toISOString().slice(0, 10)
    );
  }
  }
  
  
=======

>>>>>>> a5c55b18f0be14a6db6c328e7858cf0302fafee9

  }
  private setupChatNotifications(): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    // Écoute les nouveaux messages
    this.webSocketService.onMessage().subscribe((message) => {
      if (message.receiver === user.username) {
        this.incrementUnreadCount(message.sender);
      }
    });
    this.chatService.getUnreadMessagesCount().subscribe(count => {
      this.unreadMessagesCount = count;
      this.cdr.detectChanges();
    });
  }
  private incrementUnreadCount(sender: string): void {
    if (!this.unreadMessages[sender]) {
      this.unreadMessages[sender] = 0;
    }
    this.unreadMessages[sender]++;
    this.unreadMessagesCount = Object.values(this.unreadMessages).reduce((a, b) => a + b, 0);
    this.cdr.detectChanges();
  }
  clearNotificationss(): void {
    this.unreadMessagesCount = 0;
    this.unreadMessages = {};
    this.cdr.detectChanges();
  }




  handleScroll() {
    this.isScrolling = true;
  
    clearTimeout(this.scrollTimeout);
    this.scrollTimeout = setTimeout(() => {
      this.isScrolling = false;
    }, 1000); // 1 seconde après arrêt du scroll
  }


  getPaginatedMaintenances(): any[] {
    const startIndex = this.currentPage * this.pageSize;
    return this.filteredMaintenace.slice(startIndex, startIndex + this.pageSize);
  }
  getTotalPages(): number {
    return Math.ceil(this.filteredMaintenace.length / this.pageSize);
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


  getMin(a: number, b: number): number {
    return Math.min(a, b);
  }








  startAutoCheck(): void {
    // Vérifier toutes les 5 minutes (300000 ms)
    this.checkInterval = interval(300000).subscribe(() => {
      this.checkUpcomingMaintenances();
    });
    // Faire une vérification immédiate au démarrage
    this.checkUpcomingMaintenances();
  }
  checkUpcomingMaintenances(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    this.maintenanceService.getAllMaintenances().subscribe(maintenances => {
      this.notifications = []; // Réinitialiser les notifications
      this.notificationCount = 0;

      maintenances.forEach(maintenance => {
        // Vérifier les maintenances qui commencent aujourd'hui


        // Vérifier les répétitions de maintenance
        if (maintenance.startDaterep && maintenance.endDaterep) {
          const repetitionDates = this.calculateRepetitionDates(
            new Date(maintenance.startDaterep),
            new Date(maintenance.endDaterep),
            maintenance.repetitiontype,
            maintenance.selectedjours
          );

          repetitionDates.forEach(date => {
            date.setHours(0, 0, 0, 0);
            if (date.getTime() === today.getTime()) {
              this.addNotification(
                maintenance.id,
                `🔁 Répétition de la maintenance #${maintenance.id} (${maintenance.repetitiontype}) prévue aujourd'hui !`
              );
            }
          });
        }

        // Vérifier si la valeur suivie dépasse le seuil
        if (
          typeof maintenance.valeurSuivi === 'number' &&
          typeof maintenance.seuil === 'number' &&
          maintenance.valeurSuivi >= maintenance.seuil
        ) {
          this.addNotification(
            maintenance.id,
            `⚠️ Attention : La valeur suivie (${maintenance.valeurSuivi}) de la maintenance #${maintenance.id} a atteint ou dépassé le seuil (${maintenance.seuil}) !`
          );
        }
      });
    });
  }


  private addNotification(id: number, message: string): void {
    if (!this.notification.some(n => n.id === id)) {
      const newNotification = { id, message };

      this.notificationService.addNotification(newNotification).subscribe({
      next: () => console.log('Notification sauvegardée'),
        error: (err) => console.error('Erreur lors de la sauvegarde', err)
      });

      this.notification.push(newNotification);
      this.notificationCount++;
      //this.showToastNotification(message);
    }
  }



   // showToastNotification(message: string): void {
    //this.toastr.info(message, 'Nouvelle maintenance', {
     // timeOut: 5000,
     // positionClass: 'toast-top-right',
     // closeButton: true,
     // progressBar: true
    //});

  //}



  showToastNotification(message: string): void {
    this.toastr.info(message, 'Nouvelle maintenance', {
      timeOut: 5000,
      positionClass: 'toast-top-right',
      closeButton: true,
      progressBar: true
    });

  }

  toggleNotificationsPanel(event: MouseEvent): void {
    event.stopPropagation(); // Empêche le clic sur cloche de remonter à l'élément parent
    this.showNotificationsPanel = !this.showNotificationsPanel;
    if (!this.showNotificationsPanel) {
      this.notificationCount = 0;
    }
  }



  clearNotifications(): void {
    this.notifications = [];
    this.notificationCount = 0;
    this.showNotificationsPanel = false;
  }
  ngOnDestroy(): void {
    if (this.checkInterval) {
      this.checkInterval.unsubscribe();
    }
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



  // Méthode pour calculer la durée de l'intervention
  calculerDureeIntervention(): void {
    if (this.newMaintenance.dateDebutPrevue && this.newMaintenance.dateFinPrevue) {
      const startDate = new Date(this.newMaintenance.dateDebutPrevue);
      const endDate = new Date(this.newMaintenance.dateFinPrevue);


    }
  }

   calculer(seuil: number, valeurSuivi: number): string {
    return valeurSuivi >= seuil
      ? "🔧 Attention ! La valeur suivie a atteint le seuil."
      : "✅ La valeur suivie est encore en dessous du seuil.";
  }


  //Méthode pour calculer la REPETITION de l'intervention
  calculerRepetition(): void {
    if (this.newMaintenance.startDaterep && this.newMaintenance.endDaterep && this.newMaintenance.repetitiontype) {
      const startDaterep = new Date(this.newMaintenance.startDaterep);
      const endDaterep = new Date(this.newMaintenance.endDaterep);
      const repetitiontype = this.newMaintenance.repetitiontype;
      const selectedjours = this.newMaintenance.selectedjours || []; // S'assure que ce n'est pas undefined

      console.log("Envoi des données :", {
        startDaterep,
        endDaterep,
        repetitiontype,
        selectedjours
      });




    }
  }




  exportToExcel(): void {
    // Créer un tableau de données au format Excel
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.maintenances);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Maintenances');

    // Télécharger le fichier Excel
    XLSX.writeFile(wb, 'maintenances.xlsx');
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
/////NOTIFICATION SUBCRIBE
 // startAutoCheck(): void {
   // this.checkInterval = interval(60000).subscribe(() => { // Vérifier toutes les 60 secondes
     // this.fetchMaintenanceDetails(id: number);
    //});
  //}
  fetchMaintenanceDetails(id: number): void {
    this.maintenanceService.getMaintenanceById(id).subscribe({
      next: (data) => {
        this.newMaintenance = data;
        console.log('Maintenance details:', this.newMaintenance);

        // Vérifier les dates de répétition après récupération des données


        if (this.newMaintenance.startDaterep && this.newMaintenance.endDaterep) {
          const repetitionDates: Date[] = [];
          let currentDate = new Date(this.newMaintenance.startDaterep);
          let endDaterep = new Date(this.newMaintenance.endDaterep);
          let selectedjours: number[] = (this.newMaintenance.selectedjours || []).map(Number); // Assurer que c'est bien un tableau de nombres

          while (currentDate <= endDaterep) {
            // Vérifier si la date doit être ajoutée pour une répétition hebdomadaire avec jours spécifiques
            if (
              this.newMaintenance.repetitiontype !== 'TOUS_LES_SEMAINES' ||
              selectedjours.includes(currentDate.getDay())
            ) {
              repetitionDates.push(new Date(currentDate));
            }

            switch (this.newMaintenance.repetitiontype) {
              case 'TOUS_LES_JOURS':
                currentDate.setDate(currentDate.getDate() + 1);
                break;

              case 'TOUS_LES_SEMAINES':
                if (selectedjours.length > 0) {
                  let nextDayFound = false;
                  while (!nextDayFound) {
                    currentDate.setDate(currentDate.getDate() + 1);
                    if (selectedjours.includes(currentDate.getDay())) {
                      nextDayFound = true;
                    }
                  }
                } else {
                  currentDate.setDate(currentDate.getDate() + 7);
                }
                break;

              case 'MENSUEL':
                currentDate.setMonth(currentDate.getMonth() + 1);
                break;

              case 'ANNUEL':
                currentDate.setFullYear(currentDate.getFullYear() + 1);
                break;

              default:
                break;
            }
          }

          this.nextRepetitionDates = repetitionDates;
          console.log('Calculated repetition dates:', this.nextRepetitionDates);

          // Vérifier si une maintenance est prévue aujourd'hui
          this.checkForNotification(repetitionDates);
        }
      },
      error: (err) => {
        console.error('Error fetching maintenance details:', err);
        this.errorMessage = 'Failed to load maintenance details';
      }
    });
  }

  loadBatiments() {
    this.batimentService.getAllBatiments().subscribe(data => {
      this.batiments = data;
      console.log("batiments:", this.batiments);
    });
  }

  checkForNotification(repetitionDates: Date[]): void {
    const today = new Date().setHours(0, 0, 0, 0);
    for (let date of repetitionDates) {
      if (new Date(date).setHours(0, 0, 0, 0) === today) {
        this.notifications.push('Une maintenance est prévue pour aujourd\'hui !');
        this.notificationCount++;
        break;
      }
    }
  }


  // ✅ Affichage de la notification
  sendNotification(): void {
    alert('🔔 Une maintenance est prévue pour aujourd’hui !');
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
  loadEquipements(salleId: number) {
    this.equipementService.getEquipementsBySalle(salleId).subscribe(data => {
      this.equipements = data;
    });
  }




  loadSalles(etageId: number) {
    this.etageService.getSallesByEtageId(etageId).subscribe(data => {
      this.salles = data;
    });
  }

 // showNotifications(): void {
   // if (this.notifications.length > 0) {
     // alert(this.notifications.join("\n"));
    //} else {
      //alert("Aucune maintenance prévue aujourd'hui.");
    //}
  //}


togglePanel(): void {
  this.showPanel = !this.showPanel; // Toggle the panel visibility
}

addIndicateur() {
  if (this.newMaintenance && Array.isArray(this.newMaintenance.indicateurs)) {
    this.newMaintenance.indicateurs.push({ nom: '', valeur: '' });
  } else {
    console.error("newMaintenance ou indicateurs n'est pas défini correctement.");
  }
}
removeIndicateur(index: number) {
  if (this.newMaintenance?.indicateurs) {
    this.newMaintenance.indicateurs.splice(index, 1);
  }
}



addMaintenance() {
  // Assurez-vous que la date est au format Date
  if (this.newMaintenance.dateDebutPrevue) {
    this.newMaintenance.dateDebutPrevue = new Date(this.newMaintenance.dateDebutPrevue);
  }
  if (this.newMaintenance.dateFinPrevue) {
    this.newMaintenance.dateFinPrevue = new Date(this.newMaintenance.dateFinPrevue);
  }
  if (this.newMaintenance.dateProchainemaintenance) {
    this.newMaintenance.dateProchainemaintenance = new Date(this.newMaintenance.dateProchainemaintenance);
  }


  // Vérifiez que la date de début est avant la date de fin
  if (this.newMaintenance.dateDebutPrevue && this.newMaintenance.dateFinPrevue) {
    const debut = this.newMaintenance.dateDebutPrevue;
    const fin = this.newMaintenance.dateFinPrevue;
    if (debut >= fin) {
      console.error("La date de début doit être avant la date de fin.");
      this.errorMessage = "La date de début doit être avant la date de fin.";
      return;
    }
  }

  // Vérification et remplacement de la valeur vide pour 'frequence'
  if (this.newMaintenance.frequence === "") {
    this.newMaintenance.frequence = null;  // Remplacez "" par null
  }

  // Vérifiez que les indicateurs sont présents
  if (!this.newMaintenance.indicateurs) {
    this.newMaintenance.indicateurs = [];
  }

  // Ajoutez un nouvel indicateur si nécessaire
  this.newMaintenance.indicateurs.push({ nom: '', valeur: '' });

  // Vérifiez que tous les champs requis sont remplis
  const champsManquants = [];

  if (!this.newMaintenance.dateDebutPrevue) {
    champsManquants.push("Date de début prévue");
  }
  if (!this.newMaintenance.commentaires) {
    champsManquants.push("Commentaires");
  }
  if (!this.newMaintenance.dateProchainemaintenance) {
    champsManquants.push("Date de la prochaine maintenance");
  }
  if (!this.newMaintenance.dateFinPrevue) {
    champsManquants.push("Date de fin prévue");
  }
  if (!this.newMaintenance.statut) {
    champsManquants.push("Statut");
  }
  if (!this.newMaintenance.priorite) {
    champsManquants.push("Priorité");
  }

  if (!this.newMaintenance.repetitiontype) {
    champsManquants.push("repetitiontype");
  }


  if(!this.newMaintenance.action)
  {
    champsManquants.push("action")
  }
  if(!this.newMaintenance.selectedjours)
    {
      champsManquants.push("selectedjours")
    }







  // Si un champ est manquant, afficher un message d'erreur
  if (champsManquants.length > 0) {
    this.errorMessage = "Veuillez remplir les champs suivants : " + champsManquants.join(", ");
    return;
  }

  // Envoyer la maintenance au backend
  this.maintenanceService.createMaintenance(this.newMaintenance).subscribe({
    next: (response) => {
      console.log("Maintenance ajoutée avec succès", response);
      this.fetchMaintenances();  // Rafraîchir la liste
      this.resetForm();
      this.showPanel = false;
      this.successMessage = "Maintenance ajoutée avec succès";
    },
    error: (err) => {
      console.error("Erreur lors de l'ajout de la maintenance", err);
      this.errorMessage = "Erreur lors de l'ajout de la maintenance.";
    }
  });
}

joursSelectionnes: string[] = []; // Liste des jours validés
enregistrerSelection() {
  this.joursSelectionnes = Object.keys(this.selectedDays).filter(day => this.selectedDays[day]);
}

resetForm() {

    this.newMaintenance = {
      id: 0,
     dureeIntervention: 0,
      dateDebutPrevue: new Date(''), // Initialisé en tant qu'objet Date
      dateFinPrevue: new Date(''), // Initialisé en tant qu'objet Date
      dateProchainemaintenance: new Date(''),
      commentaires: '',
      documentPath :null,
      statut: 'EN_ATTENTE',
      priorite: 'NORMALE',
      repetitiontype:'Ne_pas_repeter',
      frequence:'',
      action:'VERIFICATION_PERFORMANCES',
      autreAction: '',
      startDaterep: new Date(''),
      endDaterep: new Date(''),
      indicateurs: [],
      selectedmois: [],
      selectedjours: [],
      selectedDays: {} , // Exemple : { "LUNDI": true, "MARDI": false }
      selectedMonth: {} ,  // Exemple : { "JANVIER": true, "FÉVRIER": false }
      repetitionType:'TOUS_LES_SEMAINES' ,
      startDate: new Date(''),
      endDate: new Date(''),
      repetition:0,
      seuil:0,
      message:'',
      NonSeuil:'',
      RepetitionType: RepetitionType.NE_SE_REPETE_PAS,
      equipementId:  null,
      equipementBatiment: "", equipementEtage: 0, equipementSalle: 0,
      equipementNom:'',

      equipement: {} as Equipement,
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

        Intervention: {
          id: 0,
          technicienId: 0,
          typeIntervention: 'PREVENTIVE',
          description: '',
          duree: 0,
          maintenanceId: 0,
          maintenanceStatut: 'EN_ATTENTE',
          maintenancePriorite: 'NORMALE',
          dateCommencement: undefined,
          dateCloture: undefined,
          dateCreation: undefined,
          equipementMaintenu: '',
          remarques: '',
          photos: [],
          piecesDetachees: []
        }
      },
      batiment :{

        id: 0,
        numBatiment: 0,
        intitule: '',
        etages:[],


    },



    };

}









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
navigateToChat() {
  this.router.navigate(['/CHAT']);
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
}
