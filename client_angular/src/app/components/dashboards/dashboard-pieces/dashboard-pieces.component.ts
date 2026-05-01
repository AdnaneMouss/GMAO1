import { Component, OnInit, AfterViewInit } from '@angular/core';
import {DashboardService} from "../../../services/dashboard.service";
import { format, parse } from 'date-fns';
import {Chart, ChartData, ChartOptions, ChartType} from 'chart.js/auto';
import { fr } from 'date-fns/locale';
@Component({
  selector: 'app-dashboard-pieces',
  templateUrl: './dashboard-pieces.component.html',
  styleUrl: './dashboard-pieces.component.css'
})
export class DashboardPiecesComponent implements OnInit, AfterViewInit {
  totalPieces: number = 0;
  ruptureCount: number = 0;
  stockBasCount: number = 0;
  disponibleCount: number = 0;



  public achatChartLabels: string[] = [];
  public achatChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'User Registrations' }
    ]
  };
  public barChartType: 'bar' = 'bar';

  constructor(private dashboardService: DashboardService) {}

  ngAfterViewInit(): void {
        throw new Error('Method not implemented.');
    }

  ngOnInit(): void {
    this.getTotalPieces();
    this.getPieceStatusCounts();
    this.loadAchatsPiecesParMois();
  }

  getTotalPieces(): void {
    this.dashboardService.getTotalPieces().subscribe({
      next: (total) => this.totalPieces = total,
      error: (err) => console.error('Erreur lors du chargement du total de pièces détachées:', err)
    });
  }

  getPieceStatusCounts(): void {
    this.dashboardService.getPieceStatusCounts().subscribe({
      next: (data) => {
        this.totalPieces = data.total;
        this.ruptureCount = data.rupture;
        this.stockBasCount = data.stockBas;
        this.disponibleCount = data.disponible;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des statistiques des pièces:', err);
      }
    });
  }

  loadAchatsPiecesParMois(): void {
    this.dashboardService.getPurchasesPerMonth().subscribe(data => {
      const sortedKeys = Object.keys(data).sort(); // Format 'YYYY-MM'

      this.achatChartLabels = sortedKeys.map(dateStr => {
        const parsedDate = parse(dateStr, 'yyyy-MM', new Date());
        return format(parsedDate, 'MMMM yyyy', { locale: fr });
      });

      const sortedValues = sortedKeys.map(key => data[key]);

      this.achatChartData = {
        labels: this.achatChartLabels,
        datasets: [
          {
            data: sortedValues,
            label: 'Achats de pièces',
            backgroundColor: '#1976d2'
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
        text: 'Nombre de pièces achetées par mois',
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
          text: 'Nombre de pièces',
          font: { size: 14, weight: 'bold' }
        },
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };


  protected readonly Math = Math;
}
