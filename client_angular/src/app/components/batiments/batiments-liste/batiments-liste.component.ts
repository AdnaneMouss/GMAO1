import { Component, OnInit } from '@angular/core';
import { Batiment } from '../../../models/batiment';
import { BatimentService } from '../../../services/batiment.service';
import { EtageService } from '../../../services/etage.service';
import {Service} from "../../../models/service";
import {Etage} from "../../../models/etage";
import {Salle} from "../../../models/salle";
import {SalleService} from "../../../services/salle.service"; // Import EtageService

@Component({
  selector: 'app-batiments-liste',
  templateUrl: './batiments-liste.component.html',
  styleUrls: ['./batiments-liste.component.css']
})
export class BatimentsListeComponent implements OnInit {

  batiments: Batiment[] = [];
  searchTermNom: string = '';
  selectedBatiment: Batiment | null = null;
  etages: any[] = [];
  selectedEtage: any | null = null;
  salles: any[] = [];
  filteredBatiments = [...this.batiments];
  errorMessage: string = '';
  showForm: boolean = false;
  newBatiment: Batiment = {id:0, numBatiment: 1, intitule: '', etages: []};
  newEtage: number = 1;
  newSalle: number = 1;
  showEtageForm: boolean = false;
  isLoading: boolean = false;  // Add this line for the loading state


  constructor(private batimentService: BatimentService, private etageService: EtageService, private salleService: SalleService) { }

  ngOnInit(): void {
    this.getAllBatiments();
  }

  getAllBatiments(): void {
    this.batimentService.getAllBatiments().subscribe(
      (data: Batiment[]) => {
        this.batiments = data;
        this.filteredBatiments = data;
      },
      (error) => {
        console.error('Error fetching batiments', error);
      }
    );
  }

  getEtages(batId: number): void {
    this.batimentService.getEtagesByBatimentId(batId).subscribe(
      (data: any[]) => {
        this.etages = data;
        this.selectedBatiment = this.batiments.find(b => b.id === batId) || null;
        console.log(`Etages for Batiment ${batId}:`, data);
      },
      (error) => {
        console.error(`Error fetching etages for Batiment ${batId}`, error);
      }
    );
  }

  getSalles(etageId: number): void {
    this.etageService.getSallesByEtageId(etageId).subscribe(
      (data: any[]) => {
        this.salles = data;
        this.selectedEtage = this.etages.find(e => e.id === etageId) || null;
        console.log(`Salles for Etage ${etageId}:`, data);
      },
      (error) => {
        console.error(`Error fetching salles for Etage ${etageId}`, error);
      }
    );
  }

  filterBatimentsByName(): void {
    this.filteredBatiments = this.batiments.filter(batiment =>
      batiment.intitule.toLowerCase().includes(this.searchTermNom.toLowerCase())
    );
  }

  resetForm(): void {
    this.newBatiment = {id:0, numBatiment: 0, intitule: '', etages: []};
    this.showForm = false;
    this.errorMessage = '';
  }

  addBatiment(): void {
    this.errorMessage = '';
    this.batimentService.createBatiment(this.newBatiment).subscribe(
      (savedBatiment: Batiment) => {
        console.log('Service ajouté avec succès:', savedBatiment);
        this.batiments.push(savedBatiment);
        this.filterBatimentsByName();
        this.resetForm();
      },
      (error) => {
        console.error('Erreur lors de l\'ajout du batiment:', error);
        if (error.status != 200) {
          this.errorMessage = 'Un batiment avec ces informations existe déjà.';
        }
      }
    );
  }



  addEtage(): void {
    this.errorMessage='';
    if (this.selectedBatiment && this.newEtage) {
      const etage: Etage = {
        id: 0,
        num: this.newEtage,
        salles: [],
        batiment: {id:0, numBatiment: 0, intitule: '', etages: []}
      };

      // Associate the new Etage with the selected Batiment
      etage.batiment = this.selectedBatiment;

      // Call the service to create the new Etage
      this.etageService.createEtage(etage).subscribe(
        (savedEtage: Etage) => {
          console.log('Etage added successfully:', savedEtage);
          this.etages.push(savedEtage);
          this.newEtage = 0;
        },
        (error) => {
          if (error.status != 200) {
            this.errorMessage = 'Cet étage existe déjà.';
          }
        }
      );
    }
  }

  addSalle(): void {
    this.errorMessage = '';

    if (this.selectedEtage && this.newSalle) {
      const salle: Salle = {
        id: 0,  // Temporary, backend will assign real ID
        num: this.newSalle,  // Ensure "nom" is correctly used
        etage: this.selectedEtage  // Associate the salle with the selected étage
      };

      // Call the service to create the new Salle
      this.salleService.createSalle(salle).subscribe(
        (savedSalle: Salle) => {
          console.log('Salle added successfully:', savedSalle);
          this.salles.push(savedSalle);  // Update the UI with the new salle
          this.newSalle = 0;  // Reset input field
        },
        (error) => {
          if (error.status !== 200) {
            this.errorMessage = 'Cette salle existe déjà.';
          }
        }
      );
    }
  }

}
