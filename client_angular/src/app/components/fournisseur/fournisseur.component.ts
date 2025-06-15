import { Component, OnInit } from '@angular/core';
import { Fournisseur } from '../../models/Fournisseur';
import { FournisseurService } from '../../services/FournisseurService';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';






//@ts-ignore
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { contratService } from '../../services/contrat.service';
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-fournisseur',
  templateUrl: './fournisseur.component.html',
  styleUrls: ['./fournisseur.component.css']
})


export class ListeFournisseursComponent implements OnInit {
  viewMode: 'table' | 'card' = 'card'; // default to table
  selectedFournisseurToArchive: any = null;
  selectedFournisseurIds: number[] = [];
  fournisseurs: any[] = []; // adapte le type si t’as un modèle
  fournisseursInactifs: any[] = []; // adapte le type si t’as un modèle
  isArchived = false;
  isRestored = false;
  showTrash = false;
  isBulkArchived = false;
  isBulkRestored = false;
  fournisseurTaken = false;
  fournisseurTakenBulk = false;
  impossibleToArchive = false;
  bulkMode = false;
  searchTermNom = '';
  bulkRestoreError: string | null = null;
  gsmTakenError = false;
  emailTakenError = false;
  nomTakenError = false;
  filteredFournisseurs = [...this.fournisseurs];
  showAddSuccessMessage: boolean = false;
  showConfirmationModal: boolean = false;
  errorMessage: string = '';
  refTakenErrorMessage: string = '';
  showEditPanel: boolean = false;  // Toggle the visibility of the edit panel
  fournisseurUpdated: boolean = false;
  successMessage: string = '';
  isEditing: boolean = false;
  imageError: string | null = null;
  isEditMode = false;
fournisseurToEditId: number | null = null;
newFournisseurs: any = {};
selectedFiles: File | null = null;
showDeleteSuccessMessage = false;
showDetailsPanel = false;
selectedFournisseurId: number | null = null;
fournisseurId: number | null = null;
selectedFile: File | null = null;

  newFournisseur: {
    image: string;
    dateajout: string;
    codepostal: number;
    adresse: string;
    actif: boolean;
    telephone: string;
    id: number;
    type: string;
    nom: string;
    email: string
  } = {
    id: 0,
    nom: '',
    actif:true,
    adresse: '',
    telephone: '',
    email: '',
    codepostal: 0,
    image: '',
    type: 'MULTI_CATEGORIE',
    dateajout: ''
  };

  referenceTaken = false;
  selectedFournisseur: any = {};
  showEditSuccessMessage: boolean = false;

  showPanel = false;

  showAddContratForm = false;
contratForm!: FormGroup;
contrats: any[] = [];
selectedFileC: File | null = null;

  constructor(private fournisseurService: FournisseurService, private router: Router
    ,private http: HttpClient,private fb: FormBuilder,private  contratservice: contratService
  ) { }

  ngOnInit(): void {
    this.getFournisseurs();
    this.getInactifFournisseurs();
     this.contratForm = this.fb.group({
    numeroContrat: ['', Validators.required],
    type: ['', Validators.required],
    dateDebut: ['', Validators.required],
    dateFin: ['', Validators.required],
    montant: ['', Validators.required]
  });
  }

  onFileSelected(event: any): void {
  this.selectedFile = event.target.files[0];
}
onFileSelectedC(event: any): void {
  const file: File = event.target.files[0];
  if (file && file.type === 'application/pdf') {
    this.selectedFileC = file;
  } else {
    alert('Veuillez sélectionner un fichier PDF.');
  }
}

  isSelected(type: any): boolean {
    return this.selectedFournisseurIds.includes(type.id);
  }


showFournisseurDetails(fournisseur: Fournisseur) {
  this.selectedFournisseur = fournisseur;
  this.showDetailsPanel = true;
}

// Méthode pour fermer le panel
closeDetailsPanel() {
  this.showDetailsPanel = false;
}

  getFournisseurs(): void {
    this.fournisseurService.getAllFournisseurs().subscribe({
      next: (data) => {
        this.fournisseurs = data;
        this.filteredFournisseurs = data;
        console.log(this.fournisseurService.getAllFournisseurs())
      },
      error: (err) => {
        console.error('Error fetching fournisseurs:', err);
      }
    });
  }

