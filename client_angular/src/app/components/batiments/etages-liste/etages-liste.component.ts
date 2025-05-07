import { Etage } from "../../../models/etage";
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EtageService } from "../../../services/etage.service";
import { BatimentService } from "../../../services/batiment.service";

@Component({
  selector: 'app-etages-liste',
  templateUrl: './etages-liste.component.html',
  styleUrls: ['./etages-liste.component.css']
})
export class EtagesListeComponent implements OnInit {
  etages: Etage[] = [];
  batimentId!: number;
  selectedBatiment: any = {};
  newEtage: Partial<Etage> = { id: 0, num: 0 };
  showEtageForm: boolean = false;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private etageService: EtageService,
    private batimentService: BatimentService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.batimentId = +this.route.snapshot.paramMap.get('id')!;
    this.loadEtages();

    this.batimentService.getBatimentById(this.batimentId).subscribe({
      next: (bat) => {
        console.log('Batiment reçu :', bat);
        this.selectedBatiment = bat; // ✅ Fix: assign directly, no spread
      },
      error: (err) => {
        console.error('Erreur lors du chargement du bâtiment :', err);
      }
    });
  }

  loadEtages(): void {
    this.batimentService.getEtagesByBatimentId(this.batimentId).subscribe({
      next: (data) => this.etages = data,
      error: (err) => console.error('Erreur lors du chargement des étages :', err)
    });
  }

  resetEtageForm(): void {
    this.newEtage = { num: 0 };
  }

  addEtage(): void {
    this.errorMessage = '';

    // Only include the ID of the batiment to avoid sending nested data
    const etageToCreate: Partial<Etage> = {
      id: 0,
      num: this.newEtage.num,
      batimentId:  this.batimentId
    };

    console.log('Sending to backend:', etageToCreate);

    this.etageService.createEtage(etageToCreate as Etage).subscribe({
      next: (savedEtage: Etage) => {
        console.log('Étage ajouté avec succès:', savedEtage);
        this.etages.push(savedEtage);
        this.resetEtageForm();
        this.showEtageForm = false;
      },
      error: (error) => {
        console.error('Erreur lors de l\'ajout de l\'étage:', error);
        if (error.status !== 200) {
          this.errorMessage = 'Un étage avec ces informations existe déjà ou le format est incorrect.';
        }
      }
    });
  }


  goToSalles(etageId: number): void {
    this.router.navigate(['/batiment', etageId, 'salles']);
  }
}
