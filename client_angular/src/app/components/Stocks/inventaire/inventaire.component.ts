import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InventaireService } from '../../../services/inventaire.service';
import {User} from "../../../models/user";
import {UserService} from "../../../services/user.service";
import {PieceDetachee} from "../../../models/piece-detachee";
import {PieceDetacheeService} from "../../../services/piece-detachee.service";
import {Inventaire} from "../../../models/inventaire";
import {MaintenanceCorrective} from "../../../models/maintenance-corrective";

@Component({
  selector: 'app-inventaire',
  templateUrl: './inventaire.component.html',
  styleUrls: ['./inventaire.component.css']
})
export class InventaireComponent implements OnInit {
  editMode: boolean = false;
  selectedStatut: string = '';                // 'CORRIGE', 'NON_CORRIGE' or ''
  selectedResponsable: string = '';           // Text input for responsable name
  startDate: string = '';                     // e.g. '2024-01-01'
  endDate: string = '';                     // e.g. '2024-01-01'
  selectedInventaire: any = null;
  currentPage: number = 1;
  itemsPerPage: number = 3;
  totalItems: number = 0;
  inventaireToEditId: number | null = null;
  showUpdatePanel: boolean = false;
  users: User[] = [];
  pieces_detachees: PieceDetachee[] = [];
  inventaires: any[] = [];
  filteredInventaires: any[] = [];
  newInventaire: any = {
    responsable: { id: null },
    lignes: []
  };
  errorMessage: string = '';
  inventaireAdded: boolean = false;
  showAddPanel: boolean = false;
  currentUser: User | null = null;  // To store the current logged-in user
  constructor(private router: Router, private inventaireService: InventaireService, private userService: UserService,private pieceDetacheeService: PieceDetacheeService) {}

  ngOnInit(): void {
    this.getInventaires();
    this.fetchUsers();
    this.fetchPieces();
    this.setCurrentUser();
  }

  setCurrentUser(): void {
    const user = localStorage.getItem('user');
    if (user) {
      this.currentUser = JSON.parse(user); // Parse the stored user info
      // Check if currentUser is valid before accessing 'nom'
      if (this.currentUser && this.currentUser.id) {
        this.newInventaire.responsableId = this.currentUser.id;
        console.log(this.currentUser.id);
      } else {
        console.error("User object does not contain a valid 'nom'.");
      }
    } else {
      console.error("No user found in localStorage.");
    }
  }

  corrigerStock(inventaireId: number): void {
    if (confirm("⚠️ Êtes-vous sûr de vouloir corriger le stock selon cet inventaire ?")) {
      this.inventaireService.corrigerStock(inventaireId).subscribe({
        next: () => {
          alert("✅ Stock corrigé avec succès !");

          this.getInventaires(); // refresh list if needed
        },
        error: (error) => {
          console.error("Erreur de correction de stock :", error);
          alert("❌ Une erreur est survenue lors de la correction du stock.");
        }
      });
    }
  }

  applyInventaireFilters(): void {
    let filtered = this.inventaires.filter(inv => {
      const matchesStatut = this.selectedStatut ? inv.statut === this.selectedStatut : true;
      const matchesResponsable = this.selectedResponsable
        ? inv.responsableNom.toLowerCase().includes(this.selectedResponsable.toLowerCase())
        : true;
      const matchesDate = (this.startDate && this.endDate)
        ? new Date(inv.dateInventaire) >= new Date(this.startDate) &&
        new Date(inv.dateInventaire) <= new Date(this.endDate)
        : true;

      return matchesStatut && matchesResponsable && matchesDate;
    });

    this.filteredInventaires=filtered;

}

  openAddModal() {
    this.showAddPanel = true;
  }

  fetchPieces(): void {
    this.pieceDetacheeService.getAllPiecesDetachees().subscribe({
      next: (data) => {
        this.pieces_detachees = data;

      },
      error: (err) => {
        console.error('Error fetching Pieces:', err);
      }
    });
  }

