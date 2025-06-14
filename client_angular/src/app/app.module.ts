import { NgModule } from '@angular/core';

import { NgChartsModule } from 'ng2-charts';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { CommonModule } from '@angular/common'; // <- pour les pipes slice, uppercase, date
import { ToastrModule } from 'ngx-toastr';
import { FullCalendarModule } from '@fullcalendar/angular';

import { MatInputModule } from '@angular/material/input';

import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";

import {AppRoutingModule} from "./app-routing.module";
import {LoginComponent} from "./components/login/login.component";
import {NgOptimizedImage} from "@angular/common";
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
import { DetailsEquipementsPiecesComponent } from './components/Equipements/details-equipements-pieces/details-equipements-pieces.component';
import { EquipementsParCategorieComponent } from './components/Equipements/equipements-par-categorie/equipements-par-categorie.component';
import { DetailsMaintenanceComponent } from './components/Maintenances/details-maintenance/details-maintenance.component';
import {TypesEquipementsComponent} from "./components/Equipements/types-equipements/types-equipements.component";
import { BatimentsListeComponent } from './components/batiments/batiments-liste/batiments-liste.component';


import { MatSnackBarModule } from '@angular/material/snack-bar';

import {UserRapportComponent} from "./components/Rapports/user-rapport/user-rapport.component";
import {
  MaintenanceCalendarComponent
} from "./components/Maintenances/maintenance-calendar/maintenance-calendar.component";
import { NotificationsComponent } from './components/Parametres/notifications/notifications.component';
import { InfosUtilisateursComponent } from './components/Parametres/infos-utilisateurs/infos-utilisateurs.component';
import { ChangePasswordComponent } from './components/Parametres/change-password/change-password.component';
import { HistoriqueMaintenancesCorrectivesComponent } from './components/Maintenances/historique-maintenances-correctives/historique-maintenances-correctives.component';

import { InterventionsPreventivesPrecedentesComponent } from './components/Interventions/interventions-preventives-precedentes/interventions-preventives-precedentes.component';
import { TachesPreventivesAffecteeComponent } from './components/Interventions/taches-preventives-affectee/taches-preventives-affectee.component';



import { Component } from '@angular/core';

import { LotAchatPieceComponent } from './components/Stocks/lot-achat-piece/lot-achat-piece.component';
import { EtagesListeComponent } from './components/batiments/etages-liste/etages-liste.component';
import { SallesListeComponent } from './components/batiments/salles-liste/salles-liste.component';
import { EquipementsParSalleComponent } from './components/Equipements/equipements-par-salle/equipements-par-salle.component';

import { ListeFournisseursComponent } from './components/fournisseur/fournisseur.component';


import { DemandeMaintenancesComponent } from './components/Maintenances/demande-maintenances/demande-maintenances.component';
import { HistoriqueDemandesComponent } from './components/Maintenances/historique-demandes/historique-demandes.component';
import { DashboardAdminComponent } from './components/dashboard-admin/dashboard-admin.component';
import { DashboardUsersComponent } from './components/dashboards/dashboard-users/dashboard-users.component';
import { DashboardEquipementsComponent } from './components/dashboards/dashboard-equipements/dashboard-equipements.component';
import { DashboardPiecesComponent } from './components/dashboards/dashboard-pieces/dashboard-pieces.component';
import { DashboardMaintenanceComponent } from './components/dashboards/dashboard-maintenance/dashboard-maintenance.component';
import { DashboardInterventionsComponent } from './components/dashboards/dashboard-interventions/dashboard-interventions.component';
import { DashboardBatimentsComponent } from './components/dashboards/dashboard-batiments/dashboard-batiments.component';
import { DashboardServicesComponent } from './components/dashboards/dashboard-services/dashboard-services.component';
import {BaseChartDirective} from "ng2-charts";
import { EquipementFormComponent } from './components/equipement-form/equipement-form.component';
import { AccepterDemandesMaintenancesComponent } from './components/Maintenances/accepter-demandes-maintenances/accepter-demandes-maintenances.component';
import { InventaireComponent } from './components/Stocks/inventaire/inventaire.component';



@NgModule({
  declarations: [
    AppComponent,
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
    DetailsEquipementsPiecesComponent,
    EquipementsParCategorieComponent,
    DetailsMaintenanceComponent,
    TypesEquipementsComponent,
    BatimentsListeComponent,
    MaintenanceCalendarComponent,
    UserRapportComponent,
    InterventionsPreventivesPrecedentesComponent,
    TachesPreventivesAffecteeComponent,
    NotificationsComponent,
    InfosUtilisateursComponent,
    ChangePasswordComponent,
    HistoriqueMaintenancesCorrectivesComponent,
    LotAchatPieceComponent,
    EtagesListeComponent,
    SallesListeComponent,
    EquipementsParSalleComponent,
    ListeFournisseursComponent,
    EquipementFormComponent,
    DemandeMaintenancesComponent,
    HistoriqueDemandesComponent,
    DashboardAdminComponent,
    DashboardUsersComponent,
    DashboardEquipementsComponent,
    DashboardPiecesComponent,
    DashboardMaintenanceComponent,
    DashboardInterventionsComponent,
    DashboardBatimentsComponent,
    DashboardServicesComponent,
    AccepterDemandesMaintenancesComponent,
    InventaireComponent,

  ],
  imports: [
    AppRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    ToastrModule.forRoot(),
    ListeEquipementsComponent,
    LoginComponent,
    MatSnackBarModule,
    NgChartsModule,
    FullCalendarModule,
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatToolbarModule,
    FormsModule,
    ReactiveFormsModule, // Required for formGroup
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatListModule,
    MatDividerModule,
    PanneauNavigationComponent,


  ],

  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
