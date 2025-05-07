
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../models/user';
import { Equipement } from '../models/equipement';
import { AttributEquipements } from '../models/attribut-equipement';
import { maintenance } from '../models/maintenance';
import { Service } from '../models/service';
import { Salle } from '../models/salle';
import { Etage } from '../models/etage';
import { Batiment } from '../models/batiment';
import { MaintenanceService } from '../services/maintenance.service';
import { ServiceService } from '../services/service.service';
import { UserService } from '../services/user.service';
import { EquipementService } from '../services/equipement.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RepetitionType } from '../models/RepetitionType';
import {TypesEquipements} from "../models/types-equipements";



@Component({
  selector: 'app-details-histo',
  templateUrl: './details-histo.component.html',
  styleUrl: './details-histo.component.css'
})
export class DetailsHistoComponent  implements OnInit {
  users  :User[]  =[];
  equipement :Equipement[]  =[];
  filteredTechnicienUsers: any[] = [];
  message: string = '';

  maintenanceId!: number;
  equipementId!: number;

  maintenances: any[] = [];
  equipements: any[] = [];
  selectedAttribut: any;
  messageSeuil: string = '';
  AttributEquipementValeur :any[]  =[];

  selectedAttributs: AttributEquipements[] = [];






  maintenance: maintenance = {
    equipement: {
      serviceNom: "",
      id: 0,
      image: '',
      nom: '',
      description: '',
      numeroSerie: '',
      modele: '',
      marque: '',
      statut: '',
      actif: false, // Default value for 'actif'
      dateAchat: '',
      dateMiseEnService: '',
      garantie: '',
      dateDerniereMaintenance: '',
      frequenceMaintenance: '',
      historiquePannes: '',
      coutAchat: '',
      valeurSuivi: 0,
      labelSuivi: '',


      typeEquipement: {} as TypesEquipements,
      service: {} as Service,
      piecesDetachees: [],
      salle: {} as Salle,
      etage: {} as Etage,
      batiment: {} as Batiment,
      repetition: 0,
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
    endDaterep: new Date(''),
    selectedDays: {},
    selectedMonth: {},
    repetitionType: 'TOUS_LES_JOURS',
    repetition: 0,
    seuil: 0,
    equipementId: 0,
    equipementNom:'',

    RepetitionType: RepetitionType.NE_SE_REPETE_PAS,
    message: '',
    NonSeuil: '',
    equipementBatiment: "", equipementEtage: 0, equipementSalle: 0
  };
  errorMessage: string = '';
  isEditMode: boolean = false;  // Mode édition
  services!: Service[];
  selectedFileName: string = '';




constructor(
    private maintenanceService: MaintenanceService,
    private serviceService: ServiceService,
    private userService: UserService,
    private  equipementService :EquipementService,
    private route: ActivatedRoute,
    private router: Router , // To navigate after save
    private _snackBar: MatSnackBar

  ) { }



  onEquipementChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const equipementId = Number(target.value);

    if (!equipementId) {
      this.selectedAttribut = [];
      return;
    }

    this.equipementService.getAttributsByEquipementId(equipementId).subscribe({
      next: (attributs) => {
        // Filter attributes where type === 'number'
        this.selectedAttribut = attributs.filter(attr => attr.attributEquipementType === 'NUMBER');
        console.log("attributs:", this.selectedAttribut);
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des attributs', error);
        this.selectedAttribut = [];
      }
    });
  }



