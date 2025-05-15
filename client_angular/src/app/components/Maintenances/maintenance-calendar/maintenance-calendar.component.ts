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

    // Création du contenu du message
    const message = `
      <div style="font-size: 16px; font-family: Arial, sans-serif; line-height: 1.6;">
        <strong>Maintenance:</strong> ${maint.id}<br/>
        <strong>Statut:</strong> ${this.translateStatus(maint.statut)}<br/>
        <strong>Équipement:</strong> ${maint.equipementId || 'N/A'}<br/>
        <strong>Date début:</strong> ${this.formatDate(new Date(maint.dateDebutPrevue))}<br/>
        <strong>Date fin:</strong> ${this.formatDate(new Date(maint.dateFinPrevue))}<br/>
        <strong>Priorité:</strong> ${maint.priorite}<br/>
        <strong>Action:</strong> ${maint.action || 'N/A'}<br/>
        <strong>Type de répétition:</strong> ${maint.repetitiontype || 'N/A'}<br/>
        <strong>Commentaires:</strong> ${maint.commentaires || 'Aucun'}
      </div>
    `;

    // Création de la boîte de dialogue
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

    // Boutons
    const createButton = (text: string, icon: string, color: string, onClick: () => void) => {
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
    };

    const buttonContainer = document.createElement('div');
    Object.assign(buttonContainer.style, {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '10px',
      marginTop: '20px'
    });

    // Bouton Modifier (ouvre l'édition)
    const editButton = createButton('Modifier', 'fa-edit', '#2196F3', () => {
      alertDiv.remove();
      this.openEditForm(maint); // ← Appel de votre méthode d'édition
    });

    // Bouton OK (ferme le popup)
    const okButton = createButton('OK', 'fa-check', '#4CAF50', () => {
      alertDiv.remove();
    });

    buttonContainer.append(editButton, okButton);
    alertDiv.appendChild(buttonContainer);
    document.body.appendChild(alertDiv);

    // Charge Font Awesome si nécessaire
    this.loadFontAwesome();
}

/**
 * Ouvre un formulaire de modification
 */
