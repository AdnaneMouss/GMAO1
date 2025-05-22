import { Component, OnInit } from '@angular/core';
import { User } from '../../../models/user';
import { UserService } from '../../../services/user.service';
import { maintenance } from '../../../models/maintenance';
import { MaintenanceService } from '../../../services/maintenance.service';
import { PhotosIntervention } from '../../../models/photos-intervention';
import { InterventionPieceDetachee } from '../../../models/intervention-pieces';
import { InterventionService } from '../../../services/intervention.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { id } from 'date-fns/locale';

export interface Intervention {
  id: number;
  technicienId: number;
  typeIntervention: 'PREVENTIVE' | 'CORRECTIVE';
  description: string;
  duree: number;
  maintenanceId: number;
  maintenanceStatut: 'EN_ATTENTE' | 'EN_COURS' | 'TERMINEE' | 'ANNULEE';
  maintenancePriorite: 'NORMALE' | 'URGENTE' | 'FAIBLE';
  dateCommencement: string | undefined;
  dateCloture: string | undefined;
  dateCreation: string | undefined;
  equipementMaintenu: string;
  remarques: string;
  photos: PhotosIntervention[];
  piecesDetachees: InterventionPieceDetachee[];
}

@Component({
  selector: 'app-user-rapport',
  templateUrl: './user-rapport.component.html',
  styleUrls: ['./user-rapport.component.css']
})
export class UserRapportComponent implements OnInit {
  maintenance: maintenance[] = [];
  users: User[] = [];
  intervention: Intervention[] = [];
  filteredUsers: User[] = [];
  selectedRole: string | null = null;

  stats = {
    totalUtilisateurs: 0,
    utilisateursActifs: 0,
    utilisateursInactifs: 0,
    totalAdmins: 0,
    totalTechniciens: 0,
    totalResponsables: 0,
    totalMagasiniers: 0,
    totalLambdas: 0,
    recentUsers: 0
  };

  roles = [
    { value: 'ADMIN', label: 'Administrateurs' },
    { value: 'RESPONSABLE', label: 'Responsables' },
    { value: 'TECHNICIEN', label: 'Techniciens' },
    { value: 'MAGASINIER', label: 'Magasiniers' },
    { value: 'LAMBDA', label: 'Utilisateurs' }
  ];

  constructor(
    private userService: UserService,
    private maintenanceService: MaintenanceService,
    private interventionService: InterventionService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadMaintenances();
   
  }
getRoleButtonClass(roleValue: string): string {
  const baseClasses = 'px-4 py-2 rounded-lg transition-colors duration-200 font-medium';
  
  switch(roleValue) {
    case 'ADMIN':
      return `${baseClasses} bg-red-100 hover:bg-red-200 text-red-800 border border-red-200`;
    case 'RESPONSABLE':
      return `${baseClasses} bg-blue-100 hover:bg-blue-200 text-blue-800 border border-blue-200`;
    case 'TECHNICIEN':
      return `${baseClasses} bg-orange-100 hover:bg-orange-200 text-orange-800 border border-orange-200`;
    case 'MAGASINIER':
      return `${baseClasses} bg-green-100 hover:bg-green-200 text-green-800 border border-green-200`;
    case 'LAMBDA':
      return `${baseClasses} bg-purple-100 hover:bg-purple-200 text-purple-800 border border-purple-200`;
    default:
      return `${baseClasses} bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-200`;
  }
}
  loadMaintenances(): void {
    this.maintenanceService.getAllMaintenances().subscribe({
      next: data => (this.maintenance = data),
      error: err => console.error('Erreur chargement maintenances:', err)
    });
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: data => {
        this.users = data;
        this.filteredUsers = [...this.users];
        this.calculateStats();
      },
      error: err => console.error('Erreur chargement utilisateurs:', err)
    });
  }

  

  calculateStats(): void {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    this.stats = {
      totalUtilisateurs: this.users.length,
      utilisateursActifs: this.users.filter(u => u.actif).length,
      utilisateursInactifs: this.users.filter(u => !u.actif).length,
      totalAdmins: this.users.filter(u => u.role === 'ADMIN').length,
      totalTechniciens: this.users.filter(u => u.role === 'TECHNICIEN').length,
      totalResponsables: this.users.filter(u => u.role === 'RESPONSABLE').length,
      totalMagasiniers: this.users.filter(u => u.role === 'MAGASINIER').length,
      totalLambdas: this.users.filter(u => u.role === 'LAMBDA').length,
      recentUsers: this.users.filter(u => new Date(u.dateInscription) > oneMonthAgo).length
    };
  }

  filterByRole(role: string): void {
    this.selectedRole = role;
    this.filteredUsers = this.users.filter(u => u.role === role);
  }

  resetFilters(): void {
    this.selectedRole = null;
    this.filteredUsers = [...this.users];
  }

  getRoleLabel(roleValue: string): string {
    const role = this.roles.find(r => r.value === roleValue);
    return role ? role.label : roleValue;
  }



