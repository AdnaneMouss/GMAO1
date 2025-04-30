import { Component, OnInit } from '@angular/core';
import { MaintenanceService } from '../../../services/maintenance.service';
import { maintenance } from '../../../models/maintenance';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import jsPDF from 'jspdf';
import { format, startOfMonth } from 'date-fns';
import { fr } from 'date-fns/locale';

interface CalendarEventMeta {
  maintenance: maintenance;
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

  private filterMaintenances(): void {
    this.filteredMaintenances = this.maintenances.filter(maint => 
      (maint.statut === 'EN_ATTENTE' || maint.statut === 'EN_COURS') && // Seulement EN_ATTENTE et EN_COURS
      maint.repetitiontype === 'Ne_pas_repeter'
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
      title: `M-${maint.id}`,
      start: maint.dateDebutPrevue,
      end: maint.dateFinPrevue,
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      textColor: '#ffffff',
      extendedProps: {
        maintenance: maint
      },
      display: 'block',
      color: this.getStatusColor(maint.statut)
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
    eventContainer.style.padding = '2px';
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
    idText.style.fontSize = '12px';
    idText.style.fontWeight = 'bold';
    idText.style.color = '#fff';
    idText.style.whiteSpace = 'nowrap';
    idText.style.overflow = 'hidden';
    idText.style.textOverflow = 'ellipsis';
    idText.textContent = `M-${maintenance.id}`;

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

  // Méthodes PDF (simplifiées pour l'exemple)
  exportCalendarPDF(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      alert('Fonctionnalité PDF à implémenter');
    }, 500);
  }
}