  addLigne(): void {
    this.newInventaire.lignes.push({
      pieceId: null,
      stockPhysique: 0
    });
  }

  removeLigne(index: number): void {
    this.newInventaire.lignes.splice(index, 1);
  }

  fetchUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (err) => {
        console.error('Error fetching users:', err);
        this.errorMessage = 'Failed to load users';
      }
    });
  }

  getInventaires(): void {
    this.inventaireService.getAllInventaires().subscribe(data => {
      // Inject showDetails field into each inventaire for toggle functionality
      this.inventaires = data.map((inv: any) => ({
        ...inv,
        showDetails: false
      }));
      this.filteredInventaires = [...this.inventaires];
      console.log('Inventaires chargés:', this.inventaires);
    });
  }

  resetForm(): void {
    this.newInventaire = {
      responsable: { id: null },
      lignes: []
    };
    this.showAddPanel = false;
  }

  addInventaire(): void {
    this.errorMessage = '';

    // 🖨️ Log the data being sent to the backend
    console.log('Données envoyées pour l\'ajout d\'un inventaire :', this.newInventaire);
this.setCurrentUser();
    this.inventaireService.addInventaire(this.newInventaire).subscribe(
      (savedInventaire) => {
        console.log('✅ Inventaire ajouté avec succès:', savedInventaire);
        this.getInventaires(); // Refresh full list
        this.inventaireAdded = true;
        this.resetForm();
      },
      (error) => {
        console.error('❌ Erreur lors de l\'ajout de l\'inventaire:', error);
        if (error.status !== 200) {
          this.errorMessage = 'Un inventaire avec ces informations existe déjà.';
        }
      }
    );
  }

  openEditPanel(inv: any): void {
    this.selectedInventaire = {
      id: inv.id,
      responsableId: inv.responsableId,
      lignes: inv.lignes.map((ligne: any) => ({
        pieceId: ligne.pieceId,
        stockPhysique: ligne.stockPhysique,
        commentaire: ligne.commentaire
      }))
    };

    this.showUpdatePanel = true;
  }

  updateInventaire(): void {
    this.errorMessage = '';

    if (!this.selectedInventaire?.id) {
      this.errorMessage = 'Aucun inventaire sélectionné pour la mise à jour.';
      return;
    }

    const dto = {
      responsableId: this.selectedInventaire.responsableId ?? this.selectedInventaire.responsable?.id ?? null,
      lignes: this.selectedInventaire.lignes?.map((ligne: any) => ({
        id: ligne.id,
        pieceId: ligne.pieceId,
        stockPhysique: ligne.stockPhysique,
        commentaire: ligne.commentaire || ''
      }))
    };

    console.log('🛠️ Sending update for ID:', this.selectedInventaire.id);
    console.table(dto.lignes); // tabular view for better debug
    console.log('👤 Responsable ID:', dto.responsableId);

    this.inventaireService.updateInventaire(this.selectedInventaire.id, dto).subscribe({
      next: (updated) => {
        console.log('✅ Update success:', updated);
        this.getInventaires();
        this.selectedInventaire = null;
        this.showUpdatePanel = false;
      },
      error: (err) => {
        console.error('❌ Update failed:', err);
        this.errorMessage = 'Erreur lors de la mise à jour.';
      }
    });
  }

  addLigneToUpdate(): void {
    if (this.selectedInventaire) {
      this.selectedInventaire.lignes.push({ pieceId: null, stockPhysique: null });
    }
  }

  removeLigneFromUpdate(index: number): void {
    if (this.selectedInventaire) {
      this.selectedInventaire.lignes.splice(index, 1);
    }
  }


  toggleDetails(inv: any): void {
    inv.showDetails = !inv.showDetails;
  }

  formatDateWithIntl(date: string | undefined): string {
    if (!date) return 'Date non disponible';

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return 'Date invalide';

    const formatter = new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });

    return formatter.format(parsedDate);
  }



  protected readonly Math = Math;
}