  getInactifFournisseurs(): void {
    this.fournisseurService.getAllFournisseursInactifs().subscribe({
      next: (data) => {
        this.fournisseursInactifs = data;
        console.log(this.fournisseursInactifs);
      },
      error: (err) => {
        console.error('Error fetching fournisseurs:', err);
      }
    });
  }




  getImageUrl(imagePath: string | undefined): string {
    return `${environment.apiUrl}${imagePath}`;
  }

  toggleView(mode: 'table' | 'card') {
    this.viewMode = mode;
  }

  onFileSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

 addFournisseur() {
  const formData = new FormData();
  formData.append('nom', this.newFournisseur.nom);
formData.append('adresse', this.newFournisseur.adresse || '');
formData.append('codepostal', this.newFournisseur.codepostal ? this.newFournisseur.codepostal.toString() : '');
formData.append('email', this.newFournisseur.email || '');
formData.append('telephone', this.newFournisseur.telephone ? this.newFournisseur.telephone.toString() : '');
formData.append('type', this.newFournisseur.type|| '');


  if (this.selectedFile) {
    formData.append('file', this.selectedFile);
  }

  this.http.post('http://localhost:8080/api/fournisseurs', formData).subscribe({
    next: response => {
      console.log('Fournisseur ajouté avec succès', response);
      this.getFournisseurs();

    },
    error: error => {
      console.error('Erreur lors de l\'ajout du fournisseur', error);
      // Handle different types of errors
      if (error.status === 409 && error.error) {
        const field = error.error.field;
        const message = error.error.message;

        if (field === 'nom') {
          this.nomTakenError = true;
          this.errorMessage = message;
        } else if (field === 'email') {
          this.emailTakenError = true;
          this.errorMessage = message;
        } else if (field === 'telephone') {
          this.gsmTakenError = true;
          this.errorMessage = message;
        }
      } else {
        this.errorMessage = 'Une erreur s\'est produite lors de l\'ajout de l\'utilisateur.';
      }
    }
  });
}

  selectAll() {
    this.selectedFournisseurIds = this.fournisseursInactifs.map(service => service.id);
  }

  toggleSelection(id: number): void {
    const index = this.selectedFournisseurIds.indexOf(id);
    if (index > -1) {
      this.selectedFournisseurIds.splice(index, 1);
    } else {
      this.selectedFournisseurIds.push(id);
    }
  }

  toggleTrash() {
    this.showTrash = !this.showTrash;
    if (this.showTrash) {
      this.getInactifFournisseurs();
    }
    this.resetForm();
  }

  updateFournisseur(): void {
    // Check if a fournisseur is selected and has a valid ID
    if (!this.selectedFournisseur || this.selectedFournisseur.id === undefined) {
      this.errorMessage = 'Aucun fournisseur sélectionné pour la mise à jour !';
      return;
    }

    // Check for required fields
    const { nom, email, telephone } = this.selectedFournisseur;
    if (!nom || !email || !telephone) {
      this.errorMessage = 'Les champs nom, email et téléphone sont obligatoires.';
      return;
    }

    // Check if there's an error with the uploaded image
    if (this.imageError) {
      this.errorMessage = this.imageError;
      return;
    }

    // Optional image
    const fileToSend = this.selectedFile ?? undefined;

    // Call the service method
    this.fournisseurService.updateFournisseur(
      this.selectedFournisseur.id,
      {
        nom: this.selectedFournisseur.nom,
        email: this.selectedFournisseur.email,
        telephone: this.selectedFournisseur.telephone,
        adresse: this.selectedFournisseur.adresse,
        codepostal: this.selectedFournisseur.codepostal,
        type: this.selectedFournisseur.type,
      },
      fileToSend
    ).subscribe(
      (updatedFournisseur) => {
        // Update the fournisseur in the list
        const index = this.fournisseurs.findIndex(f => f.id === updatedFournisseur.id);
        if (index !== -1) {
          this.fournisseurs[index] = updatedFournisseur;
        }

        this.getFournisseurs();
        this.resetNewFournisseur();
        this.successMessage = 'Fournisseur mis à jour avec succès.';
        this.showEditPanel = false;
        this.fournisseurUpdated = true;

        setTimeout(() => {
          this.fournisseurUpdated = false;
        }, 3000);
      },
      (error) => {
        // Handle known errors
        if (error.status === 409 && error.error) {
          const field = error.error.field;
          const message = error.error.message;

          this.errorMessage = message || 'Un conflit est survenu.';
        } else if (error.status === 400) {
          this.errorMessage = 'Données invalides. Veuillez vérifier les champs.';
        } else if (error.status === 404) {
          this.errorMessage = 'Fournisseur introuvable.';
        } else {
          this.errorMessage = 'Échec de la mise à jour du fournisseur.';
        }
      }
    );
  }


