import { Component, OnInit } from '@angular/core';
import { PieceDetachee } from '../../../models/piece-detachee';
import { PieceDetacheeService } from '../../../services/piece-detachee.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-details-stock',
  templateUrl: './details-stock.component.html',
  styleUrl: './details-stock.component.css'
})
export class DetailsStockComponent implements OnInit {
  pieceDetachee: PieceDetachee | undefined;
  errorMessage: string = '';
  isEditMode: boolean = false;  // Mode édition

  constructor(
    private pieceDetacheeService: PieceDetacheeService,
    private route: ActivatedRoute,
    private router: Router  // Pour rediriger après mise à jour
  ) { }

  ngOnInit(): void {
    const pieceId = +this.route.snapshot.paramMap.get('id')!;  // Récupération de l'ID depuis l'URL
    this.fetchPieceDetails(pieceId);
  }

  fetchPieceDetails(id: number): void {
    this.pieceDetacheeService.getPieceDetacheeById(id).subscribe({
      next: (data) => {
        this.pieceDetachee = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des détails de la pièce :', err);
        this.errorMessage = 'Échec du chargement des détails';
      }
    });
  }

  // Activation du mode édition
  enableEditMode(): void {
    this.isEditMode = true;
  }
  
  saveChanges(): void {
    if (this.pieceDetachee) {
      this.pieceDetacheeService.updatePieceDetachee(this.pieceDetachee.id!, this.pieceDetachee).subscribe({
        next: (updatedUser) => {
          this.pieceDetachee = updatedUser;
          this.isEditMode = false;  // Disable edit mode after saving
          this.router.navigate(['/pieces']);  // Redirect after saving
        },
        error: (err) => {
          console.error('Error updating piece:', err);
          this.errorMessage = 'Failed to update piece details';
        }
      });
    }
  }

  
    }



