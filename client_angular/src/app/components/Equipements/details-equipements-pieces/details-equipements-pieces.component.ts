import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EquipementService } from '../../../services/equipement.service'; // Replace with your service

@Component({
  selector: 'app-details-equipements-pieces',
  templateUrl: './details-equipements-pieces.component.html',
  styleUrls: ['./details-equipements-pieces.component.css']
})
export class DetailsEquipementsPiecesComponent implements OnInit {
  equipementId!: number; // The property is defined but will be set later
  piecesDetachees: any[] = [];
  showForm: boolean = false;
  searchTermNom = '';
  filteredPieces = [...this.piecesDetachees];
  equipementName!: string;
  constructor(
    private route: ActivatedRoute,
    private equipementService: EquipementService // Assuming you have a service to fetch details
  ) { }

  ngOnInit(): void {
this.getPiecesByEquipement();
  }

  getPiecesByEquipement(){
    const equipementIdParam = this.route.snapshot.paramMap.get('id');

    if (equipementIdParam) {
      this.equipementId = +equipementIdParam; // Convert the string to number
      this.equipementService.getPiecesDetacheesByEquipementId(this.equipementId).subscribe(pieces => {
        this.piecesDetachees = pieces;
        this.filteredPieces = [...this.piecesDetachees];
        this.equipementService.getEquipementById(this.equipementId).subscribe(equipement => {
          this.equipementName = equipement.nom; // Assuming 'nom' is the equipment's name
        });
      });
    }
  }

  filterPiecesByName() {
    this.filteredPieces = this.piecesDetachees.filter(service =>
      service.nom.toLowerCase().includes(this.searchTermNom.toLowerCase())
    );
  }
}

