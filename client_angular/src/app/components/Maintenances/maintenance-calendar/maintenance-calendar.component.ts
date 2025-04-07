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

    const content = document.createElement('div');
    content.className = 'fc-event-content';

    const startDate = new Date(event.start);
    const endDate = new Date(event.end);

    // Tableau des dates à afficher (seulement début et fin)
    const datesToDisplay = [
        { date: startDate,  label: "Début"  },
        { date: endDate, label: "Fin" }
        
    ];

    // Boucle pour afficher uniquement ces deux dates
    datesToDisplay.forEach((item, index) => {
        const dayContainer = document.createElement('div');
        dayContainer.className = 'event-day-container';

        const daySquare = document.createElement('div');
        daySquare.className = 'event-day-square';

        // Taille du carreau
        daySquare.style.width = '5px';
        daySquare.style.height = '15px';
        daySquare.style.display = 'flex';
        daySquare.style.alignItems = 'center';
        daySquare.style.justifyContent = 'center';
        daySquare.style.fontSize = '12px';
        daySquare.style.color = 'white';
        daySquare.style.fontWeight = 'bold';

        // Espacement entre les carreaux
        daySquare.style.marginRight = '3cm'; // Espace entre les deux carreaux

        // Pas de marge à droite pour le dernier élément
        if (index === datesToDisplay.length - 1) {
            daySquare.style.marginRight = '0';
        }

        // Couleur selon le statut
        daySquare.style.backgroundColor = this.getStatusColor(meta.maintenance.statut || 'EN_ATTENTE');
        
        // Ajouter le texte dans le carreau
        daySquare.innerText = item.label;

        // Ajouter info en tooltip
        daySquare.title = `${event.title} (${item.date.toLocaleDateString()})`;

        // Ajouter le carreau au conteneur
        dayContainer.appendChild(daySquare);
        content.appendChild(dayContainer);
    });

    return { domNodes: [content] };
}

  
  
  

  
  
  

  exportToHTML(): void {
    // Création du contenu HTML
    let htmlContent = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <title>Calendrier des Maintenances</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #2c3e50; text-align: center; }
          .info { margin-bottom: 20px; text-align: center; }
          .legend { display: flex; justify-content: center; margin: 15px 0; flex-wrap: wrap; }
          .legend-item { display: flex; align-items: center; margin: 5px 15px; }
          .legend-color { width: 20px; height: 20px; margin-right: 5px; border-radius: 3px; }
          .calendar-container { width: 100%; overflow-x: auto; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; font-weight: bold; }
          .event { padding: 3px; border-radius: 3px; margin: 2px 0; color: white; }
          @media print {
            body { margin: 0; padding: 10px; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <h1>Calendrier des Maintenances</h1>
        <div class="info">
          Généré le ${new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })} - 
          ${this.filteredMaintenances.length} maintenances programmées
        </div>
        
        <div class="legend">
          ${this.legendItems.map(item => `
            <div class="legend-item">
              <div class="legend-color" style="background-color: ${item.color};"></div>
              <div>${item.label}</div>
            </div>
          `).join('')}
        </div>
        
        <div class="calendar-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Titre</th>
                <th>Statut</th>
                <th>Date Début</th>
                <th>Date Fin</th>
                <th>Priorité</th>
                <th>Commentaires</th>
              </tr>
            </thead>
            <tbody>
    `;

    // Ajout des données de maintenance
    this.filteredMaintenances.forEach(maint => {
      const statusColor = this.getStatusColor(maint.statut);
      
      htmlContent += `
        <tr>
          <td>${maint.id}</td>
          <td>Maintenance: ${maint.id}</td>
          <td>
            <div class="event" style="background-color: ${statusColor}">
              ${this.translateStatus(maint.statut)}
            </div>
          </td>
          <td>${new Date(maint.dateDebutPrevue).toLocaleString('fr-FR', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</td>
          <td>${new Date(maint.dateFinPrevue).toLocaleString('fr-FR', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</td>
          <td>${maint.priorite || 'N/A'}</td>
          <td>${maint.commentaires || 'Aucun'}</td>
        </tr>
      `;
    });

    // Fermeture du HTML
    htmlContent += `
            </tbody>
          </table>
          <div class="no-print" style="text-align: center; margin-top: 20px;">
            <button onclick="window.print()" style="padding: 8px 16px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">
              Imprimer
            </button>
          </div>
        </div>
      </body>
      </html>
    `;

    // Ouverture dans un nouvel onglet pour impression
    const printWindow = window.open('', '_blank');
    printWindow?.document.write(htmlContent);
    printWindow?.document.close();
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