  formatDateWithIntl(date: string | undefined): string {
    if (!date) {
      return 'Date non disponible'; // Or provide a default string if date is undefined
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return 'Invalid Date'; // Return fallback if date parsing fails
    }

    const formatter = new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
    return formatter.format(parsedDate);
  }



 resetForm(): void {
  this.newFournisseurs = {};
  this.selectedFiles = null;
  this.showPanel = false;
  this.isEditMode = false;
  this.fournisseurToEditId = null;
}


  enableEditing(): void {
    this.isEditing = true;
  }



  viewDetails(fournisseurId: number): void {
    this.fournisseurService.getFournisseurById(fournisseurId).subscribe({
      next: (fournisseur) => {
        this.selectedFournisseur = { ...fournisseur };
        this.showEditPanel = true;
        this.isEditing = false;
      },
      error: (err) => {
        console.error('Error fetching fournisseur details:', err);
      }
    });
  }

  closePanel(): void {
    this.showEditPanel = false;
    this.resetNewFournisseur();
  }

  openEditPanel(fournisseur: any): void {
    this.selectedFournisseur = { ...fournisseur };
    this.showEditPanel = true;


  }

openAddContratForm(fournisseur: Fournisseur) {
  this.selectedFournisseur = fournisseur;
  this.selectedFournisseurId = fournisseur?.id ?? null;
  this.showAddContratForm = true;
   this.contratForm.reset();
  // NE PAS faire reset ici
}


resetAddContratForm() {
  this.contratForm.reset();
  this.showAddContratForm = false;
  this.selectedFournisseurId = null;
}


cancelAddContrat() {
  this.resetAddContratForm();
}

submitContrat(): void {

   if (this.selectedFournisseurId == null) {
    console.error("fournisseurId est null, impossible d'envoyer le formulaire");
    return; // on arrête la soumission
  }
  if (this.contratForm.invalid) return;

  const formValues = this.contratForm.value;
  const formData = new FormData();

  formData.append('numeroContrat', formValues.numeroContrat);
  formData.append('type', formValues.type);
formData.append('dateDebut', new Date(formValues.dateDebut).toISOString().substring(0,10));
formData.append('dateFin', new Date(formValues.dateFin).toISOString().substring(0,10));

formData.append('montant', formValues.montant?.toString() ?? '');
formData.append('fournisseurId', this.selectedFournisseurId.toString());




  if (this.selectedFile) {
    formData.append('file', this.selectedFile);
  }

  this.contratservice.ajouterContrat1(formData).subscribe({
    next: (res) => {
      console.log('Contrat enregistré avec succès', res);
      // reset ou close modal
         this.loadContrats();

      // ✅ Réinitialise le formulaire et l’état
      this.contratForm.reset();
      this.selectedFileC = null;
      this.selectedFournisseurId = null;
    },

    error: (err) => {
      console.error('Erreur lors de l\'enregistrement', err);
    }
  });
}




loadContrats(): void {
  if (!this.selectedFournisseur) return;

  this.contratservice.getContratsByFournisseur(this.selectedFournisseur.id).subscribe({
    next: (data) => {
      this.contrats = data;
      console.log('Contrats chargés :', this.contrats);
    },
    error: (err) => {
      console.error('Erreur lors du chargement des contrats :', err);
    }
  });
}


