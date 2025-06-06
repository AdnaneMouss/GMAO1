import { Component, OnInit } from '@angular/core';
import { Fournisseur } from '../../models/Fournisseur';
import { FournisseurService } from '../../services/FournisseurService';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';






//@ts-ignore
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { contratService } from '../../services/contrat.service';

@Component({
  selector: 'app-fournisseur',
  templateUrl: './fournisseur.component.html',
  styleUrls: ['./fournisseur.component.css']
})


export class ListeFournisseursComponent implements OnInit {

  fournisseurs: Fournisseur[] = [];
  searchTermNom = '';
  filteredFournisseurs = [...this.fournisseurs];
  showAddSuccessMessage: boolean = false;
  selectedFile: File = new File([], "");
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

  newFournisseur: Fournisseur = {
    id: 0,
    nom: '',

    adresse: '',
    telephone: '',
    email: '',
    codepostal: 0,
    image: '',
    type: 'pharmaceutique',
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
    this.fetchFournisseurs();
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


showFournisseurDetails(fournisseur: Fournisseur) {
  this.selectedFournisseur = fournisseur;
  this.showDetailsPanel = true;
}

// Méthode pour fermer le panel
closeDetailsPanel() {
  this.showDetailsPanel = false;
}

  fetchFournisseurs(): void {
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
      this.fetchFournisseurs();
         this.showPanel=false;
    },
    error: error => {
      console.error('Erreur lors de l\'ajout du fournisseur', error);
    }
  });
}

updateFournisseur(): void {
  const formData = new FormData();
  formData.append('nom', this.newFournisseur.nom || '');
  formData.append('adresse', this.newFournisseur.adresse || '');
  formData.append('codepostal', this.newFournisseur.codepostal !== undefined && this.newFournisseur.codepostal !== null
    ? this.newFournisseur.codepostal.toString()
    : '');
  formData.append('email', this.newFournisseur.email || '');
  formData.append('telephone', this.newFournisseur.telephone || '');
  formData.append('type', this.newFournisseur.type|| '');

  if (this.selectedFile) {
    formData.append('file', this.selectedFile);
  }

  if (!this.fournisseurToEditId) {
    console.error('Aucun fournisseur sélectionné pour la mise à jour');
    return;
  }

  this.fournisseurService.updateFournisseur(this.fournisseurToEditId, formData).subscribe({
    next: () => {
      console.log('Fournisseur mis à jour avec succès');
      this.fetchFournisseurs();
      this.showEditSuccessMessage = true;
      this.showPanel = false;
      this.isEditMode = false;
    },
    error: (err) => {
      console.error('Erreur de mise à jour', err);
    }
  });
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
    
      adresse: '',
      telephone: '',
      email: '',
      image: '',
       dateajout: '',
        type: 'pharmaceutique'
     
    };
    this.referenceTaken = false;
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
      this.fetchFournisseurs();
      
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
    'pharmaceutique': 'Produits pharmaceutiques',
    'equipement': 'Équipements médicaux',
    'consommable': 'Consommables stériles',
    'service': 'Services médicaux',
    'logistique': 'Logistique hospitalière'
  };
}