// Modifiez votre handleEventClick pour utiliser le formulaire
openEditForm(maintenance: any): void {
  // Création du conteneur du formulaire
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

  // Création du formulaire
  const form = document.createElement('form');
  form.style.backgroundColor = 'white';
  form.style.padding = '20px';
  form.style.borderRadius = '8px';
  form.style.width = '80%';
  form.style.maxWidth = '600px';
  form.style.maxHeight = '90vh';
  form.style.overflowY = 'auto';

  // Titre
  const title = document.createElement('h2');
  title.textContent = 'Modifier la Maintenance';
  title.style.marginBottom = '20px';
  title.style.color = '#333';
  form.appendChild(title);

  // Fonction pour créer des champs de formulaire
  const createFormField = (labelText: string, fieldName: string, value: any, type = 'text') => {
    const div = document.createElement('div');
    div.style.marginBottom = '15px';

    const label = document.createElement('label');
    label.textContent = labelText;
    label.style.display = 'block';
    label.style.marginBottom = '5px';
    label.style.fontWeight = 'bold';

    let input: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    
    if (type === 'textarea') {
      input = document.createElement('textarea');
      input.rows = 3;
    } else if (type === 'select') {
      input = document.createElement('select');
    } else {
      input = document.createElement('input');
      input.type = type;
    }

    input.name = fieldName;
    input.value = value || '';
    input.style.width = '100%';
    input.style.padding = '8px';
    input.style.border = '1px solid #ddd';
    input.style.borderRadius = '4px';

    div.appendChild(label);
    div.appendChild(input);

    return { container: div, input };
  };

  // Champs du formulaire
  const fields = [
    { label: 'Statut', name: 'statut', value: maintenance.statut, type: 'select' },
    { label: 'Date Début Prévue', name: 'dateDebutPrevue', value: this.formatDateForInput(maintenance.dateDebutPrevue), type: 'datetime-local' },
    { label: 'Date Fin Prévue', name: 'dateFinPrevue', value: this.formatDateForInput(maintenance.dateFinPrevue), type: 'datetime-local' },
    { label: 'Priorité', name: 'priorite', value: maintenance.priorite, type: 'select' },
    { label: 'Action', name: 'action', value: maintenance.action, type: 'textarea' },
    { label: 'Commentaires', name: 'commentaires', value: maintenance.commentaires, type: 'textarea' }
  ];

  const formInputs: {[key: string]: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement} = {};

  fields.forEach(field => {
    const { container, input } = createFormField(field.label, field.name, field.value, field.type);
    
    // Gestion spéciale pour les selects
    if (field.type === 'select') {
      const select = input as HTMLSelectElement;
      
      if (field.name === 'statut') {
        ['EN_COURS', 'EN_ATTENTE','TERMINEE', 'ANNULEE'].forEach(option => {
          const optElement = document.createElement('option');
          optElement.value = option;
          optElement.textContent = option;
          select.appendChild(optElement);
        });
      } else if (field.name === 'priorite') {
        ['URGENTE', 'FAIBLE', 'NORMALE'].forEach(option => {
          const optElement = document.createElement('option');
          optElement.value = option;
          optElement.textContent = option;
          select.appendChild(optElement);
        });
      }
    }
    
    formInputs[field.name] = input;
    form.appendChild(container);
  });

  // Boutons
  const buttonContainer = document.createElement('div');
  buttonContainer.style.display = 'flex';
  buttonContainer.style.justifyContent = 'flex-end';
  buttonContainer.style.gap = '10px';
  buttonContainer.style.marginTop = '20px';

  // Bouton Enregistrer
  const saveButton = document.createElement('button');
  saveButton.textContent = 'Enregistrer';
  saveButton.style.padding = '10px 20px';
  saveButton.style.backgroundColor = '#4CAF50';
  saveButton.style.color = 'white';
  saveButton.style.border = 'none';
  saveButton.style.borderRadius = '4px';
  saveButton.style.cursor = 'pointer';
  saveButton.onclick = (e) => {
    e.preventDefault();
    this.saveMaintenance(maintenance.id, formInputs);
    formContainer.remove();
  };

  // Bouton Annuler
  const cancelButton = document.createElement('button');
  cancelButton.textContent = 'Annuler';
  cancelButton.style.padding = '10px 20px';
  cancelButton.style.backgroundColor = '#f44336';
  cancelButton.style.color = 'white';
  cancelButton.style.border = 'none';
  cancelButton.style.borderRadius = '4px';
  cancelButton.style.cursor = 'pointer';
  cancelButton.onclick = (e) => {
    e.preventDefault();
    formContainer.remove();
  };

  buttonContainer.appendChild(cancelButton);
  buttonContainer.appendChild(saveButton);
  form.appendChild(buttonContainer);

  formContainer.appendChild(form);
  document.body.appendChild(formContainer);
}

private formatDateForInput(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().slice(0, 16);
}

private saveMaintenance(id: number, inputs: any): void {
 const updatedMaintenance: Partial<maintenance> = {
  statut: inputs.statut.value,
  dateDebutPrevue: inputs.dateDebutPrevue.value,
  dateFinPrevue: inputs.dateFinPrevue.value,
  priorite: inputs.priorite.value,
  action: inputs.action.value,
  commentaires: inputs.commentaires.value
};


  this.maintenanceService.updateMaintenance(id, updatedMaintenance).subscribe({
    next: (res) => {
      alert('Maintenance mise à jour avec succès ✅');
      // Optionnel : recharger les maintenances ou rafraîchir le calendrier ici
    },
    error: (err) => {
      console.error('Erreur lors de la mise à jour :', err);
      alert('❌ Échec de la mise à jour.');
    }
  });
}


/**
 * Charge dynamiquement Font Awesome
 */
loadFontAwesome(): void {
  if (!document.querySelector('link[href*="font-awesome"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
    document.head.appendChild(link);
  }
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