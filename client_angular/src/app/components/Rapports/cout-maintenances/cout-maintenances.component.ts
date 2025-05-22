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

  showReportModal = false;
  lundiSemaineCourante?: Date;
  rapportHebdo: any;
  rapportMens: any;
  showRapportModal = false;
  selectedEquipementId: number | null = null;

  dateDebutFiltreH!: Date | null;
dateFinFiltreH!: Date | null;


dateDebutFiltreM!: Date | null;
dateFinFiltreM!: Date | null;

  showRapportModalM= false
  showEquipementDetails(eq: any): void {
    this.selectedEquipementId = eq.id; // ou eq.nom si pas d'ID
  }






resetFiltreH() {
    this.dateDebutFiltreH = null;
    this.dateFinFiltreH = null;
    this.filteredEquipmentH = [...this.equipements]; // ou juste this.maintenances si tu n’as pas besoin de copie
  }
     resetFiltreM() {
    this.dateDebutFiltreM = null;
    this.dateFinFiltreM = null;
    this.filteredEquipmentM = [...this.equipements]; // ou juste this.maintenances si tu n’as pas besoin de copie
  }
filteredEquipmentH: Equipement[] = [];
filteredEquipmentM: Equipement[] = [];


filteredEquipment: Equipement[] = [];
weeklyStats = {
  pannes: 0,
  maintenances: 0,
  tauxDisponibilite: '0'
};

  equipements: Equipement[] = [];

  criticalEquipments: Equipement[] = [];
  initialItemsToShow: number = 5; // Nombre d'Ã©lÃ©ments Ã  afficher initialement
showAll: boolean = false; // ContrÃ´le l'affichage complet ou partiel
reportGenerated: boolean = false;  // Indicateur si un rapport a Ã©tÃ© gÃ©nÃ©rÃ©
lastGeneratedReport: any = null;


  stats = {
    totalEquipements: 0,
    equipementsEnPanne: 0,
    coutTotal: 0,
    MiseEnServiceEquipement: 0
  };

  statutChart: any;

  currentWeekStart: Date = new Date();
