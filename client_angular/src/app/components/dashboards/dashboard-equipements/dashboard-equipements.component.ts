import {Component, ElementRef, ViewChild} from '@angular/core';
import {Chart, ChartConfiguration, ChartData, ChartOptions} from "chart.js/auto";
import {DashboardService} from "../../../services/dashboard.service";


@Component({
  selector: 'app-dashboard-equipements',
  templateUrl: './dashboard-equipements.component.html',
  styleUrl: './dashboard-equipements.component.css'
})
export class DashboardEquipementsComponent {
  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;
  totalEquipements!: number;
  equipementsByService: Record<string, number> = {};
  expiredGarantiesCount!: number;
  equipementsTotalCost!: number;
  withoutRecentMaintenanceCount!: number;
  aboveThresholdCount!: number;

  enServiceCount!: number;
  enPanneCount!: number;
  enMaintenanceCount!: number;



  private chart: any;

  readonly monthOrder = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  public barChartLabels: string[] = [];
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Equipements par type' }
    ]
  };

  barChartLabelsMarque: string[] = [];
  barChartDataMarque: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Equipements par marque' }
    ]
  };

  barChartLabelsService: string[] = [];
  barChartDataService: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Equipements par marque' }
    ]
  };


  public barChartType: 'bar' = 'bar';

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadEquipementStats();
  }


  currentChartIndex = 0;

  scrollLeft() {
    this.currentChartIndex = Math.max(0, this.currentChartIndex - 1);
  }

  scrollRight() {
    this.currentChartIndex = Math.min(2, this.currentChartIndex + 1);
  }


  loadEquipementStats(): void {
    this.getTotalEquipements();
    this.getEquipementsByStatut();
    this.getEquipementsByMarque();
    this.getEquipementsByType();
    this.getEquipementsByService();
    this.getExpiredGarantiesCount();
    this.getEquipementsTotalCost();
    this.getEquipementsWithoutRecentMaintenance();
    this.getEquipementsAboveThreshold();
  }

  getPercentage(count: number): string {
    if (!this.totalEquipements || this.totalEquipements === 0) return '0';
    const percent = (count / this.totalEquipements) * 100;
    return percent.toFixed(2); // 2 decimal places, clean and pipe-free
  }

  getAverageCost(): string {
    if (!this.totalEquipements || this.totalEquipements === 0) return '0';
    const avg = this.equipementsTotalCost / this.totalEquipements;
    return avg.toFixed(2); // Rounded to 2 decimal places
  }




  getTotalEquipements(): void {
    this.dashboardService.getTotalEquipements().subscribe({
      next: (total) => this.totalEquipements = total,
      error: (err) => console.error('Erreur chargement total équipements:', err)
    });
  }


  getEquipementsByStatut(): void {
    this.dashboardService.getEquipementsStatusCounts().subscribe({
      next: (data) => {
        this.totalEquipements = data.total;
        this.enServiceCount = data.EN_SERVICE;
        this.enPanneCount = data.EN_PANNE;
        this.enMaintenanceCount = data.EN_MAINTENANCE;
      },
      error: (err) => {
        console.error('Error fetching equipements counts:', err);
      }
    });
  }





  getEquipementsByMarque(): void {
    this.dashboardService.getEquipementsByMarque().subscribe(data => {
      // Step 1: Sort the brands alphabetically
      const sortedKeys = Object.keys(data).sort((a, b) => a.localeCompare(b));

      // Step 2: Set labels (brand names)
      this.barChartLabelsMarque = sortedKeys;

      // Step 3: Get corresponding values
      const sortedValues = sortedKeys.map(key => data[key]);

      // Step 4: Chart data
      this.barChartDataMarque = {
        labels: this.barChartLabelsMarque,
        datasets: [
          {
            data: sortedValues,
            label: 'Équipements',
            backgroundColor: '#2196f3'
          }
        ]
      };
    });
  }

  barChartOptionsMarque: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      title: {
        display: true,
        text: 'Nombre d\'équipements par marque',
        font: {
          size: 18,
          weight: 'bold'
        }
      },
      tooltip: { enabled: true }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Marques',
          font: { size: 14, weight: 'bold' }
        }
      },
      y: {
        title: {
          display: true,
          text: 'Nombre d\'équipements',
          font: { size: 14, weight: 'bold' }
        },
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };


  getEquipementsByType(): void {
      this.dashboardService.getEquipementsByType().subscribe(data => {
        // Step 1: Convert object to array of entries
        const entries = Object.entries(data); // [['Scanner', 7], ['Moniteur', 12], ...]

        // Step 2: Separate keys (types) and values (counts)
        this.barChartLabels = entries.map(([type]) => type);
        const counts = entries.map(([, count]) => count);

        // Step 3: Assign to chart data
        this.barChartData = {
          labels: this.barChartLabels,
          datasets: [
            {
              data: counts,
              label: 'Équipements',
              backgroundColor: '#4caf50'
            }
          ]
        };
      });
    }


  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'top' },
      title: {
        display: true,
        text: 'Nombre d\'équipements par type',
        font: { size: 18, weight: 'bold' }
      },
      tooltip: { enabled: true },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Type d\'équipement',
          font: { size: 14, weight: 'bold' }
        }
      },
      y: {
        title: {
          display: true,
          text: 'Quantité',
          font: { size: 14, weight: 'bold' }
        },
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };


  getEquipementsByService(): void {
    this.dashboardService.getEquipementsByService().subscribe(data => {
      const sortedKeys = Object.keys(data).sort((a, b) => a.localeCompare(b));
      this.barChartLabelsService = sortedKeys;
      const sortedValues = sortedKeys.map(key => data[key]);

      this.barChartDataService = {
        labels: this.barChartLabelsService,
        datasets: [
          {
            data: sortedValues,
            label: 'Équipements',
            backgroundColor: '#ff9800' // A fire-orange color to mix it up 🧡
          }
        ]
      };
    });
  }

  barChartOptionsService: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      title: {
        display: true,
        text: 'Nombre d\'équipements par service',
        font: {
          size: 18,
          weight: 'bold'
        }
      },
      tooltip: { enabled: true }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Services',
          font: { size: 14, weight: 'bold' }
        }
      },
      y: {
        title: {
          display: true,
          text: 'Nombre d\'équipements',
          font: { size: 14, weight: 'bold' }
        },
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  getExpiredGarantiesCount(): void {
    this.dashboardService.getExpiredGarantiesCount().subscribe({
      next: (count) => this.expiredGarantiesCount = count,
      error: (err) => console.error('Erreur chargement garanties expirées:', err)
    });
  }

  getEquipementsTotalCost(): void {
    this.dashboardService.getEquipementsTotalCost().subscribe({
      next: (cost) => this.equipementsTotalCost = cost,
      error: (err) => console.error('Erreur chargement coût total équipements:', err)
    });
  }

  getEquipementsWithoutRecentMaintenance(): void {
    this.dashboardService.getEquipementsWithoutRecentMaintenance().subscribe({
      next: (count) => this.withoutRecentMaintenanceCount = count,
      error: (err) => console.error('Erreur équipements sans maintenance récente:', err)
    });
  }

  getEquipementsAboveThreshold(): void {
    this.dashboardService.getEquipementsAboveThreshold().subscribe({
      next: (count) => this.aboveThresholdCount = count,
      error: (err) => console.error('Erreur équipements au-dessus du seuil:', err)
    });
  }

  protected readonly Math = Math;
}
