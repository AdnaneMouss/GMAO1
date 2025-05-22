import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { MaintenanceService } from '../../../services/maintenance.service';
import { maintenance } from '../../../models/maintenance';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import { MaintenanceCorrective } from '../../../models/maintenance-corrective';
import { MaintenanceCorrectiveService } from '../../../services/maintenance-corrective.service';
import { forkJoin } from 'rxjs';
import { th } from 'date-fns/locale';

@Component({
  selector: 'app-statistiques-interventions',
  templateUrl: './statistiques-interventions.component.html',
  styleUrls: ['./statistiques-interventions.component.css']



})
export class StatistiquesInterventionsComponent implements OnInit {
  // Pagination

  customReportStart: string | null = null;
  customReportEnd: string | null = null;
  generatedReports: any[] = [];
 
  selectedTypeMaint: 'CORRECTIVE' | 'PREVENTIVE' | null = null;



 
  currentPage: number = 0;
pageSize: number = 10;
sortTable(column: string): void {
  // Implémentez votre logique de tri ici
  console.log('Tri par:', column);
}

// Navigation pagination
prevPage(): void {
  if (this.currentPage > 0) {
    this.currentPage--;
  }
}


get filteredMaintenancesM() {
  let maintenances;

  switch (this.selectedTypeMaint) {
    case 'CORRECTIVE':
      maintenances = this.maintenanceCorrective;
      break;
    case 'PREVENTIVE':
      maintenances = this.maintenancePreventive;
      break;
    default: // 'TOUS' ou null ou autre
      maintenances = this.allMaintenances;
  }

  // Filtrer pour ne garder que les maintenances terminées ou annulées
  return maintenances.filter(m => m.statut === 'TERMINEE' || m.statut === 'ANNULEE');
}



showAll() {
  this.selectedTypeMaint = null; // ou 'TOUS' si tu préfères
}

showCorrective() {
  this.selectedTypeMaint = 'CORRECTIVE';
}

showPreventive() {
  this.selectedTypeMaint = 'PREVENTIVE';
}

nextPage(): void {
  if ((this.currentPage + 1) * this.pageSize < this.filteredMaintenances.length) {
    this.currentPage++;
  }
}
  // Data
  //allMaintenances: maintenance[] = [];
  allMaintenances: (MaintenanceCorrective | maintenance)[] = [];

maintenanceCorrective: MaintenanceCorrective[] = [];
maintenancePreventive: maintenance[] = [];

filteredMaintenances: (maintenance | MaintenanceCorrective)[] = [];
paginatedMaintenances: (maintenance | MaintenanceCorrective)[] = [];

  // Filtres
  selectedStatus: string = '';
  selectedPriorite: string = '';

  selectedType: string = '';
  selectedMonth: number | null = null;
  selectedYear: number | null = new Date().getFullYear();
  years: number[] = [2023, 2024, 2025];
   filteredMaintenace = [...this.allMaintenances];





  
 
  sortColumn: string = 'dateDebutPrevue';
  sortDirection: 'asc' | 'desc' = 'desc';
  
  // Statistiques
  stats = {
    totalMaintenances: 0,
    maintenancesPreventives: 0,
    maintenancesCorrectives: 0,
  
    byStatus: {
      EN_ATTENTE: 0,
      EN_COURS: 0,
      TERMINEE: 0,
      ANNULEE: 0
    },
    byPriority: {
      FAIBLE: 0,
      NORMALE: 0,
      URGENTE: 0
    }
  };
  
  // Graphiques
  statutChart!: Chart;
  prioriteChart!: Chart;

  constructor(private maintenanceService: MaintenanceService, private maintenanceCorrectiveService : MaintenanceCorrectiveService) {
    this.generateReports();
  }

  ngOnInit(): void {
    this.loadMaintenances();
    this.filteredMaintenace;
    this.allMaintenances;
   

    setTimeout(() => {
      this.generateMonthlyReportIfScheduled();
      // Programme la vérification mensuelle
      setInterval(() => {
        this.generateMonthlyReportIfScheduled();
      }, 30 * 24 * 60 * 60 * 1000); // Environ 30 jours
    }, );
  }

