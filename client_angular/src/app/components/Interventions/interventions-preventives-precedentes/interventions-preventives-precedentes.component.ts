import { Component, OnInit } from '@angular/core';
import { Intervention } from '../../../models/intervention';
import { PieceDetachee } from '../../../models/piece-detachee';
import { PhotosIntervention } from '../../../models/photos-intervention';
import { InterventionPreventiceService } from '../../../services/interventionPreventice.service ';
import { MaintenanceService } from '../../../services/maintenance.service';
import { maintenance } from '../../../models/maintenance';
import { AuthService } from '../../../services/auth.service';


@Component({
  selector: 'app-interventions-preventives-precedentes',
  templateUrl: './interventions-preventives-precedentes.component.html',
  styleUrls: ['./interventions-preventives-precedentes.component.css']
})
export class InterventionsPreventivesPrecedentesComponent implements OnInit {
  filters = {
    typeIntervention: '',
    equipementMaintenu: '',
    priorite: '',
    startDate: null,
    endDate: null
  };
   
  interventions: Intervention[] = [];
  technicianId: number | null = null;
  technicienId: number = 0;
  selectedPhotos: PhotosIntervention[] = [];
  showPhotoModal: boolean = false;
  piecesByIntervention: { [key: number]: PieceDetachee[] } = {};
   maintenance: maintenance[] = [];
  filteredMaintenace = [...this.maintenance];
  maintenances: any[] = []; 
  currentTechnicienId: number | null = null;

  constructor(private InterventionPreventiceService: InterventionPreventiceService,private maintenanceService: MaintenanceService,private authService: AuthService ) {}

  ngOnInit(): void {
    // 1. Récupérer d'abord l'utilisateur connecté
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.technicienId = user.id;
    console.log("ID user connecté:", this.technicienId);
  
    // 2. Ensuite charger les maintenances pour cet utilisateur
    this.getMaintenancesByTechnicien(this.technicienId);
  
    
 
  


  }

  
 

 
  
  loadTechnicienMaintenances(): void {
    // 1. Récupérer l'ID du technicien connecté
    this.currentTechnicienId = this.authService.getCurrentUser()?.id || null;
    
    if (!this.currentTechnicienId) {
      console.error('Aucun technicien connecté identifié');
      return;
    }
  }

  getPieces(interventionId: number): PieceDetachee[] {
    return this.piecesByIntervention[interventionId] || [];
  }

  loadPiecesForAllInterventions(): void {
    this.interventions.forEach(intervention => {
      this.InterventionPreventiceService.getPiecesByInterventionId(intervention.id)
        .subscribe({
          next: (pieces) => {
            this.piecesByIntervention[intervention.id] = pieces;
          },
          error: (err) => {
            console.error(`Erreur pièces pour intervention ${intervention.id}:`, err);
          }
        });
    });
  }

  filteredInterventions(): Intervention[] {
    return this.interventions.filter(intervention => {
      const matchesEquipement = !this.filters.equipementMaintenu || 
        intervention.equipementMaintenu.toLowerCase().includes(this.filters.equipementMaintenu.toLowerCase());
      
      const matchesType = !this.filters.typeIntervention || 
        intervention.typeIntervention === this.filters.typeIntervention;
      
      const matchesPriorite = !this.filters.priorite || 
        intervention.maintenancePriorite === this.filters.priorite;

      return matchesEquipement && matchesType && matchesPriorite;
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

  getInterventionsByTechnician(technicianId: number): void {
    this.InterventionPreventiceService.getInterventionsByTechnician(technicianId).subscribe(
      (data: Intervention[]) => {
        this.interventions = data.filter(intervention =>
          intervention.maintenanceId && intervention.maintenanceStatut === 'TERMINEE'
        );
 
        // 👇 For each intervention, fetch its pieces    
        this.interventions.forEach(intervention => {
          this.getPiecesForIntervention(intervention.id);
        });
      },
      (error) => {
        console.error('Error fetching interventions:', error);
      }
    );
  }

  getPiecesForIntervention(interventionId: number): void {
    this.InterventionPreventiceService.getPiecesByInterventionId(interventionId).subscribe({
      next: (pieces) => {
        this.piecesByIntervention[interventionId] = pieces;
        console.log('pieces:', this.piecesByIntervention);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des pièces détachées :', err);
      }
    });
  }

  viewPhotos(intervention: Intervention): void {
    if (intervention.photos?.length > 0) {
      this.selectedPhotos = intervention.photos;
      this.showPhotoModal = true;
    }
  }

  formatDateWithIntl(date: string | undefined): string {
    if (!date) return 'Non renseignée';
    
    try {
      return new Intl.DateTimeFormat('fr-FR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).format(new Date(date));
    } catch {
      return 'Date invalide';
    }
  }
}