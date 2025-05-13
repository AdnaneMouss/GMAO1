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

  showRapportModalM= false
  showEquipementDetails(eq: any): void {
    this.selectedEquipementId = eq.id; // ou eq.nom si pas d'ID
  }

<<<<<<< HEAD
dateDebutFiltreH!: Date | null;
dateFinFiltreH!: Date | null;


dateDebutFiltreM!: Date | null;
dateFinFiltreM!: Date | null;
=======


>>>>>>> a5c55b18f0be14a6db6c328e7858cf0302fafee9





filteredEquipmentH: Equipement[] = [];
filteredEquipmentM: Equipement[] = [];
weeklyStats = {
  pannes: 0,
  maintenances: 0,
  tauxDisponibilite: '0'
};

  equipements: Equipement[] = [];

  criticalEquipments: Equipement[] = [];
  initialItemsToShow: number = 5; // Nombre d'éléments à afficher initialement
showAll: boolean = false; // Contrôle l'affichage complet ou partiel
reportGenerated: boolean = false;  // Indicateur si un rapport a été généré
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
   if (this.dateDebutFiltreH && this.dateFinFiltreH) {
  this.generateWeeklyReport();
} else {
  console.warn("Les dates de filtrage ne sont pas définies.");
}

     //this.scheduleWeeklyReport();

  }
  get premierJourMoisActuel(): Date {
    const maintenant = new Date();
    return new Date(maintenant.getFullYear(), maintenant.getMonth(), 1);
  }
<<<<<<< HEAD

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
  
=======
>>>>>>> a5c55b18f0be14a6db6c328e7858cf0302fafee9




  scheduleWeeklyReport(): void {
    const now = new Date();

    // Calcul du prochain lundi à 8:00
    const nextMonday = new Date(now);
    nextMonday.setDate(now.getDate() + ((1 + 7 - now.getDay()) % 7 || 7)); // Prochain lundi
    nextMonday.setHours(8, 0, 0, 0); // À 8h00



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

 async generateWeeklyReport(): Promise<void> {
    const currentDate = new Date();
    const dayOfWeek = currentDate.getDay();
    const diffToMonday = (dayOfWeek + 6) % 7;

    const dateDebut = new Date(currentDate);
    dateDebut.setDate(currentDate.getDate() - diffToMonday);
    dateDebut.setHours(0, 0, 0, 0);

    const dateFin = new Date(dateDebut);
    dateFin.setDate(dateDebut.getDate() + 6);
    dateFin.setHours(23, 59, 59, 999);

<<<<<<< HEAD
    

    

=======
>>>>>>> a5c55b18f0be14a6db6c328e7858cf0302fafee9
    const pannesCetteSemaine = this.getPannesForPeriod(dateDebut, dateFin);
    const maintenancesCetteSemaine = this.getMaintenancesForPeriod(dateDebut, dateFin);

    const equipementsDansPeriode = this.equipements.filter(eq => {
<<<<<<< HEAD
      
        const dateDerniereMaintenance = eq.dateDerniereMaintenance ? new Date(eq.dateDerniereMaintenance) : null;

        return (
            dateDerniereMaintenance && 
            dateDerniereMaintenance >= dateDebut && 
            dateDerniereMaintenance <= dateFin
        );
    });

    // Filtrage des équipements pour l'intervalle personnalisé
    //const equipementsDansIntervalleFiltre = this.equipements.filter(eq => {
      //  const dateDerniereMaintenance = eq.dateDerniereMaintenance ? new Date(eq.dateDerniereMaintenance) : null;

        //return (
           // dateDerniereMaintenance && 
          //  dateDerniereMaintenance >= dateDebutFiltreH && 
            //dateDerniereMaintenance <= dateFinFiltreH
        //);
    //});

=======
      const achat = eq.dateAchat ? new Date(eq.dateAchat) : null;
      const miseService = eq.dateMiseEnService ? new Date(eq.dateMiseEnService) : null;
      const dateDerniereMaintenance = eq.dateDerniereMaintenance ? new Date(eq.dateDerniereMaintenance) : null;

      return (

        (dateDerniereMaintenance && dateDerniereMaintenance >= dateDebut && dateDerniereMaintenance <= dateFin)
      );
    });