  closeEditPanel(): void {
    this.selectedFournisseur = null;
  }

  filterFournisseursByName() {
    this.filteredFournisseurs = this.fournisseurs.filter(fournisseur =>
      fournisseur.nom.toLowerCase().includes(this.searchTermNom.toLowerCase())
    );
  }

  editFournisseur(fournisseur: any): void {
  this.isEditMode = true;
  this.fournisseurToEditId = fournisseur.id;
  this.newFournisseur = { ...fournisseur }; // copie pour éviter les modifications directes
  this.showPanel = true;
}

  resetNewFournisseur(): void {
    this.newFournisseur = {
      id: 0,
      nom: '',
     codepostal:0,
    actif: true,
      adresse: '',
      telephone: '',
      email: '',
      image: '',
       dateajout: '',
        type: 'MULTI_CATEGORIE'

    };
    this.referenceTaken = false;
  }

  onFileChange(event: any): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Vérifier le type de fichier (optionnel)
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        this.imageError = "Seuls les fichiers JPG, JPEG et PNG sont acceptés.";
        this.selectedFile = null;
        return;
      }

      // Vérifier la taille (ex: max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        this.imageError = "La taille de l'image ne doit pas dépasser 5MB.";
        this.selectedFile = null;
        return;
      }

      this.imageError = null; // Aucune erreur
      this.selectedFile = file;
    }
  }


  exportToExcel(): void {
    const worksheetData = this.fournisseurs.map(fournisseur => {
      return {
        'ID': fournisseur.id,
        'Nom': fournisseur.nom,

        'Adresse': fournisseur.adresse,
        'Téléphone': fournisseur.telephone,
        'Email': fournisseur.email,

      };
    });



    const headerStyle = {
      font: { bold: true, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: '2E7D32' } },
      alignment: { horizontal: 'center', vertical: 'center' },
      border: {
        top: { style: 'thin', color: { rgb: '000000' } },
        bottom: { style: 'thin', color: { rgb: '000000' } }
      }
    };

    const evenRowStyle = { fill: { fgColor: { rgb: 'E8F5E9' } } };
    const oddRowStyle = { fill: { fgColor: { rgb: 'C8E6C9' } } };

    const borderStyle = {
      border: {
        top: { style: 'thin', color: { rgb: '000000' } },
        bottom: { style: 'thin', color: { rgb: '000000' } },
        left: { style: 'thin', color: { rgb: '000000' } },
        right: { style: 'thin', color: { rgb: '000000' } }
      }
    };









}


  togglePanel(): void {
    this.showPanel = !this.showPanel;
    this.resetNewFournisseur();
  }


  // Dans votre composant fournisseur.component.ts

