import {Etage} from "../../../models/etage";
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {EtageService} from "../../../services/etage.service";
import {BatimentService} from "../../../services/batiment.service";
import {Salle} from "../../../models/salle";
import {SalleService} from "../../../services/salle.service";

@Component({
  selector: 'app-salles-liste',
  templateUrl: './salles-liste.component.html',
  styleUrl: './salles-liste.component.css'
})
export class SallesListeComponent implements OnInit {
  salles: Salle[] = [];
  etageId!: number;
  selectedEtage: any = {};
  newSalle: Partial<Salle> = { num: 0, prefixe:'' };
  showSalleForm: boolean = false;
  errorMessage: string = '';
  constructor(
    private route: ActivatedRoute,
    private etageService: EtageService,
    private salleService: SalleService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.etageId = +this.route.snapshot.paramMap.get('id')!;
    this.loadSalles();
    this.etageService.getEtageById(this.etageId).subscribe({
      next: (etage) => {
        this.selectedEtage = { ...etage };
        console.log("", this.selectedEtage)
      }
    });
  }

  goBack(etageId: number): void {
    this.router.navigate(['/batiment', etageId, 'etages']);
  }

  resetSalleForm(): void {
    this.newSalle = { num: 0, prefixe:'' };
  }

  addSalle(): void {
    this.errorMessage = '';

    // Only include the ID of the batiment to avoid sending nested data
    const salleToCreate: Partial<Salle> = {
      id: 0,
      num: this.newSalle.num,
      prefixe: this.newSalle.prefixe,
      etageId: this.etageId,
    };

    console.log('Sending to backend:', salleToCreate);

    this.salleService.createSalle(salleToCreate as Salle).subscribe({
      next: (savedSalle: Salle) => {
        console.log('Étage ajouté avec succès:', savedSalle);
        this.salles.push(savedSalle);
        this.resetSalleForm();
        this.showSalleForm = false;
      },
      error: (error) => {
        console.error('Erreur lors de l\'ajout de l\'étage:', error);
        if (error.status !== 200) {
          this.errorMessage = 'Une salle avec ces informations existe déjà ou le format est incorrect.';
        }
      }
    });
  }



  loadSalles(): void {
    this.etageService.getSallesByEtageId(this.etageId).subscribe(
      data => this.salles = data,
      error => console.error('Error loading etages', error)
    );
  }
}