>>>>>>> a5c55b18f0be14a6db6c328e7858cf0302fafee9
    const rapport = {
        dateGeneration: currentDate,
        periode: { debut: dateDebut, fin: dateFin },
        //periodeFiltrage: { debut: dateDebutFiltreH, fin: dateFinFiltreH }, // Ajout de la période filtrée
        stats: {
            totalEquipements: this.stats.totalEquipements,
            pannes: pannesCetteSemaine.length,
            maintenances: maintenancesCetteSemaine.length,
            tauxDisponibilite: (
                ((this.stats.totalEquipements - pannesCetteSemaine.length) / this.stats.totalEquipements) * 100
            ).toFixed(2),
        },
        pannes: pannesCetteSemaine,
        maintenances: maintenancesCetteSemaine,
        equipementsCritiques: equipementsDansPeriode,
       // equipementsDansIntervalleFiltre: equipementsDansIntervalleFiltre, // Équipements dans l'intervalle filtré
    };

    const doc = new jsPDF();
    const primaryColor = [22, 160, 133];

    const marginLeft = 20;
    let yPosition = 30;

    // Load and add logo
    try {
<<<<<<< HEAD
        const logoImg = new Image();
        logoImg.src = 'assets/logo.png';
        
        // Wait for image to load
        await new Promise((resolve, reject) => {
            logoImg.onload = resolve;
            logoImg.onerror = reject;
        });

        doc.addImage(logoImg, 'PNG', marginLeft, yPosition, 30, 30);
        doc.setFontSize(8);
=======
      const logoImg = new Image();
      logoImg.src = 'assets/logo.png';

      // Wait for image to load
      await new Promise((resolve, reject) => {
          logoImg.onload = resolve;
          logoImg.onerror = reject;
      });

      doc.addImage(logoImg, 'PNG', marginLeft, yPosition, 30, 30);
      doc.setFontSize(8);

      doc.text('Hôpital Universitaire International de Rabat', marginLeft + 35, yPosition + 10);
      doc.text('Système de Gestion des Équipements', marginLeft + 35, yPosition + 15);

      yPosition += 40;
  } catch (e) {
      console.warn('Logo not found or failed to load, proceeding without it');
      yPosition += 20;
  }
>>>>>>> a5c55b18f0be14a6db6c328e7858cf0302fafee9

        doc.text('Hôpital Universitaire International de Rabat', marginLeft + 35, yPosition + 10);
        doc.text('Système de Gestion des Équipements', marginLeft + 35, yPosition + 15);

        yPosition += 40;
    } catch (e) {
        console.warn('Logo not found or failed to load, proceeding without it');
        yPosition += 20;
    }

    // Report title
    doc.setFontSize(16);
<<<<<<< HEAD
=======

>>>>>>> a5c55b18f0be14a6db6c328e7858cf0302fafee9
    doc.setFont('helvetica', 'bold');
    const titleText = "Rapport Hebdomadaire des Équipements";
    const titleWidth = doc.getTextWidth(titleText);
    doc.text(titleText, 105, yPosition, { align: 'center' });
    // Underline the title
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setLineWidth(0.5);
    doc.line(105 - titleWidth/2, yPosition + 2, 105 + titleWidth/2, yPosition + 2);
    yPosition += 15;

    // Report period and generation date
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Black
    doc.setFont('helvetica', 'normal');
    doc.text(`Période : du ${rapport.periode.debut.toLocaleDateString()} au ${rapport.periode.fin.toLocaleDateString()}`, marginLeft, yPosition);
    yPosition += 10;
    doc.text(`Date de génération : ${rapport.dateGeneration.toLocaleString()}`, marginLeft, yPosition);
    yPosition += 15;

<<<<<<< HEAD
    // Display custom filtering period
    doc.setFontSize(12);
    //doc.text(`Filtrage personnalisé : du ${rapport.periodeFiltrage.debut.toLocaleDateString()} au ${rapport.periodeFiltrage.fin.toLocaleDateString()}`, marginLeft, yPosition);
    yPosition += 15;

    // Critical equipment section
    doc.setFontSize(14);
=======


    // Critical equipment section
    doc.setFontSize(14);

