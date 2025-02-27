import { Component, OnInit } from '@angular/core';
import { PieceDetacheeService } from '../../../services/piece-detachee.service';
import { PieceDetachee } from '../../../models/piece-detachee';
import * as XLSX from 'xlsx';
//@ts-ignore
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-liste-pieces-detachees',
  templateUrl: './liste-pieces-detachees.component.html',
  styleUrl: './liste-pieces-detachees.component.css'
})
export class ListePiecesDetacheesComponent  implements OnInit {

  pieces_detachees: PieceDetachee[] = [];
  searchTermNom = '';
  filteredPiecesDetachees = [...this.pieces_detachees];

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
  image:''

};
referenceTaken = false; // Variable pour gérer l'état de la référence

// Méthode pour vérifier si la référence est unique
checkReferenceUniqueness(reference: string): boolean {
  return this.pieces_detachees.some(piece => piece.reference === reference);
}

  showPanel = false;

  constructor(private PieceDetacheeService: PieceDetacheeService) { }
  ngOnInit(): void {
    this.fetchPieces();
  }
  fetchPieces(): void {
    this.PieceDetacheeService.getAllPiecesDetachees().subscribe({
      next: (data) => {
        this.pieces_detachees = data;
        this.filteredPiecesDetachees=data;
        console.log(this.PieceDetacheeService.getAllPiecesDetachees())
      },
      error: (err) => {
        console.error('Error fetching Pieces:', err);
      }
    });
  }
  addPiece(): void {
    // Vérifier si la référence est unique avant d'ajouter la pièce
    const referenceExistante = this.pieces_detachees.some(piece => piece.reference === this.newPiece.reference);

    if (referenceExistante) {
        alert('Cette référence existe déjà. Veuillez entrer une référence unique.');
        return; // Ne pas procéder si la référence existe déjà
    }

    // Si la référence est unique, procéder à l'ajout de la pièce
    this.PieceDetacheeService.createPieceDetachee(this.newPiece).subscribe({
        next: () => {
            alert('Pièce ajoutée avec succès.');
            this.fetchPieces(); // Rafraîchir la liste des pièces
            this.resetNewPiece(); // Réinitialiser le formulaire
            this.showPanel = false; // Fermer le panneau
        },
        error: (err) => {
            console.error('Erreur lors de l\'ajout de la pièce:', err);
        }
    });
}


  filterPiecesDetacheesByName() {
    this.filteredPiecesDetachees = this.pieces_detachees.filter(piece =>
      piece.nom.toLowerCase().includes(this.searchTermNom.toLowerCase())
    );
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
          historiqueUtilisation: '',
          image:''

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

  exportToExcel(): void {
    // Create data with the piece attributes
    const worksheetData = this.pieces_detachees.map(piece => {
      const rowData: any = {
        'ID': piece.id,
        'Nom': piece.nom,
        'Description': piece.description,
        'Référence': piece.reference,
        'Fournisseur': piece.fournisseur,
        'Coût Unitaire (€)': piece.coutUnitaire,
        'Quantité en Stock': piece.quantiteStock,
        'Quantité Minimale': piece.quantiteMinimale,
        'Date Achat': piece.dateAchat,
        'Date Péremption': piece.datePeremption,
        'Historique Utilisation': piece.historiqueUtilisation,
        'Image': piece.image,
      };
      return rowData;
    });

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);

    // Define header styles (dark green background, white bold text)
    const headerStyle = {
      font: { bold: true, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: '2E7D32' } }, // Dark Green
      alignment: { horizontal: 'center', vertical: 'center' },
      border: {
        top: { style: 'thin', color: { rgb: '000000' } },
        bottom: { style: 'thin', color: { rgb: '000000' } }
      }
    };

    // Define alternate row colors
    const evenRowStyle = { fill: { fgColor: { rgb: 'E8F5E9' } } }; // Light Green
    const oddRowStyle = { fill: { fgColor: { rgb: 'C8E6C9' } } }; // Slightly Darker Green

    // Define border style for all cells
    const borderStyle = {
      border: {
        top: { style: 'thin', color: { rgb: '000000' } },
        bottom: { style: 'thin', color: { rgb: '000000' } },
        left: { style: 'thin', color: { rgb: '000000' } },
        right: { style: 'thin', color: { rgb: '000000' } }
      }
    };

    // Get range of the sheet
    const range = XLSX.utils.decode_range(worksheet['!ref'] || '');

    // Apply styles
    for (let col = range.s.c; col <= range.e.c; col++) {
      const headerCell = XLSX.utils.encode_cell({ r: 0, c: col });
      if (worksheet[headerCell]) {
        worksheet[headerCell].s = headerStyle;
      }
    }

    // Apply styles to each row (alternating colors)
    for (let row = 1; row <= range.e.r; row++) {
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cell = XLSX.utils.encode_cell({ r: row, c: col });
        if (worksheet[cell]) {
          worksheet[cell].s = {
            ...borderStyle,
            ...(row % 2 === 0 ? evenRowStyle : oddRowStyle)
          };
        }
      }
    }

    // Adjust column widths
    worksheet['!cols'] = [
      { wch: 5 },  // ID
      { wch: 20 }, // Nom
      { wch: 30 }, // Description
      { wch: 15 }, // Référence
      { wch: 20 }, // Fournisseur
      { wch: 15 }, // Coût Unitaire (€)
      { wch: 15 }, // Quantité en Stock
      { wch: 15 }, // Quantité Minimale
      { wch: 15 }, // Date Achat
      { wch: 15 }, // Date Péremption
      { wch: 25 }, // Historique Utilisation
      { wch: 15 }, // Image
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Pieces');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'pieces_professionnel.xlsx');
  }



}
