import { Component, OnInit } from '@angular/core';
import { MaintenanceService } from '../../../services/maintenance.service';
import { maintenance } from '../../../models/maintenance';
import { CalendarOptions } from '@fullcalendar/core';
import { EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import jsPDF from 'jspdf';
import { format, startOfMonth } from 'date-fns';
import { fr } from 'date-fns/locale';

interface CalendarEventMeta {
  maintenance: maintenance;

}

@Component({
  selector: 'app-maintenance-calendar',
  templateUrl: './maintenance-calendar.component.html',
  styleUrls: ['./maintenance-calendar.component.css']
})
export class MaintenanceCalendarComponent implements OnInit {
  maintenances: maintenance[] = [];
  filteredMaintenances: maintenance[] = [];
  
  currentMonth: string = '';

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    events: [],
    eventClick: this.handleEventClick.bind(this),
    eventContent: this.customEventContent.bind(this),
    height: 'auto',
    locale: 'fr',
    firstDay: 1,
    weekends: true,
    editable: false,
    selectable: false,
    dayMaxEvents: true,
    headerToolbar: {
      left: '',
      center: 'title',
      right: 'prev,next today'
    },
    datesSet: (dateInfo) => {
      this.updateCurrentMonth(dateInfo.start);
    }
  };
 
  
  legendItems = [
    { color: '#FFC107', label: 'En attente' },
    { color: '#2196F3', label: 'En cours' }
  ];
  private updateCurrentMonth(date: Date): void {
    this.currentMonth = format(startOfMonth(date), 'MMMM yyyy', { locale: fr });
    this.currentMonth = this.currentMonth.charAt(0).toUpperCase() + this.currentMonth.slice(1);
  }
  constructor(private maintenanceService: MaintenanceService) {
    this.initCalendarOptions();
  }

  ngOnInit(): void {
    this.loadMaintenances();
  }

  private initCalendarOptions(): void {
    this.calendarOptions = {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      events: [],
      eventClick: this.handleEventClick.bind(this),
      eventContent: this.customEventContent.bind(this),
      height: 'auto',
      locale: 'fr',
      firstDay: 1,
      weekends: true,
      editable: false,
      selectable: false,
      dayMaxEvents: true,
    };
  }

  loadMaintenances(): void {
    this.maintenanceService.getAllMaintenances().subscribe({
      next: (data) => {
        this.maintenances = data;
        this.filterMaintenances();
        this.updateCalendarEvents();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des maintenances', err);
      }
    });
  }

  private filterMaintenances(): void {
    this.filteredMaintenances = this.maintenances.filter(maint => 
      maint.statut !== 'TERMINEE' && 
      maint.statut !== 'ANNULEE' &&
      maint.repetitiontype === 'Ne_pas_repeter'
    );
  }

  private updateCalendarEvents(): void {
    const events = this.transformMaintenancesToEvents(this.filteredMaintenances);
    this.calendarOptions.events = events;
  }

  private transformMaintenancesToEvents(maintenances: maintenance[]): EventInput[] {
    return maintenances.map(maint => {
        return {
            title: `Maintenance ${maint.id}`, // Titre plus court
            start: maint.dateDebutPrevue,
            end: maint.dateFinPrevue,
            backgroundColor: 'transparent', // Fond transparent
            borderColor: 'transparent', // Pas de bordure
            extendedProps: {
                maintenance: maint
            },
            display: 'block' // Important pour l'affichage en barre
        };
    });
}

  private getStatusColor(status?: string): string {
    switch (status) {
      case 'EN_ATTENTE': return '#FFC107';
      case 'EN_COURS': return '#2196F3';
      default: return '#9E9E9E';
    }
  }

  private handleEventClick(arg: any): void {
    const meta: CalendarEventMeta = arg.event.extendedProps;
    const maint = meta.maintenance;
    
    alert([
      `Maintenance: ${maint.id}`,
      `Statut: ${maint.statut}`,
      `Du: ${arg.event.start?.toLocaleString() || 'N/A'}`,
      `Au: ${arg.event.end?.toLocaleString() || 'N/A'}`,
      `Priorité: ${maint.priorite}`,
      `Commentaires: ${maint.commentaires || 'Aucun'}`
    ].join('\n'));
  }

  private customEventContent(arg: any): { domNodes: HTMLElement[] } {
    const event = arg.event;
    const meta: CalendarEventMeta = event.extendedProps;
    const maintenance = meta.maintenance;

    // Création du conteneur principal
    const eventContainer = document.createElement('div');
    eventContainer.className = 'fc-event-main-container';
    eventContainer.style.display = 'flex';
    eventContainer.style.alignItems = 'center';
    eventContainer.style.height = '100%';
    eventContainer.style.padding = '2px 4px';

    // Barre de durée (représentant la période de maintenance)
    const durationBar = document.createElement('div');
    durationBar.className = 'fc-event-duration-bar';
    durationBar.style.backgroundColor = this.getStatusColor(maintenance.statut);
    durationBar.style.height = '16px';
    durationBar.style.borderRadius = '4px';
    durationBar.style.flexGrow = '1';
    durationBar.style.display = 'flex';
    durationBar.style.alignItems = 'center';
    durationBar.style.justifyContent = 'space-between';
    durationBar.style.padding = '0 8px';

    // Texte à gauche (date début)
    const startText = document.createElement('div');
    startText.className = 'fc-event-start';
    startText.style.fontSize = '10px';
    startText.style.color = '#fff';
    startText.style.fontWeight = 'bold';
    startText.textContent = this.formatDate(new Date(event.start));

    // Texte au centre (titre)
    const titleText = document.createElement('div');
    titleText.className = 'fc-event-title';
    titleText.style.fontSize = '11px';
    titleText.style.color = '#fff';
    titleText.style.margin = '0 8px';
    titleText.style.textOverflow = 'ellipsis';
    titleText.style.overflow = 'hidden';
    titleText.style.whiteSpace = 'nowrap';
    titleText.textContent = `M-${maintenance.id}`; // ou autre titre si préféré

    // Texte à droite (date fin)
    const endText = document.createElement('div');
    endText.className = 'fc-event-end';
    endText.style.fontSize = '10px';
    endText.style.color = '#fff';
    endText.style.fontWeight = 'bold';
    endText.textContent = this.formatDate(new Date(event.end));

    // Ajout des éléments à la barre
    durationBar.appendChild(startText);
    durationBar.appendChild(titleText);
    durationBar.appendChild(endText);

    // Ajout de la barre au conteneur
    eventContainer.appendChild(durationBar);

    return { domNodes: [eventContainer] };
}

private formatDate(date: Date): string {
    return date.toLocaleDateString('fr-FR', { 
        day: '2-digit', 
        month: '2-digit' 
    });
}



exportCalendarPDF(): void {
  const doc = new jsPDF('landscape');
  
  // Couleurs
  const primaryColor = '#4169E1'; // Royal Blue
  const secondaryColor = '#A9A9A9'; // Dark Gray
  const pendingColor = '#FFC107'; // Amber
  const inProgressColor = '#2196F3'; // Blue
  const lightGray = '#F5F5F5';

  // Ajouter le logo
  const logoUrl = 'assets/logo.png';
  const img = new Image();
  img.src = logoUrl;

  img.onload = () => {
    try {
      // ==================== PARTIE 1: DÉTERMINATION DE LA PLAGE DE DATES ====================
      let minDate = new Date();
      let maxDate = new Date();
      
      if (this.filteredMaintenances.length > 0) {
        minDate = new Date(this.filteredMaintenances[0].dateDebutPrevue);
        maxDate = new Date(this.filteredMaintenances[0].dateFinPrevue);
        
        this.filteredMaintenances.forEach(maint => {
          const startDate = new Date(maint.dateDebutPrevue);
          const endDate = new Date(maint.dateFinPrevue);
          
          if (startDate < minDate) minDate = startDate;
          if (endDate > maxDate) maxDate = endDate;
        });
      }

      // Ajouter une marge d'un mois avant et après
      minDate.setMonth(minDate.getMonth() - 1);
      maxDate.setMonth(maxDate.getMonth() + 1);

      // ==================== PARTIE 2: GÉNÉRATION DU PDF ====================
      let currentMonth = new Date(minDate);
      currentMonth.setDate(1); // Premier du mois
      let pageCount = 0;
      const totalPages = Math.ceil((maxDate.getMonth() - minDate.getMonth() + 
                                  (maxDate.getFullYear() - minDate.getFullYear()) * 12) / 1) + 1;

      // Générer une page par mois
      while (currentMonth <= maxDate) {
        if (pageCount > 0) {
          doc.addPage('landscape');
        }
        pageCount++;

        // ==================== EN-TÊTE ====================
        doc.addImage(img, 'PNG', 15, 10, 30, 15);
        doc.setFontSize(12);
        doc.setTextColor(secondaryColor);
        doc.text('H.U.I.R', 50, 15);
        doc.text('HOPITAL UNIVERSITAIRE INTERNATIONAL DE RABAT', 50, 20);
        
        // Titre principal
        doc.setFontSize(14);
        doc.setTextColor(primaryColor);
        doc.text('Calendrier des Maintenances', 140, 30, { align: 'center' });
        
        // Ligne de séparation
        doc.setDrawColor(primaryColor);
        doc.setLineWidth(0.3);
        doc.line(15, 35, 275, 35);
        
        // Légende
        doc.setFontSize(10);
        doc.setTextColor('#000000');
        doc.text('Légende:', 20, 45);
        
        // Carré pour "En attente"
        doc.setFillColor(pendingColor);
        doc.rect(40, 40, 5, 5, 'F');
        doc.text('En attente', 50, 45);
        
        // Carré pour "En cours"
        doc.setFillColor(inProgressColor);
        doc.rect(90, 40, 5, 5, 'F');
        doc.text('En cours', 100, 45);

        // ==================== CALENDRIER DU MOIS ====================
        const calendarStartY = 60;
        const dayWidth = 35;
        const dayHeight = 15;
        const monthHeaderHeight = 15;
        
        // Titre du mois
        doc.setFontSize(12);
        doc.setTextColor(primaryColor);
        const monthTitle = currentMonth.toLocaleDateString('fr-FR', { 
          month: 'long', 
          year: 'numeric' 
        }).toUpperCase();
        doc.text(monthTitle, 20, calendarStartY - 5);
        
        // En-tête des jours
        doc.setFillColor(lightGray);
        doc.rect(20, calendarStartY, dayWidth * 7, monthHeaderHeight, 'F');
        doc.setTextColor('#000000');
        doc.setFontSize(8);
        
        const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
        days.forEach((day, i) => {
          doc.text(day, 20 + (i * dayWidth) + (dayWidth / 2), calendarStartY + 10, { align: 'center' });
        });
        
        // Cases des jours
        const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
        const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
        
        let currentY = calendarStartY + monthHeaderHeight;
        let currentDateCursor = new Date(firstDay);
        
        // Ajuster pour le premier jour du mois
        const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
        
        // Dessiner les cases du calendrier
        while (currentDateCursor <= lastDay) {
          // Nouvelle ligne chaque semaine
          if (currentDateCursor.getDay() === 1 && currentDateCursor.getDate() > 1) {
            currentY += dayHeight;
          }
          
          const dayX = 20 + ((currentDateCursor.getDay() - 1 + 7) % 7) * dayWidth;
          
          // Fond de la case
          doc.setDrawColor('#DDDDDD');
          doc.setFillColor('#FFFFFF');
          doc.rect(dayX, currentY, dayWidth, dayHeight, 'FD');
          
          // Numéro du jour
          doc.setTextColor('#000000');
          doc.setFontSize(8);
          doc.text(currentDateCursor.getDate().toString(), dayX + 3, currentY + 5);
          
          // Ajouter les maintenances pour ce jour
          this.filteredMaintenances.forEach(maint => {
            const startDate = new Date(maint.dateDebutPrevue);
            const endDate = new Date(maint.dateFinPrevue);
            
            if (currentDateCursor >= startDate && currentDateCursor <= endDate) {
              const color = maint.statut === 'EN_ATTENTE' ? pendingColor : inProgressColor;
              doc.setFillColor(color);
              doc.rect(dayX + 15, currentY + 8, dayWidth - 20, 4, 'F');
            }
          });
          
          currentDateCursor.setDate(currentDateCursor.getDate() + 1);
        }

        // Pied de page
        doc.setFontSize(8);
        doc.setTextColor(secondaryColor);
        doc.text(`Page ${pageCount}/${totalPages} - Document généré le ${new Date().toLocaleDateString()} - H.U.I.R`, 
                 140, 190, { align: 'center' });

        // Passer au mois suivant
        currentMonth.setMonth(currentMonth.getMonth() + 1);
      }

      // ==================== PAGE FINALE: TABLEAU DES MAINTENANCES ====================
      doc.addPage('landscape');
      pageCount++;
      
      // En-tête
      doc.addImage(img, 'PNG', 15, 10, 30, 15);
      doc.setFontSize(12);
      doc.setTextColor(secondaryColor);
      doc.text('H.U.I.R', 50, 15);
      doc.text('HOPITAL UNIVERSITAIRE INTERNATIONAL DE RABAT', 50, 20);
      
      // Titre principal
      doc.setFontSize(14);
      doc.setTextColor(primaryColor);
      doc.text('Liste des Maintenances', 140, 30, { align: 'center' });
      
      // Ligne de séparation
      doc.setDrawColor(primaryColor);
      doc.setLineWidth(0.3);
      doc.line(15, 35, 275, 35);
      
      // Tableau des maintenances
      let yPosition = 45;
      doc.setFontSize(9);
      
      // En-tête du tableau
      doc.setFillColor(primaryColor);
      doc.setTextColor('#FFFFFF');
      doc.rect(20, yPosition, 240, 8, 'F');
      doc.text('ID', 25, yPosition + 6);
      doc.text('Équipement', 50, yPosition + 6);
      doc.text('Date Début', 110, yPosition + 6);
      doc.text('Date Fin', 150, yPosition + 6);
      doc.text('Statut', 190, yPosition + 6);
      doc.text('Priorité', 230, yPosition + 6);
      
      yPosition += 10;
      
      // Contenu du tableau
      doc.setTextColor('#000000');
      this.filteredMaintenances.forEach((maint, index) => {
        if (yPosition > 180 && index < this.filteredMaintenances.length - 1) {
          doc.addPage('landscape');
          yPosition = 20;
          pageCount++;
          
          // Répéter l'en-tête si nouvelle page
          doc.setFillColor(primaryColor);
          doc.setTextColor('#FFFFFF');
          doc.rect(20, yPosition, 240, 8, 'F');
          doc.text('ID', 25, yPosition + 6);
          doc.text('Équipement', 50, yPosition + 6);
          doc.text('Date Début', 110, yPosition + 6);
          doc.text('Date Fin', 150, yPosition + 6);
          doc.text('Statut', 190, yPosition + 6);
          doc.text('Priorité', 230, yPosition + 6);
          yPosition += 10;
        }
        
        // Alternance des couleurs de fond
        doc.setFillColor(index % 2 === 0 ? '#FFFFFF' : lightGray);
        doc.rect(20, yPosition, 240, 8, 'F');
        
        // Couleur du statut
        const statusColor = maint.statut === 'EN_ATTENTE' ? pendingColor : inProgressColor;
        doc.setFillColor(statusColor);
        doc.rect(190, yPosition, 30, 8, 'F');
        
        // Texte
        doc.setTextColor('#000000');
        doc.text(maint.id.toString(), 25, yPosition + 6);
        
        if (maint.equipementId !== null && maint.equipementId !== undefined) {
          doc.text(maint.equipementId.toString(), 50, yPosition + 6);
        } else {
          doc.text('N/A', 50, yPosition + 6);
        }
        
        doc.text(new Date(maint.dateDebutPrevue).toLocaleDateString(), 110, yPosition + 6);
        doc.text(new Date(maint.dateFinPrevue).toLocaleDateString(), 150, yPosition + 6);
        
        // Statut avec couleur de fond
        doc.setTextColor('#FFFFFF');
        doc.text(this.translateStatus(maint.statut), 190, yPosition + 6, { align: 'center' });
        
        doc.setTextColor('#000000');
        doc.text(maint.priorite, 230, yPosition + 6);
        
        yPosition += 10;
      });
      
      // Pied de page final
      doc.setFontSize(8);
      doc.setTextColor(secondaryColor);
      doc.text(`Page ${pageCount}/${totalPages} - Document généré le ${new Date().toLocaleDateString()} - H.U.I.R`, 
               140, 190, { align: 'center' });
      
      doc.save(`calendrier_maintenances_${new Date().toISOString().slice(0,10)}.pdf`);
    } catch (e) {
      console.error('Erreur lors de la génération du PDF:', e);
    }
  };

  img.onerror = () => {
    console.error('Le logo est introuvable, génération sans logo...');
    this.generateCalendarPDFWithoutLogo(doc);
  };
}

private generateCalendarPDFWithoutLogo(doc: jsPDF): void {
  // Version simplifiée sans logo
  // ... (implémentez la même logique mais sans les références au logo)
  doc.save(`calendrier_maintenances_simple_${new Date().toISOString().slice(0,10)}.pdf`);
}
  
  
  

  
  
  

 

  private translateStatus(status?: string): string {
    const statusMap: {[key: string]: string} = {
      'EN_ATTENTE': 'En attente',
      'EN_COURS': 'En cours',
      'TERMINEE': 'Terminée',
      'ANNULEE': 'Annulée'
    };
    return status ? (statusMap[status] || status) : 'N/A';
  }
}