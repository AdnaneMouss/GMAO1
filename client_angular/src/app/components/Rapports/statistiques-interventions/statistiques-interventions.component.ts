
import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { MaintenanceService } from '../../../services/maintenance.service';

@Component({
  selector: 'app-statistiques-interventions',
  templateUrl: './statistiques-interventions.component.html',
  styleUrl: './statistiques-interventions.component.css'
})
export class StatistiquesInterventionsComponent implements OnInit {
  stats: any = {};
  maintenances: any[] = [];
  currentPage = 0;
  pageSize = 10;
  totalItems = 0;
  
  // Filtres
  selectedStatut: string = '';
  selectedPriorite: string = '';
  selectedType: string = '';
  selectedMonth: number | null = null;
  selectedYear: number | null = new Date().getFullYear();
  
  // Graphiques
  statutChart: any;
  prioriteChart: any;
  tempsResolutionChart: any;
Math: any;

  constructor(
    private maintenanceService: MaintenanceService,
   
  ) {
    Chart.register(...registerables);
  
  }

  ngOnInit(): void {
    this.loadReport();
  }

  loadReport(): void {
    // Charger les statistiques
    this.maintenanceService.getAllMaintenances()
      .subscribe(data => {
        this.stats = data;
        this.createCharts();
      });

    // Charger les détails paginés
    this.loadMaintenances();
  }

  loadMaintenances(): void {
    this.maintenanceService.getAllMaintenances(
     
    ).subscribe(data => {
      this.maintenances = data;
   
    });
  }

  createCharts(): void {
    // Graphique de répartition par statut
    const statutCtx = document.getElementById('statutChart') as HTMLCanvasElement;
    this.statutChart = new Chart(statutCtx, {
      type: 'doughnut',
      data: {
        labels: Object.keys(this.stats.statutDistribution),
        datasets: [{
          data: Object.values(this.stats.statutDistribution),
          backgroundColor: [
            '#FFCE56', // EN_ATTENTE
            '#36A2EB', // EN_COURS
            '#4BC0C0', // TERMINEE
            '#FF6384'  // ANNULEE
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
          tooltip: {
            callbacks: {
              label: (context) => {
                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                const value = context.raw as number;
                const percentage = Math.round((value / total) * 100);
                return `${context.label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    });

    // Graphique de répartition par priorité
    const prioriteCtx = document.getElementById('prioriteChart') as HTMLCanvasElement;
    this.prioriteChart = new Chart(prioriteCtx, {
      type: 'bar',
      data: {
        labels: Object.keys(this.stats.prioriteDistribution),
        datasets: [{
          label: 'Nombre de maintenances',
          data: Object.values(this.stats.prioriteDistribution),
          backgroundColor: [
            '#4CAF50', // FAIBLE
            '#FFC107', // NORMALE
            '#F44336'  // URGENTE
          ]
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }

  onFilterChange(): void {
    this.currentPage = 0;
    this.loadReport();
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadMaintenances();
  }

  exportToPDF(): void {
    const docDefinition = {
      content: [
        { text: 'Rapport des Maintenances', style: 'header' },
        { text: `Période: ${this.getPeriodLabel()}`, style: 'subheader' },
        '\n',
        {
          table: {
            widths: ['*', '*', '*', '*'],
            body: [
              [
                { text: 'Total', style: 'tableHeader' },
                { text: 'Préventives', style: 'tableHeader' },
                { text: 'Correctives', style: 'tableHeader' },
                { text: 'Coût Total', style: 'tableHeader' }
              ],
              [
                this.stats.totalMaintenances,
                this.stats.maintenancesPreventives,
                this.stats.maintenancesCorrectives,
                { text: `${this.stats.coutTotal?.toFixed(2)} €`, style: 'money' }
              ]
            ]
          }
        },
        '\n',
        { text: 'Top 5 Équipements avec le plus de maintenances', style: 'sectionHeader' },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*'],
            body: [
              [
                { text: 'Équipement', style: 'tableHeader' },
                { text: 'Nombre de maintenances', style: 'tableHeader' }
              ],
              ...this.stats.topEquipements.map((e: any) => [
                e.equipementNom,
                e.count
              ])
            ]
          }
        },
        '\n',
        { text: 'Maintenances en retard', style: 'sectionHeader' },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*', '*', '*'],
            body: [
              [
                { text: 'ID', style: 'tableHeader' },
                { text: 'Équipement', style: 'tableHeader' },
                { text: 'Date prévue', style: 'tableHeader' },
                { text: 'Jours de retard', style: 'tableHeader' }
              ],
              ...this.stats.maintenancesEnRetard.map((m: any) => [
                m.id,
                m.equipement?.nom || 'N/A',
               
                m.joursRetard
              ])
            ]
          }
        }
      ],
      styles: {
        header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
        subheader: { fontSize: 10, margin: [0, 0, 0, 10] },
        tableHeader: { bold: true, fillColor: '#2E7D32', color: 'white' },
        sectionHeader: { fontSize: 14, bold: true, margin: [0, 10, 0, 5] },
        money: { alignment: 'right' }
      }
    };

    
  }

  getPeriodLabel(): string {
    if (this.selectedMonth && this.selectedYear) {
      
      
    } else if (this.selectedYear) {
      return `Année: ${this.selectedYear}`;
    }
    return 'Toutes périodes';
  }
}