 loadMaintenances(): void {
  this.allMaintenances = [];
  this.maintenancePreventive = [];
  this.maintenanceCorrective = [];

  forkJoin([
    this.maintenanceService.getAllMaintenances(),
    this.maintenanceCorrectiveService.getAllMaintenances()
  ]).subscribe({
    next: ([preventiveData, correctiveData]) => {
      this.maintenancePreventive = preventiveData;
      this.maintenanceCorrective = correctiveData;

      this.allMaintenances = [...this.maintenancePreventive, ...this.maintenanceCorrective];

      // 🔄 Calcul des statistiques correctement
      this.calculateStats();

      // Appliquer les filtres + afficher
      this.applyFilters();
    },
    error: (error) => {
      console.error('Erreur lors du chargement des données', error);
    }
  });
}



 applyFilters(): void {
  this.filteredMaintenances = this.allMaintenances.filter(m => {
    let date: Date | null = null;

    if ('dateDebutPrevue' in m && m.dateDebutPrevue) {
      date = new Date(m.dateDebutPrevue);
    }

    // Debug
    console.log('Filtrage:', {
      statut: m.statut,
      priorite: m.priorite,
      selectedPriorite: this.selectedPriorite,
      date: date ? date.toISOString() : null
    });

    return (
      (!this.selectedStatus || m.statut === this.selectedStatus) &&
      (!this.selectedPriorite || (('priorite' in m) && m.priorite === this.selectedPriorite)) &&
      (!this.selectedMonth || (date && date.getMonth() + 1 === this.selectedMonth)) &&
      (!this.selectedYear || (date && date.getFullYear() === this.selectedYear))
    );
  });

  this.calculateStats();
  this.sortData();
  this.paginateData();
  this.updateCharts();
}


calculateStats(): void {
  this.stats = {
    totalMaintenances: this.allMaintenances.length,
    maintenancesPreventives: this.maintenancePreventive.length,
   maintenancesCorrectives: this.maintenanceCorrective.length,
    byStatus: {
      EN_ATTENTE: this.allMaintenances.filter(m => m.statut === 'EN_ATTENTE').length,
      EN_COURS: this.allMaintenances.filter(m => m.statut === 'EN_COURS').length,
      TERMINEE: this.allMaintenances.filter(m => m.statut === 'TERMINEE').length,
      ANNULEE: this.allMaintenances.filter(m => m.statut === 'ANNULEE').length
    },
    byPriority: {
      FAIBLE: this.allMaintenances.filter(m => m.priorite === 'FAIBLE').length,
      NORMALE: this.allMaintenances.filter(m => m.priorite === 'NORMALE').length,
      URGENTE: this.allMaintenances.filter(m => m.priorite === 'URGENTE').length
    }
  };
}



sortData(): void {
  if (!this.sortColumn) return;

  this.filteredMaintenances.sort((a, b) => {
    let valueA: any;
    let valueB: any;

    if (this.sortColumn.includes('.')) {
      const props = this.sortColumn.split('.');
     
    } else {
      // Sécurité : vérifier que la propriété existe avant d'accéder
      if (this.sortColumn in a) valueA = (a as any)[this.sortColumn];
      if (this.sortColumn in b) valueB = (b as any)[this.sortColumn];
    }

    if (valueA == null) return 1;
    if (valueB == null) return -1;

    if (typeof valueA === 'string') {
      return valueA.localeCompare(valueB);
    }

    if (typeof valueA === 'number' || valueA instanceof Date) {
      return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
    }

    return 0;
  });
}


  paginateData(): void {
    const start = this.currentPage * this.pageSize;
    this.paginatedMaintenances = this.filteredMaintenances.slice(start, start + this.pageSize);
  }