deleteFournisseur(fournisseurId: number): void {
  // Confirmation avant suppression
  const confirmation = confirm('Voulez-vous vraiment supprimer ce fournisseur ?');

  if (!confirmation) {
    return;
  }

  // Appel au service pour suppression
  this.fournisseurService.deleteFournisseur(fournisseurId).subscribe({
    next: () => {
      // Message de succès
      this.showDeleteSuccessMessage = true;

      // Recharger la liste des fournisseurs
      this.getFournisseurs();

      // Masquer le message après 3 secondes
      setTimeout(() => {
        this.showDeleteSuccessMessage = false;
      }, 3000);
    },
    error: (err) => {
      console.error('Erreur lors de la suppression:', err);
      // Vous pouvez ajouter ici un message d'erreur
    }
  });
}

  getTypeLabel(type: string): string {
    return this.typeLabels[type] || type;
  }

  typeLabels: { [key: string]: string } = {
    PIECES_DETACHEES: 'Fournisseur de pièces',
    EQUIPEMENTS_MEDICAUX: 'Fournisseur d’équipements médicaux',
    EQUIPEMENTS_HOSPITALIERS: 'Fournisseur d’équipements hospitaliers',
    CONSOMMABLES: 'Fournisseur de consommables',
    SERVICES_TECHNIQUES: 'Prestataire de services techniques',
    MULTI_CATEGORIE: 'Fournisseur polyvalent'
  };


  // Assumptions: fournisseurService, selectedFournisseurIds, fournisseursInactifs, getFournisseurs(), getInactifFournisseurs() already exist in your component.

  restaurerFournisseur(id: number): void {
    this.errorMessage = '';
    this.fournisseurService.restaurerFournisseur(id).subscribe(
      (response) => {
        console.log('Fournisseur restauré:', response);
        this.isRestored = true;
        this.getInactifFournisseurs();
        this.getFournisseurs();
        this.showTrash = false;
        this.resetForm();
        setTimeout(() => {
          this.isRestored = false;
        }, 3000);
      },
      (error) => {
        if (error.status === 409) {
          this.fournisseurTaken = true;
          this.errorMessage = 'Un fournisseur actif avec ce nom existe déjà!';
        }
      }
    );
  }

  restaurerFournisseursSelection(): void {
    this.errorMessage = '';
    if (this.selectedFournisseurIds.length === 0) return;

    this.bulkRestoreError = null;
    this.fournisseurService.restaurerMultipleFournisseurs(this.selectedFournisseurIds).subscribe(
      (response) => {
        this.isBulkRestored = true;
        this.getInactifFournisseurs();
        this.getFournisseurs();
        this.showTrash = false;
        this.resetForm();
        this.selectedFournisseurIds = [];
        setTimeout(() => {
          this.isBulkRestored = false;
        }, 3000);
      },
      (error) => {
        if (error.status === 409) {
          this.fournisseurTakenBulk = true;
          this.errorMessage = 'Un ou plusieurs fournisseurs actifs avec le même nom existent déjà!';
        }
      }
    );
  }

  archiverFournisseursSelection(): void {
    if (this.selectedFournisseurIds.length === 0) return;

    this.fournisseurService.archiverMultipleFournisseurs(this.selectedFournisseurIds).subscribe(
      (response) => {
        this.getInactifFournisseurs();
        this.getFournisseurs();
        this.selectedFournisseurIds = [];
        this.showTrash = false;
        this.isBulkArchived = true;
        this.errorMessage = '';
        setTimeout(() => {
          this.isBulkArchived = false;
        }, 3000);
      },
      (error) => {
        if (error.status === 400) {
          this.impossibleToArchive = true;
          this.errorMessage = error.error.message || "Impossible d’archiver ces fournisseurs.";
        } else {
          this.errorMessage = "Une erreur inattendue s'est produite. Veuillez réessayer.";
        }
      }
    );
  }

  archiverFournisseur(id: number): void {
    this.fournisseurService.archiverFournisseur(id).subscribe(
      (response) => {
        console.log('Fournisseur archivé:', response);
        this.isArchived = true;
        this.errorMessage = '';
        this.getInactifFournisseurs();
        this.getFournisseurs();
        this.showTrash = false;
        setTimeout(() => {
          this.isArchived = false;
        }, 3000);
      },
      (error) => {
        console.error('Erreur archivage fournisseur:', error);
        if (error.status === 400) {
          this.impossibleToArchive = true;
          this.errorMessage = error.error.message || "Impossible d’archiver ce fournisseur.";
        } else {
          this.errorMessage = "Une erreur inattendue s'est produite. Veuillez réessayer.";
        }
      }
    );
  }

  toggleBulkMode(): void {
    this.bulkMode = !this.bulkMode;
    if (!this.bulkMode) {
      this.selectedFournisseurIds = [];
    }
  }

  isSelectedFournisseur(f: any): boolean {
    return this.selectedFournisseurIds.includes(f.id);
  }

  toggleFournisseurSelection(id: number): void {
    const index = this.selectedFournisseurIds.indexOf(id);
    if (index > -1) {
      this.selectedFournisseurIds.splice(index, 1);
    } else {
      this.selectedFournisseurIds.push(id);
    }
  }

  selectAllFournisseurs(): void {
    this.selectedFournisseurIds = this.fournisseursInactifs.map(f => f.id);
  }

  resetFournisseurSelection(): void {
    this.selectedFournisseurIds = [];
  }


  protected readonly FournisseurService = FournisseurService;
}


