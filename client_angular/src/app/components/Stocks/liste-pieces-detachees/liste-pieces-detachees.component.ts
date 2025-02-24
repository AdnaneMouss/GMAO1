import { Component, OnInit } from '@angular/core';
import { PieceDetacheeService } from '../../../services/piece-detachee.service';
import { PieceDetachee } from '../../../models/piece-detachee';

@Component({
  selector: 'app-liste-pieces-detachees',
  templateUrl: './liste-pieces-detachees.component.html',
  styleUrl: './liste-pieces-detachees.component.css'
})
export class ListePiecesDetacheesComponent  implements OnInit {
    
  pieces_detachees: PieceDetachee[] = [];

newPiece: PieceDetachee = {
  id: 0,
  nom: '',
  description: '',
  reference: '',
  fournisseur: '',
  coutUnitaire: 0,
  quantiteStock: 0,
  quantiteMinimale: 0,
  dateAchat: new Date().toISOString().split('T')[0], // Format YYYY-MM-DD
  datePeremption: '',
  historiqueUtilisation: '',
  
};

  showPanel = false;

  constructor(private PieceDetacheeService: PieceDetacheeService) { }
  ngOnInit(): void {
    this.fetchPieces();
  }
  fetchPieces(): void {
    this.PieceDetacheeService.getAllPiecesDetachees().subscribe({
      next: (data) => {
        this.pieces_detachees = data;
        console.log(this.PieceDetacheeService.getAllPiecesDetachees())
      },
      error: (err) => {
        console.error('Error fetching Pieces:', err);
      }
    });
  }
     addPiece(): void {
        this.PieceDetacheeService.createPieceDetachee(this.newPiece).subscribe({
          next: () => {
            alert('Pièce ajoutée avec succès.');
            this.fetchPieces();
            this.resetNewPiece();
            this.showPanel = false;
          },
          error: (err) => {
            console.error('Erreur lors d ajout de la pièce:', err);
          }
        });
      }
      resetNewPiece(): void {
        this.newPiece = {
          id: 0,
          nom: '',
          description: '',
          reference: '',
          fournisseur: '',
          coutUnitaire: 0,
          quantiteStock: 0,
          quantiteMinimale: 0,
          dateAchat: new Date().toISOString().split('T')[0], // Format YYYY-MM-DD
          datePeremption: '',
          historiqueUtilisation: ''

          
      };
      
    }
    
  togglePanel(): void {
    this.showPanel = !this.showPanel;
  }
  
  deletePiece(id: number): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la pièce avec l'ID ${id} ?`)) {
        this.PieceDetacheeService.deletePieceDetachee(id).subscribe({
            next: () => {
                this.fetchPieces();
                alert('Pièce supprimée avec succès.');
            },
            error: (err) => {
                console.error('Erreur lors de la suppression de la pièce :', err);
            }
        });
    }
}




}
