import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import saveAs from 'file-saver';
import { environment } from '../../../../environments/environment';
import { User } from '../../../models/user';
import { UserService } from '../../../services/user.service';
import { Chart, registerables } from 'chart.js';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { maintenance } from '../../../models/maintenance';
import { MaintenanceService } from '../../../services/maintenance.service';
import { Intervention } from '../../../models/intervention';

// Enregistrer tous les composants de Chart.js
Chart.register(...registerables);

@Component({
  selector: 'app-user-rapport',
  templateUrl: './user-rapport.component.html',
  styleUrl: './user-rapport.component.css'
})
export class UserRapportComponent implements AfterViewInit {
  @ViewChild('roleChart') roleChartRef!: ElementRef;
  @ViewChild('statusChart') statusChartRef!: ElementRef;
  @ViewChild('monthlyChart') monthlyChartRef!: ElementRef;
  maintenance: maintenance[] = [];
  users: User[] = [];
  intervention:Intervention[]=[];
  filteredUsers: User[] = [];
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
  
  selectedRole: string | null = null;
  roleChart: any;
  statusChart: any;
  monthlyChart: any;

  constructor(private userService: UserService,private maintenanceService :MaintenanceService) {}

  ngAfterViewInit(): void {
    this.initCharts();
  }

  ngOnInit(): void {
    this.loadUsers();
    this.loadMaintenances();
  }