exportUserPDF(user: User): void {
  this.interventionService.getInterventionsByTechnician(user.id).subscribe({
    next: (interventionsUser: Intervention[]) => {
      const doc = new jsPDF();
      const logoUrl = 'assets/logo.png';
      const img = new Image();
      img.src = logoUrl;

      img.onload = () => {
        try {
          // Logo  
          doc.addImage(img, 'PNG', 15, 10, 30, 15);

          // En-tête
          doc.setFontSize(12);
          doc.setTextColor('#A9A9A9');
          doc.text('H.U.I.R', 50, 15);
          doc.text('HOPITAL UNIVERSITAIRE INTERNATIONAL DE RABAT', 50, 20);

          // Titre Fiche Utilisateur
          doc.setFontSize(14);
          doc.setTextColor('#4169E1');
          doc.text('Fiche Utilisateur', 105, 30, { align: 'center' });

          // Ligne sous-titre
          doc.setDrawColor('#4169E1');
          doc.setLineWidth(0.3);
          doc.line(15, 35, 195, 35);

          // Infos utilisateur
          let y = 45;
          doc.setFontSize(11);
          doc.setTextColor('#000');
          doc.setFont('helvetica', 'bold');
          doc.text('Nom complet:', 20, y);
          doc.setFont('helvetica', 'normal');
          doc.text(`${user.civilite}. ${user.nom}`, 60, y); y += 7;

          doc.setFont('helvetica', 'bold');
          doc.text('Email:', 20, y);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor('#0000FF');
          doc.text(user.email, 60, y); y += 7;

          doc.setTextColor('#000');
          doc.setFont('helvetica', 'bold');
          doc.text('Username:', 20, y);
          doc.setFont('helvetica', 'normal');
          doc.text(user.username, 60, y); y += 7;

          doc.setFont('helvetica', 'bold');
          doc.text('Téléphone:', 20, y);
          doc.setFont('helvetica', 'normal');
          doc.text(user.gsm || 'Non renseigné', 60, y); y += 7;

          doc.setFont('helvetica', 'bold');
          doc.text('Statut:', 20, y);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(user.actif ? '#228B22' : '#DC143C');
          doc.text(user.actif ? 'Actif' : 'Inactif', 60, y); y += 7;

          doc.setTextColor('#000');
          doc.setFont('helvetica', 'bold');
          doc.text('Rôle:', 20, y);
          doc.setFont('helvetica', 'normal');
          doc.text(this.getRoleLabel(user.role), 60, y); y += 7;

          doc.setFont('helvetica', 'bold');
          doc.text('Date inscription:', 20, y);
          doc.setFont('helvetica', 'normal');
          doc.text(new Date(user.dateInscription).toLocaleDateString(), 60, y); y += 12;

          // Si le rôle est TECHNICIEN, afficher les interventions
          if (user.role === 'TECHNICIEN') {
            doc.setFont('helvetica', 'bold');
            doc.setTextColor('#000');
            doc.text(`Détail des interventions effectuées (${interventionsUser.length}) :`, 20, y);
            y += 5;

            if (interventionsUser.length === 0) {
              doc.setFont('helvetica', 'italic');
              doc.setTextColor('#7f8c8d');
              doc.text('Aucune intervention enregistrée pour cet utilisateur.', 20, y);
              y += 7;
            } else {
              // Titre interventions
              doc.setFont('helvetica', 'bold');
              doc.setTextColor('#228B22'); // Vert foncé
              doc.text('Interventions:', 20, y);
              y += 7;

              doc.setFont('helvetica', 'normal');
              doc.setTextColor('#000');

              interventionsUser.forEach((intervention, index) => {
                if (index > 0) {
                  doc.setDrawColor('#DDDDDD');
                  doc.setLineWidth(0.2);
                  doc.line(20, y, 190, y);
                  y += 5;
                }

                doc.text(`- Type: ${intervention.typeIntervention || 'Non spécifié'}`, 25, y);
                y += 6;

                doc.text(`- Description: ${intervention.description || 'Aucune description'}`, 25, y);
                y += 6;

                doc.text(`- Remarques: ${intervention.remarques || 'Aucune remarque'}`, 25, y);
                y += 10;

                // Si y trop bas, créer une nouvelle page
                if (y > 270) {
                  doc.addPage();
                  y = 20;
                }
              });
            }
          }

          // Pied de page
          doc.setFontSize(8);
          doc.setTextColor('#A9A9A9');
          doc.text(`Document généré le ${new Date().toLocaleDateString()} - H.U.I.R`, 105, 285, { align: 'center' });

          // Sauvegarde
          doc.save(`fiche_utilisateur_${user.nom.replace(/ /g, '_')}.pdf`);
        } catch (e) {
          console.error('Erreur génération PDF:', e);
        }
      };

      img.onerror = () => {
        console.error('Erreur chargement logo');
      };
    },
    error: err => {
      console.error('Erreur chargement interventions utilisateur:', err);
    }
  });
}


}