currentWeekEnd: Date = new Date();



  constructor(
    private equipementService: EquipementService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadEquipements();
    const today = new Date();
    const day = today.getDay(); // 0 = Dimanche, 1 = Lundi, etc.
    const diff = (day + 6) % 7; // Lundi = 0, Dimanche = 6
    this.lundiSemaineCourante = new Date(today);
    this.lundiSemaineCourante.setDate(today.getDate() - diff);
    this.lundiSemaineCourante.setHours(0, 0, 0, 0);
    //this.generateWeeklyReport();
     //this.scheduleWeeklyReport();

  }
  get premierJourMoisActuel(): Date {
    const maintenant = new Date();
    return new Date(maintenant.getFullYear(), maintenant.getMonth(), 1);
  }




  scheduleWeeklyReport(): void {
    const now = new Date();

    // Calcul du prochain lundi Ã  8:00
    const nextMonday = new Date(now);
    nextMonday.setDate(now.getDate() + ((1 + 7 - now.getDay()) % 7 || 7)); // Prochain lundi
    nextMonday.setHours(8, 0, 0, 0); // Ã€ 8h00



    // Planification du rapport
    setTimeout(() => {
      this.generateWeeklyReport();
      // Reprogrammer pour la semaine suivante
      this.scheduleWeeklyReport();
    }, );
  }

  toggleShowAll(): void {
    this.showAll = !this.showAll;
  }
  closeReportModal(): void {
    this.showReportModal = false;
  }
  loadEquipements(): void {
    this.equipementService.getAllEquipements().subscribe({
      next: (data) => {
        console.log('DonnÃ©es reÃ§ues:', data);
        this.equipements = data;
        this.calculateStats(); // AjoutÃ©
        this.filterCriticalEquipments(); // AjoutÃ©
        this.initChart(); // AjoutÃ© pour initialiser le graphique
      },
      error: (err) => {
        console.error('Error loading equipment:', err);
      }
    });
  }

  // Ajoutez cette mÃ©thode pour initialiser le graphique
  initChart(): void {
    if (this.statutChartRef) {
      const ctx = this.statutChartRef.nativeElement.getContext('2d');

      // DÃ©truire le graphique existant s'il y en a un
      if (this.statutChart) {
        this.statutChart.destroy();
      }

      this.statutChart = new Chart(ctx, {
        type: 'bar', // ou 'pie' selon ce que vous voulez
        data: {
          labels: ['Actif', 'En panne', 'Hors service', 'En maintenance'],
          datasets: [{
            label: 'Statut des equipements',
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

async generateWeeklyReport(): Promise<void> {
  const currentDate = new Date();

  // ➤ Si les dates sont définies, on les utilise. Sinon, on prend la semaine précédente (du lundi au dimanche)
  const dateDebut = this.dateDebutFiltreH
    ? new Date(this.dateDebutFiltreH)
    : (() => {
        const today = new Date();
        const dayOfWeek = today.getDay(); // 0 (dimanche) à 6 (samedi)
        const diffToLastMonday = (dayOfWeek + 6) % 7 + 7; // Lundi de la semaine précédente
        today.setDate(today.getDate() - diffToLastMonday);
        today.setHours(0, 0, 0, 0);
        return today;
      })();

  const dateFin = this.dateFinFiltreH
    ? new Date(this.dateFinFiltreH)
    : (() => {
        const fin = new Date(dateDebut);
        fin.setDate(dateDebut.getDate() + 6);
        fin.setHours(23, 59, 59, 999);
        return fin;
      })();

  // ➤ Récupération des données pour la période
  const pannesCetteSemaine = this.getPannesForPeriod(dateDebut, dateFin);
  const maintenancesCetteSemaine = this.getMaintenancesForPeriod(dateDebut, dateFin);

  const equipementsDansPeriode = this.equipements.filter(eq => {
    const dateDerniereMaintenance = eq.dateDerniereMaintenance ? new Date(eq.dateDerniereMaintenance) : null;
    return (
      dateDerniereMaintenance &&
      dateDerniereMaintenance >= dateDebut &&
      dateDerniereMaintenance <= dateFin
    );
  });

  // ➤ Création du rapport
  const rapport = {
    dateGeneration: currentDate,
    periode: {
      debut: dateDebut,
      fin: dateFin,
      semaine: `Semaine du ${dateDebut.toLocaleDateString()} au ${dateFin.toLocaleDateString()}`
    },
    pannes: pannesCetteSemaine,
    maintenances: maintenancesCetteSemaine,
    equipementsCritiques: equipementsDansPeriode,
  };

  // ➤ Génération PDF avec jsPDF
  const doc = new jsPDF();
  const primaryColor = [22, 160, 133];
  const marginLeft = 20;
  let yPosition = 30;

  // ➤ Logo et en-tête
  try {
    const logoImg = new Image();
    logoImg.src = 'assets/logo.png';

    await new Promise((resolve, reject) => {
      logoImg.onload = resolve;
      logoImg.onerror = reject;
    });

    doc.addImage(logoImg, 'PNG', marginLeft, yPosition, 30, 30);
    doc.setFontSize(8);
    doc.text('Hopital Universitaire International de Rabat', marginLeft + 35, yPosition + 10);
    doc.text('Systeme de Gestion des Equipements', marginLeft + 35, yPosition + 15);
    yPosition += 40;
  } catch (e) {
    console.warn('Logo non trouvé, continuation sans logo');
    yPosition += 20;
  }

  // ➤ Titre du rapport centré
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  const titleText = 'Rapport Hebdomadaire de Maintenance';
  const titleWidth = doc.getTextWidth(titleText);
  doc.text(titleText, 105, yPosition, { align: 'center' });
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setLineWidth(0.5);
  doc.line(105 - titleWidth / 2, yPosition + 2, 105 + titleWidth / 2, yPosition + 2);
  yPosition += 10;

  // ➤ Sous-titre avec la période
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(rapport.periode.semaine, 105, yPosition, { align: 'center' });
  yPosition += 15;

  // ➤ Date de génération
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Date de génération : ${rapport.dateGeneration.toLocaleString()}`, marginLeft, yPosition);
  yPosition += 15;

  // ➤ Statistiques générales (à compléter si nécessaire)
  

  // ➤ Équipements critiques
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Équipements maintenus cette semaine', marginLeft, yPosition);
  yPosition += 10;

  autoTable(doc, {
    startY: yPosition,
    head: [['ID', 'Nom', 'Dernière Maintenance']],
    body: rapport.equipementsCritiques.map(e => [
      e.id.toString(),
      e.nom,
      new Date(e.dateDerniereMaintenance).toLocaleDateString(),
    ]),
    styles: {
      fontSize: 9,
    },
    headStyles: {
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240]
    }
  });

  // ➤ Sauvegarde du fichier
  doc.save(`rapport-maintenance-${currentDate.toISOString().split('T')[0]}.pdf`);
}



async generateMonthlyReport(): Promise<void> {
  const currentDate = new Date();

  // ➤ Si les dates sont définies, on les utilise. Sinon, on prend le mois précédent
  const dateDebut = this.dateDebutFiltreM
    ? new Date(this.dateDebutFiltreM)
    : (() => {
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        firstDay.setHours(0, 0, 0, 0);
        return firstDay;
      })();

  const dateFin = this.dateFinFiltreM
    ? new Date(this.dateFinFiltreM)
    : (() => {
        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
        lastDay.setHours(23, 59, 59, 999);
        return lastDay;
      })();

  // Récupérer les données pour la période
  const pannesCeMois = this.getPannesForPeriod(dateDebut, dateFin);
  const maintenancesCeMois = this.getMaintenancesForPeriod(dateDebut, dateFin);

  // Filtrer les équipements actifs cette période
  const equipementsDansPeriode = this.equipements.filter(eq => {
    const dateDerniereMaintenance = eq.dateDerniereMaintenance ? new Date(eq.dateDerniereMaintenance) : null;
    return (
      dateDerniereMaintenance && 
      dateDerniereMaintenance >= dateDebut && 
      dateDerniereMaintenance <= dateFin
    );
  });

  // Préparer les données du rapport
  const rapport = {
    dateGeneration: currentDate,
    periode: {
      debut: dateDebut,
      fin: dateFin,
      nomMois: dateDebut.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })
    },
    stats: {
      totalEquipements: this.stats.totalEquipements,
      pannes: pannesCeMois.length,
      maintenances: maintenancesCeMois.length,
      tauxDisponibilite: (
        ((this.stats.totalEquipements - pannesCeMois.length) / this.stats.totalEquipements) * 100
      ).toFixed(2),
    },
    pannes: pannesCeMois,
    maintenances: maintenancesCeMois,
    equipementsCritiques: equipementsDansPeriode
  };

  // Génération du PDF
  const doc = new jsPDF();
  const primaryColor = [22, 160, 133];
  const marginLeft = 20;
  let yPosition = 30;

  // Logo et en-tête
  try {
    const logoImg = new Image();
    logoImg.src = 'assets/logo.png';

    await new Promise((resolve, reject) => {
      logoImg.onload = resolve;
      logoImg.onerror = reject;
    });

    doc.addImage(logoImg, 'PNG', marginLeft, yPosition, 30, 30);
    doc.setFontSize(8);
    doc.text('Hopital Universitaire International de Rabat', marginLeft + 35, yPosition + 10);
    doc.text('Systeme de Gestion des Equipements', marginLeft + 35, yPosition + 15);
    yPosition += 40;
  } catch (e) {
    console.warn('Logo non trouvé, continuation sans logo');
    yPosition += 20;
  }

  // Titre du rapport
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  const titleText = `Rapport Mensuel des Equipements - ${rapport.periode.nomMois}`;
  const titleWidth = doc.getTextWidth(titleText);
  doc.text(titleText, 105, yPosition, { align: 'center' });
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setLineWidth(0.5);
  doc.line(105 - titleWidth/2, yPosition + 2, 105 + titleWidth/2, yPosition + 2);
  yPosition += 15;

  // Periode et date de génération
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.text(`Periode : du ${rapport.periode.debut.toLocaleDateString()} au ${rapport.periode.fin.toLocaleDateString()}`, marginLeft, yPosition);
  yPosition += 10;
  doc.text(`Date de generation : ${rapport.dateGeneration.toLocaleString()}`, marginLeft, yPosition);
  yPosition += 15;

  // Tableau des statistiques
  autoTable(doc, {
    startY: yPosition,
    styles: {
      fontSize: 10,
      cellPadding: 5,
    },
    columnStyles: {
      0: { fontStyle: 'bold' },
      1: { halign: 'right' }
    },
    margin: { left: marginLeft }
  });
  yPosition = (doc as any).lastAutoTable.finalY + 10;

  // Tableau des équipements
  autoTable(doc, {
    startY: yPosition,
    head: [['#', 'Nom',   'Dernière Maintenance']],
    body: rapport.equipementsCritiques.map((eq: any, index: number) => [
      index + 1,
      eq.nom || 'N/A',
    
     
      eq.dateDerniereMaintenance ? new Date(eq.dateDerniereMaintenance).toLocaleDateString() : 'N/A'
    ]),
    styles: {
      fontSize: 9,
    },
    headStyles: {
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240]
    }
  });

  // Sauvegarder le PDF
  doc.save(`rapport-mensuel-${dateDebut.getFullYear()}-${dateDebut.getMonth() + 1}.pdf`);
}













  private getPannesForPeriod(debut: Date, fin: Date): any[] {
    // Simulation - en rÃ©alitÃ©, vous filtreriez depuis votre base de donnÃ©es
    return this.equipements.filter(eq =>
      eq.statut === 'En panne' &&
      new Date(eq.dateDerniereMaintenance) >= debut &&
      new Date(eq.dateDerniereMaintenance) <= fin
    );
  }

  private getMaintenancesForPeriod(debut: Date, fin: Date): any[] {
    // Simulation - en rÃ©alitÃ©, vous filtreriez depuis votre base de donnÃ©es
    return this.equipements.filter(eq =>
      eq.dateDerniereMaintenance &&
      new Date(eq.dateDerniereMaintenance) >= debut &&
      new Date(eq.dateDerniereMaintenance) <= fin
    );
  }

async viewWeeklyReport(): Promise<void> {
  const currentDate = new Date();

  // ➤ 1. Gestion des dates de période (identique à generateWeeklyReport)
  const dateDebut = this.dateDebutFiltreH
    ? new Date(this.dateDebutFiltreH)
    : (() => {
        const today = new Date();
        const dayOfWeek = today.getDay(); // 0 (dimanche) à 6 (samedi)
        const diffToLastMonday = (dayOfWeek + 6) % 7 + 7; // Lundi semaine précédente
        today.setDate(today.getDate() - diffToLastMonday);
        today.setHours(0, 0, 0, 0);
        return today;
      })();

  const dateFin = this.dateFinFiltreH
    ? new Date(this.dateFinFiltreH)
    : (() => {
        const fin = new Date(dateDebut);
        fin.setDate(dateDebut.getDate() + 6); // Dimanche suivant
        fin.setHours(23, 59, 59, 999);
        return fin;
      })();

  // ➤ 2. Validation de la période (optionnelle)
  if (dateDebut > dateFin) {
    console.error('Erreur : La date de début doit être avant la date de fin');
    return;
  }

  // ➤ 3. Récupération des données (identique à votre version originale)
  const pannesCetteSemaine = this.getPannesForPeriod(dateDebut, dateFin);
  const maintenancesCetteSemaine = this.getMaintenancesForPeriod(dateDebut, dateFin);

  const equipementsDansPeriode = this.equipements.filter(eq => {
    const derniereMaintenance = eq.dateDerniereMaintenance 
      ? new Date(eq.dateDerniereMaintenance) 
      : null;
    return (
      derniereMaintenance && 
      derniereMaintenance >= dateDebut && 
      derniereMaintenance <= dateFin
    );
  });

  // ➤ 4. Calcul des stats
  const tauxDisponibilite = (
    ((this.stats.totalEquipements - pannesCetteSemaine.length) / this.stats.totalEquipements) * 100
  ).toFixed(2);

  // ➤ 5. Création du rapport avec formatage amélioré
  this.rapportHebdo = {
    dateGeneration: currentDate,
    periode: { 
      debut: dateDebut, 
      fin: dateFin,
      // Formatage lisible ex: "Semaine du 15/04/2024 au 21/04/2024"
      semaine: `Semaine du ${dateDebut.toLocaleDateString('fr-FR')} au ${dateFin.toLocaleDateString('fr-FR')}`,
      // Pour un affichage complémentaire
      anneeSemaine: `S${this.getWeekNumber(dateDebut)}-${dateDebut.getFullYear()}`
    },
    stats: {
      totalEquipements: this.stats.totalEquipements,
      pannes: pannesCetteSemaine.length,
      maintenances: maintenancesCetteSemaine.length,
      tauxDisponibilite: tauxDisponibilite,
      // Ajouts optionnels
     
    },
    pannes: pannesCetteSemaine,
    maintenances: maintenancesCetteSemaine,
    equipementsCritiques: equipementsDansPeriode
  };

  // ➤ 6. Affichage (avec log de débogage)
  console.log(`Rapport généré pour : ${this.rapportHebdo.periode.semaine}`);
  this.showRapportModal = true;
}

// ➤ Fonction helper pour le numéro de semaine (optionnelle)
private getWeekNumber(date: Date): string {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
  const week1 = new Date(d.getFullYear(), 0, 4);
  return Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7 + 1)
    .toString()
    .padStart(2, '0');
}
 viewMonthlyReport(): void {
  const currentDate = new Date();

  // ➤ Si les dates sont définies, on les utilise. Sinon, on prend le mois précédent
  const dateDebut = this.dateDebutFiltreM
    ? new Date(this.dateDebutFiltreM)
    : (() => {
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        firstDay.setHours(0, 0, 0, 0);
        return firstDay;
      })();

  const dateFin = this.dateFinFiltreM
    ? new Date(this.dateFinFiltreM)
    : (() => {
        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
        lastDay.setHours(23, 59, 59, 999);
        return lastDay;
      })();

  // Récupérer les données pour la période
  const pannesMoisPrecedent = this.getPannesForPeriod(dateDebut, dateFin);
  const maintenancesMoisPrecedent = this.getMaintenancesForPeriod(dateDebut, dateFin);

  // Filtrer les équipements actifs cette période
  const equipementsDansPeriode = this.equipements.filter(eq => {
    const derniereMaintenance = eq.dateDerniereMaintenance ? new Date(eq.dateDerniereMaintenance) : null;
    return (
      derniereMaintenance && 
      derniereMaintenance >= dateDebut && 
      derniereMaintenance <= dateFin
    );
  });

  this.rapportMens = {
    dateGeneration: currentDate,
    periode: { 
      debut: dateDebut, 
      fin: dateFin,
      nomMois: dateDebut.toLocaleString('fr-FR', { month: 'long', year: 'numeric' }) // Ajout du nom du mois
    },
    stats: {
      totalEquipements: this.stats.totalEquipements,
      pannes: pannesMoisPrecedent.length,
      maintenances: maintenancesMoisPrecedent.length,
      tauxDisponibilite: (
        ((this.stats.totalEquipements - pannesMoisPrecedent.length) / this.stats.totalEquipements) * 100
      ).toFixed(2),
    },
    pannes: pannesMoisPrecedent,
    maintenances: maintenancesMoisPrecedent,
    equipementsCritiques: equipementsDansPeriode
  };

  console.log('Affichage du rapport mensuel', this.rapportMens);
  this.showRapportModalM = true;
}



  exportReport(): void {
    const rapport = localStorage.getItem('lastWeeklyReport');
    if (!rapport) {

      return;
    }

    const rapportObj = JSON.parse(rapport);
    const doc = new jsPDF();

    // Titre
    doc.setFontSize(18);
    doc.text('Rapport Hebdomadaire des Equipements', 14, 20);

    // PÃ©riode
    doc.setFontSize(12);
    doc.text(`Periode: ${new Date(rapportObj.periode.debut).toLocaleDateString()} - ${new Date(rapportObj.periode.fin).toLocaleDateString()}`, 14, 30);
    doc.text(`Genere le: ${new Date(rapportObj.dateGeneration).toLocaleDateString()}`, 14, 36);







    const critData = rapportObj.equipementsCritiques.map((eq: any) => [
      eq.nom || 'N/A',
      eq.statut || 'N/A',
      eq.joursSansPanne || '0',
      eq.dateDerniereMaintenance ? new Date(eq.dateDerniereMaintenance).toLocaleDateString() : 'N/A'
    ]);

    autoTable(doc, {

      head: [['Nom', 'Statut', 'Jours sans panne', 'DerniÃ¨re maintenance']],
      body: critData,
      theme: 'grid',
      headStyles: { fillColor: [231, 76, 60] }
    });

    // Sauvegarde du PDF
    doc.save(`rapport_equipements_hebdo_${new Date().toISOString().slice(0, 10)}.pdf`);


  }




  calculateStats(): void {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    this.stats = {
      totalEquipements: this.equipements.length,
      equipementsEnPanne: this.equipements.filter(e =>
        ['EN_PANNE'].includes(e.statut)
      ).length,
      coutTotal: this.equipements.reduce((total, e) => total + (e.coutAchat || 0), 0),
      MiseEnServiceEquipement: this.equipements.filter(e =>
        e.dateAchat && new Date(e.dateAchat) > oneMonthAgo
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
    const primaryColor = '#4169E1'; // Bleu royal
    const secondaryColor = '#6B7280'; // Gris
    const accentColor = '#10B981'; // Vert émeraude
    const warningColor = '#F59E0B'; // Orange
    const dangerColor = '#EF4444'; // Rouge
    const textColor = '#000000'; // Noir
    const marginLeft = 15;
    const labelWidth = 60;
    let yPosition = 20;

    // Fonction pour charger l'image
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

    

    // Fonction principale async
    (async () => {
      try {
        // 1. Ajout du logo
        const logoData = await loadImage('assets/logo.png');

        if (logoData) {
          doc.addImage(logoData, 'PNG', marginLeft, yPosition, 30, 30);
          doc.setFontSize(10);
          doc.setTextColor(textColor);
          doc.setFont('helvetica', 'bold');
          doc.text('Hôpital Universitaire International de Rabat', marginLeft + 35, yPosition + 10);
          doc.setFont('helvetica', 'normal');
          doc.text('Système de Gestion des Equipements', marginLeft + 35, yPosition + 16);
          
          // Cadre autour du logo et texte
          doc.setDrawColor(primaryColor);
          doc.setLineWidth(0.3);
          doc.roundedRect(marginLeft, yPosition, 180, 25, 2, 2, 'S');
        }

        yPosition += logoData ? 40 : 20;

        // 2. En-tête du document
        doc.setFontSize(16);
        doc.setTextColor(primaryColor);
        doc.setFont('helvetica', 'bold');
        doc.text('FICHE TECHNIQUE EQUIPEMENT', 105, yPosition, { align: 'center' });
        
        // Ligne de séparation stylisée
        yPosition += 7;
        doc.setDrawColor(primaryColor);
        doc.setLineWidth(0.5);
        doc.line(50, yPosition, 160, yPosition);
        doc.setFillColor(primaryColor);
        doc.circle(50, yPosition, 1, 'F');
        doc.circle(160, yPosition, 1, 'F');
        yPosition += 15;

        // 3. Sections d'information avec style amélioré
        const sections = [
          {
            title: 'INFORMATIONS GÉNÉRALES',
            
            fields: [
              { label: 'Nom', value: equipment.nom || 'N/A', color: textColor },
              { label: 'Numéro de série', value: equipment.numeroSerie || 'N/A', color: textColor },
              { label: 'Modèle', value: equipment.modele || 'N/A', color: textColor },
              { label: 'Marque', value: equipment.marque || 'N/A', color: textColor },
              { label: 'Description', value: equipment.description || 'N/A', color: textColor },
              { label: 'Statut', value: equipment.statut || 'N/A', special: 'status' },
              { label: 'Actif', value: equipment.actif ? 'Oui' : 'Non', color: equipment.actif ? accentColor : dangerColor },
              { label: 'Type', value: equipment.typeEquipement || 'N/A', color: textColor }
            ]
          },
          {
            title: 'DATES IMPORTANTES',
           
            fields: [
              
              { label: 'Date dernière maintenance', value: equipment.dateDerniereMaintenance ? new Date(equipment.dateDerniereMaintenance).toLocaleDateString() : 'N/A', color: textColor },
              { label: 'Date Mise en  service', value: equipment.dateMiseEnService ? new Date(equipment.dateMiseEnService).toLocaleDateString() : 'N/A', color: warningColor }
            ]
          },
          {
            title: 'LOCALISATION',
         
            fields: [
              { label: 'Bâtiment', value: equipment.batimentNom?.toString() || 'N/A', color: textColor },
              { label: 'Étage', value: equipment.etageNum?.toString() || 'N/A', color: textColor },
              { label: 'Salle', value: equipment.salleNum?.toString() || 'N/A', color: textColor },
              { label: 'Service', value: equipment.serviceNom || 'N/A', color: textColor }
            ]
          },
          {
            title: 'COÛTS ET SUIVI',
          
            fields: [
              { label: 'Coût d\'achat', value: equipment.coutAchat ? `${equipment.coutAchat} DH` : 'N/A', color: textColor },
              { label: 'Label suivi', value: equipment.labelSuivi || 'N/A', color: textColor },
              { label: 'Valeur suivi', value: equipment.valeurSuivi?.toString() || 'N/A', color: textColor }
            ]
          }
        ];

        // 4. Génération des sections avec style amélioré
        for (const section of sections) {
          // Vérification de l'espace disponible
          if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
          }

          // Titre de section avec icône et fond coloré
          doc.setFillColor(238, 242, 255); // Fond bleu très clair
          doc.roundedRect(marginLeft, yPosition - 5, 180, 10, 3, 3, 'F');
          doc.setFontSize(12);
          doc.setTextColor(primaryColor);
          doc.setFont('helvetica', 'bold');
          doc.text(` ${section.title}`, marginLeft + 5, yPosition);
          yPosition += 12;

          // Contenu de section
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');

          for (const field of section.fields) {
            if (yPosition > 270) {
              doc.addPage();
              yPosition = 20;
            }

            // Label en gras
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(textColor);
            doc.text(`${field.label}:`, marginLeft, yPosition);

            // Valeur avec couleur spécifique
            if (field.special === 'status') {
              const statusColor = this.getStatusColor(field.value);
              doc.setTextColor(statusColor);
            } else {
              doc.setTextColor(field.color || textColor);
            }
            
            doc.setFont('helvetica', 'normal');
            
            // Gestion des textes longs avec splitTextToSize
            const valueLines = doc.splitTextToSize(field.value, 120);
            doc.text(valueLines, marginLeft + labelWidth, yPosition);
            
            // Ajustement de la position Y en fonction du nombre de lignes
            yPosition += Math.max(7, valueLines.length * 7);

            doc.setTextColor(textColor); // Réinitialisation à la couleur noire
          }

          yPosition += 10; // Espace entre sections
          
          // Ligne de séparation fine entre sections
          doc.setDrawColor(secondaryColor);
          doc.setLineWidth(0.2);
          doc.line(marginLeft, yPosition - 5, 195, yPosition - 5);
        }

        // 5. Pied de page stylisé
        doc.setFontSize(8);
        doc.setTextColor(secondaryColor);
        doc.setFont('helvetica', 'italic');
        doc.text(`Document généré le ${new Date().toLocaleDateString()} - Système de Gestion des Equipements H.U.I.R`, 105, 285, { align: 'center' });
        
        // Ligne de séparation du pied de page
        doc.setDrawColor(primaryColor);
        doc.setLineWidth(0.3);
        doc.line(marginLeft, 280, 195, 280);

        // 6. Sauvegarde du PDF
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

  // Fallback si Ã©chec du PDF complet
  private generateSimplePDF(doc: jsPDF, equipment: Equipement): void {
    doc.text('FICHE EQUIPEMENT SIMPLIFIE', 20, 20);
    doc.text(`Nom: ${equipment.nom || 'N/A'}`, 20, 30);
    doc.text(`Numero de serie: ${equipment.numeroSerie || 'N/A'}`, 20, 40);
    doc.save(`fiche_simple_${equipment.nom?.replace(/\s+/g, '_') || 'equipement'}.pdf`);
  }

  private addSectionHeader(doc: jsPDF, text: string, x: number, y: number): void {
    doc.setFontSize(12);
    doc.setTextColor('#4169E1');
    doc.setFont('helvetica', 'bold');
    doc.text(text, x, y);
    doc.setFont('helvetica', 'normal');
  }



  // MÃ©thode addField amÃ©liorÃ©e
  private addField(doc: jsPDF, label: string, value: string, x: number, y: number, labelWidth: number): void {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`${label}:`, x, y);
    doc.setFont('helvetica', 'normal');
    doc.text(value, x + labelWidth, y);
  }

  // MÃ©thodes utilitaires avec typage strict










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
    // Version simplifiÃ©e sans logo
    doc.setFontSize(16);
    doc.setTextColor('#4169E1');
    doc.text('Rapport des Couts de Maintenance', 40, 40);

    doc.setFontSize(10);
    doc.setTextColor('#A9A9A9');
    doc.text('H.U.I.R - HOPITAL UNIVERSITAIRE INTERNATIONAL DE RABAT', 40, 50);

    // Ajouter le reste du contenu comme dans la version avec logo...
    // (vous pouvez copier le mÃªme contenu mais en ajustant les positions Y)

    doc.save(`rapport_cout_maintenance_simple_${new Date().toISOString().slice(0,10)}.pdf`);
  }



}
