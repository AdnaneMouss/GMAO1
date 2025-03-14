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
  
 
  

  closeForm() {
    this.selectedForm= null; // Ferme le formulaire
  }

   

  



  
    

  

  newMaintenance: maintenance = {
    equipement: {
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
    batiment :{
      
        id: 0,
        numBatiment: 0,
        intitule: '',
        etages:[],
        

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
    documentPath :null,
    statut: 'EN_ATTENTE',
    priorite: 'NORMALE',
    frequence:'',
    action:'VERIFICATION_PERFORMANCES',
    autreAction: '',
    indicateurs: [],
    selectedDays: {} , // Exemple : { "LUNDI": true, "MARDI": false }
    selectedMonth: {} ,  // Exemple : { "JANVIER": true, "FÉVRIER": false }
    repetitionType:'TOUS_LES_SEMAINES' ,
    startDate: new Date(''),
    endDate: new Date(''),

                
  
  
   
  };
  
  showPanel = false; // Controls the panel visibility
  searchVisible: boolean = false;
  maintenances: any[] = []; // Tableau pour stocker les maintenances
  
 
  constructor(private maintenanceService: MaintenanceService, private cdr: ChangeDetectorRef,private equipementService: EquipementService,private userService: UserService, batimentservice:BatimentService) { }

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
  

  ngOnInit(): void {
    this.chargerMaintenance();
    this.chargerEquipements();
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
        console.log("maintenance chargés :", this.maintenances); // Pour vérifier si les données arrivent bien
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

  if(!this.newMaintenance.action)
  {
    champsManquants.push("action")
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
    commentaires: '',
   dureeIntervention: 0,
    dateDebutPrevue: new Date(''),
    dateFinPrevue: new Date(''),
    dateProchainemaintenance: new Date(''),
    statut: 'EN_ATTENTE', 
    documentPath :null,
    priorite: 'NORMALE',
    frequence:'',
    indicateurs: [],
    action:'VERIFICATION_PERFORMANCES',
    autreAction: '',
    selectedDays: {} , // Exemple : { "LUNDI": true, "MARDI": false }
    selectedMonth: {} ,  // Exemple : { "JANVIER": true, "FÉVRIER": false }
    repetitionType:'TOUS_LES_SEMAINES' ,
    startDate: new Date(''),
    endDate: new Date(''),

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

onSubmit() {
  console.log('Données soumises:', this.newMaintenance); // Affiche les données soumises dans la console pour vérifier si "autreAction" est bien définie
  this.maintenanceService.createMaintenance(this.newMaintenance).subscribe(response => {
      console.log('Réponse de l\'API:', response);
      // Traite la réponse ici, par exemple, redirige ou affiche un message de succès
  }, error => {
      console.error('Erreur lors de la soumission:', error);
  });
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
}