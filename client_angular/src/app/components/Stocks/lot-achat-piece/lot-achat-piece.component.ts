import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AchatPiece } from "../../../models/achatPiece";
import { AchatPieceService } from "../../../services/achat-piece.service";
import {PieceDetacheeService} from "../../../services/piece-detachee.service";

@Component({
  selector: 'app-lot-achat-piece',
  templateUrl: './lot-achat-piece.component.html',
  styleUrls: ['./lot-achat-piece.component.css']
})
export class LotAchatPieceComponent implements OnInit {
  achatToDelete!: AchatPiece | null;
  filterDate: string | null = null;
  showDeleteModal = false;
  showPanel: boolean = false;
  showAddSuccessMessage: boolean = false;
  showEditSuccessMessage: boolean = false;
  pieceId!: number;
  achats: AchatPiece[] = [];
  newAchat: AchatPiece = {
    pieceId: 0,
    dateAchat: '',
    quantite: 0,
    coutUnitaire: 0
  };

  updatedAchat: Partial<AchatPiece> = {
    dateAchat: '', // Initialize with default values or empty strings
    quantite: 0,
    coutUnitaire: 0
  };

  selectedPiece: any = {};
  selectedAchat: any = {};  // To hold the selected achat

  showEditModal: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private achatPieceService: AchatPieceService,
    private pieceDetacheeService: PieceDetacheeService,
  ) {}

  ngOnInit(): void {
    // 🔥 Grab the pieceId from route params
    this.pieceId = Number(this.route.snapshot.paramMap.get('pieceId'));
    console.log('🧩 Received pieceId:', this.pieceId);

    // ✅ Initialize pieceId in the form and load existing achats
    this.newAchat.pieceId = this.pieceId;
    this.loadAchatsForPiece(this.pieceId);

    this.pieceDetacheeService.getPieceDetacheeById(this.pieceId).subscribe({
      next: (piece) => {
        this.selectedPiece = { ...piece };
      }
    });
  }

  getMontantTotal(achat: any): string {
    const total = achat.quantite * achat.coutUnitaire;
    return total.toFixed(2) + ' MAD';
  }


  ajouterAchat(): void {
    this.achatPieceService.ajouterAchat(this.newAchat).subscribe({
      next: (res) => {
        console.log('✅ Achat ajouté:', res);
        this.loadAchatsForPiece(this.pieceId);
        this.resetForm();
        this.showPanel=false;
        this.showAddSuccessMessage = true;
        setTimeout(() => {
          this.showAddSuccessMessage = false;
        }, 3000);
      },
      error: (err) => console.error('❌ Erreur ajout achat:', err)
    });
  }


  openEditModal(achat: AchatPiece): void {
    this.selectedAchat = { ...achat };  // Copy the data to selectedAchat
    this.showEditModal = true;
  }

  // Close modal without making changes
  closeEditModal(): void {
    this.showEditModal = false;
  }

// Handle updating the Achat
  updateAchat(): void {
    // Ensure you pass the necessary fields (dateAchat, quantite, coutUnitaire) separately
    this.achatPieceService.updateAchat(
      this.selectedAchat.id,          // achatId
      this.selectedAchat.dateAchat,   // dateAchat
      this.selectedAchat.quantite,    // quantite
      this.selectedAchat.coutUnitaire // coutUnitaire
    ).subscribe({
      next: (res) => {
        console.log('✅ Achat mis à jour:', res);
        this.loadAchatsForPiece(this.pieceId); // Optionally reload or refresh the list
        this.closeEditModal();
        this.showEditSuccessMessage = true;
        setTimeout(() => {
          this.showEditSuccessMessage = false;
        }, 3000);
      },
      error: (err) => console.error('❌ Erreur mise à jour achat:', err)
    });
  }

  confirmDelete(achat: AchatPiece): void {
    this.achatToDelete = achat;
    this.showDeleteModal = true;
  }

// Cancel delete
  cancelDelete(): void {
    this.achatToDelete = null;
    this.showDeleteModal = false;
  }

  filteredAchats() {
    if (!this.filterDate) return this.achats;

    return this.achats.filter(achat => {
      const achatDate = new Date(achat.dateAchat).toISOString().split('T')[0];
      return achatDate === this.filterDate;
    });
  }

  clearDateFilter() {
    this.filterDate = null;
  }

// Perform deletion
  deleteAchatConfirmed(): void {
    if (!this.achatToDelete) return;

    this.achatPieceService.deleteAchat(this.achatToDelete.id!).subscribe({
      next: () => {
        console.log('🗑️ Achat supprimé');
        this.loadAchatsForPiece(this.pieceId); // Refresh list
        this.showDeleteModal = false;
        this.achatToDelete = null;
      },
      error: (err) => {
        console.error('❌ Erreur suppression achat:', err);
        this.showDeleteModal = false;
      }
    });
  }

  loadAchatsForPiece(pieceId: number): void {
    this.achatPieceService.getAchatsByPieceId(pieceId).subscribe({
      next: (data) => {
        this.achats = data;
        console.log('📦 Achats chargés:', data);
      },
      error: (err) => console.error('❌ Erreur chargement achats:', err)
    });
  }

  resetForm(): void {
    this.newAchat = {
      pieceId: this.pieceId, // Keep the current pieceId!
      dateAchat: '',
      quantite: 0,
      coutUnitaire: 0
    };
  }
}
