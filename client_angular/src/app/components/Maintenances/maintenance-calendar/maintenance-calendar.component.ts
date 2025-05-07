import { Component, OnInit } from '@angular/core';
import { MaintenanceService } from '../../../services/maintenance.service';
import { maintenance } from '../../../models/maintenance';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import jsPDF from 'jspdf';
import { format, startOfMonth,endOfMonth,getDay,getDate } from 'date-fns';
import { fr } from 'date-fns/locale';
import { MaintenanceCorrective } from '../../../models/maintenance-corrective';

  


interface CalendarEventMeta {
  maintenance: maintenance;
  //MaintenanceCorrective :MaintenanceCorrective;
}

interface LegendItem {
  color: string;
  label: string;
}

interface CalendarEvent extends EventInput {
  extendedProps: CalendarEventMeta;
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
  isLoading: boolean = true;
  errorMessage: string | null = null;
  moisAffiche: string = ''; 

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    events: [],
    eventClick: this.handleEventClick.bind(this), // Correction: Ajout de la liaison
    eventContent: this.customEventContent.bind(this),
    height: '100%',
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
    },
    eventDisplay: 'block',
    eventMinHeight: 20,
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }
  };

  legendItems: LegendItem[] = [
    { color: '#FFC107', label: 'En attente' },
    { color: '#2196F3', label: 'En cours' }
  ];

  constructor(private maintenanceService: MaintenanceService) {}

  ngOnInit(): void {
    this.loadMaintenances();
    this.moisAffiche = this.calculerMois(new Date());
    
  }

  private loadMaintenances(): void {
    this.isLoading = true;
    this.errorMessage = null;
    
    this.maintenanceService.getAllMaintenances().subscribe({
      next: (data) => {
        this.maintenances = data;
        this.filterMaintenances();
        this.updateCalendarEvents();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des maintenances', err);
        this.errorMessage = 'Erreur lors du chargement des données. Veuillez réessayer.';
        this.isLoading = false;
      }
    });
  }
  calculerMois(date: Date): string {
    const mois = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    return `${mois[date.getMonth()]} ${date.getFullYear()}`;
  }
  

  private filterMaintenances(): void {
    this.filteredMaintenances = this.maintenances.filter(maint => 
      (maint.statut === 'EN_ATTENTE' || maint.statut === 'EN_COURS')  // Seulement EN_ATTENTE et EN_COURS
     
    );
  }

  private updateCalendarEvents(): void {
    const events = this.transformMaintenancesToEvents(this.filteredMaintenances);
    this.calendarOptions.events = events;
    
    setTimeout(() => {
      if (this.calendarOptions.events) {
        this.calendarOptions.events ;
      }
    }, 0);
  }

  private transformMaintenancesToEvents(maintenances: maintenance[]): CalendarEvent[] {
    return maintenances.map(maint => ({
      title: `Maint-${maint.id} ,${maint.action}`,
      start: maint.dateDebutPrevue,
      end: new Date(new Date(maint.dateDebutPrevue).getTime() + 30*60000), // 30 minutes après le début
       display: 'list-item',
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      textColor: '#ffffff',
      extendedProps: { maintenance: maint },
     // display: 'block',
      color: this.getStatusColor(maint.statut),
      allDay: false // Important pour éviter le comportement "all-day"
    }));
  }
  private getStatusColor(status?: string): string {
    switch (status) {
      case 'EN_ATTENTE': return '#FFC107';
      case 'EN_COURS': return '#2196F3';
      default: return '#9E9E9E';
    }
  }

  // Correction de la méthode handleEventClick
  handleEventClick(clickInfo: any): void {
    const event = clickInfo.event;
    const maint = event.extendedProps.maintenance;
    
    const message = [
      `Maintenance: ${maint.id}`,
      `Statut: ${this.translateStatus(maint.statut)}`,
      `Équipement: ${maint.equipementId || 'N/A'}`,
      `Date début: ${this.formatDate(new Date(maint.dateDebutPrevue))}`,
      `Date fin: ${this.formatDate(new Date(maint.dateFinPrevue))}`,
      `Priorité: ${maint.priorite}`,
      `Commentaires: ${maint.commentaires || 'Aucun'}`
    ].join('\n');
    
    alert(message);
  }

  private customEventContent(arg: { event: CalendarEvent }): { domNodes: HTMLElement[] } {
    const event = arg.event;
    const maintenance = event.extendedProps.maintenance;

    const eventContainer = document.createElement('div');
    eventContainer.className = 'fc-event-main-container';
    eventContainer.style.display = 'flex';
    eventContainer.style.alignItems = 'center';
    eventContainer.style.height = '100%';
    eventContainer.style.padding = '10px';
    eventContainer.style.overflow = 'hidden';

    const durationBar = document.createElement('div');
    durationBar.className = 'fc-event-duration-bar';
    durationBar.style.backgroundColor = this.getStatusColor(maintenance.statut);
    durationBar.style.height = '100%';
    durationBar.style.borderRadius = '4px';
    durationBar.style.flexGrow = '1';
    durationBar.style.display = 'flex';
    durationBar.style.alignItems = 'center';
    durationBar.style.justifyContent = 'space-between';
    durationBar.style.padding = '0 6px';
    durationBar.style.overflow = 'hidden';

    const content = document.createElement('div');
    content.style.display = 'flex';
    content.style.alignItems = 'center';
    content.style.justifyContent = 'space-between';
    content.style.width = '100%';
    content.style.overflow = 'hidden';

    const idText = document.createElement('div');
    idText.className = 'fc-event-id';
    idText.style.fontSize = ' 12px';
    idText.style.fontWeight = 'bold';
    idText.style.color = '#fff';
    idText.style.whiteSpace = 'nowrap';
    idText.style.overflow = 'hidden';
    idText.style.textOverflow = 'ellipsis';
    idText.textContent = `M-${maintenance.id} ${maintenance.action}`;

    if (maintenance.priorite === 'URGENTE') {
      const priorityBadge = document.createElement('div');
      priorityBadge.textContent = '❗';
      priorityBadge.style.marginLeft = '4px';
      content.appendChild(priorityBadge);
    }

    content.appendChild(idText);
    durationBar.appendChild(content);
    eventContainer.appendChild(durationBar);

    return { domNodes: [eventContainer] };
  }

  private updateCurrentMonth(date: Date): void {
    this.currentMonth = format(startOfMonth(date), 'MMMM yyyy', { locale: fr });
    this.currentMonth = this.currentMonth.charAt(0).toUpperCase() + this.currentMonth.slice(1);
  }

  private formatDate(date: Date): string {
    return format(date, 'dd/MM/yyyy HH:mm', { locale: fr });
  }

  private translateStatus(status?: string): string {
    const statusMap: Record<string, string> = {
      'EN_ATTENTE': 'En attente',
      'EN_COURS': 'En cours'
    };
    return status ? (statusMap[status] || status) : 'N/A';
  }

  refreshData(): void {
    this.loadMaintenances();
  }

  exportCalendarPDF(): void {
    // Configuration du PDF
    const doc = new jsPDF('landscape');
    const currentDate = new Date();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    const logoBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAwcAAAGXCAYAAADmoSwlAA';
    
    // 1. Ajout du logo
    const addLogo = () => {
      const img = new Image();
      img.src = logoBase64;
      img.onload = () => {
        const logoHeight = 20;
        const logoWidth = (img.width * logoHeight) / img.height;
        doc.addImage(img, 'png', margin, 10, logoWidth, logoHeight);
      };
      img.onerror = () => console.warn("Logo non trouvé, l'export continuera sans logo");
    };
    addLogo();

    // 2. Titre principal
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text(`Calendrier des Maintenances - `, pageWidth / 2, 25, { align: 'center' });

    // 3. Sous-titre avec date
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Généré le ${format(currentDate, 'dd/MM/yyyy HH:mm')}`, pageWidth - margin, 30, { align: 'right' });

    // 4. Légende
    this.legendItems.forEach((item, index) => {
      doc.setFillColor(item.color);
      doc.rect(margin + (index * 60), 35, 10, 10, 'F');
      doc.setTextColor(0);
      doc.text(item.label, margin + (index * 60) + 15, 42);
    });

    // ==================== PARTIE CALENDRIER ====================
    
    const calendarStartY = 50;
    const cellHeight = 40;
    const cellWidth = (pageWidth - 2 * margin) / 7;
    const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    
    // En-têtes des jours
    doc.setFont('helvetica', 'bold');
    days.forEach((day, i) => {
      doc.text(day.substring(0, 3), margin + (i * cellWidth) + cellWidth / 2, calendarStartY, { align: 'center' });
    });
    
    // Remplissage du calendrier
    let yPos = calendarStartY + 10;
    const monthStart = startOfMonth(new Date());
    const monthEnd = endOfMonth(monthStart);
    let currentDay = 1;
    
    for (let week = 0; week < 6; week++) {
      if (currentDay > getDate(monthEnd)) break;
    
      yPos += cellHeight;
    
      for (let day = 0; day < 7; day++) {
        const xPos = margin + (day * cellWidth);
        const currentDate = new Date(monthStart.getFullYear(), monthStart.getMonth(), currentDay);
        if (currentDay > getDate(monthEnd)) break;
        
        const dayKey = format(currentDate, 'yyyy-MM-dd');
        const maintenances = this.getMaintenancesForDay(dayKey);
    
        // Style de cellule
        doc.setDrawColor(200);
        doc.rect(xPos, yPos - cellHeight, cellWidth, cellHeight);
    
        // Numéro du jour
        doc.setFontSize(10);
        doc.setTextColor(0);
        doc.text(currentDay.toString(), xPos + 5, yPos - cellHeight + 8);
    
        // Événements (max 3 pour éviter chevauchement)
        let eventY = yPos - cellHeight + 15;
        maintenances.slice(0, 3).forEach(maint => {
          const statusColor = this.getStatusColor(maint.statut);
          doc.setFillColor(statusColor);
          doc.roundedRect(xPos + 5, eventY, cellWidth - 10, 6, 1, 1, 'F');
          doc.setFontSize(6);
          doc.setTextColor(0);
          doc.text(`${maint.action.substring(0, 12)}${maint.action.length > 12 ? '...' : ''}`, xPos + 8, eventY + 4);
          eventY += 8;
        });
    
        // S'il y a plus de 3 événements
        if (maintenances.length > 3) {
          doc.setFontSize(7);
          doc.setTextColor(100);
          doc.text(`+${maintenances.length - 3}`, xPos + 5, eventY);
        }
    
        currentDay++;
      }
    }

    // ==================== PARTIE TABLEAU DÉTAILS ====================
    
    const headers = [
      'ID', 'Action', 'Équipement', 'Commentaire',
      'Type Répétition', 'Technicien', 'Date Début', 'Statut', 'Priorité'
    ];
    
    // Largeur totale paysage = environ 285mm (A4), on reste < 270mm pour marges
    const colWidths = [10, 50, 35, 35, 30, 30, 30, 25, 20]; // total ≈ 265
    let tableStartY = yPos + 20;
    let currentY = tableStartY;
    let xPos = margin;
    
    // Ajout d'une nouvelle page si on dépasse
    if (tableStartY > 180) {
      doc.addPage('landscape');
      tableStartY = 20;
      currentY = tableStartY;
    }
    
    // Titre
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Détails des Maintenances', margin, tableStartY - 5);
    
    // En-têtes
    headers.forEach((header, i) => {
      doc.setFontSize(9);
      doc.setTextColor(0);
      doc.setFillColor(173, 216, 230);
      doc.rect(xPos, currentY, colWidths[i], 10, 'F');
      doc.text(header, xPos + 2, currentY + 7);
      xPos += colWidths[i];
    });
    
    currentY += 10;
    
    // Corps du tableau
    this.filteredMaintenances.forEach((maint) => {
      xPos = margin;
    
      const rowData = [
        maint.id?.toString() || '',
        maint.action || '',
        maint.equipementNom || 'N/A',
        maint.commentaires || '',
        maint.repetitiontype || '',
        maint.user?.nom || '',
        format(new Date(maint.dateDebutPrevue), 'dd/MM HH:mm'),
        this.translateStatus(maint.statut),
        maint.priorite || ''
      ];
    
      rowData.forEach((text, i) => {
        doc.setFontSize(7);
        doc.setTextColor(0);
    
        const wrappedText = doc.splitTextToSize(String(text), colWidths[i] - 4);
        const cellHeight = 8; // Tu peux l’augmenter si besoin
    
        doc.rect(xPos, currentY, colWidths[i], cellHeight);
        doc.text(wrappedText, xPos + 2, currentY + 5);
    
        xPos += colWidths[i];
      });
    
      currentY += 8;
    
      // Changement de page
      if (currentY > 190) {
        doc.addPage('landscape');
        currentY = 20;
        xPos = margin;
    
        // Redessiner les en-têtes
        headers.forEach((header, i) => {
          doc.setFontSize(9);
          doc.setTextColor(0);
          doc.setFillColor(173, 216, 230);
          doc.rect(xPos, currentY, colWidths[i], 10, 'F');
          doc.text(header, xPos + 2, currentY + 7);
          xPos += colWidths[i];
        });
    
        currentY += 10;
      }
    });
    
    // Pied de page
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text('© Votre Société - Système de Gestion des Maintenances', pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
    
    // Sauvegarde du PDF
    doc.save(`maintenances_${format(currentDate, 'yyyyMMdd_HHmm')}.pdf`);
  }    
   
  
  
    
  
  
  
  private getMaintenancesForDay(dayKey: string): maintenance[] {
    return this.filteredMaintenances.filter(maint => 
      format(new Date(maint.dateDebutPrevue), 'yyyy-MM-dd') === dayKey
    );
  }
  

  
 
}