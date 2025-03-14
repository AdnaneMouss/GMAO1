import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DashboardService } from "../../../services/dashboard.service";
import {Chart, ChartData, ChartOptions, ChartType} from 'chart.js/auto';
import { format, parse } from 'date-fns';
import { fr } from 'date-fns/locale';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';



@Component({
  selector: 'app-dashboard-users',
  templateUrl: './dashboard-users.component.html',
  styleUrls: ['./dashboard-users.component.css']  // <-- fix typo here
})
export class DashboardUsersComponent implements OnInit, AfterViewInit {
  roleCounts: { [key: string]: number } = {};
  totalUsers: number = 0;
  activeUsers: number = 0;
  inactiveUsers: number = 0;


  private chart: any;

  readonly monthOrder = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  public barChartLabels: string[] = [];
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'User Registrations' }
    ]
  };
  public barChartType: 'bar' = 'bar';

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.fetchUserStatusCounts();
    this.getRolesCounts();
    this.loadUserRegistrations();
  }


  ngAfterViewInit(): void {
    // Delay to ensure data is fetched before chart init
    setTimeout(() => this.initChart(), 600);
  }

  fetchUserStatusCounts(): void {
    this.dashboardService.getUserStatusCounts().subscribe({
      next: (data) => {
        this.totalUsers = data.total;
        this.activeUsers = data.active;
        this.inactiveUsers = data.inactive;
      },
      error: (err) => {
        console.error('Error fetching user counts:', err);
      }
    });
  }

  getRolesCounts(): void {
    this.dashboardService.getRoleCounts().subscribe({
      next: (counts) => {
        this.roleCounts = counts;
        this.updateChartData();  // update chart when roles loaded
      },
      error: (err) => {
        console.error('Error fetching role counts:', err);
      }
    });
  }

  initChart(): void {
    const ctx = document.getElementById('rolesPieChart') as HTMLCanvasElement;
    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Admin', 'Technicien', 'Magasinier', 'Médecin'],
        datasets: [{
          data: [
            this.roleCounts['ADMIN'] || 0,
            this.roleCounts['TECHNICIEN'] || 0,
            this.roleCounts['MAGASINIER'] || 0,
            this.roleCounts['LAMBDA'] || 0,
          ],
          backgroundColor: [
            '#22c55e', // green
            '#3b82f6', // blue
            '#facc15', // yellow
            '#ef4444'  // red
          ],
          borderWidth: 1,
        }]
      },
      options: {
        responsive: true,
        cutout: '60%',
        plugins: {
          legend: { display: false }
        }
      }
    });
  }

  updateChartData(): void {
    if (this.chart) {
      this.chart.data.datasets[0].data = [
        this.roleCounts['ADMIN'] || 0,
        this.roleCounts['TECHNICIEN'] || 0,
        this.roleCounts['MAGASINIER'] || 0,
        this.roleCounts['RESPONSABLE'] || 0,
        this.roleCounts['LAMBDA'] || 0,
      ];
      this.chart.update();
    }
  }



  loadUserRegistrations() {
    this.dashboardService.getUserRegistrationsPerMonth().subscribe(data => {
      // Step 1: Get keys and sort them chronologically
      const sortedKeys = Object.keys(data).sort(); // since 'YYYY-MM' format, this sorts correctly

      // Step 2: Format for labels like "Mai 2025"
      this.barChartLabels = sortedKeys.map(dateStr => {
        const parsedDate = parse(dateStr, 'yyyy-MM', new Date());
        return format(parsedDate, 'MMMM yyyy', { locale: fr }); // French month formatting
      });

      // Step 3: Map the values in order
      const sortedValues = sortedKeys.map(key => data[key]);

      // Step 4: Assign to chart data
      this.barChartData = {
        labels: this.barChartLabels,
        datasets: [
          {
            data: sortedValues,
            label: 'Inscriptions',
            backgroundColor: '#4caf50'
          }
        ]
      };
    });
  }
// Chart options with title and axis labels
  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'top' },
      title: {
        display: true,
        text: 'Nombre d\'inscriptions par mois',
        font: { size: 18, weight: 'bold' }
      },
      tooltip: { enabled: true },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Mois',
          font: { size: 14, weight: 'bold' }
        }
      },
      y: {
        title: {
          display: true,
          text: 'Nombre d\'inscriptions',
          font: { size: 14, weight: 'bold' }
        },
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  async exportRolesToPDF() {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const title = 'Répartition des rôles';
    const roles = this.roleCounts;

    page.drawText(title, {
      x: 50,
      y: height - 50,
      size: 24,
      font,
      color: rgb(0, 0.53, 0.22),
    });

    let yPosition = height - 100;
    Object.entries(roles).forEach(([role, count], index) => {
      page.drawText(`${role}: ${count}`, {
        x: 50,
        y: yPosition - index * 30,
        size: 16,
        font,
        color: rgb(0, 0, 0),
      });
    });

    const pdfBytes = await pdfDoc.save();

    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'repartition_des_roles.pdf';
    link.click();
  }




  protected readonly Math = Math;
}
