import { Component, ElementRef, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { Equipement } from '../../../models/equipement';
import { EquipementService } from '../../../services/equipement.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Batiment } from '../../../models/batiment';

Chart.register(...registerables);

@Component({
  selector: 'app-cout-maintenances',
  templateUrl: './cout-maintenances.component.html',
  styleUrls: ['./cout-maintenances.component.css']
})
export class CoutMaintenancesComponent implements OnInit {
  @ViewChild('statutChart') statutChartRef!: ElementRef;
  
  equipements: Equipement[] = [];
  criticalEquipments: Equipement[] = [];
  initialItemsToShow: number = 5; // Nombre d'éléments à afficher initialement
showAll: boolean = false; // Contrôle l'affichage complet ou partiel

  
  stats = {
    totalEquipements: 0,
    equipementsEnPanne: 0,
    coutTotal: 0,
    MiseEnServiceEquipement: 0
  };

  statutChart: any;

  constructor(
    private equipementService: EquipementService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadEquipements();
  }

  toggleShowAll(): void {
    this.showAll = !this.showAll;
  }
  loadEquipements(): void {
    this.equipementService.getAllEquipements().subscribe({
      next: (data) => {
        this.equipements = data;
        this.calculateStats();
        this.filterCriticalEquipments();
        this.cd.detectChanges();
        this.initStatutChart();
      },
      error: (err) => {
        console.error('Error loading equipment:', err);
      }
    });
  }

  calculateStats(): void {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    this.stats = {
      totalEquipements: this.equipements.length,
      equipementsEnPanne: this.equipements.filter(e => 
        ['En panne', 'Hors service'].includes(e.statut)
      ).length,
      coutTotal: this.equipements.reduce((total, e) => {
        const cout = typeof e.coutAchat === 'string' 
          ? parseFloat(e.coutAchat.replace(',', '.')) 
          : Number(e.coutAchat);
        return total + (isNaN(cout) ? 0 : cout);
      }, 0),
      MiseEnServiceEquipement: this.equipements.filter(e => 
        e.dateMiseEnService && new Date(e.dateMiseEnService) > oneMonthAgo
      ).length
    };
  }

  filterCriticalEquipments(): void {
    this.criticalEquipments = this.equipements
      .filter(e => ['En panne', 'Hors service'].includes(e.statut))
      .slice(0, 10);
  }

  initStatutChart(): void {
    if (!this.statutChartRef?.nativeElement) {
      console.error('Canvas element not found');
      return;
    }
  
    if (this.statutChart) {
      this.statutChart.destroy();
    }
  
    const ctx = this.statutChartRef.nativeElement.getContext('2d');
    if (!ctx) return;
  
    const labels = ['Actif', 'En panne', 'Hors service', 'En maintenance'];
    const data = this.prepareChartData();
  
    this.statutChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Nombre d\'équipements',
          data: data,
          backgroundColor: [
            '#10B981', // Vert - Actif
            '#F59E0B', // Orange - En panne
            '#EF4444', // Rouge - Hors service
            '#3B82F6'  // Bleu - En maintenance
          ],
          borderColor: [
            '#059669', // Vert foncé
            '#D97706', // Orange foncé
            '#DC2626', // Rouge foncé
            '#2563EB'  // Bleu foncé
          ],
          borderWidth: 1,
          borderRadius: 8,
          barPercentage: 0.6,
          categoryPercentage: 0.5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              color: '#111',
              font: {
                size: 14,
                weight: 'bold'
              }
            }
          },
          title: {
            display: true,
            text: 'Répartition des équipements par statut',
            font: {
              size: 18,
              weight: 'bold'
            },
            color: '#1F2937'
          },
          tooltip: {
            backgroundColor: '#f9fafb',
            titleColor: '#111827',
            bodyColor: '#1F2937',
            borderColor: '#E5E7EB',
            borderWidth: 1
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              color: '#374151',
              font: {
                size: 13
              }
            },
            title: {
              display: true,
              text: 'Nombre',
              color: '#1F2937',
              font: {
                size: 14,
                weight: 'bold'
              }
            },
            grid: {
              color: '#E5E7EB'
            }
          },
          x: {
            ticks: {
              color: '#374151',
              font: {
                size: 13
              }
            },
            title: {
              display: true,
              text: 'Statut',
              color: '#1F2937',
              font: {
                size: 14,
                weight: 'bold'
              }
            },
            grid: {
              color: '#F3F4F6'
            }
          }
        }
      }
    });
  }

  prepareChartData(): number[] {
    return [
      this.equipements.filter(e => e.statut === 'Actif').length,
      this.equipements.filter(e => e.statut === 'En panne').length,
      this.equipements.filter(e => e.statut === 'Hors service').length,
      this.equipements.filter(e => e.statut === 'En maintenance').length
    ];
  }

  exportEquipmentPDF(equipment: Equipement): void {
    const doc = new jsPDF();
    const primaryColor = '#4169E1';
    const secondaryColor = '#A9A9A9';
    
    // Configuration initiale
    let yPosition = 30;
    const marginLeft = 15;
    const valueOffset = 80;
    
    // Ajout du logo
    const logoUrl = 'assets/logo.png';
    const img = new Image();
    img.src = logoUrl;

 
const etageNom = equipment.etage?.num || 'Inconnu';
const salleNom = equipment.salle?.num || 'Inconnue';
const serviceNom = equipment.service?.nom || 'Inconnu';

  
    img.onload = () => {
      try {
        // En-tête avec logo
        doc.addImage(img, 'PNG', marginLeft, 10, 30, 15);
        doc.setFontSize(12);
        doc.setTextColor(secondaryColor);
        doc.text('H.U.I.R', 50, 15);
        doc.text('HOPITAL UNIVERSITAIRE INTERNATIONAL DE RABAT', 50, 20);
        
        // Titre principal
        doc.setFontSize(16);
        doc.setTextColor(primaryColor);
        doc.text('FICHE TECHNIQUE ÉQUIPEMENT', 105, yPosition, { align: 'center' });
        yPosition += 10;
        
        // Ligne de séparation
        doc.setDrawColor(primaryColor);
        doc.setLineWidth(0.5);
        doc.line(marginLeft, yPosition, 195, yPosition);
        yPosition += 15;
  
        // Section 1: Informations de base
        this.addSectionHeader(doc, 'INFORMATIONS GÉNÉRALES', marginLeft, yPosition);
        yPosition += 7;
        this.addField(doc, 'Nom', equipment.nom, marginLeft, yPosition, valueOffset, 'left');
        this.addField(doc, 'Numéro de série', equipment.numeroSerie, marginLeft, yPosition, valueOffset, 'left');
        this.addField(doc, 'Modèle', equipment.modele, marginLeft, yPosition, valueOffset, 'left');
        this.addField(doc, 'Marque', equipment.marque, marginLeft, yPosition, valueOffset, 'left');
        this.addField(doc, 'Description', equipment.description, marginLeft, yPosition, valueOffset, 'left');
        
  
        // Section 2: Statut et localisation
        this.addField(doc, 'Actif', equipment.actif ? 'Oui' : 'Non', marginLeft, yPosition, valueOffset, 'left');
        this.addField(doc, "Numéro bâtiment", String(equipment.batiment?.numBatiment ?? "Inconnu"), marginLeft, yPosition, valueOffset, 'left');
        this.addField(doc, "Numéro etage", String(equipment.etage?.num ?? "Inconnu"), marginLeft, yPosition, valueOffset, 'left');
        this.addField(doc, "salle", String(equipment.salle?.num ?? "Inconnu"), marginLeft, yPosition, valueOffset, 'left');
        this.addField(doc, 'Service', serviceNom, marginLeft, yPosition + 28, valueOffset, 'left');
        
        
        // Gestion des propriétés optionnelles avec vérification de type
        this.addField(doc, 'Coût d\'achat', equipment.coutAchat ? `${equipment.coutAchat} DH` : null, marginLeft, yPosition, valueOffset, 'left');
        this.addField(doc, 'Pièces détachées', `${equipment.piecesDetachees.length} pièces associées`, marginLeft, yPosition, valueOffset, 'left');
        
        this.addField(doc, 'Historique des pannes', equipment.historiquePannes || 'Aucun historique', marginLeft, yPosition, valueOffset, 'left');
        this.addField(doc, 'Valeur suivi', equipment.valeurSuivi?.toString(), marginLeft, yPosition, valueOffset, 'left');
        this.addField(doc, 'Label suivi', equipment.labelSuivi || null, marginLeft, yPosition, valueOffset, 'left');

  
  
        
        
       
  
        // Pied de page
        doc.setFontSize(8);
        doc.setTextColor(secondaryColor);
        doc.text(`Document généré le ${new Date().toLocaleDateString()} - H.U.I.R`, 105, 285, { align: 'center' });
  
        // Enregistrement du PDF
        doc.save(`fiche_equipement_${(equipment.nom || 'equipement').replace(/\s+/g, '_')}.pdf`);
      } catch (e) {
        console.error('Erreur lors de la génération du PDF:', e);
      }
    };
  
    img.onerror = () => {
      console.error('Le logo est introuvable, génération sans logo...');
      this.generatePDFWithoutLogo(doc, equipment);
    };
  }
  
  // Méthodes utilitaires avec typage strict
  private addSectionHeader(doc: jsPDF, text: string, x: number, y: number): void {
    doc.setFontSize(12);
    doc.setTextColor('#4169E1');
    doc.setFont('helvetica', 'bold');
    doc.text(text, x, y);
    doc.setFont('helvetica', 'normal');
  }
  
  addField(doc: jsPDF, label: string, value: string | null | undefined, x: number, y: number, offset: number, align: 'left' | 'center' | 'right'): void {
    doc.text(`${label} : ${value ?? 'N/A'}`, x + offset, y, { align });
  }
  
    
  
  

 
  
  private addStatusField(doc: jsPDF, label: string, status: string | undefined, x: number, y: number, offset: number): void {
    if (!status) return;
    
    const statusColor = {
      'Actif': '#228B22',
      'En panne': '#F59E0B',
      'Hors service': '#DC143C',
      'En maintenance': '#3B82F6'
    }[status] || '#A9A9A9';
  
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`${label}:`, x, y);
    doc.setTextColor(statusColor);
    doc.text(status, x + offset, y);
    doc.setTextColor('#000000');
  }
  
 
  
  private generatePDFWithoutLogo(doc: jsPDF, equipment: Equipement): void {
    // Version simplifiée sans logo
    doc.setFontSize(16);
    doc.setTextColor('#4169E1');
    doc.text('Rapport des Coûts de Maintenance', 40, 40);
    
    doc.setFontSize(10);
    doc.setTextColor('#A9A9A9');
    doc.text('H.U.I.R - HOPITAL UNIVERSITAIRE INTERNATIONAL DE RABAT', 40, 50);
    
    // Ajouter le reste du contenu comme dans la version avec logo...
    // (vous pouvez copier le même contenu mais en ajustant les positions Y)
    
    doc.save(`rapport_cout_maintenance_simple_${new Date().toISOString().slice(0,10)}.pdf`);
  }

 
  
}