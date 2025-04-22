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
import {
  EquipementsParCategorieComponent
} from "./components/Equipements/equipements-par-categorie/equipements-par-categorie.component";
import { DetailsMaintenanceComponent } from './components/Maintenances/details-maintenance/details-maintenance.component';
import {
  DetailsEquipementsPiecesComponent
} from "./components/Equipements/details-equipements-pieces/details-equipements-pieces.component";
import {TypesEquipementsComponent} from "./components/Equipements/types-equipements/types-equipements.component";
import {BatimentsListeComponent} from "./components/batiments/batiments-liste/batiments-liste.component";
import {EquipementFormComponent} from "./equipement-form/equipement-form.component";

import { MaintenanceCalendarComponent } from './components/Maintenances/maintenance-calendar/maintenance-calendar.component';

import {
  MaintenancesCorrectivesComponent
} from "./components/Maintenances/maintenances-correctives/maintenances-correctives.component";
import { UserRapportComponent } from './components/Rapports/user-rapport/user-rapport.component';
<<<<<<< HEAD
import { InterventionsPreventivesPrecedentesComponent } from './components/Interventions/interventions-preventives-precedentes/interventions-preventives-precedentes.component';
import { TachesPreventivesAffecteeComponent } from './components/Interventions/taches-preventives-affectee/taches-preventives-affectee.component';
=======
import {
  HistoriqueMaintenancesCorrectivesComponent
} from "./components/Maintenances/historique-maintenances-correctives/historique-maintenances-correctives.component";

>>>>>>> 7d82ae8d930f451ff17c35dd76dcb796f3ad4fc4


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN', 'RESPONSABLE'] } },
  { path: 'utilisateurs/liste', component: ListeUtilisateursComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN'] } },
  { path: 'utilisateurs/permissions', component: GestionAccesUtilisateursComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN'] } },
  { path: 'details/:id', component: DetailsUtilisateursComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN'] } },
  { path: 'equipements/liste', component: ListeEquipementsComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN', 'RESPONSABLE'] } },
  { path: 'test', component: EquipementFormComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN', 'RESPONSABLE'] } },
  { path: 'equipements/type_equipements', component: TypesEquipementsComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN'] } },
  { path: 'equipements/categories', component: CategoriesEquipementsComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN'] } },
  { path: 'equipements/:serviceId', component: EquipementsParCategorieComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN'] } },
  { path: 'equipement/:id/pieces', component: DetailsEquipementsPiecesComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN'] } },
  { path: 'batiments/liste', component: BatimentsListeComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN'] } },
  { path: 'stock/liste', component: ListePiecesDetacheesComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN','RESPONSABLE','MAGASINIER'] } },
  { path: 'stock/alertes', component: SuiviStocksAlertesComponent, canActivate: [AuthGuard], data: { roles: ['RESPONSABLE'] } },
  { path: 'stock/demande', component: DemandePieceDetacheeComponent, canActivate: [AuthGuard], data: { roles: ['RESPONSABLE'] } },
  { path:'details-maintenance/:id',component:DetailsMaintenanceComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN'] } },
  { path: 'maintenances/correctives', component: MaintenancesCorrectivesComponent, canActivate: [AuthGuard], data: { roles: ['RESPONSABLE','ADMIN'] } },
  { path: 'maintenances/preventives', component: MaintenancesPreventivesComponent, canActivate: [AuthGuard], data: { roles: ['RESPONSABLE','ADMIN'] } },
  { path: 'maintenances/historique', component: HistoriqueMaintenancesComponent, canActivate: [AuthGuard], data: { roles: ['RESPONSABLE','ADMIN'] } },
  { path: 'maintenances/historique-maintenances-correctives', component: HistoriqueMaintenancesCorrectivesComponent, canActivate: [AuthGuard], data: { roles: ['RESPONSABLE','ADMIN'] } },
  { path: 'interventions/taches', component: TachesAffecteesComponent, canActivate: [AuthGuard], data: { roles: ['TECHNICIEN'] } },
  { path: 'interventions/liste', component: InterventionsPrecedentesComponent, canActivate: [AuthGuard], data: { roles: ['TECHNICIEN'] } },
  { path: 'rapports/coutMaintenance', component: CoutMaintenancesComponent, canActivate: [AuthGuard], data: { roles: ['RESPONSABLE','ADMIN'] } },
  { path: 'rapports/statistiques', component: StatistiquesInterventionsComponent, canActivate: [AuthGuard], data: { roles: ['RESPONSABLE','ADMIN'] } },
  { path: 'rapports/Utiliateurs', component: UserRapportComponent, canActivate: [AuthGuard], data: { roles: ['RESPONSABLE','ADMIN'] } },
  { path: 'maintenances/calendar', component: MaintenanceCalendarComponent , canActivate: [AuthGuard], data: { roles: ['RESPONSABLE','ADMIN'] } },
  { path: 'interventionsP/taches', component: TachesPreventivesAffecteeComponent, canActivate: [AuthGuard], data: { roles: ['TECHNICIEN'] } },
  { path: 'interventionsP/liste', component: InterventionsPreventivesPrecedentesComponent, canActivate: [AuthGuard], data: { roles: ['TECHNICIEN'] } },
  
  { path: 'parametres', component: ParametresGenerauxComponent},


  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }