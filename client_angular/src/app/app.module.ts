import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { DetailsUtilisateursComponent } from './components/Utilisateurs/details-utilisateurs/details-utilisateurs.component';
import {MatFormField} from "@angular/material/form-field";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {RouterLink, RouterOutlet} from "@angular/router";
import {AppRoutingModule} from "./app-routing.module";
import {LoginComponent} from "./components/login/login.component";
import {NgOptimizedImage} from "@angular/common";
import { GestionAccesUtilisateursComponent } from './components/Utilisateurs/gestion-acces-utilisateurs/gestion-acces-utilisateurs.component';
import { ListeUtilisateursComponent } from './components/Utilisateurs/liste-utilisateurs/liste-utilisateurs.component';
import { ListePiecesDetacheesComponent } from './components/Stocks/liste-pieces-detachees/liste-pieces-detachees.component';
import { SuiviStocksAlertesComponent } from './components/Stocks/suivi-stocks-alertes/suivi-stocks-alertes.component';
import { DemandePieceDetacheeComponent } from './components/Stocks/demande-piece-detachee/demande-piece-detachee.component';
import { MaintenancesPreventivesComponent } from './components/Maintenances/maintenances-preventives/maintenances-preventives.component';
import { MaintenancesCorrectivesComponent } from './components/Maintenances/maintenances-correctives/maintenances-correctives.component';
import { HistoriqueMaintenancesComponent } from './components/Maintenances/historique-maintenances/historique-maintenances.component';
import { CategoriesEquipementsComponent } from './components/Equipements/categories-equipements/categories-equipements.component';
import { StatistiquesInterventionsComponent } from './components/Rapports/statistiques-interventions/statistiques-interventions.component';
import { CoutMaintenancesComponent } from './components/Rapports/cout-maintenances/cout-maintenances.component';
import { ParametresGenerauxComponent } from './components/Parametres/parametres-generaux/parametres-generaux.component';
import { PanneauNavigationComponent } from './components/Navigation/panneau-navigation/panneau-navigation.component';
import { TachesAffecteesComponent } from './components/Interventions/taches-affectees/taches-affectees.component';
import { InterventionsPrecedentesComponent } from './components/Interventions/interventions-precedentes/interventions-precedentes.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import {ListeEquipementsComponent} from "./components/Equipements/liste-equipements/liste-equipements.component";
import { DetailsEquipementsComponent } from './components/Equipements/details-equipements/details-equipements.component';
import { DetailsEquipementsPiecesComponent } from './components/Equipements/details-equipements-pieces/details-equipements-pieces.component';
import { EquipementsParCategorieComponent } from './components/Equipements/equipements-par-categorie/equipements-par-categorie.component';

@NgModule({
  declarations: [
    AppComponent,
    DetailsUtilisateursComponent,
    GestionAccesUtilisateursComponent,
    ListeUtilisateursComponent,
    ListePiecesDetacheesComponent,
    SuiviStocksAlertesComponent,
    DemandePieceDetacheeComponent,
    MaintenancesPreventivesComponent,
    MaintenancesCorrectivesComponent,
    HistoriqueMaintenancesComponent,
    CategoriesEquipementsComponent,
    StatistiquesInterventionsComponent,
    CoutMaintenancesComponent,
    ParametresGenerauxComponent,
    TachesAffecteesComponent,
    InterventionsPrecedentesComponent,
    DashboardComponent,
    DetailsEquipementsComponent,
    DetailsEquipementsPiecesComponent,
    EquipementsParCategorieComponent,
  ],
  imports: [
    AppRoutingModule,
    ListeEquipementsComponent,
    LoginComponent,
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatDividerModule,
    MatFormField,
    MatOption,
    MatSelect,
    FormsModule,
    RouterOutlet,
    PanneauNavigationComponent,
    NgOptimizedImage,
    RouterLink,
    ReactiveFormsModule,
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
