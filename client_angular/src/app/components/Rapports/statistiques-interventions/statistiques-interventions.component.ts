import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { MaintenanceService } from '../../../services/maintenance.service';
import { maintenance } from '../../../models/maintenance';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-statistiques-interventions',
  templateUrl: './statistiques-interventions.component.html',
  styleUrls: ['./statistiques-interventions.component.css']



})
export class StatistiquesInterventionsComponent implements OnInit {
  // Pagination
 
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

nextPage(): void {
  if ((this.currentPage + 1) * this.pageSize < this.filteredMaintenances.length) {
    this.currentPage++;
  }
}
  // Data
  allMaintenances: maintenance[] = [];

  filteredMaintenances: maintenance[] = [];
  paginatedMaintenances: maintenance[] = [];
  
  // Filtres
  selectedStatus: string = '';
  selectedPriorite: string = '';

  selectedType: string = '';
  selectedMonth: number | null = null;
  selectedYear: number | null = new Date().getFullYear();
  years: number[] = [2023, 2024, 2025];
   filteredMaintenace = [...this.allMaintenances];





  
  // Tri
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

  constructor(private maintenanceService: MaintenanceService) {
  }

  ngOnInit(): void {
    this.loadMaintenances();
    this.filteredMaintenace;
    this.allMaintenances;
  }

  loadMaintenances(): void {
    this.maintenanceService.getAllMaintenances().subscribe({
      next: (data) => {
        this.allMaintenances = data;
        this.applyFilters();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des maintenances', err);
      }
    });
  }

  applyFilters(): void {
    // Filtrer les données
    this.filteredMaintenances = this.allMaintenances.filter(m => {
      const date = new Date(m.dateDebutPrevue);
      return (
        (!this.selectedStatus || m.statut === this.selectedStatus) &&
        (!this.selectedPriorite || m.priorite === this.selectedPriorite) &&
        (!this.selectedType || m.type_maintenance === this.selectedType) &&
        (!this.selectedMonth || date.getMonth() + 1 === this.selectedMonth) &&
        (!this.selectedYear || date.getFullYear() === this.selectedYear)
      );
    });

    // Calculer les statistiques
    this.calculateStats();
    
    // Trier les données
    this.sortData();
    
    // Paginer les données
    this.paginateData();
    
    // Mettre à jour les graphiques
    this.updateCharts();
  }

  calculateStats(): void {
    this.stats = {
      totalMaintenances: this.filteredMaintenances.length,
      maintenancesPreventives: this.filteredMaintenances.filter(m => m.type_maintenance === 'PREVENTIVE').length,
      maintenancesCorrectives: this.filteredMaintenances.filter(m => m.type_maintenance === 'CORRECTIVE').length,
   
      byStatus: {
        EN_ATTENTE: this.filteredMaintenances.filter(m => m.statut === 'EN_ATTENTE').length,
        EN_COURS: this.filteredMaintenances.filter(m => m.statut === 'EN_COURS').length,
        TERMINEE: this.filteredMaintenances.filter(m => m.statut === 'TERMINEE').length,
        ANNULEE: this.filteredMaintenances.filter(m => m.statut === 'ANNULEE').length
      },
      byPriority: {
        FAIBLE: this.filteredMaintenances.filter(m => m.priorite === 'FAIBLE').length,
        NORMALE: this.filteredMaintenances.filter(m => m.priorite === 'NORMALE').length,
        URGENTE: this.filteredMaintenances.filter(m => m.priorite === 'URGENTE').length
      }
    };
  }