  updateCharts(): void {
    // Détruire les anciens graphiques s'ils existent
    if (this.statutChart) this.statutChart.destroy();
    if (this.prioriteChart) this.prioriteChart.destroy();
    
    // Graphique des statuts
    this.statutChart = new Chart('statutChart', {
      type: 'pie',
      data: {
        labels: ['En attente', 'En cours', 'Terminée', 'Annulée'],
        datasets: [{
          data: [
            this.stats.byStatus.EN_ATTENTE,
            this.stats.byStatus.EN_COURS,
            this.stats.byStatus.TERMINEE,
            this.stats.byStatus.ANNULEE
          ],
          backgroundColor: [
            '#fbbf24', // Jaune pour en attente
            '#60a5fa', // Bleu pour en cours
            '#34d399', // Vert pour terminée
            '#f87171'  // Rouge pour annulée
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
    
    // Graphique des priorités
    this.prioriteChart = new Chart('prioriteChart', {
      type: 'bar',
      data: {
        labels: ['Faible', 'Normale', 'Urgente'],
        datasets: [{
          label: 'Nombre de maintenances',
          data: [
            this.stats.byPriority.FAIBLE,
            this.stats.byPriority.NORMALE,
            this.stats.byPriority.URGENTE
          ],
          backgroundColor: [
            '#34d399', // Vert pour faible
            '#60a5fa', // Bleu pour normale
            '#f87171'  // Rouge pour urgente
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0
            }
          }
        }
      }
    });
  }

  // Gestion des filtres
  onFilterChange(): void {
    this.currentPage = 0;
    this.applyFilters();
  }

  resetFilters(): void {
    this.selectedStatus = '';
    this.selectedPriorite = '';
    this.selectedType = '';
    this.selectedMonth = null;
    this.selectedYear = new Date().getFullYear();
    this.onFilterChange();
  }

  // Gestion du tri
 

  // Gestion de la pagination
 

  getMin(currentPage: number, pageSize: number, totalItems: number): number {
    return Math.min((currentPage + 1) * pageSize, totalItems);
  }

  onPageSizeChange(): void {
    this.currentPage = 0;
    this.paginateData();
  }

  // Export

   
 
exportMaintenancePDF(maintenances: (MaintenanceCorrective | maintenance)[]): void {
  const doc = new jsPDF();

  const primaryColor = '#4169E1';
  const secondaryColor = '#A9A9A9';
  const textColor = '#000000';
  const lineHeight = 7;
  const sectionSpacing = 10;
  const pageMargin = 15;
  const maxWidth = 180; // Largeur maximale du texte

  const logoUrl = 'assets/logo.png';
  const img = new Image();
  img.src = logoUrl;

  function isMaintenancePreventive(m: MaintenanceCorrective | maintenance): m is maintenance {
    return (m as maintenance).dateFinPrevue !== undefined;
  }

  // Fonction pour ajouter du texte avec retour à la ligne automatique
  const addTextWithWrap = (text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return lines.length * lineHeight;
  };

  img.onload = () => {
    try {
      maintenances.forEach((maintenance, index) => {
        let yPosition = 20;

        // Logo
        doc.addImage(img, 'PNG', pageMargin, yPosition, 30, 15);
        yPosition += 10;

        // En-tête
        doc.setFontSize(12);
        doc.setTextColor(secondaryColor);
        doc.text('H.U.I.R', 50, yPosition);
        yPosition += 5;
        doc.text('HOPITAL UNIVERSITAIRE INTERNATIONAL DE RABAT', 50, yPosition);
        yPosition += 15;

        // Titre
        doc.setFontSize(14);
        doc.setTextColor(primaryColor);
        doc.text('Fiche Maintenance', 105, yPosition, { align: 'center' });
        yPosition += 10;

        doc.setDrawColor(primaryColor);
        doc.setLineWidth(0.5);
        doc.line(pageMargin, yPosition, 195, yPosition);
        yPosition += sectionSpacing;

        doc.setFontSize(10);
        doc.setTextColor(textColor);

        const addField = (label: string, value: string | number | undefined, valueColor?: string) => {
          doc.setFont('helvetica', 'bold');
          doc.text(`${label}:`, pageMargin, yPosition);
          doc.setFont('helvetica', 'normal');
          
          if (value) {
            if (valueColor) doc.setTextColor(valueColor);
            const text = value.toString();
            const heightAdded = addTextWithWrap(text, pageMargin + 50, yPosition, maxWidth - 50, lineHeight);
            doc.setTextColor(textColor);
            yPosition += Math.max(lineHeight, heightAdded);
          } else {
            doc.text('-', pageMargin + 50, yPosition);
            yPosition += lineHeight;
          }
          doc.setTextColor(textColor);
        };

        if (isMaintenancePreventive(maintenance)) {
          // Maintenance préventive : tous les champs détaillés
          addField('ID Maintenance', maintenance.id);
          addField('Durée Intervention', maintenance.dureeIntervention);
          addField('Date début prévue', maintenance.dateDebutPrevue ? new Date(maintenance.dateDebutPrevue).toLocaleDateString() : undefined);
          addField('Date fin prévue', maintenance.dateFinPrevue ? new Date(maintenance.dateFinPrevue).toLocaleDateString() : undefined);
        
          const equipementInfos = maintenance.equipement
            ? `${maintenance.equipementNom} - Bâtiment: ${maintenance.equipement.batimentNom ?? 'N/A'}, Étage: ${maintenance.equipement.etageNum ?? 'N/A'}, Salle: ${maintenance.equipement.salleNum ?? 'N/A'}`
            : `${maintenance.equipementNom} - Bâtiment: ${maintenance.equipementBatiment ?? 'N/A'}, Étage: ${maintenance.equipementEtage ?? 'N/A'}, Salle: ${maintenance.equipementSalle ?? 'N/A'}`;

          addField('Équipement', equipementInfos);
          addField('Date prochain entretien', maintenance.dateProchainemaintenance ? new Date(maintenance.dateProchainemaintenance).toLocaleDateString() : undefined);
          addField('Commentaires', maintenance.commentaires);
          addField('Statut', maintenance.statut, this.getStatusColor(maintenance.statut));
          addField('Priorité', maintenance.priorite, this.getPriorityColor(maintenance.priorite));
          addField('Technicien', maintenance.user ? `${maintenance.user.nom} | ${maintenance.user.email} | ${maintenance.user.gsm}` : undefined);
          addField('Action', maintenance.action);
          addField('Début répétition', maintenance.startDaterep ? new Date(maintenance.startDaterep).toLocaleDateString() : undefined);
          addField('Fin répétition', maintenance.endDaterep ? new Date(maintenance.endDaterep).toLocaleDateString() : undefined);
         
          // Répétition
          if (maintenance.repetitiontype) {
              addField('Type de répétition', maintenance.repetitiontype);
          }
          
          // Jours/Mois de répétition
          if (maintenance.selectedjours?.length > 0) {
              addField('Jours de répétition', maintenance.selectedjours.join(', '));
          }

          if (maintenance.selectedmois?.length > 0) {
              addField('Mois de répétition', maintenance.selectedmois.join(', '));
          }

          // Section Dates de Répétition
          if (maintenance.nextRepetitionDatesString) {
            let repetitionDates: string[] = [];

            if (Array.isArray(maintenance.nextRepetitionDatesString)) {
                repetitionDates = maintenance.nextRepetitionDatesString;
            } else if (typeof maintenance.nextRepetitionDatesString === 'string') {
                repetitionDates = [maintenance.nextRepetitionDatesString];
            }

            if (repetitionDates.length > 0) {
                yPosition += sectionSpacing;
                doc.setFont('helvetica', 'bold');
                doc.text('Dates de répétition:', pageMargin, yPosition);
                yPosition += lineHeight;

                doc.setTextColor(primaryColor);
                doc.setFont('helvetica', 'normal');

                repetitionDates.forEach(date => {
                    const formattedDate = new Date(date).toLocaleDateString();
                    doc.text(`• ${formattedDate}`, pageMargin + 5, yPosition);
                    yPosition += lineHeight;
                    
                    // Vérification pour éviter le débordement de page
                    if (yPosition > 270) {
                        doc.addPage();
                        yPosition = 20;
                    }
                });
                doc.setTextColor(textColor);
            }
          }

        } else {
          // Maintenance corrective : champs spécifiques
          const mCorrective = maintenance as MaintenanceCorrective;
          addField('ID Maintenance', mCorrective.id);
          addField('Titre', mCorrective.titre);
          addField('Description', mCorrective.description);
          addField('Statut', mCorrective.statut, this.getStatusColor(mCorrective.statut));
          addField('Priorité', mCorrective.priorite, this.getPriorityColor(mCorrective.priorite));
          addField('Date création', mCorrective.dateCreation ? new Date(mCorrective.dateCreation).toLocaleDateString() : undefined);
          addField('Date clôture', mCorrective.dateCloture ? new Date(mCorrective.dateCloture).toLocaleDateString() : undefined);
          addField('Date commencement', mCorrective.dateCommencement ? new Date(mCorrective.dateCommencement).toLocaleDateString() : undefined);
          addField('Assigné à (ID)', mCorrective.affecteAId);
          addField('Assigné à (Nom)', mCorrective.affecteANom);
          addField('Créé par (Nom)', mCorrective.creeParNom);
          addField('Créé par (ID)', mCorrective.creeParId);
          addField('Équipement', mCorrective.equipementNom);
          addField('Numéro de série', mCorrective.equipementNumSerie);
          addField('Bâtiment', mCorrective.equipementBatiment);
          addField('Salle', mCorrective.equipementSalle);
          addField('Étage', mCorrective.equipementEtage);
          addField('Nombre d\'interventions', mCorrective.interventions?.length || 0);
        }

        // Pied de page
        yPosition = 285;
        doc.setFontSize(8);
        doc.setTextColor(secondaryColor);
        doc.text(`Document généré le ${new Date().toLocaleDateString()} - H.U.I.R`, 105, yPosition, { align: 'center' });

        if (index < maintenances.length - 1) {
          doc.addPage();
        }
      });

      doc.save(`fiche_maintenance.pdf`);
    } catch (e) {
      console.error('Erreur lors de la génération du PDF:', e);
    }
  };

  img.onerror = () => {
    console.error('Le logo est introuvable, génération sans logo...');
  };
}








  
  private generateMaintenancePDFWithoutLogo(doc: jsPDF, maintenance: maintenance): void {
    // Version simplifiée sans logo
    doc.setFontSize(14);
    doc.setTextColor('#4169E1');
    doc.text('Fiche Maintenance', 105, 20, { align: 'center' });
    
    // ... (reprendre le reste du contenu sans le logo)
    
    doc.save(`fiche_maintenance_${maintenance.id}_simple.pdf`);
  }
  
  // Méthodes utilitaires
  private getStatusColor(status: string): string {
    const colors: {[key: string]: string} = {
      'EN_ATTENTE': '#FFA500', // Orange
      'EN_COURS': '#4169E1',   // Royal Blue
      'TERMINEE': '#228B22',   // Forest Green
      'ANNULEE': '#DC143C'     // Crimson
    };
    return colors[status] || '#000000';
  }
  
  private getPriorityColor(priority: string): string {
    const colors: {[key: string]: string} = {
      'URGENTE': '#DC143C',    // Crimson
      'NORMALE': '#FFA500',    // Orange
      'FAIBLE': '#32CD32'      // LimeGreen
    };
    return colors[priority] || '#000000';
  }
  
  
  
 

  // Utilitaires
  getMonthName(month: number): string {
    return new Date(2000, month - 1, 1).toLocaleString('fr-FR', { month: 'long' });
  }

  getPeriodLabel(): string {
    if (this.selectedMonth && this.selectedYear) {
      return `${this.getMonthName(this.selectedMonth)} ${this.selectedYear}`;
    } else if (this.selectedYear) {
      return `Année: ${this.selectedYear}`;
    }
    return 'Toutes périodes';
  }

  getStatusLabel(status: string): string {
    const statusLabels: {[key: string]: string} = {
      'EN_ATTENTE': 'En attente',
      'EN_COURS': 'En cours',
      'TERMINEE': 'Terminée',
      'ANNULEE': 'Annulée'
    };
    return statusLabels[status] || status;
  }

  getPriorityLabel(priority: string): string {
    const priorityLabels: {[key: string]: string} = {
      'FAIBLE': 'Faible',
      'NORMALE': 'Normale',
      'URGENTE': 'Urgente'
    };
    return priorityLabels[priority] || priority;
  }

 
  
  
  generateMonthlyReportIfScheduled(): void {
    const now = new Date();
  
    // Vérifie si on est le 1er jour du mois à 8h00 (heure exacte)
    const isFirstDayOfMonth = now.getDate() === 1;
    const is8AM = now.getHours() === 8 && now.getMinutes() < 1; // Donne une fenêtre d'une minute
    
    if (!(isFirstDayOfMonth && is8AM)) {
      return; // Ce n'est pas le moment de générer
    }
  
    const today = new Date();
    const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
  
    startOfLastMonth.setHours(0, 0, 0, 0);
    endOfLastMonth.setHours(23, 59, 59, 999);
  
    // Filtrage des maintenances clôturées le mois passé
    const filtered = this.allMaintenances.filter(m => {
    //  if (!m.dateFinPrevue) return false;
     // const dateFinPrevue = new Date(m.dateFinPrevue);
      return //dateFinPrevue >= startOfLastMonth && dateFinPrevue <= endOfLastMonth;
    });
  
    if (filtered.length === 0) {
      console.log("Aucune maintenance clôturée le mois dernier.");
      return;
    }
  
    const monthName = startOfLastMonth.toLocaleString('fr-FR', { month: 'long' });
    const year = startOfLastMonth.getFullYear();
  
    let content = `Rapport Mensuel - ${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${year}\n\n`;
    content += `Total des maintenances : ${filtered.length}\n\n`;
    
    // Groupement par type de maintenance
   
 
    
    content += '\nDétail des maintenances :\n';
    filtered.forEach((m, i) => {
     // content += `${i + 1}. [${m.repetitiontype}] ${m.equipement} - ${m.commentaires || 'sans commentaire'} (Clôturé le ${new Date(m.dateFinPrevue).toLocaleDateString('fr-FR')})\n`;
    });
  
    content += `\nGénéré automatiquement le ${now.toLocaleDateString('fr-FR')} à ${now.toLocaleTimeString('fr-FR')}`;
  
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const filename = `rapport-mensuel-${year}-${(startOfLastMonth.getMonth() + 1).toString().padStart(2, '0')}.txt`;
    saveAs(blob, filename);
  
    console.log(`✅ Rapport mensuel généré pour ${monthName} ${year} avec ${filtered.length} maintenances.`);
}
  


 

  


  getNextMonday(): Date {
    const today = new Date();
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + ((1 + 7 - today.getDay()) % 7));
    return nextMonday;
  }
  
  getFirstDayNextMonth(): Date {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth() + 1, 1);
  }
  
downloadReport(maintenances: any[]): void {
  if (!maintenances || maintenances.length === 0) {
    console.warn('Aucune maintenance à traiter.');
    return;
  }

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  let previousMonth = currentMonth - 1;
  let yearOfPreviousMonth = currentYear;
  if (previousMonth < 0) {
    previousMonth = 11;
    yearOfPreviousMonth -= 1;
  }

  const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet',
    'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  const previousMonthName = monthNames[previousMonth];

  const filteredMaintenances = maintenances.filter(m => {
    try {
      const dateStr = m.dateDebutPrevue || m.dateCommencement;
      const date = new Date(dateStr);
      return !isNaN(date.getTime()) &&
             date.getMonth() === previousMonth &&
             date.getFullYear() === yearOfPreviousMonth;
    } catch {
      return false;
    }
  });

  const logo = new Image();
  logo.src = 'assets/logo.png';

  logo.onload = () => {
    const doc = new jsPDF();
    let y = 20;
    const primaryColor = '#4169E1';
    const textColor = '#000000';

    doc.addImage(logo, 'PNG', 15, y, 30, 15);
    doc.setFontSize(12);
    doc.setTextColor(primaryColor);
    doc.text('HOPITAL UNIVERSITAIRE INTERNATIONAL DE RABAT', 105, y + 5, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`Rapport Mensuel des Maintenances - ${previousMonthName} ${yearOfPreviousMonth}`, 105, y + 15, { align: 'center' });
    doc.setTextColor(textColor);
    doc.setFontSize(10);
    doc.text(`Nombre total de maintenances prévues : ${filteredMaintenances.length}`, 105, y + 23, { align: 'center' });

    y += 35;

    // En-tête tableau
    doc.setFontSize(10);
    doc.setTextColor(primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text('ID', 15, y);
    doc.text('Equipement', 35, y);
    doc.text('Date Début', 110, y);
    doc.text('Statut', 150, y);
    doc.text('Priorité', 180, y);

    y += 3;
    doc.setDrawColor(primaryColor);
    doc.setLineWidth(0.5);
    doc.line(15, y, 200, y);
    y += 7;

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(textColor);

    filteredMaintenances.forEach(m => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }

      let dateToShow = '-';
      try {
        const datePrevue = new Date(m.dateDebutPrevue);
        if (!isNaN(datePrevue.getTime())) {
          dateToShow = datePrevue.toLocaleDateString('fr-FR');
        } else {
          const dateComm = new Date(m.dateCommencement);
          if (!isNaN(dateComm.getTime())) {
            dateToShow = dateComm.toLocaleDateString('fr-FR');
          }
        }
      } catch (e) {
        dateToShow = '-';
      }

      doc.text(m.id?.toString() || '-', 15, y);
      doc.text((m.equipementNom || '-').substring(0, 60), 35, y);
      doc.text(dateToShow, 110, y);
      doc.text(this.getStatusLabel(m.statut), 150, y);
      doc.text(this.getPriorityLabel(m.priorite), 180, y);

      y += 8;
    });

    const dateGeneration = now.toLocaleDateString('fr-FR');
    doc.setFontSize(8);
    doc.setTextColor('#A9A9A9');
    doc.text(`Document généré le ${dateGeneration} - H.U.I.R`, 105, 290, { align: 'center' });

    const fileDate = dateGeneration.replace(/\//g, '-');
    doc.save(`Rapport_Maintenances_${previousMonthName}_${fileDate}.pdf`);
  };

  logo.onerror = () => {
    console.error("Erreur de chargement du logo, génération sans logo...");
  };
}


  
  
 
generateMonthlyReportMetadata(baseDate: Date = new Date()): { type: string; period: string; generatedDate: Date; filePath: string } {
  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  // Mois courant
  const currentMonth = baseDate.getMonth();
  const currentYear = baseDate.getFullYear();

  // Mois précédent
  let previousMonth = currentMonth - 1;
  let previousYear = currentYear;
  if (previousMonth < 0) {
    previousMonth = 11; // Décembre
    previousYear -= 1;
  }

  // Texte pour la période = mois précédent
  const period = `${months[previousMonth]} ${previousYear}`;

  // Date de génération = 1er jour du mois courant à 08:00
  const generatedDate = new Date(currentYear, currentMonth, 1, 8, 0, 0);

  // Fichier basé sur le mois précédent
  const filePath = `/reports/monthly-${previousYear}-${String(previousMonth + 1).padStart(2, '0')}.txt`;

  return {
    type: 'monthly',
    period,
    generatedDate,
    filePath
  };
}
downloadWeeklyReport(maintenances: any[]): void {
  if (!maintenances || maintenances.length === 0) {
    console.warn('Aucune maintenance à traiter.');
    return;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Trouver le lundi de la semaine actuelle
  const currentDay = today.getDay();
  const offset = currentDay === 0 ? -6 : 1 - currentDay;
  const mondayThisWeek = new Date(today);
  mondayThisWeek.setDate(today.getDate() + offset);

  // Semaine dernière
  const monday = new Date(mondayThisWeek);
  monday.setDate(mondayThisWeek.getDate() - 7);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  const generatedDate = new Date(monday);
  generatedDate.setHours(8, 0, 0, 0); // lundi à 08:00

  const filtered = maintenances.filter(m => {
    try {
      const dateStr = m.dateCommencement || m.dateDebutPrevue;
      const maintenanceDate = new Date(dateStr);
      return maintenanceDate >= monday && maintenanceDate <= sunday;
    } catch (e) {
      console.error('Erreur de conversion de date:', m.id, e);
      return false;
    }
  });

  if (filtered.length === 0) {
    console.warn('Aucune maintenance pour la semaine dernière.');
    return;
  }

  const doc = new jsPDF();
  const logo = new Image();
  logo.src = 'assets/logo.png';

  logo.onload = () => {
    let y = 20;
    const primaryColor = '#4169E1';
    const textColor = '#000000';

    doc.addImage(logo, 'PNG', 15, y, 30, 15);
    doc.setFontSize(12);
    doc.setTextColor(primaryColor);
    doc.text('HOPITAL UNIVERSITAIRE INTERNATIONAL DE RABAT', 105, y + 5, { align: 'center' });
    doc.setFontSize(10);
    doc.text('Rapport Hebdomadaire des Maintenances', 105, y + 15, { align: 'center' });

    // Période
    const formatDate = (date: Date): string => {
      return date.toLocaleDateString('fr-FR', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      });
    };

    doc.setFontSize(10);
    doc.setTextColor(textColor);
    doc.text(`Période : ${formatDate(monday)} au ${formatDate(sunday)}`, 105, y + 23, { align: 'center' });

    y += 35;

    doc.setFontSize(10);
    doc.setTextColor(primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text('ID', 20, y);
    doc.text('Équipement', 35, y);
    doc.text('Date Début', 110, y);
    doc.text('Statut', 150, y);
    doc.text('Priorité', 180, y);

    y += 3;
    doc.setDrawColor(primaryColor);
    doc.setLineWidth(0.5);
    doc.line(20, y, 190, y);
    y += 7;

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(textColor);
    filtered.forEach(m => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }

      doc.text(m.id.toString(), 20, y);
      doc.text(m.equipementNom || '-', 35, y);

      // Choix de la date à afficher
      let dateToShow: string;
      try {
        const datePrevue = new Date(m.dateDebutPrevue);
        if (!isNaN(datePrevue.getTime())) {
          dateToShow = datePrevue.toLocaleDateString('fr-FR');
        } else {
          const dateComm = new Date(m.dateCommencement);
          dateToShow = isNaN(dateComm.getTime()) ? '-' : dateComm.toLocaleDateString('fr-FR');
        }
      } catch (e) {
        dateToShow = '-';
      }

      doc.text(dateToShow, 110, y);
      doc.text(this.getStatusLabel(m.statut), 150, y);
      doc.text(this.getPriorityLabel(m.priorite), 180, y);

      y += 8;
    });

    doc.setFontSize(8);
    doc.setTextColor('#A9A9A9');
    doc.text(`Document généré le ${generatedDate.toLocaleDateString('fr-FR')} à 08h00 - H.U.I.R`, 105, 290, { align: 'center' });

    doc.save(`rapport_hebdomadaire_${monday.toISOString().split('T')[0]}_au_${sunday.toISOString().split('T')[0]}.pdf`);
  };

  logo.onerror = () => {
    console.error("Erreur de chargement du logo, génération sans logo...");
  };
}


generateWeeklyReportMetadata(baseDate: Date = new Date()): { type: string; period: string; generatedDate: Date; filePath: string } {
    const daysOfWeek = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const months = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];

    // Trouver le lundi de la semaine actuelle
    const currentDay = baseDate.getDay();
    const diffToMonday = (currentDay === 0 ? -6 : 1) - currentDay;
    const mondayThisWeek = new Date(baseDate);
    mondayThisWeek.setDate(baseDate.getDate() + diffToMonday);

    // Lundi de la semaine dernière
    const mondayLastWeek = new Date(mondayThisWeek);
    mondayLastWeek.setDate(mondayThisWeek.getDate() - 7);

    // Dimanche de la semaine dernière
    const sundayLastWeek = new Date(mondayLastWeek);
    sundayLastWeek.setDate(mondayLastWeek.getDate() + 6);

    // Date de génération = lundi dernier à 08h00
    const generatedDate = new Date(mondayLastWeek);
    generatedDate.setHours(8, 0, 0, 0);

    // Format de date : Lundi 6 Mai 2025
    const formatDate = (date: Date): string => {
        return `${daysOfWeek[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    };

    const period = `${formatDate(mondayLastWeek)} au ${formatDate(sundayLastWeek)}`;

    const filePath = `/reports/weekly-${mondayLastWeek.getFullYear()}-${String(mondayLastWeek.getMonth() + 1).padStart(2, '0')}-${String(mondayLastWeek.getDate()).padStart(2, '0')}.txt`;

    return {
        type: 'weekly',
        period,
        generatedDate,
        filePath
    };
}

  
generateReports(): void {
  const today = new Date();
  
  // Générer le rapport hebdomadaire
   const weeklyReport = this.generateWeeklyReportMetadata(today);
  
  // Générer le rapport mensuel
  const monthlyReport = this.generateMonthlyReportMetadata(today);
  
  // Ajouter les rapports dans le tableau
  this.generatedReports = [
      {
          type: 'weekly',
         period: weeklyReport.period,
          generatedDate: weeklyReport.generatedDate,
          filePath: weeklyReport.filePath
      },
      {
          type: 'monthly',
          period: monthlyReport.period,
          generatedDate: monthlyReport.generatedDate,
          filePath: monthlyReport.filePath
      }
  ];
}

  




  
}

