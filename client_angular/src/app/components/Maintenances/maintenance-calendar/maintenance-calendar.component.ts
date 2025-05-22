import { Component, OnInit } from '@angular/core';
import { MaintenanceService } from '../../../services/maintenance.service';
import { maintenance } from '../../../models/maintenance';
import { CalendarOptions, EventClickArg, EventContentArg, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import jsPDF from 'jspdf';
import { format, startOfMonth, endOfMonth, getDate } from 'date-fns';
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
  moisAffiche: string = '';

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    events: [],
    eventClick: this.handleEventClick.bind(this),
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
      (maint.statut === 'EN_ATTENTE' || maint.statut === 'EN_COURS')
    );
  }

  private updateCalendarEvents(): void {
    const events = this.transformMaintenancesToEvents(this.filteredMaintenances);
    this.calendarOptions.events = events;
  }

  private transformMaintenancesToEvents(maintenances: maintenance[]): CalendarEvent[] {
    return maintenances.map(maint => ({
      title: `Maint-${maint.id} ,${maint.action}`,
      start: maint.dateDebutPrevue,
      end: new Date(new Date(maint.dateDebutPrevue).getTime() + 30*60000),
      display: 'list-item',
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      textColor: '#ffffff',
      extendedProps: { maintenance: maint },
      color: this.getStatusColor(maint.statut),
      allDay: false
    }));
  }

  private getStatusColor(status?: string): string {
    switch (status) {
      case 'EN_ATTENTE': return '#FFC107';
      case 'EN_COURS': return '#2196F3';
      default: return '#9E9E9E';
    }
  }

  handleEventClick(clickInfo: EventClickArg): void {
    const event = clickInfo.event;
    const maint = event.extendedProps['maintenance'];

    const message = `
      <div style="font-size: 16px; font-family: Arial, sans-serif; line-height: 1.6;">
        <strong>Maintenance:</strong> ${maint.id}<br/>
        <strong>Statut:</strong> ${this.translateStatus(maint.statut)}<br/>
        <strong>Équipement:</strong> ${maint.equipementId || 'N/A'}<br/>
        <strong>Date début:</strong> ${this.formatDate(new Date(maint.dateDebutPrevue))}<br/>
        <strong>Date fin:</strong> ${this.formatDate(new Date(maint.dateFinPrevue))}<br/>
        <strong>Priorité:</strong> ${maint.priorite}<br/>
        <strong>Action:</strong> ${maint.action || 'N/A'}<br/>
        <strong>Commentaires:</strong> ${maint.commentaires || 'Aucun'}
      </div>
    `;

    const alertDiv = document.createElement('div');
    alertDiv.id = 'custom-alert';
    Object.assign(alertDiv.style, {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#f9f9f9',
      padding: '25px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      zIndex: '1000',
      width: '400px',
      maxWidth: '90%'
    });

    alertDiv.innerHTML = message;

    const buttonContainer = document.createElement('div');
    Object.assign(buttonContainer.style, {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '10px',
      marginTop: '20px'
    });

    const editButton = this.createButton('Modifier', 'fa-edit', '#2196F3', () => {
      alertDiv.remove();
      this.openEditForm(maint);
    });

    const okButton = this.createButton('OK', 'fa-check', '#4CAF50', () => {
      alertDiv.remove();
    });

    buttonContainer.append(editButton, okButton);
    alertDiv.appendChild(buttonContainer);
    document.body.appendChild(alertDiv);

    this.loadFontAwesome();
  }

  private createButton(text: string, icon: string, color: string, onClick: () => void): HTMLButtonElement {
    const btn = document.createElement('button');
    btn.innerHTML = `<i class="fas ${icon}"></i> ${text}`;
    Object.assign(btn.style, {
      padding: '8px 16px',
      backgroundColor: color,
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer'
    });
    btn.onclick = onClick;
    return btn;
  }

  openEditForm(maintenance: maintenance): void {
    const formContainer = document.createElement('div');
    formContainer.id = 'maintenance-form-container';
    formContainer.style.position = 'fixed';
    formContainer.style.top = '0';
    formContainer.style.left = '0';
    formContainer.style.width = '100%';
    formContainer.style.height = '100%';
    formContainer.style.backgroundColor = 'rgba(0,0,0,0.5)';
    formContainer.style.display = 'flex';
    formContainer.style.justifyContent = 'center';
    formContainer.style.alignItems = 'center';
    formContainer.style.zIndex = '1000';

    const form = document.createElement('form');
    form.style.backgroundColor = 'white';
    form.style.padding = '20px';
    form.style.borderRadius = '8px';
    form.style.width = '80%';
    form.style.maxWidth = '600px';
    form.style.maxHeight = '90vh';
    form.style.overflowY = 'auto';

    const title = document.createElement('h2');
    title.textContent = 'Modifier la Maintenance';
    title.style.marginBottom = '20px';
    title.style.color = '#333';
    form.appendChild(title);

    const formInputs: {[key: string]: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement} = {};

    // Ajout des champs du formulaire
  // Dans la partie où vous créez les champs du formulaire
const fields = [
  { label: 'Statut', name: 'statut', value: maintenance.statut, type: 'select', options: ['EN_COURS', 'EN_ATTENTE', 'TERMINEE', 'ANNULEE'] },
  { label: 'Date Début Prévue', name: 'dateDebutPrevue', value: this.formatDateForInput(maintenance.dateDebutPrevue), type: 'date' },
  { label: 'Date Fin Prévue', name: 'dateFinPrevue', value: this.formatDateForInput(maintenance.dateFinPrevue), type: 'date' },
  { label: 'Priorité', name: 'priorite', value: maintenance.priorite, type: 'select', options: ['URGENTE', 'FAIBLE', 'NORMALE'] },
  { label: 'Action', name: 'action', value: maintenance.action, type: 'select', options: [
    'VERIFICATION_PERFORMANCES',
    'NETTOYAGE_EQUIPEMENTS',
    'CALIBRATION_EQUIPEMENTS',
    'TEST_SECURITE',
    'AUTRE',
    'REMPLACEMENT_PIECES',
    'INSPECTION_VISUELLE',
    'CONTROLE_CONNECTIVITE',
    'VERIFICATION_SAUVEARDES',
    'FORMATION_ENTRETIEN'
  ]},
  { label: 'Commentaires', name: 'commentaires', value: maintenance.commentaires, type: 'textarea' },
  { label: 'Équipement ID', name: 'equipementId', value: maintenance.equipementId?.toString(), type: 'number' }
];

    fields.forEach(field => {
      const fieldContainer = document.createElement('div');
      fieldContainer.style.marginBottom = '15px';

      const label = document.createElement('label');
      label.textContent = field.label;
      label.style.display = 'block';
      label.style.marginBottom = '5px';
      label.style.fontWeight = 'bold';

      let input: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
      
      if (field.type === 'textarea') {
        input = document.createElement('textarea');
        input.rows = 3;
      } else if (field.type === 'select') {
        input = document.createElement('select');
        field.options?.forEach(option => {
          const optElement = document.createElement('option');
          optElement.value = option;
          optElement.textContent = option;
          input.appendChild(optElement);
        });
      } else {
        input = document.createElement('input');
        input.type = field.type;
      }

      input.name = field.name;
      input.value = field.value || '';
      input.style.width = '100%';
      input.style.padding = '8px';
      input.style.border = '1px solid #ddd';
      input.style.borderRadius = '4px';

      fieldContainer.appendChild(label);
      fieldContainer.appendChild(input);
      form.appendChild(fieldContainer);

      formInputs[field.name] = input;
    });

    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'flex-end';
    buttonContainer.style.gap = '10px';
    buttonContainer.style.marginTop = '20px';

const saveButton = this.createButton('Enregistrer', 'fa-save', '#4CAF50', () => {
  const updatedMaintenance: Partial<maintenance> = {
    statut: (formInputs['statut'] as HTMLSelectElement).value as any,
    dateDebutPrevue: new Date((formInputs['dateDebutPrevue'] as HTMLInputElement).value),
    dateFinPrevue: new Date((formInputs['dateFinPrevue'] as HTMLInputElement).value),
    priorite: (formInputs['priorite'] as HTMLSelectElement).value as any,
    action: (formInputs['action'] as HTMLSelectElement).value as any,
    commentaires: (formInputs['commentaires'] as HTMLTextAreaElement).value,
    equipementId: parseInt((formInputs['equipementId'] as HTMLInputElement).value, 10),
  };

  const maintenanceId = maintenance.id; // ← Assurez-vous que `maintenance` contient bien un `id`

  this.maintenanceService.updateMaintenance(maintenanceId, updatedMaintenance).subscribe({
    next: () => {
      this.loadMaintenances();  // Recharge les maintenances après mise à jour
      formContainer.remove();   // Ferme le formulaire
    },
    error: (err) => {
      console.error('Erreur lors de la mise à jour de la maintenance', err);
      alert('Erreur lors de la mise à jour. Veuillez réessayer.');
    }
  });
});

    const cancelButton = this.createButton('Annuler', 'fa-times', '#f44336', () => {
      formContainer.remove();
    });

    buttonContainer.append(cancelButton, saveButton);
    form.appendChild(buttonContainer);
    formContainer.appendChild(form);
    document.body.appendChild(formContainer);
  }