  sortData(): void {
    this.filteredMaintenances.sort((a, b) => {
      let valueA, valueB;
      
      // Gestion des propriétés imbriquées (comme equipment.name)
      if (this.sortColumn.includes('.')) {
        const props = this.sortColumn.split('.');
      
      } else {
        valueA = a[this.sortColumn as keyof maintenance];
        valueB = b[this.sortColumn as keyof maintenance];
      }
      
      // Comparaison
  
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


  exportToExcel(): void {
    const worksheet = XLSX.utils.json_to_sheet(
      this.filteredMaintenances.map(m => ({
        ID: m.id,
     
        Type: m.type_maintenance === 'PREVENTIVE' ? 'Préventive' : 'preventive',
        'Date début': new Date(m.dateDebutPrevue).toLocaleDateString(),
        Statut: this.getStatusLabel(m.statut),
        Priorité: this.getPriorityLabel(m.priorite),
      
      }))
    );
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Maintenances');
    XLSX.writeFile(workbook, 'rapport_maintenances.xlsx');
  }

  exportMaintenancePDF(maintenance: maintenance): void {
    const doc = new jsPDF();
    
    // Configuration des couleurs
    const primaryColor = '#4169E1';
    const secondaryColor = '#A9A9A9';
    const preventiveColor = '#228B22';
    const correctiveColor = '#DC143C';
    const textColor = '#000000';
    const lineColor = '#E0E0E0';
    const repetitionColor = '#00008B'; // Couleur pour les dates de répétition

    // Configuration des polices
    const titleFontSize = 14;
    const headerFontSize = 12;
    const bodyFontSize = 10;
    const lineHeight = 7;
    const sectionSpacing = 10;

    // Logo
    const logoUrl = 'assets/logo.png';
    const img = new Image();
    img.src = logoUrl;

    img.onload = () => {
        try {
            // Position initiale
            let yPosition = 20;

            // Ajout du logo
            doc.addImage(img, 'PNG', 15, yPosition, 30, 15);
            yPosition += 5;

            // En-tête
            doc.setFontSize(headerFontSize);
            doc.setTextColor(secondaryColor);
            doc.text('H.U.I.R', 50, yPosition);
            yPosition += 5;
            doc.text('HOPITAL UNIVERSITAIRE INTERNATIONAL DE RABAT', 50, yPosition);
            yPosition += 15;

            // Titre principal
            doc.setFontSize(titleFontSize);
            doc.setTextColor(primaryColor);
            doc.text('Fiche Maintenance', 105, yPosition, { align: 'center' });
            yPosition += 10;

            // Ligne de séparation
            doc.setDrawColor(primaryColor);
            doc.setLineWidth(0.5);
            doc.line(15, yPosition, 195, yPosition);
            yPosition += sectionSpacing;

            // Configuration de la police pour le corps du document
            doc.setFontSize(bodyFontSize);
            doc.setTextColor(textColor);

            // Fonction pour ajouter une ligne de champ
            const addField = (label: string, value: string | number, valueColor?: string) => {
                doc.setFont('helvetica', 'bold');
                doc.text(`${label}:`, 20, yPosition);
                
                doc.setFont('helvetica', 'normal');
                if (valueColor) doc.setTextColor(valueColor);
                doc.text(value.toString(), 70, yPosition);
                doc.setTextColor(textColor);
                
                yPosition += lineHeight;
            };

            // Informations de base
            addField('ID Maintenance', maintenance.id.toString());
            
            if (maintenance.equipementId != null) {
                addField('Équipement', maintenance.equipementId.toString());
            }

            // Type de maintenance
            addField(
                'Type', 
                maintenance.type_maintenance === 'PREVENTIVE' ? 'Préventive' : 'Préventive',
                maintenance.type_maintenance === 'PREVENTIVE' ? preventiveColor : correctiveColor
            );

            // Dates
            addField('Date début prévue', new Date(maintenance.dateDebutPrevue).toLocaleDateString());
            addField('Date fin prévue', new Date(maintenance.dateFinPrevue).toLocaleDateString());

            // Durée d'intervention
            if (maintenance.dureeIntervention) {
                addField('Durée intervention', `${maintenance.dureeIntervention} jours`);
            }

            // Statut et priorité
            addField('Statut', this.getStatusLabel(maintenance.statut), this.getStatusColor(maintenance.statut));
            addField('Priorité', this.getPriorityLabel(maintenance.priorite), this.getPriorityColor(maintenance.priorite));

            // Section Commentaires
            if (maintenance.commentaires) {
                yPosition += 3;
                addMultilineField('Commentaires', maintenance.commentaires);
            }

            // Section Action
            if (maintenance.action) {
                yPosition += 3;
                addMultilineField('Action de maintenance', maintenance.action);
            }

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
if (maintenance.nextRepetitionDates && maintenance.nextRepetitionDates.length > 0) {
  yPosition += sectionSpacing;
  addSectionHeader('Jours de Répétition', repetitionColor);

  // Icône de répétition 
  doc.setTextColor(repetitionColor);
  doc.setFontSize(bodyFontSize + 2);
  doc.text('↻', 20, yPosition);

  // Liste des dates
  doc.setFontSize(bodyFontSize);
  doc.setTextColor(textColor);
  doc.setFont('helvetica', 'normal');

  let datesY = yPosition;
  maintenance.nextRepetitionDates.forEach(date => {
      const formattedDate = new Date(date).toLocaleDateString();
      doc.text(formattedDate, 30, datesY);
      datesY += lineHeight;
  });

  yPosition = datesY;
}


            // Section Technicien
            if (maintenance.user) {
                yPosition += sectionSpacing;
                addSectionHeader('Technicien assigné');
                
                addField('Civilité', maintenance.user.civilite || 'Non renseigné');
                addField('Nom', maintenance.user.nom || 'Non renseigné');
                addField('Email', maintenance.user.email || 'Non renseigné');
                
                if (maintenance.user.username) {
                    addField('Nom utilisateur', maintenance.user.username);
                }
                
                addField('Contact', maintenance.user.gsm || 'Non renseigné');
                
                if (maintenance.user.role) {
                    addField('Fonction', maintenance.user.role);
                }
                
                if (maintenance.user.actif !== undefined) {
                    addField('Actif', maintenance.user.actif ? 'Oui' : 'Non');
                }
            }

            // Pied de page
            yPosition = 285;
            doc.setFontSize(8);
            doc.setTextColor(secondaryColor);
            doc.text(`Document généré le ${new Date().toLocaleDateString()} - H.U.I.R`, 105, yPosition, { align: 'center' });

            // Sauvegarde du PDF
            doc.save(`fiche_maintenance_${maintenance.id}.pdf`);

            // Fonction pour les champs multilignes
            function addMultilineField(label: string, text: string) {
                doc.setFont('helvetica', 'bold');
                doc.text(`${label}:`, 20, yPosition);
                
                const textLines = doc.splitTextToSize(text, 160);
                doc.setFont('helvetica', 'normal');
                doc.text(textLines, 25, yPosition + 5);
                
                yPosition += 5 + (textLines.length * lineHeight);
            }

            // Fonction pour les en-têtes de section (modifiée pour accepter une couleur personnalisée)
            function addSectionHeader(title: string, color: string = primaryColor) {
                doc.setFontSize(bodyFontSize + 1);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(color);
                doc.text(title, 20, yPosition);
                
                doc.setDrawColor(lineColor);
                doc.setLineWidth(0.3);
                doc.line(20, yPosition + 2, 50, yPosition + 2);
                
                yPosition += lineHeight + 3;
                doc.setFontSize(bodyFontSize);
                doc.setTextColor(textColor);
            }

        } catch (e) {
            console.error('Erreur lors de la génération du PDF:', e);
        }
    };

    img.onerror = () => {
        console.error('Le logo est introuvable, génération sans logo...');
        this.generateMaintenancePDFWithoutLogo(doc, maintenance);
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
}