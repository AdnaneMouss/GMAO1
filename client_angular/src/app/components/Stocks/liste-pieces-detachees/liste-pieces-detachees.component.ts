import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PieceDetacheeService } from '../../../services/piece-detachee.service';
import { PieceDetachee } from '../../../models/piece-detachee';
import * as XLSX from 'xlsx';
//@ts-ignore
import { saveAs } from 'file-saver';
import {environment} from "../../../../environments/environment";
import {AchatPieceService} from "../../../services/achat-piece.service";
@Component({
  selector: 'app-liste-pieces-detachees',
  templateUrl: './liste-pieces-detachees.component.html',
  styleUrl: './liste-pieces-detachees.component.css'
})
export class ListePiecesDetacheesComponent  implements OnInit {

  pieces_detachees: PieceDetachee[] = [];
  searchTermNom = '';
  filteredPiecesDetachees = [...this.pieces_detachees];
  showAddSuccessMessage: boolean = false;
  selectedFile: File = new File([], "");
  errorMessage: string='';
  refTakenErrorMessage: string = '';
  showEditPanel: boolean = false;  // Toggle the visibility of the edit panel
  pieceUpdated: boolean = false;
  successMessage: string = '';
  isEditing: boolean = false;
  imageError: string | null = null;
  isAddingLot: { [key: number]: boolean } = {};  // Pour suivre l'état d'affichage du formulaire pour chaque pièce


  newAchat: any = {  // Object to store new achat data
    dateAchat: '',
    quantite: 0,
    coutUnitaire: 0
  };
  newPiece: PieceDetachee = {
  id: 0,
  nom: '',
  description: '',
  reference: '',
  fournisseur: '',
  quantiteMinimale: 0,
  historiqueUtilisation: '',
  image:''

};
referenceTaken = false;
selectedPiece: any = {};
  showEditSuccessMessage: boolean = false;

  showPanel = false;

  constructor(private PieceDetacheeService: PieceDetacheeService, private AchatPieceService: AchatPieceService, private router: Router) { }
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

  onFileSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }


  addLotAchat(pieceId: number): void {
    const { dateAchat, quantite, coutUnitaire } = this.newAchat;
    if (!dateAchat || quantite <= 0 || coutUnitaire <= 0) {
      this.errorMessage = "Tous les champs doivent être remplis avec des valeurs valides.";
      return;
    }

    // Call the service to add a new purchase lot
    this.AchatPieceService.ajouterAchat({
      pieceId,
      dateAchat,
      quantite,
      coutUnitaire
    }).subscribe({
      next: (result) => {
        this.successMessage = "Lot d'achat ajouté avec succès!";
        this.newAchat = { dateAchat: '', quantite: 0, coutUnitaire: 0 }; // Clear form
        this.fetchPieces();  // Re-fetch the pieces to update the UI
      },
      error: (err) => {
        console.error("Erreur lors de l'ajout du lot", err);
        this.errorMessage = 'Erreur lors de l\'ajout du lot.';
      }
    });
  }

  // Select a piece to manage
  selectPiece(piece: any): void {
    this.selectedPiece = piece;
    this.showEditPanel = true;
  }

  toggleLotForm(pieceId: number): void {
    this.isAddingLot[pieceId] = !this.isAddingLot[pieceId];
  }

  goToLotAchat(pieceId: number): void {
    this.router.navigate(['/stock/lot', pieceId]);
  }


  addPiece(): void {
    // Call the service method to create the piece with image
    this.PieceDetacheeService.createPieceWithImage(this.newPiece, this.selectedFile).subscribe(
      (response) => {
        // Add the new piece to the list
        this.pieces_detachees.push(response);
        this.resetNewPiece();  // Reset the form after success
        this.fetchPieces();  // Refresh the list of pieces

        // Show success message
        this.showAddSuccessMessage = true;
        this.showPanel = false;

        // Hide success message after 3 seconds
        setTimeout(() => {
          this.showAddSuccessMessage = false;
        }, 3000);
      },
      (error) => {
        // Handle error, show specific message
        if (error.status === 409) {
          this.referenceTaken=true;
          this.refTakenErrorMessage = 'Une pièce avec cette référence existe déjà.';
        } else {
          this.errorMessage = 'Échec de la création de la pièce. Veuillez réessayer.';
        }
      }
    );
  }

  updatePiece(): void {
    // Check if the selected piece exists and is properly selected
    if (!this.selectedPiece || this.selectedPiece.id === undefined) {
      this.errorMessage = 'Aucune pièce sélectionnée pour la mise à jour!';
      return;
    }

    // Check for missing required fields
    if (!this.selectedPiece.nom || !this.selectedPiece.reference || !this.selectedPiece.fournisseur) {
      this.errorMessage = 'Les champs nom, référence et fournisseur sont obligatoires';
      return;
    }

    // Check if a file has been selected (if required for the update)
    const fileToSend = this.selectedFile === null ? undefined : this.selectedFile;


    // Prepare the piece data
    const pieceData = {
      nom: this.selectedPiece.nom,
      description: this.selectedPiece.description,
      reference: this.selectedPiece.reference,
      fournisseur: this.selectedPiece.fournisseur,
      coutUnitaire: this.selectedPiece.coutUnitaire,
      quantiteStock: this.selectedPiece.quantiteStock,
      quantiteMinimale: this.selectedPiece.quantiteMinimale,
      dateAchat: this.selectedPiece.dateAchat,
      datePeremption: this.selectedPiece.datePeremption,
    };

    // Call the service to update the piece with the selected file if available
    this.PieceDetacheeService.updatePiece(
      this.selectedPiece.id,
      pieceData,
      fileToSend
    ).subscribe(
      (updatedPiece) => {
        // Find and update the piece in the pieces list
        const index = this.pieces_detachees.findIndex(piece => piece.id === updatedPiece.id);
        if (index !== -1) {
          this.pieces_detachees[index] = updatedPiece;
        }

        this.resetNewPiece();
        this.fetchPieces();
        this.pieceUpdated = true;
        this.showEditPanel = false;
        this.successMessage = 'Pièce modifiée avec succès';

        // Hide the success message after 3 seconds
        setTimeout(() => {
          this.pieceUpdated = false;
        }, 3000);
      },
      (error) => {
        if (error.status === 409) {
          this.referenceTaken = true;
          this.refTakenErrorMessage = 'Une pièce avec cette référence existe déjà.';
        }
      }
    );
  }

  enableEditing(): void {
    this.isEditing = true;
  }

  viewDetails(pieceId: number): void {
    this.PieceDetacheeService.getPieceDetacheeById(pieceId).subscribe({
      next: (piece) => {
        this.selectedPiece = { ...piece }; // Clone the object to prevent unwanted changes
        this.showEditPanel = true;
        this.isEditing = false; // Ensure it's in view mode by default
      },
      error: (err) => {
        console.error('Error fetching piece details:', err);
      }
    });
  }


// Method to close the panel
  closePanel(): void {
    this.showEditPanel = false;
    this.resetNewPiece();
  }

  openEditPanel(piece: any): void {
    this.selectedPiece = { ...piece };
    this.showEditPanel=true;
  }

  closeEditPanel(): void {
    this.selectedPiece = null; // Close the edit panel
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
          quantiteMinimale: 0,
          historiqueUtilisation: '',
          image:''
      };
        this.referenceTaken=false;
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
        'Quantité Minimale': piece.quantiteMinimale,
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

  getImageUrl(imagePath: string): string {
    return `${environment.apiUrl}${imagePath}`;
  }

  togglePanel(): void {
    this.showPanel = !this.showPanel;
    this.resetNewPiece();
  }



}
