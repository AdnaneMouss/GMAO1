import { Component, OnInit, Pipe } from '@angular/core';
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
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../../../services/NotificationService';

                    

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
  filteredMaintenace = [...this.maintenance];
  equipements: Equipement[] = [];
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
  notificationMessage: string = ''; // Variable pour stocker le message de notification
  notificationCount: number = 0;
  notification: {id: number, message: string}[] = [];

private checkInterval: Subscription | undefined;
showNotificationsPanel: boolean = false;



 
notifications: string[] = [];

showNotifications: boolean = false;

  selectedDays: { [key: string]: boolean } = {
    L: false,
    M: false,
    MER: false,
    J: false,
    V: false,
    S: false,
    D: false,
  };
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
    return Object.keys(this.selectedMois);
  }
  toggleDay(day: string): void {
    this.selectedDays[day] = !this.selectedDays[day];
  }
  joursSemaine: string[] = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  moisAnnee: string[] = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];
  

  
 
  

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
    repetition:0,
    endDaterep: new Date(''),


    indicateurs: [],
    selectedDays: {}, // Exemple : { "LUNDI": true, "MARDI": false }
    selectedMonth: {}, // Exemple : { "JANVIER": true, "FÉVRIER": false }
    repetitionType: 'TOUS_LES_SEMAINES',
    startDate: new Date(''),
    endDate: new Date(''),
    RepetitionType: RepetitionType.NE_SE_REPETE_PAS
  };




  nextRepetitionDates: Date[] = [];
  
  
  showPanel = false; // Controls the panel visibility
  searchVisible: boolean = false;
  maintenances: any[] = []; // Tableau pour stocker les maintenances
  
  
  constructor(private maintenanceService: MaintenanceService, private cdr: ChangeDetectorRef,private equipementService: EquipementService,private userService: UserService, batimentservice:BatimentService,  private route: ActivatedRoute,private toastr: ToastrService,private http: HttpClient,private notificationService: NotificationService ) { }

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
        if (maintenance.startDaterep) {
          const startDate = new Date(maintenance.startDaterep);
          startDate.setHours(0, 0, 0, 0);
  
          if (startDate.getTime() === today.getTime()) {
            this.addNotification(
              maintenance.id,
              `La maintenance #${maintenance.id} commence aujourd'hui!`
            );
          }
        }
  
        // Vérifier les répétitions de maintenance
        if (maintenance.startDaterep && maintenance.endDaterep) {
          const repetitionDates = this.calculateRepetitionDates(
            new Date(maintenance.startDaterep),
            new Date(maintenance.endDaterep),
            maintenance.repetitiontype
          );
  
          repetitionDates.forEach(date => {
            date.setHours(0, 0, 0, 0);
            if (date.getTime() === today.getTime()) {
              this.addNotification(
                maintenance.id,
                `Répétition de la maintenance #${maintenance.id} prévue aujourd'hui!`
              );
            }
          });
        }
      });
    });
  }
  
  // private addNotification(id: number, message: string): void {
    // Éviter les doublons
    //if (!this.notification.some(n => n.id === id)) {
      //this.notification.push({id, message});
      //this.notificationCount++;
      //this.showToastNotification(message);
    //}
  //}
  private addNotification(id: number, message: string): void {
    if (!this.notification.some(n => n.id === id)) {
      const newNotification = { id, message };
  
      this.notificationService.addNotification(newNotification).subscribe({
        next: () => console.log('Notification sauvegardée'),
        error: (err) => console.error('Erreur lors de la sauvegarde', err)
      });
  
      this.notification.push(newNotification);
      this.notificationCount++;
      this.showToastNotification(message);
    }
  }
  
  
  calculateRepetitionDates(startDate: Date, endDate: Date, repetitionType: string): Date[] {
    const dates: Date[] = [];
    let currentDate = new Date(startDate);
  
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
  
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
        default:
          return dates; // Ne pas répéter
      }
    }
  
    return dates;
  }
  showToastNotification(message: string): void {
    this.toastr.info(message, 'Nouvelle maintenance', {
      timeOut: 5000,
      positionClass: 'toast-top-right',
      closeButton: true,
      progressBar: true
    });
  }
  toggleNotificationsPanel(): void {
    this.showNotificationsPanel = !this.showNotificationsPanel;
    if (!this.showNotificationsPanel) {
      this.notificationCount = 0; // Réinitialiser le compteur quand on ferme le panneau
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
        console.error("Erreur lors du chargement des users", err);
      }
    });
  }


  



  





  // Méthode pour calculer la durée de l'intervention
  calculerDureeIntervention(): void {
    if (this.newMaintenance.dateDebutPrevue && this.newMaintenance.dateFinPrevue) {
      const startDate = new Date(this.newMaintenance.dateDebutPrevue);
      const endDate = new Date(this.newMaintenance.dateFinPrevue);
      
      // Calcul de la différence en jours
     // const timeDiff = endDate.getTime() - startDate.getTime();
      //this.newMaintenance.dureeIntervention = timeDiff / (1000 * 3600 * 24); // Convertir en jours
    }
  }

  //Méthode pour calculer la REPETITION de l'intervention
  calculerRepetition(): void {
    if (this.newMaintenance.startDaterep && this.newMaintenance.endDaterep && this.newMaintenance.repetitiontype) {
      const startDaterep = new Date(this.newMaintenance.startDaterep);
      const endDaterep = new Date(this.newMaintenance.endDaterep);
      const repetitiontype = this.newMaintenance.repetitiontype;
      
      // Calcul de la différence en jours
     // const timeDiff = endDate.getTime() - startDate.getTime();
      //this.newMaintenance.dureeIntervention = timeDiff / (1000 * 3600 * 24); // Convertir en jours
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
  handleFrequenceChange() {
    if (this.newMaintenance.frequence) {
      this.newMaintenance.indicateurs = undefined; // Mettre les indicateurs à undefined
    }
    this.showJournalierForm = this.newMaintenance.frequence === 'JOURNALIER';
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

          while (currentDate <= endDaterep) {
            repetitionDates.push(new Date(currentDate));

            switch (this.newMaintenance.repetitiontype) {
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
    RepetitionType: RepetitionType.NE_SE_REPETE_PAS,
   


  
 
    equipement: {  // Reset the Equipement object to its initial state
     
        id:0,
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
        typeEquipement: { id: undefined, type: '', image: '', attributs: [] },  // Initial empty type
        service: {} as Service,
        piecesDetachees: [],
        salle: {} as Salle,
        etage: {} as Etage,
        batiment: {} as Batiment,
        attributsValeurs: []
      
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


toggleJourSelection(jour: string, event: Event) {
  const checkbox = event.target as HTMLInputElement; // Assure que c'est bien une case à cocher
  if (!this.newMaintenance.selectedjours) {
    this.newMaintenance.selectedjours = []; // Initialise si c'est null
  }

  if (checkbox.checked) {
    this.newMaintenance.selectedjours.push(jour);
  } else {
    this.newMaintenance.selectedjours = this.newMaintenance.selectedjours.filter(j => j !== jour);
  }
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


















}




