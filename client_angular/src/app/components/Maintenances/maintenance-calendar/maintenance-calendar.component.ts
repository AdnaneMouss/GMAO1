import { Component, OnInit } from '@angular/core';
import { MaintenanceService } from '../../../services/maintenance.service';
import { maintenance } from '../../../models/maintenance';
import { CalendarOptions } from '@fullcalendar/core';
import { EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

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
  calendarOptions!: CalendarOptions;
  
  legendItems = [
    { color: '#FFC107', label: 'En attente' },
    { color: '#2196F3', label: 'En cours' }
  ];

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
      dayMaxEvents: true
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
        title: `Maintenance: ${maint.id}`,
        start: maint.dateDebutPrevue,
        end: maint.dateFinPrevue,
        backgroundColor: this.getStatusColor(maint.statut),
        borderColor: this.getStatusColor(maint.statut),
        extendedProps: {
          maintenance: maint
        }
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
      `Maintenance: ${maint.id }`,
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
    
    const content = document.createElement('div');
    content.className = 'fc-event-content';
    
    const title = document.createElement('div');
    title.className = 'fc-event-title';
    title.innerText = event.title;
    
    const status = document.createElement('div');
    status.className = 'fc-event-status';
    status.innerText = meta.maintenance.statut || 'N/A';
    status.style.fontSize = '0.8em';
    status.style.marginTop = '2px';
    
    content.append(title, status);
    return { domNodes: [content] };
  }
}