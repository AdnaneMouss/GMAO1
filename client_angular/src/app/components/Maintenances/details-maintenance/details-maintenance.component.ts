import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MaintenanceService } from '../../../services/maintenance.service';
import { Service } from '../../../models/service';
import { ServiceService } from '../../../services/service.service';
import { User } from '../../../models/user';
import { UserService } from '../../../services/user.service';
import { maintenance } from '../../../models/maintenance';

@Component({
  selector: 'app-details-maintenance',
  templateUrl: './details-maintenance.component.html',
  styleUrl: './details-maintenance.component.css'
})
export class DetailsMaintenanceComponent implements OnInit {
  users  :User[]  =[];
  
  maintenance: maintenance = {
    id: 0,
    dureeIntervention: 0,
    dateDebutPrevue: new Date(''), // Initialisé en tant qu'objet Date
    dateFinPrevue: new Date(''), // Initialisé en tant qu'objet Date
    dateProchainemaintenance: new Date(''),
    commentaires: '',
    documentPath:null,
    statut: 'EN_ATTENTE' ,
    priorite: 'NORMALE',
    frequence:'JOURNALIER',
    action:'VERIFICATION_PERFORMANCES',
    indicateurs: [],
    autreAction: '',
    selectedDays: {} , // Exemple : { "LUNDI": true, "MARDI": false }
    selectedMonth: {} ,  // Exemple : { "JANVIER": true, "FÉVRIER": false }
    repetitionType:'TOUS_LES_SEMAINES' ,
    startDate: new Date(''),
    endDate: new Date(''),

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
    equipement: {
      image: '',
      nom: '',
      description: '',
      numeroSerie: '',
      modele: '',
      marque: '',
      localisation: '',
      statut: '',
      dateAchat: '',
      dateMiseEnService: '',
      garantie: '',
      dateDerniereMaintenance: '',
      frequenceMaintenance: '',
      historiquePannes: '',
      coutAchat: '',
      attributs: [],
      serviceNom: '',
    },
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
    private router: Router  // To navigate after save

  ) { }
  ngOnInit(): void {
    const maintenanceId = +this.route.snapshot.paramMap.get('id')!;  // Get equipement ID from route params
    this.fetchMaintenanceDetails(maintenanceId);
    this.getAllServices();
    this.loadUsers(); 
    
    
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

  fetchMaintenanceDetails(id: number): void {
    this.maintenanceService.getMaintenanceById(id).subscribe({
      next: (data) => {
        this.maintenance = data;
        console.log(this.maintenance,)
      },
      error: (err) => {
        console.error('Error fetching  details:', err);
        this.errorMessage = 'Failed to load mainteance details';
      }
    });
  }
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
}

 



 