  loadMaintenances(): void {
    this.maintenanceService.getAllMaintenances().subscribe({
      next: (data) => {
        this.maintenance = data;
      
      },
      error: (err) => {
        console.error('Error loading maintenances:', err);
      }
    });
  }


  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.filteredUsers = [...this.users];
        this.calculateStats();
        this.initCharts();
      },
      error: (err) => {
        console.error('Error loading users:', err);
      }
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

  initCharts(): void {
    this.initRoleChart();
    this.initStatusChart();
    this.initMonthlyRegistrationChart();
  }

  initRoleChart(): void {
    if (this.roleChart) {
      this.roleChart.destroy();
    }

    const roleCounts = this.roles.map(role => 
      this.users.filter(u => u.role === role.value).length
    );

    const ctx = this.roleChartRef.nativeElement.getContext('2d');
    this.roleChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: this.roles.map(r => r.label),
        datasets: [{
          data: roleCounts,
          backgroundColor: [
            '#EF4444', // red for admin
            '#3B82F6', // blue for responsable
            '#F59E0B', // orange for technicien
            '#10B981', // green for magasinier
            '#8B5CF6'  // purple for lambda
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              font: {
                size: 14
              },
              padding: 20
            }
          },
          title: {
            display: true,
            text: 'Répartition par Rôle',
            font: {
              size: 16
            },
            padding: {
              top: 10,
              bottom: 30
            }
          }
        },
        cutout: '60%'
      }
    });
  }

  initStatusChart(): void {
    if (this.statusChart) {
      this.statusChart.destroy();
    }

    const ctx = this.statusChartRef.nativeElement.getContext('2d');
    this.statusChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Actifs', 'Inactifs'],
        datasets: [{
          label: 'Statut des Utilisateurs',
          data: [this.stats.utilisateursActifs, this.stats.utilisateursInactifs],
          backgroundColor: [
            '#10B981',
            '#EF4444'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Statut des Utilisateurs',
            font: {
              size: 16
            },
            padding: {
              top: 10,
              bottom: 30
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    });
  }

  initMonthlyRegistrationChart(): void {
    if (this.monthlyChart) {
      this.monthlyChart.destroy();
    }

    // Group users by month of registration
    const monthlyData = this.getMonthlyRegistrationData();

    const ctx = this.monthlyChartRef.nativeElement.getContext('2d');
    this.monthlyChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: monthlyData.labels,
        datasets: [{
          label: 'Inscriptions par Mois',
          data: monthlyData.values,
          fill: false,
          borderColor: '#3B82F6',
          tension: 0.4,
          pointBackgroundColor: '#3B82F6',
          pointRadius: 5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          },
          title: {
            display: true,
            text: 'Inscriptions Mensuelles',
            font: {
              size: 16
            },
            padding: {
              top: 10,
              bottom: 30
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    });
  }

  getMonthlyRegistrationData(): { labels: string[], values: number[] } {
    const monthlyCounts: { [key: string]: number } = {};
    const monthNames = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];

    this.users.forEach(user => {
      const date = new Date(user.dateInscription);
      const monthYear = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      
      if (!monthlyCounts[monthYear]) {
        monthlyCounts[monthYear] = 0;
      }
      monthlyCounts[monthYear]++;
    });

    const sortedEntries = Object.entries(monthlyCounts)
      .sort((a, b) => {
        const [monthA, yearA] = a[0].split(' ');
        const [monthB, yearB] = b[0].split(' ');
        const monthIndexA = monthNames.indexOf(monthA);
        const monthIndexB = monthNames.indexOf(monthB);
        const numA = parseInt(yearA) * 12 + monthIndexA;
        const numB = parseInt(yearB) * 12 + monthIndexB;
        return numA - numB;
      });

    return {
      labels: sortedEntries.map(entry => entry[0]),
      values: sortedEntries.map(entry => entry[1])
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

  getRoleButtonClass(roleValue: string): string {
    const baseClass = 'px-4 py-2 rounded-lg hover:opacity-90 transition-colors';
    const isActive = this.selectedRole === roleValue ? 'ring-2 ring-offset-2' : '';
    
    switch(roleValue) {
      case 'ADMIN': return `${baseClass} ${isActive} bg-red-100 text-red-800 hover:bg-red-200 ring-red-300`;
      case 'RESPONSABLE': return `${baseClass} ${isActive} bg-blue-100 text-blue-800 hover:bg-blue-200 ring-blue-300`;
      case 'TECHNICIEN': return `${baseClass} ${isActive} bg-orange-100 text-orange-800 hover:bg-orange-200 ring-orange-300`;
      case 'MAGASINIER': return `${baseClass} ${isActive} bg-green-100 text-green-800 hover:bg-green-200 ring-green-300`;
      default: return `${baseClass} ${isActive} bg-purple-100 text-purple-800 hover:bg-purple-200 ring-purple-300`;
    }
  }

  exportToExcel(): void {
    // Implémentation existante
  }

  exportUserPDF(user: User): void {
    const doc = new jsPDF();
    
    // Couleurs sous forme de chaînes hexadécimales
    const primaryColor = '#4169E1'; // Royal Blue
    const secondaryColor = '#A9A9A9'; // Dark Gray
    const activeColor = '#228B22'; // Forest Green
    const inactiveColor = '#DC143C'; // Crimson
  
    // Ajouter le logo
    const logoUrl = 'assets/logo.png';
    const img = new Image();
    img.src = logoUrl;
  
    img.onload = () => {
      try {
        doc.addImage(img, 'PNG', 15, 10, 30, 15);
        
        // En-tête
        doc.setFontSize(12);
        doc.setTextColor(secondaryColor);
        doc.text('H.U.I.R', 50, 15);
        doc.text('HOPITAL UNIVERSITAIRE INTERNATIONAL DE RABAT', 50, 20);
        
        // Titre principal
        doc.setFontSize(14);
        doc.setTextColor(primaryColor);
        doc.text('Fiche Utilisateur', 105, 30, { align: 'center' });
        
        // Ligne de séparation
        doc.setDrawColor(primaryColor);
        doc.setLineWidth(0.3);
        doc.line(15, 35, 195, 35);
        
        // Informations utilisateur
        doc.setFontSize(11);
        let yPosition = 45;
        
        // Nom complet
        doc.setTextColor('#000000');
        doc.setFont('helvetica', 'bold');
        doc.text('Nom complet:', 20, yPosition);
        doc.setFont('helvetica', 'normal');
        doc.text(`${user.civilite}. ${user.nom}`, 60, yPosition);
        yPosition += 7;
        
        // Email
        doc.setFont('helvetica', 'bold');
        doc.text('Email:', 20, yPosition);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor('#0000FF'); // Bleu pour l'email
        doc.text(user.email, 60, yPosition);
        doc.setTextColor('#000000');
        yPosition += 7;
        
        // Username
        doc.setFont('helvetica', 'bold');
        doc.text('Username:', 20, yPosition);
        doc.setFont('helvetica', 'normal');
        doc.text(user.username, 60, yPosition);
        yPosition += 7;
        
        // Téléphone
        doc.setFont('helvetica', 'bold');
        doc.text('Téléphone:', 20, yPosition);
        doc.setFont('helvetica', 'normal');
        doc.text(user.gsm || 'Non renseigné', 60, yPosition);
        yPosition += 7;
        
        // Statut
        doc.setFont('helvetica', 'bold');
        doc.text('Statut:', 20, yPosition);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(user.actif ? activeColor : inactiveColor);
        doc.text(user.actif ? 'Actif' : 'Inactif', 60, yPosition);
        doc.setTextColor('#000000');
        yPosition += 7;
        
        // Rôle
        doc.setFont('helvetica', 'bold');
        doc.text('Rôle:', 20, yPosition);
        doc.setFont('helvetica', 'normal');
        doc.text(this.getRoleLabel(user.role), 60, yPosition);
        yPosition += 7;
        
        // Date inscription
        doc.setFont('helvetica', 'bold');
        doc.text('Date inscription:', 20, yPosition);
        doc.setFont('helvetica', 'normal');
        doc.text(new Date(user.dateInscription).toLocaleDateString(), 60, yPosition);
        yPosition += 12;

        doc.setFont('helvetica', 'bold');
        doc.text('intervention:', 20, yPosition);
        doc.setFont('helvetica', 'normal');
        
        doc.setFont('helvetica', 'bold');
        doc.text('intervention:', 20, yPosition);
        doc.setFont('helvetica', 'normal');
        
        // Vérification si interventionss est un tableau et s'il contient des éléments
        const interventionsText = Array.isArray(user.interventionss) && user.interventionss.length > 0
          ? user.interventionss.map((intervention) => intervention.toString()).join(', ') 
          : 'Non renseigné';
        
        doc.text(interventionsText, 60, yPosition);
        yPosition += 7;
        
        
        


         //  INtervention
       
         if (user.Intervention) {
             doc.setFont('helvetica', 'bold');
             doc.text('Dernière intervention:', 20, yPosition);
             doc.setFont('helvetica', 'normal');
             
             // Convertir technicienId en string si nécessaire
             doc.text(user.Intervention.technicienId.toString(), 60, yPosition);
             yPosition += 7;
             
             // Autres informations d'intervention
             doc.setFont('helvetica', 'bold');
             doc.text('Statut intervention:', 20, yPosition);
             doc.setFont('helvetica', 'normal');
           //  doc.text(user.Intervention.type || 'Non spécifié', 60, yPosition);
             yPosition += 7;
             
             doc.setFont('helvetica', 'bold');
             doc.text('Date intervention:', 20, yPosition);
             doc.setFont('helvetica', 'normal');
            // doc.text(user.Intervention.dateIntervention ? new Date(user.Intervention.dateIntervention).toLocaleDateString() : 'Non spécifiée', 60, yPosition);
             yPosition += 7;
         }
     

         
         yPosition += 12;
    
        
        // Pied de page
        doc.setFontSize(8);
        doc.setTextColor(secondaryColor);
        doc.text(`Document généré le ${new Date().toLocaleDateString()} - H.U.I.R`, 105, 285, { align: 'center' });
        
        doc.save(`fiche_utilisateur_${user.nom.replace(' ', '_')}.pdf`);
      } catch (e) {
        console.error('Erreur lors de la génération du PDF:', e);
      }
    };
  
    img.onerror = () => {
      console.error('Le logo est introuvable, génération sans logo...');
      // Version sans logo
      this.generatePDFWithoutLogo(doc, user);
    };
  }
  
  private generatePDFWithoutLogo(doc: jsPDF, user: User): void {
    // Implémentez ici une version alternative sans logo
    // ...
    doc.save(`fiche_utilisateur_${user.nom.replace(' ', '_')}_simple.pdf`);
  }
  
}