>>>>>>> a5c55b18f0be14a6db6c328e7858cf0302fafee9
    doc.setFont('helvetica', 'bold');
    doc.text('Équipements en activité cette semaine', marginLeft, yPosition);
    yPosition += 10;

    // Generate table for filtered equipment
    autoTable(doc, {
<<<<<<< HEAD
        startY: yPosition,
        head: [['#', 'Nom', 'Date Achat', 'Date Mise en Service', 'Dernière Maintenance']],
        body: rapport.equipementsCritiques.map((eq: any, index: number) => [
            index + 1,
            eq.nom || 'N/A',
            eq.dateAchat ? new Date(eq.dateAchat).toLocaleDateString() : 'N/A',
            eq.dateMiseEnService ? new Date(eq.dateMiseEnService).toLocaleDateString() : 'N/A',
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

    // Equipment in custom filtering period section
    //doc.setFontSize(14);
    //doc.setFont('helvetica', 'bold');
    //doc.text('Équipements dans la période de filtrage personnalisée', marginLeft, yPosition);
    //yPosition += 10;

    // Generate table for custom filtered equipment
   // autoTable(doc, {
     //   startY: yPosition,
       /// head: [['#', 'Nom', 'Date Achat', 'Date Mise en Service', 'Dernière Maintenance']],
        //body: rapport.equipementsDansIntervalleFiltre.map((eq: any, index: number) => [
          //  index + 1,
            //eq.nom || 'N/A',
            //eq.dateAchat ? new Date(eq.dateAchat).toLocaleDateString() : 'N/A',
            //eq.dateMiseEnService ? new Date(eq.dateMiseEnService).toLocaleDateString() : 'N/A',
            //eq.dateDerniereMaintenance ? new Date(eq.dateDerniereMaintenance).toLocaleDateString() : 'N/A'
       // ]),
       // styles: {
         //   fontSize: 9,
        //},
        //headStyles: {
          //  textColor: [255, 255, 255],
           // fontStyle: 'bold'
        //},
        //alternateRowStyles: {
          //  fillColor: [240, 240, 240]
        //}
    //});

=======
      startY: yPosition,
      head: [['#', 'Nom', 'Date Achat', 'Date Mise en Service', 'Dernière Maintenance']],
      body: rapport.equipementsCritiques.map((eq: any, index: number) => [
        index + 1,
        eq.nom || 'N/A',
        eq.dateAchat ? new Date(eq.dateAchat).toLocaleDateString() : 'N/A',
        eq.dateMiseEnService ? new Date(eq.dateMiseEnService).toLocaleDateString() : 'N/A',
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

>>>>>>> a5c55b18f0be14a6db6c328e7858cf0302fafee9
    doc.save(`rapport-maintenance-${new Date().toISOString().split('T')[0]}.pdf`);
}


async generateMonthlyReport(): Promise<void> {
  // Déterminer le mois précédent
  const currentDate = new Date();
  const firstDayOfPreviousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
  const lastDayOfPreviousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);

  // Ajuster les heures pour couvrir toute la journée
  firstDayOfPreviousMonth.setHours(0, 0, 0, 0);
  lastDayOfPreviousMonth.setHours(23, 59, 59, 999);

  // Récupérer les données pour la période
  const pannesCeMois = this.getPannesForPeriod(firstDayOfPreviousMonth, lastDayOfPreviousMonth);
  const maintenancesCeMois = this.getMaintenancesForPeriod(firstDayOfPreviousMonth, lastDayOfPreviousMonth);

  // Filtrer les équipements actifs ce mois-ci
  const equipementsDansPeriode = this.equipements.filter(eq => {
   
    const dateDerniereMaintenance = eq.dateDerniereMaintenance ? new Date(eq.dateDerniereMaintenance) : null;

    return (

      (dateDerniereMaintenance && dateDerniereMaintenance >= firstDayOfPreviousMonth && dateDerniereMaintenance <= lastDayOfPreviousMonth)
    );
  });

  // Préparer les données du rapport
  const rapport = {
    dateGeneration: currentDate,
    periode: {
      debut: firstDayOfPreviousMonth,
      fin: lastDayOfPreviousMonth,
      nomMois: firstDayOfPreviousMonth.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })
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
    doc.text('Hôpital Universitaire International de Rabat', marginLeft + 35, yPosition + 10);
    doc.text('Système de Gestion des Équipements', marginLeft + 35, yPosition + 15);
    yPosition += 40;
  } catch (e) {
    console.warn('Logo non trouvé, continuation sans logo');
    yPosition += 20;
  }

  // Titre du rapport
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  const titleText = `Rapport Mensuel des Équipements - ${rapport.periode.nomMois}`;
  const titleWidth = doc.getTextWidth(titleText);
  doc.text(titleText, 105, yPosition, { align: 'center' });
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setLineWidth(0.5);
  doc.line(105 - titleWidth/2, yPosition + 2, 105 + titleWidth/2, yPosition + 2);
  yPosition += 15;

  // Période et date de génération
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.text(`Période : du ${rapport.periode.debut.toLocaleDateString()} au ${rapport.periode.fin.toLocaleDateString()}`, marginLeft, yPosition);
  yPosition += 10;
  doc.text(`Date de génération : ${rapport.dateGeneration.toLocaleString()}`, marginLeft, yPosition);
  yPosition += 15;

  // Statistiques
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Statistiques du mois', marginLeft, yPosition);
  yPosition += 10;

  // Tableau des statistiques
  autoTable(doc, {
    startY: yPosition,
    body: [
      ['Total des équipements', rapport.stats.totalEquipements],
      ['Pannes ce mois', rapport.stats.pannes],
      ['Maintenances ce mois', rapport.stats.maintenances],
      ['Taux de disponibilité', rapport.stats.tauxDisponibilite + '%']
    ],
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

  // Équipements en activité
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Équipements en activité ce mois', marginLeft, yPosition);
  yPosition += 10;

  // Tableau des équipements
  autoTable(doc, {
    startY: yPosition,
    head: [['#', 'Nom', 'Date Achat', 'Date Mise en Service', 'Dernière Maintenance']],
    body: rapport.equipementsCritiques.map((eq: any, index: number) => [
      index + 1,
      eq.nom || 'N/A',
      eq.dateAchat ? new Date(eq.dateAchat).toLocaleDateString() : 'N/A',
      eq.dateMiseEnService ? new Date(eq.dateMiseEnService).toLocaleDateString() : 'N/A',
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
  doc.save(`rapport-mensuel-${firstDayOfPreviousMonth.getFullYear()}-${firstDayOfPreviousMonth.getMonth() + 1}.pdf`);
}













  private getPannesForPeriod(debut: Date, fin: Date): any[] {
    // Simulation - en réalité, vous filtreriez depuis votre base de données
    return this.equipements.filter(eq =>
      eq.statut === 'En panne' &&
      new Date(eq.dateDerniereMaintenance) >= debut &&
      new Date(eq.dateDerniereMaintenance) <= fin
    );
  }

  private getMaintenancesForPeriod(debut: Date, fin: Date): any[] {
    // Simulation - en réalité, vous filtreriez depuis votre base de données
    return this.equipements.filter(eq =>
      eq.dateDerniereMaintenance &&
      new Date(eq.dateDerniereMaintenance) >= debut &&
      new Date(eq.dateDerniereMaintenance) <= fin
    );
  }

  viewWeeklyReport(): void {
    const currentDate = new Date();
    const dayOfWeek = currentDate.getDay();
    const diffToMonday = (dayOfWeek + 6) % 7;

    const dateDebut = new Date(currentDate);
    dateDebut.setDate(currentDate.getDate() - diffToMonday);
    dateDebut.setHours(0, 0, 0, 0);

    const dateFin = new Date(dateDebut);
    dateFin.setDate(dateDebut.getDate() + 6);
    dateFin.setHours(23, 59, 59, 999);

    const pannesCetteSemaine = this.getPannesForPeriod(dateDebut, dateFin);
    const maintenancesCetteSemaine = this.getMaintenancesForPeriod(dateDebut, dateFin);

    const equipementsDansPeriode = this.equipements.filter(eq => {
      const achat = eq.dateAchat ? new Date(eq.dateAchat) : null;
      const miseService = eq.dateMiseEnService ? new Date(eq.dateMiseEnService) : null;
      const derniereMaintenance = eq.dateDerniereMaintenance ? new Date(eq.dateDerniereMaintenance) : null;

      return (

        (derniereMaintenance && derniereMaintenance >= dateDebut && derniereMaintenance <= dateFin)
      );
    });

    this.rapportHebdo = {
      dateGeneration: currentDate,
      periode: { debut: dateDebut, fin: dateFin },
      stats: {
        totalEquipements: this.stats.totalEquipements,
        pannes: pannesCetteSemaine.length,
        maintenances: maintenancesCetteSemaine.length,
        tauxDisponibilite: (
          ((this.stats.totalEquipements - pannesCetteSemaine.length) / this.stats.totalEquipements) * 100
        ).toFixed(2),
      },
      pannes: pannesCetteSemaine,
      maintenances: maintenancesCetteSemaine,
      equipementsCritiques: equipementsDansPeriode
    };
    console.log('Affichage du modal');
this.showRapportModal = true;


  }
  viewMonthlyReport(): void {
    const currentDate = new Date();

    // Mois précédent
    const dateDebut = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const dateFin = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0); // le 0 renvoie le dernier jour du mois précédent

    dateDebut.setHours(0, 0, 0, 0);
    dateFin.setHours(23, 59, 59, 999);

    const pannesMoisPrecedent = this.getPannesForPeriod(dateDebut, dateFin);
    const maintenancesMoisPrecedent = this.getMaintenancesForPeriod(dateDebut, dateFin);

    const equipementsDansPeriode = this.equipements.filter(eq => {
      const achat = eq.dateAchat ? new Date(eq.dateAchat) : null;
      const miseService = eq.dateMiseEnService ? new Date(eq.dateMiseEnService) : null;
      const derniereMaintenance = eq.dateDerniereMaintenance ? new Date(eq.dateDerniereMaintenance) : null;

      return (

        (derniereMaintenance && derniereMaintenance >= dateDebut && derniereMaintenance <= dateFin)
      );
    });

    this.rapportMens = {
      dateGeneration: currentDate,
      periode: { debut: dateDebut, fin: dateFin },
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

    console.log('Affichage du rapport mensuel');
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
    doc.text('Rapport Hebdomadaire des Équipements', 14, 20);

    // Période
    doc.setFontSize(12);
    doc.text(`Période: ${new Date(rapportObj.periode.debut).toLocaleDateString()} - ${new Date(rapportObj.periode.fin).toLocaleDateString()}`, 14, 30);
    doc.text(`Généré le: ${new Date(rapportObj.dateGeneration).toLocaleDateString()}`, 14, 36);







    const critData = rapportObj.equipementsCritiques.map((eq: any) => [
      eq.nom || 'N/A',
      eq.statut || 'N/A',
      eq.joursSansPanne || '0',
      eq.dateDerniereMaintenance ? new Date(eq.dateDerniereMaintenance).toLocaleDateString() : 'N/A'
    ]);

    autoTable(doc, {

      head: [['Nom', 'Statut', 'Jours sans panne', 'Dernière maintenance']],
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
              { label: 'Type', value: equipment.typeEquipement || 'N/A' }
            ]
          },
          {
            title: 'DATES IMPORTANTES',
            fields: [
              { label: 'Date achat', value: equipment.dateAchat ? new Date(equipment.dateAchat).toLocaleDateString() : 'N/A' },
              { label: 'Date mise en service', value: equipment.dateMiseEnService ? new Date(equipment.dateMiseEnService).toLocaleDateString() : 'N/A' },
              { label: 'Date dernière maintenance', value: equipment.dateDerniereMaintenance ? new Date(equipment.dateDerniereMaintenance).toLocaleDateString() : 'N/A' },
            ]
          },
          {
            title: 'LOCALISATION',
            fields: [
              { label: 'Bâtiment', value: equipment.batimentNom.toString() || 'N/A' },
              { label: 'Étage', value: equipment.etageNum?.toString() || 'N/A' },
              { label: 'Salle', value: equipment.salleNum?.toString() || 'N/A' },
              { label: 'Service', value: equipment.serviceNom || 'N/A' }
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
