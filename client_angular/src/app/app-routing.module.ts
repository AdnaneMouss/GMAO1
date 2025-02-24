import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

import {LoginComponent} from "./components/login/login.component";
import {
  DetailsUtilisateursComponent
} from "./components/Utilisateurs/details-utilisateurs/details-utilisateurs.component";
import {ListeUtilisateursComponent} from "./components/Utilisateurs/liste-utilisateurs/liste-utilisateurs.component";
import {
  CategoriesEquipementsComponent
} from "./components/Equipements/categories-equipements/categories-equipements.component";
import {
  ListePiecesDetacheesComponent
} from "./components/Stocks/liste-pieces-detachees/liste-pieces-detachees.component";
import {SuiviStocksAlertesComponent} from "./components/Stocks/suivi-stocks-alertes/suivi-stocks-alertes.component";
import {
  DemandePieceDetacheeComponent
} from "./components/Stocks/demande-piece-detachee/demande-piece-detachee.component";
import {
  MaintenancesCorrectivesComponent
} from "./components/Maintenances/maintenances-correctives/maintenances-correctives.component";
import {
  MaintenancesPreventivesComponent
} from "./components/Maintenances/maintenances-preventives/maintenances-preventives.component";
import {
  HistoriqueMaintenancesComponent
} from "./components/Maintenances/historique-maintenances/historique-maintenances.component";
import {TachesAffecteesComponent} from "./components/Interventions/taches-affectees/taches-affectees.component";
import {
  InterventionsPrecedentesComponent
} from "./components/Interventions/interventions-precedentes/interventions-precedentes.component";
import {CoutMaintenancesComponent} from "./components/Rapports/cout-maintenances/cout-maintenances.component";
import {
  StatistiquesInterventionsComponent
} from "./components/Rapports/statistiques-interventions/statistiques-interventions.component";
import {ParametresGenerauxComponent} from "./components/Parametres/parametres-generaux/parametres-generaux.component";
import {
  GestionAccesUtilisateursComponent
} from "./components/Utilisateurs/gestion-acces-utilisateurs/gestion-acces-utilisateurs.component";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {ListeEquipementsComponent} from "./components/Equipements/liste-equipements/liste-equipements.component";
import {DetailsEquipementsComponent} from "./components/Equipements/details-equipements/details-equipements.component";
import {
  EquipementsParCategorieComponent
} from "./components/Equipements/equipements-par-categorie/equipements-par-categorie.component";

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN', 'RESPONSABLE'] } },
  { path: 'utilisateurs/liste', component: ListeUtilisateursComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN'] } },
  { path: 'utilisateurs/permissions', component: GestionAccesUtilisateursComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN'] } },
  { path: 'details/:id', component: DetailsUtilisateursComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN'] } },
  { path: 'equipements/liste', component: ListeEquipementsComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN', 'RESPONSABLE'] } },
  { path: 'details-equipements/:id', component: DetailsEquipementsComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN'] } },
  { path: 'equipements/categories', component: CategoriesEquipementsComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN'] } },
  { path: 'equipements/:serviceId', component: EquipementsParCategorieComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN'] } },
  { path: 'stock/liste', component: ListePiecesDetacheesComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN','RESPONSABLE','MAGASINIER'] } },
  { path: 'stock/alertes', component: SuiviStocksAlertesComponent, canActivate: [AuthGuard], data: { roles: ['RESPONSABLE'] } },
  { path: 'stock/demande', component: DemandePieceDetacheeComponent, canActivate: [AuthGuard], data: { roles: ['RESPONSABLE','TECHNICIEN'] } },
  { path: 'maintenances/correctives', component: MaintenancesCorrectivesComponent, canActivate: [AuthGuard], data: { roles: ['RESPONSABLE','ADMIN'] } },
  { path: 'maintenances/preventives', component: MaintenancesPreventivesComponent, canActivate: [AuthGuard], data: { roles: ['RESPONSABLE','ADMIN'] } },
  { path: 'maintenances/historique', component: HistoriqueMaintenancesComponent, canActivate: [AuthGuard], data: { roles: ['RESPONSABLE','ADMIN'] } },
  { path: 'interventions/taches', component: TachesAffecteesComponent, canActivate: [AuthGuard], data: { roles: ['TECHNICIEN'] } },
  { path: 'interventions/liste', component: InterventionsPrecedentesComponent, canActivate: [AuthGuard], data: { roles: ['TECHNICIEN'] } },
  { path: 'rapports/coutMaintenance', component: CoutMaintenancesComponent, canActivate: [AuthGuard], data: { roles: ['RESPONSABLE','ADMIN'] } },
  { path: 'rapports/statistiques', component: StatistiquesInterventionsComponent, canActivate: [AuthGuard], data: { roles: ['RESPONSABLE','ADMIN'] } },
  { path: 'parametres', component: ParametresGenerauxComponent},
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