  ngOnInit(): void {
    const maintenanceId = +this.route.snapshot.paramMap.get('id')!;  // Get equipment ID from route params
    this.fetchMaintenanceDetails(maintenanceId);  // Call to fetchMaintenanceDetails
    this.getAllServices();


    this.loadUsers();
    this.checkThreshold();
    console.log("Données equipement :", this.maintenance.equipement);
    const seuil = this.maintenance.seuil;
    const valeurAttribut = this.selectedAttribut.valeur;

    this.messageSeuil = this.verifierSeuilMaintenance(seuil,valeurAttribut);
    this.chargerEquipements();






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



  verifierSeuilMaintenance(seuil: number, valeurAttribut: number): string {
    const difference = Math.abs(seuil - valeurAttribut);

    if (valeurAttribut >= seuil) {
      return `⚠️ Maintenance doit être faite : la valeur a dépassé le seuil (${valeurAttribut} ≥ ${seuil})`;
    } else if (difference <= 0.1 * seuil) {
      return `ℹ️ Attention : la valeur est proche du seuil (${valeurAttribut} ≈ ${seuil})`;
    } else {
      return '';
    }
  }











  isLoading: boolean = true;
  nextRepetitionDates: Date[] = [];


 calculateRepetitionDates(
  startDaterep: Date,
  endDaterep: Date,
  repetitiontype: string,
  selectedjours: string[] = [],
  selectedmois: string[] = []
): Date[] {
  if (!startDaterep || !endDaterep || !repetitiontype) {
    console.warn('Données manquantes pour calculer les dates de répétition.');
    return [];
  }

  const repetitionDates: Date[] = [];
  let currentDate = new Date(startDaterep);
  const endDate = new Date(endDaterep);

  // Mapping mois de l'année
  const moisMap: { [key: string]: number } = {
    'janvier': 0, 'fevrier': 1, 'mars': 2, 'avril': 3,
    'mai': 4, 'juin': 5, 'juillet': 6, 'aout': 7, 'septembre': 8,
    'octobre': 9, 'novembre': 10, 'decembre': 11
  };

  // Mapping des jours de la semaine
  const dayMap: { [key: string]: number } = {
    'DIMANCHE': 0, 'LUNDI': 1, 'MARDI': 2, 'MERCREDI': 3,
    'JEUDI': 4, 'VENDREDI': 5, 'SAMEDI': 6
  };

  // Convertir les MOIS sélectionnés en numéros
  const selectedMoisNumbers = selectedmois
    .map(mois => moisMap[mois.toLowerCase()])
    .filter(moisNum => moisNum !== undefined);

  console.log('Mois sélectionnés convertis:', selectedMoisNumbers);

  // Convertir les jours sélectionnés en numéros
  const selectedDaysNumbers = selectedjours
    .map(day => dayMap[day.toUpperCase()])
    .filter(dayNum => dayNum !== undefined);

  console.log('Jours sélectionnés convertis:', selectedDaysNumbers);

  if (repetitiontype === 'TOUS_LES_SEMAINES' && selectedDaysNumbers.length > 0) {
    // Cas des répétitions hebdomadaires avec jours spécifiques
    while (currentDate <= endDate) {
      const currentDay = currentDate.getDay();

      if (selectedDaysNumbers.includes(currentDay)) {
        repetitionDates.push(new Date(currentDate));
      }

      // Passer au jour suivant
      currentDate.setDate(currentDate.getDate() + 1);
    }
  } else if (repetitiontype === 'MENSUEL' && selectedMoisNumbers.length > 0) {
    // Cas des répétitions mensuelles avec jours spécifiques
    while (currentDate <= endDate) {
      const currentMonth = currentDate.getMonth();

      // Vérifier si le mois actuel est sélectionné
      if (selectedMoisNumbers.includes(currentMonth)) {
        // Vérifier si un jour spécifique est sélectionné pour ce mois
        const currentDay = currentDate.getDay();

        if (selectedDaysNumbers.length === 0 || selectedDaysNumbers.includes(currentDay)) {
          repetitionDates.push(new Date(currentDate));
        }
      }

      // Passer au mois suivant
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
  } else {
    // Pour les autres types de répétitions
    while (currentDate <= endDate) {
      repetitionDates.push(new Date(currentDate));

      switch (repetitiontype) {
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
          return repetitionDates;
      }
    }
  }

  // Trier et supprimer les doublons
  const uniqueDates = [...new Set(repetitionDates.map(d => d.getTime()))]
    .sort()
    .map(time => new Date(time));

  console.log('Dates finales:', uniqueDates);
  return uniqueDates;
}









  onSubmit(): void {
    // Convertir les dates si elles sont des strings
    const startDate = this.maintenance.startDaterep instanceof Date
      ? this.maintenance.startDaterep
      : new Date(this.maintenance.startDaterep);

    const endDate = this.maintenance.endDaterep instanceof Date
      ? this.maintenance.endDaterep
      : new Date(this.maintenance.endDaterep);

    this.nextRepetitionDates = this.calculateRepetitionDates(
      startDate,
      endDate,
      this.maintenance.repetitiontype,
      this.maintenance.selectedjours || [],
      this.maintenance.selectedmois || []
    );
    this.maintenance.nextRepetitionDates=this.nextRepetitionDates;

    this.maintenanceService.createMaintenance(this.maintenance).subscribe({
      next: (response) => {
        console.log('Succès:', response);
        // Gérer la réponse...
      },
      error: (error) => {
        console.error('Erreur:', error);
      }
    });
  }










  getAllServices(): void {
    this.serviceService.getAllServices().subscribe(
      (data: Service[]) => {
        this.services = data;
      },
      (error) => {
        console.error('Error fetching services:', error);
      }
    );
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe(
      (users) => {
        this.users = users; // Assignez les utilisateurs récupérés
        console.log('Utilisateurs chargés:', this.users);
      },
      (error) => {
        console.error('Erreur lors du chargement des utilisateurs:', error);
      }
    );
  }

  //fetchMaintenanceDetails(id: number): void {
    //this.maintenanceService.getMaintenanceById(id).subscribe({
      //next: (data) => {
        //this.maintenance = data;
        //console.log(this.maintenance,)
      //},


      //error: (err) => {
       // console.error('Error fetching  details:', err);
        //this.errorMessage = 'Failed to load mainteance details';
      //}
    //});



  //}
  fetchMaintenanceDetails(id: number): void {
    this.isLoading = true;

    this.maintenanceService.getMaintenanceById(id).subscribe({
      next: (data) => {
        // Assigner les données de maintenance
        this.maintenance = data;

        // Initialiser l'équipement si non présent
        if (!this.maintenance.equipement) {
          this.maintenance.equipement = {
            serviceNom: "",
            id: 0,
            image: '',
            nom: '',
            description: '',
            numeroSerie: '',
            modele: '',
            marque: '',
            statut: '',
            actif: false, // Valeur par défaut
            dateAchat: '',
            dateMiseEnService: '',
            garantie: '',
            dateDerniereMaintenance: '',
            frequenceMaintenance: '',
            historiquePannes: '',
            coutAchat: '',
            valeurSuivi: 0,
            labelSuivi: '',
            typeEquipement: {} as TypesEquipements,
            service: {} as Service,
            piecesDetachees: [],
            salle: {} as Salle,
            etage: {} as Etage,
            batiment: {} as Batiment,
            repetition: 0,
            attributsValeurs: []
          };
        }

        // Initialiser l'utilisateur si non présent
        if (!this.maintenance.user) {
          this.maintenance.user = {
            id: 0,
            nom: '',
            civilite: 'M',
            email: '',
            username: '',
            password: '',
            gsm: '',
            image: '',

            role: 'TECHNICIEN',
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
          };
        }

        console.log('Détails maintenance:', this.maintenance);
        console.log('Équipement:', this.maintenance.equipement);
        console.log('Utilisateur:', this.maintenance.user);

        // Calcul des dates de répétition si elles existent
        if (this.maintenance.startDaterep && this.maintenance.endDaterep) {
          this.nextRepetitionDates = this.calculateRepetitionDates(
            new Date(this.maintenance.startDaterep),
            new Date(this.maintenance.endDaterep),
            this.maintenance.repetitiontype,
            this.maintenance.selectedjours || [],
            this.maintenance.selectedmois || []
          );
        }

        // Charger les utilisateurs techniciens
        this.loadTechnicianUsers();

        this.checkThreshold();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.errorMessage = 'Échec du chargement des détails de maintenance';
        this.isLoading = false;
      }
    });
}


  // Méthode pour charger les utilisateurs techniciens
  loadTechnicianUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users: User[]) => {
        // Filtrer pour n'avoir que les techniciens
        this.filteredTechnicienUsers = users.filter(user =>
          user.role === 'TECHNICIEN' || user.role === 'RESPONSABLE'
        );

        // Si aucun utilisateur n'est affecté, sélectionner le premier technicien par défaut
        if (this.maintenance.user?.id === 0 && this.filteredTechnicienUsers.length > 0) {
          this.maintenance.user = this.filteredTechnicienUsers[0];
        }
      },
      error: (err) => {
        console.error('Erreur lors du chargement des techniciens:', err);
      }
    });
  }

  // Méthode pour vérifier le seuil


  // Function to check if any repetition date matches the current date
  checkForNotification(repetitionDates: Date[]): void {
    const today = new Date().setHours(0, 0, 0, 0); // Set to midnight for comparison

    // Check if any repetition date matches the current date
    for (let date of repetitionDates) {
      if (date.setHours(0, 0, 0, 0) === today) {
        this.sendNotification(); // Send notification
        break;
      }
    }
  }

  // Function to trigger a notification (you can customize with libraries or native methods)
  //sendNotification(): void {
    // Simple notification (you can customize with libraries or push notifications)
    //alert('A maintenance task is scheduled for today!');
  //}



  enableEditMode(): void {
    this.isEditMode = true;
  }
  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'FAIBLE':
        return '#FFD700'; // Jaune
      case 'NORMALE':
        return '#FFA500'; // Orange
      case 'URGENTE':
        return '#FF0000'; // Rouge
      default:
        return '#000000'; // Noir par défaut
    }
  }


  onFileSelected(event: any) {
    const file = event.target.files[0];  // Récupère le fichier sélectionné
    if (file) {
      this.selectedFileName = file.name;  // Met à jour le nom du fichier
      this.maintenance.documentPath = file;    // Stocke l'objet fichier si nécessaire
    }
  }
  clearFile() {
    this.selectedFileName = '';  // Réinitialise le nom du fichier
    this.maintenance.documentPath = null;  // Réinitialise le fichier
  }



  saveChanges(): void {
    if (this.maintenance) {
      this.maintenanceService.updateMaintenance(this.maintenance.id!, this.maintenance).subscribe({
        next: (updateMaintenance) => {
          this.maintenance = updateMaintenance;
          this.isEditMode = false;  // Disable edit mode after saving
          this.router.navigate(['/maintenances/preventives']);  // Redirect after saving
        },
        error: (err) => {
          console.error('Error updating maintenance:', err);
          this.errorMessage = 'Failed to update mainytenance details';
        }
      });
    }
  }


  sendNotification(): void {
    // Crée le message avec l'ID de la maintenance
    const notificationMessage = `Une tâche de maintenance :id : ${this.maintenance.id},Action:${this.maintenance.action} est prévue pour aujourd'hui`;

    this._snackBar.open(notificationMessage, 'Fermer', {
      duration: 6000, // La notification reste pendant 6 secondes
      verticalPosition: 'top', // Position en haut de l'écran
      horizontalPosition: 'center', // Centrée horizontalement
      panelClass: ['custom-snackbar'] // Classe CSS personnalisée pour le style
    });
  }


  checkThreshold(): void {
    if (!this.maintenance.equipement) {
      this.message = 'Aucune information d\'équipement disponible';
      return;
    }

    const valeur = this.maintenance.valeurSuivi || 0;
    const seuil = this.maintenance.seuil || 0;

    if (valeur >= seuil) {
      this.message = "⚠️ Alerte : La valeur suivie (" + valeur + ") dépasse le seuil (" + seuil + ")";
  } else if (valeur >= seuil * 0.9) { // valeur proche du seuil (90%)
      this.message = "🟡 Attention : La valeur suivie (" + valeur + ") est proche du seuil (" + seuil + ")";
  } else {
      this.message = "✅ Normal : Valeur suivie (" + valeur + ") sous le seuil (" + seuil + ")";
  }

  }


  selectedEquipement: any;

  onEquipementSelected() {
    this.selectedEquipement = this.equipements.find(e => e.id === this.maintenance.equipementId);
  }












}



