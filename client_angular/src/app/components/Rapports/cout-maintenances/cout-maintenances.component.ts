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
        console.log('Données reçues:', data);
        this.equipements = data;
        this.calculateStats(); // Ajouté
        this.filterCriticalEquipments(); // Ajouté
        this.initChart(); // Ajouté pour initialiser le graphique
      },
      error: (err) => {
        console.error('Error loading equipment:', err);
      }
    });
  }
  
  // Ajoutez cette méthode pour initialiser le graphique
  initChart(): void {
    if (this.statutChartRef) {
      const ctx = this.statutChartRef.nativeElement.getContext('2d');
      
      // Détruire le graphique existant s'il y en a un
      if (this.statutChart) {
        this.statutChart.destroy();
      }
  
      this.statutChart = new Chart(ctx, {
        type: 'bar', // ou 'pie' selon ce que vous voulez
        data: {
          labels: ['Actif', 'En panne', 'Hors service', 'En maintenance'],
          datasets: [{
            label: 'Statut des équipements',
            data: this.prepareChartData(),
            backgroundColor: [
              'rgba(75, 192, 192, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)'
            ],
            borderColor: [
              'rgba(75, 192, 192, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
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

  

  prepareChartData(): number[] {
    return [
      this.equipements.filter(e => e.statut === 'Actif').length,
      this.equipements.filter(e => e.statut === 'En panne').length,
      this.equipements.filter(e => e.statut === 'Hors service').length,
      this.equipements.filter(e => e.statut === 'En maintenance').length
    ];
  }

  exportEquipmentPDF(equipment: Equipement): void {
    const doc = new jsPDF('p', 'mm', 'a4');
    const primaryColor = '#4169E1';
    const secondaryColor = '#6B7280';
    const marginLeft = 15;
    const labelWidth = 60;
    let yPosition = 20;
  
    // 1. Chargement asynchrone du logo
    const loadImage = async (url: string): Promise<string> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = url;
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/png'));
          } else {
            resolve('');
          }
        };
        
        img.onerror = () => {
          console.warn('Logo non chargé, continuation sans logo');
          resolve('');
        };
      });
    };
  
    // 2. Fonction principale async
    (async () => {
      try {
        // A. Ajout du logo
        const logoData = await loadImage('assets/logo.png');
        
        if (logoData) {
          doc.addImage(logoData, 'PNG', marginLeft, yPosition, 30, 30);
          doc.setFontSize(8);
          doc.setTextColor(secondaryColor);
          doc.text('Hôpital Universitaire International de Rabat', marginLeft + 35, yPosition + 10);
          doc.text('Système de Gestion des Équipements', marginLeft + 35, yPosition + 15);
        }
        
        yPosition += logoData ? 40 : 20;
  
        // B. En-tête du document
        doc.setFontSize(16);
        doc.setTextColor(primaryColor);
        doc.setFont('helvetica', 'bold');
        doc.text('FICHE TECHNIQUE ÉQUIPEMENT', 105, yPosition, { align: 'center' });
        yPosition += 10;
        
        // Ligne de séparation
        doc.setDrawColor(primaryColor);
        doc.setLineWidth(0.5);
        doc.line(marginLeft, yPosition, 195, yPosition);
        yPosition += 15;
  
        // C. Sections d'information
        const sections = [
          {
            title: 'INFORMATIONS GÉNÉRALES',
            fields: [
              { label: 'Nom', value: equipment.nom || 'N/A' },
              { label: 'Numéro de série', value: equipment.numeroSerie || 'N/A' },
              { label: 'Modèle', value: equipment.modele || 'N/A' },
              { label: 'Marque', value: equipment.marque || 'N/A' },
              { label: 'Description', value: equipment.description || 'N/A' },
              { label: 'Statut', value: equipment.statut || 'N/A', special: 'status' },
              { label: 'Actif', value: equipment.actif ? 'Oui' : 'Non' },
              { label: 'Type', value: equipment.typeEquipement?.type || 'N/A' }
            ]
          },
          {
            title: 'DATES IMPORTANTES',
            fields: [
              { label: 'Date achat', value: equipment.dateAchat ? new Date(equipment.dateAchat).toLocaleDateString() : 'N/A' },
              { label: 'Date mise en service', value: equipment.dateMiseEnService ? new Date(equipment.dateMiseEnService).toLocaleDateString() : 'N/A' },
              { label: 'Date dernière maintenance', value: equipment.dateDerniereMaintenance ? new Date(equipment.dateDerniereMaintenance).toLocaleDateString() : 'N/A' },
              { label: 'Garantie', value: equipment.garantie || 'N/A' },
              { label: 'Fréquence maintenance', value: equipment.frequenceMaintenance || 'N/A' }
            ]
          },
          {
            title: 'LOCALISATION',
            fields: [
              { label: 'Bâtiment', value: equipment.batiment?.numBatiment?.toString() || 'N/A' },
              { label: 'Étage', value: equipment.etage?.num?.toString() || 'N/A' },
              { label: 'Salle', value: equipment.salle?.num?.toString() || 'N/A' },
              { label: 'Service', value: equipment.service?.nom || 'N/A' }
            ]
          },
          {
            title: 'COÛTS ET SUIVI',
            fields: [
              { label: 'Coût d\'achat', value: equipment.coutAchat ? `${equipment.coutAchat} DH` : 'N/A' },
              { label: 'Label suivi', value: equipment.labelSuivi || 'N/A' },
              { label: 'Valeur suivi', value: equipment.valeurSuivi?.toString() || 'N/A' }
            ]
          }
        ];
  
        // D. Génération dynamique des sections
        for (const section of sections) {
          // Vérifier si besoin d'une nouvelle page
          if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
          }
  
          // Titre de section
          doc.setFontSize(12);
          doc.setTextColor(primaryColor);
          doc.setFont('helvetica', 'bold');
          doc.text(section.title, marginLeft, yPosition);
          yPosition += 10;
  
          // Contenu de section
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          
          for (const field of section.fields) {
            if (yPosition > 270) {
              doc.addPage();
              yPosition = 20;
            }
  
            doc.setFont('helvetica', 'bold');
            doc.text(`${field.label}:`, marginLeft, yPosition);
            
            if (field.special === 'status') {
              const statusColor = this.getStatusColor(field.value);
              doc.setTextColor(statusColor);
              doc.text(field.value, marginLeft + labelWidth, yPosition);
              doc.setTextColor('#000000');
            } else {
              doc.setFont('helvetica', 'normal');
              doc.text(field.value, marginLeft + labelWidth, yPosition);
            }
            
            yPosition += 7;
          }
          
          yPosition += 10; // Espace entre sections
        }
  
        // E. Pied de page
        doc.setFontSize(8);
        doc.setTextColor(secondaryColor);
        doc.text(`Document généré le ${new Date().toLocaleDateString()} - Système de Gestion des Équipements H.U.I.R`, 105, 285, { align: 'center' });
  
        // F. Sauvegarde du PDF
        doc.save(`fiche_technique_${equipment.nom?.replace(/\s+/g, '_') || 'equipement'}.pdf`);
  
      } catch (error) {
        console.error('Erreur lors de la génération du PDF:', error);
        // Fallback sans image si échec
        this.generateSimplePDF(doc, equipment);
      }
    })();
  }
  
  // Helper pour les couleurs de statut
  private getStatusColor(status: string): string {
    const colors: {[key: string]: string} = {
      'Actif': '#228B22',
      'En panne': '#F59E0B',
      'Hors service': '#DC143C',
      'En maintenance': '#3B82F6'
    };
    return colors[status] || '#000000';
  }
  
  // Fallback si échec du PDF complet
  private generateSimplePDF(doc: jsPDF, equipment: Equipement): void {
    doc.text('FICHE ÉQUIPEMENT SIMPLIFIÉE', 20, 20);
    doc.text(`Nom: ${equipment.nom || 'N/A'}`, 20, 30);
    doc.text(`Numéro de série: ${equipment.numeroSerie || 'N/A'}`, 20, 40);
    doc.save(`fiche_simple_${equipment.nom?.replace(/\s+/g, '_') || 'equipement'}.pdf`);
  }
  
  private addSectionHeader(doc: jsPDF, text: string, x: number, y: number): void {
    doc.setFontSize(12);
    doc.setTextColor('#4169E1');
    doc.setFont('helvetica', 'bold');
    doc.text(text, x, y);
    doc.setFont('helvetica', 'normal');
  }
  

  
  // Méthode addField améliorée
  private addField(doc: jsPDF, label: string, value: string, x: number, y: number, labelWidth: number): void {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`${label}:`, x, y);
    doc.setFont('helvetica', 'normal');
    doc.text(value, x + labelWidth, y);
  }
  
  // Méthodes utilitaires avec typage strict
 
  
 
  
    
  
  

 
  
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