private saveMaintenance(id: number, updatedMaintenance: Partial<maintenance>): void {
  try {
    // Validate required fields
    if (!updatedMaintenance.statut || !updatedMaintenance.dateDebutPrevue || !updatedMaintenance.dateFinPrevue) {
      throw new Error('Tous les champs obligatoires doivent être remplis');
    }

    // Convert dates to ISO string format
    const dateDebut = new Date(updatedMaintenance.dateDebutPrevue);
    const dateFin = new Date(updatedMaintenance.dateFinPrevue);

    if (isNaN(dateDebut.getTime())) throw new Error('Date de début invalide');
    if (isNaN(dateFin.getTime())) throw new Error('Date de fin invalide');
    if (dateFin < dateDebut) throw new Error('La date de fin ne peut pas être antérieure à la date de début');

    // Prepare the payload with proper types
    const payload: any = {
      id: id,
      statut: updatedMaintenance.statut,
      dateDebutPrevue: dateDebut.toISOString(),
      dateFinPrevue: dateFin.toISOString(),
      priorite: updatedMaintenance.priorite || 'NORMALE',
      action: updatedMaintenance.action,
      commentaires: updatedMaintenance.commentaires || '',
      equipementId: updatedMaintenance.equipementId ? Number(updatedMaintenance.equipementId) : null
    };

    // Remove undefined/null values
    Object.keys(payload).forEach(key => {
      if (payload[key] === undefined || payload[key] === null) {
        delete payload[key];
      }
    });

    console.log('Sending payload:', payload); // Debug log

    this.maintenanceService.updateMaintenance(id, payload).subscribe({
      next: (res) => {
        alert('✅ Maintenance mise à jour avec succès');
        this.loadMaintenances();
      },
      error: (err) => {
        console.error('❌ Erreur lors de la mise à jour :', err);
        let errorMessage = '❌ Échec de la mise à jour';
        
        if (err.error) {
          // Try to extract server error message
          if (err.error.message) {
            errorMessage += `: ${err.error.message}`;
          } else if (err.error.errors) {
            // Handle validation errors
            const validationErrors = Object.values(err.error.errors).join('\n');
            errorMessage += `:\n${validationErrors}`;
          }
        } else if (err.message) {
          errorMessage += `: ${err.message}`;
        }
        
        alert(errorMessage);
      }
    });
  } catch (error) {
    console.error('Validation error:', error);
    alert(`❌ Erreur de validation: ${error}`);
  }
}

  private formatDateForInput(dateString: string | Date): string {
    const date = new Date(dateString);
    return format(date, "yyyy-MM-dd");
  }

  private customEventContent(arg: EventContentArg): { domNodes: HTMLElement[] } {
    const event = arg.event;
    const maintenance = event.extendedProps['maintenance'];

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
    idText.style.fontSize = '12px';
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
async exportCalendarPDF(): Promise<void> {
  try {
    this.updateCurrentMonth(new Date());
    const doc = new jsPDF('landscape');
    const currentDate = new Date();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    let yPosition = 20;

    // 1. Chargement du logo (avec fallback si échec)
    try {
      const logoResponse = await fetch('assets/logo.png');
      if (logoResponse.ok) {
        const logoData = await logoResponse.blob();
        const logoUrl = URL.createObjectURL(logoData);
        doc.addImage(logoUrl, 'PNG', margin, yPosition, 30, 30);
      }
    } catch (e) {
      console.warn('Logo non chargé, continuation sans logo');
    }

    // En-tête texte
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Hôpital Universitaire International de Rabat', margin + 35, yPosition + 10);
    doc.setFont('helvetica', 'normal');
    doc.text('Système de Gestion des Equipements', margin + 35, yPosition + 16);
    yPosition += 30;

    // Titre principal
    doc.setFontSize(16);
    doc.setTextColor(0, 51, 102);
    doc.text('CALENDRIER DES MAINTENANCES', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 10;
    doc.setFontSize(12);
    doc.text(this.currentMonth, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    // Vérification des données
    const allMaintenances = this.getMaintenancesForCurrentMonth();
    if (!allMaintenances || allMaintenances.length === 0) {
      doc.setTextColor(255, 0, 0);
      doc.text('Aucune donnée de maintenance disponible', margin, yPosition);
      doc.save('calendrier_maintenances_vide.pdf');
      return;
    }

    // Filtrage avec vérification
   

    // En-têtes du tableau
    const headers = ['Date', 'Équipement', 'Action', 'Statut', 'Priorité', 'Technicien'];
    const colWidths = [30, 50, 60, 30, 30, 50];
    
    // Dessin des en-têtes
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    let x = margin;
    headers.forEach((header, i) => {
      doc.text(header, x + 2, yPosition);
      x += colWidths[i];
    });
    yPosition += 7;

    // Données
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    
    this.maintenances.forEach(maint => {
      const row = [
        maint.dateDebutPrevue ? format(new Date(maint.dateDebutPrevue), 'dd/MM/yyyy') : 'N/A',
        maint.equipementNom || 'Non spécifié',
        maint.action || 'Non spécifié',
        maint.statut || 'Non spécifié',
        maint.priorite || 'Non spécifié',
        
      ];

      x = margin;
      row.forEach((cell, i) => {
        const originalColor = doc.getTextColor();
        
        if (headers[i] === 'Statut') {
          if (maint.statut?.toLowerCase().includes('en cours')) {
            doc.setTextColor(0, 0, 255); // Bleu
          } else if (maint.statut?.toLowerCase().includes('en attente')) {
            doc.setTextColor(255, 165, 0); // Orange
          }
        }
        
        doc.text(cell, x + 2, yPosition);
        doc.setTextColor(originalColor);
        x += colWidths[i];
      });

      yPosition += 10;
      
      // Saut de page
      if (yPosition > 190) {
        doc.addPage('landscape');
        yPosition = 20;
        x = margin;
        doc.setFont('helvetica', 'bold');
        headers.forEach((header, i) => {
          doc.text(header, x + 2, yPosition);
          x += colWidths[i];
        });
        yPosition = 27;
        doc.setFont('helvetica', 'normal');
      }
    });

    doc.save(`maintenances_${format(currentDate, 'yyyyMMdd')}.pdf`);

  } catch (error) {
    console.error('Erreur génération PDF:', error);
    alert('Erreur lors de la génération du PDF. Voir la console pour les détails.');
  }
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
      'EN_COURS': 'En cours',
      'TERMINEE': 'Terminée',
      'ANNULEE': 'Annulée'
    };
    return status ? (statusMap[status] || status) : 'N/A';
  }

  private loadFontAwesome(): void {
    if (!document.querySelector('link[href*="font-awesome"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
      document.head.appendChild(link);
    }
  }

  refreshData(): void {
    this.loadMaintenances();
  }




getMaintenancesForCurrentMonth(): any[] {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  return this.maintenances.filter(maint => {
    if (!maint.dateDebutPrevue) return false;
    const maintDate = new Date(maint.dateDebutPrevue);
    if (isNaN(maintDate.getTime())) return false;

    return (
      maintDate.getMonth() === currentMonth &&
      maintDate.getFullYear() === currentYear
    );
  });
}




  private getMaintenancesForDay(dayKey: string): maintenance[] {
    return this.filteredMaintenances.filter(maint => 
      format(new Date(maint.dateDebutPrevue), 'yyyy-MM-dd') === dayKey
    );
  }
}  