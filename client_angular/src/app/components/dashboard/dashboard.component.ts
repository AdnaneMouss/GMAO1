import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  activeTab: string = 'users';
  
  tabs = [
    { id: 'users', name: 'Utilisateurs', icon: 'fas fa-users' },
    { id: 'equipements', name: 'Équipements', icon: 'fas fa-tools' },
    { id: 'pieces', name: 'Pièces', icon: 'fas fa-cogs' },
    { id: 'maintenance', name: 'Maintenances', icon: 'fas fa-wrench' },
    { id: 'interventions', name: 'Interventions', icon: 'fas fa-clipboard-list' },
    { id: 'batiments', name: 'Bâtiments', icon: 'fas fa-building' },
    { id: 'services', name: 'Services', icon: 'fas fa-concierge-bell' }
  ];

  constructor() {
    Chart.register(...registerables); // Enregistre tous les modules de Chart.js
  }

  ngOnInit(): void {
    this.createCharts();
  }

  createCharts(): void {
    // Graphique 1 : Interventions par type
    const maintenanceChart = new Chart('maintenanceChart', {
      type: 'pie',
      data: {
        labels: ['Préventive', 'Corrective'],
        datasets: [{
          label: 'Nombre d\'interventions',
          data: [300, 150],
          backgroundColor: ['#36a2eb', '#ff6384'],
        }]
      }
    });

    // Graphique 2 : Statut des équipements
    const equipmentChart = new Chart('equipmentChart', {
      type: 'doughnut',
      data: {
        labels: ['Actif', 'En Panne', 'Hors Service'],
        datasets: [{
          label: 'Statut des Équipements',
          data: [250, 30, 20],
          backgroundColor: ['#4caf50', '#f44336', '#9e9e9e'],
        }]
      }
    });

    // Graphique 3 : Interventions par mois
    const monthlyChart = new Chart('monthlyChart', {
      type: 'line',
      data: {
        labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
        datasets: [{
          label: 'Interventions par Mois',
          data: [45, 60, 50, 70, 65, 80, 90, 85, 75, 70, 60, 55],
          borderColor: '#36a2eb',
          fill: false,
        }]
      }
    });

    // Graphique 4 : Répartition des techniciens
    const technicianChart = new Chart('technicianChart', {
      type: 'bar',
      data: {
        labels: ['Électronique', 'Mécanique', 'Informatique'],
        datasets: [{
          label: 'Répartition des Techniciens',
          data: [200, 150, 40],
          backgroundColor: ['#ff6384', '#36a2eb', '#ffce56'],
        }]
      }
    });
  }

  
}