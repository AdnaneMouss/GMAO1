import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MaintenanceService } from '../../../services/maintenance.service';
import { Service } from '../../../models/service';
import { ServiceService } from '../../../services/service.service';
import { User } from '../../../models/user';
import { UserService } from '../../../services/user.service';
import { maintenance } from '../../../models/maintenance';
import { Salle } from '../../../models/salle';
import { Batiment } from '../../../models/batiment';
import { Etage } from '../../../models/etage';
import { RepetitionType } from '../../../models/RepetitionType';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-details-maintenance',
  templateUrl: './details-maintenance.component.html',
  styleUrl: './details-maintenance.component.css'
})
export class DetailsMaintenanceComponent implements OnInit {
  users  :User[]  =[];
  filteredTechnicienUsers: any[] = []; 
  
 
  
  maintenance: maintenance = {
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
      repetition:0,
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
    endDaterep: new Date(''),
    selectedDays: {},
    selectedMonth: {},
    repetitionType: 'TOUS_LES_JOURS',
    repetition:0,
    RepetitionType: RepetitionType.NE_SE_REPETE_PAS
  };
  errorMessage: string = '';
  isEditMode: boolean = false;  // Mode édition
  services!: Service[];
  selectedFileName: string = '';

 

 
constructor(
    private maintenanceService: MaintenanceService,
    private serviceService: ServiceService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router , // To navigate after save
    private _snackBar: MatSnackBar

  ) { }


  ngOnInit(): void {
    const maintenanceId = +this.route.snapshot.paramMap.get('id')!;  // Get equipment ID from route params
    this.fetchMaintenanceDetails(maintenanceId);  // Call to fetchMaintenanceDetails
    this.getAllServices();
    this.loadUsers();
  }


  
  
  
  
  
  
  

  isLoading: boolean = true;
  nextRepetitionDates: Date[] = [];


  calculateRepetitionDates(startDaterep: Date, endDaterep: Date, repetitiontype: string): Date[] {
    if (!startDaterep || !endDaterep || !repetitiontype) {
      console.warn('Données manquantes pour calculer les dates de répétition.');
      return [];
    }
  
    const repetitionDates: Date[] = [];
    const calendar = new Date(startDaterep);
  
    console.log('Date de début:', calendar);
    console.log('Date de fin:', endDaterep);
    console.log('Type de répétition:', repetitiontype);
  
    // Ajouter la première date de répétition
    repetitionDates.push(new Date(calendar));
  
    while (calendar.getTime() < endDaterep.getTime()) {
      switch (repetitiontype) {
        case 'TOUS_LES_JOURS':
          calendar.setDate(calendar.getDate() + 1);
          break;
        case 'TOUS_LES_SEMAINES':
          calendar.setDate(calendar.getDate() + 7);
          break;
        case 'MENSUEL':
          calendar.setMonth(calendar.getMonth() + 1);
          break;
        case 'ANNUEL':
          calendar.setFullYear(calendar.getFullYear() + 1);
          break;
        case 'Ne_pas_repeter':
        default:
          return repetitionDates;
      }
  
      // Vérifier si la nouvelle date est encore avant la date de fin
      if (calendar.getTime() <= endDaterep.getTime()) {
        repetitionDates.push(new Date(calendar));
      }
    }
  
    console.log('Dates de répétition calculées:', repetitionDates);
    return repetitionDates;
  }
  
  
  

  onSubmit(): void {
    console.log('Données soumises:', this.maintenance);
    console.log('Start Date:', this.maintenance.startDaterep);
    console.log('End Date:', this.maintenance.endDaterep);
    console.log('Repetition Type:', this.maintenance.repetitiontype);
  
    // Calculer les dates de répétition
    this.nextRepetitionDates = this.calculateRepetitionDates(
      this.maintenance.startDaterep,
      this.maintenance.endDaterep,
      this.maintenance.repetitiontype
    );
  
    console.log('Dates calculées:', this.nextRepetitionDates);
  
    this.isLoading = false;
  
    // Envoyer les données au backend si nécessaire
    this.maintenanceService.createMaintenance(this.maintenance).subscribe(
      (response) => {
        console.log('Réponse de l\'API:', response);
      },
      (error) => {
        console.error('Erreur lors de la soumission:', error);
      }
    );
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
    this.maintenanceService.getMaintenanceById(id).subscribe({
      next: (data) => {
        this.maintenance = data;
        console.log('Maintenance details:', this.maintenance);
  
        // Calculate repetition dates after fetching the data
        if (this.maintenance.startDaterep && this.maintenance.endDaterep) {
          const repetitionDates: Date[] = [];
          let currentDate = new Date(this.maintenance.startDaterep); // Start date of repetition
          let endDaterep = new Date(this.maintenance.endDaterep); // End date of repetition
  
          // Calculate repeated dates
          while (currentDate <= endDaterep) {
            repetitionDates.push(new Date(currentDate)); // Add the current date to the list
  
            // Increment date based on repetition type
            switch (this.maintenance.repetitiontype) {
              case 'TOUS_LES_JOURS':
                currentDate.setDate(currentDate.getDate() + 1); // Add 1 day
                break;
              case 'TOUS_LES_SEMAINES':
                currentDate.setDate(currentDate.getDate() + 7); // Add 1 week
                break;
              case 'MENSUEL':
                currentDate.setMonth(currentDate.getMonth() + 1); // Add 1 month
                break;
              case 'ANNUEL':
                currentDate.setFullYear(currentDate.getFullYear() + 1); // Add 1 year
                break;
              default:
                break;
            }
          }
  
          // Assign the calculated repetition dates to 'nextRepetitionDates'
          this.nextRepetitionDates = repetitionDates;
          console.log('Calculated repetition dates:', this.nextRepetitionDates);
  
          // Check for any matching repetition date with the current date
          this.checkForNotification(repetitionDates);
        }
      },
      error: (err) => {
        console.error('Error fetching maintenance details:', err);
        this.errorMessage = 'Failed to load maintenance details';
      }
    });
  }
  
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
}

 