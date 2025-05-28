import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

import {LoginComponent} from "./components/login/login.component";
import {ListeUtilisateursComponent} from "./components/Utilisateurs/liste-utilisateurs/liste-utilisateurs.component";
import {
  CategoriesEquipementsComponent
} from "./components/Equipements/categories-equipements/categories-equipements.component";
import {
  ListePiecesDetacheesComponent
} from "./components/Stocks/liste-pieces-detachees/liste-pieces-detachees.component";
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

import { MaintenanceCalendarComponent } from './components/Maintenances/maintenance-calendar/maintenance-calendar.component';

import {
  MaintenancesCorrectivesComponent
} from "./components/Maintenances/maintenances-correctives/maintenances-correctives.component";
import { UserRapportComponent } from './components/Rapports/user-rapport/user-rapport.component';
import { InterventionsPreventivesPrecedentesComponent } from './components/Interventions/interventions-preventives-precedentes/interventions-preventives-precedentes.component';
import { TachesPreventivesAffecteeComponent } from './components/Interventions/taches-preventives-affectee/taches-preventives-affectee.component';
import { HistoriqueMaintenancesCorrectivesComponent } from './components/Maintenances/historique-maintenances-correctives/historique-maintenances-correctives.component';
import { ChatComponent } from './chat/chat.component';
import { DetailsHistoComponent } from './details-histo/details-histo.component';
import {LotAchatPieceComponent} from "./components/Stocks/lot-achat-piece/lot-achat-piece.component";
import {EtagesListeComponent} from "./components/batiments/etages-liste/etages-liste.component";
import {SallesListeComponent} from "./components/batiments/salles-liste/salles-liste.component";
import {
  EquipementsParSalleComponent
} from "./components/Equipements/equipements-par-salle/equipements-par-salle.component";
import {
  DemandeMaintenancesComponent
} from "./components/Maintenances/demande-maintenances/demande-maintenances.component";
import {HistoriqueDemandesComponent} from "./components/Maintenances/historique-demandes/historique-demandes.component";
import {DashboardAdminComponent} from "./components/dashboard-admin/dashboard-admin.component";
import {EquipementFormComponent} from "./components/equipement-form/equipement-form.component";



const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardAdminComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN', 'RESPONSABLE'] } },
  { path: 'form', component: EquipementFormComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN', 'RESPONSABLE'] } },
  { path: 'utilisateurs/liste', component: ListeUtilisateursComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN'] } },
  { path: 'equipements/liste', component: ListeEquipementsComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN', 'RESPONSABLE'] } },
  { path: 'equipements/type_equipements', component: TypesEquipementsComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN'] } },
  { path: 'equipements/categories', component: CategoriesEquipementsComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN'] } },
  { path: 'equipements/:serviceId', component: EquipementsParCategorieComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN'] } },
  { path: 'equipements/salle/:salleId', component: EquipementsParSalleComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN'] } },
  { path: 'equipement/:id/pieces', component: DetailsEquipementsPiecesComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN'] } },
  { path: 'batiments/liste', component: BatimentsListeComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN'] } },
  { path: 'batiment/:id/etages', component: EtagesListeComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN'] } },
  { path: 'batiment/:id/salles', component: SallesListeComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN'] } },
  { path: 'stock/liste', component: ListePiecesDetacheesComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN','RESPONSABLE','MAGASINIER'] } },
  { path: 'stock/lot/:pieceId', component: LotAchatPieceComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN','RESPONSABLE'] } },
  { path: 'stock/demande', component: DemandePieceDetacheeComponent, canActivate: [AuthGuard], data: { roles: ['RESPONSABLE'] } },
  { path:'details-maintenance/:id',component:DetailsMaintenanceComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN'] } },
  { path:'details/:id',component:DetailsHistoComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN'] } },
  { path: 'maintenances/correctives', component: MaintenancesCorrectivesComponent, canActivate: [AuthGuard], data: { roles: ['RESPONSABLE','ADMIN'] } },
  { path: 'maintenances/preventives', component: MaintenancesPreventivesComponent, canActivate: [AuthGuard], data: { roles: ['RESPONSABLE','ADMIN'] } },
  { path: 'maintenances/historique', component: HistoriqueMaintenancesComponent, canActivate: [AuthGuard], data: { roles: ['RESPONSABLE','ADMIN'] } },
  { path: 'maintenances/historique-maintenances-correctives', component: HistoriqueMaintenancesCorrectivesComponent, canActivate: [AuthGuard], data: { roles: ['RESPONSABLE','ADMIN'] } },
  { path: 'maintenances/demandes', component: DemandeMaintenancesComponent, canActivate: [AuthGuard], data: { roles: ['LAMBDA'] } },
  { path: 'maintenances/demandes/historique', component: HistoriqueDemandesComponent, canActivate: [AuthGuard], data: { roles: ['LAMBDA'] } },
  { path: 'interventions/taches', component: TachesAffecteesComponent, canActivate: [AuthGuard], data: { roles: ['TECHNICIEN'] } },
  { path: 'interventions/liste', component: InterventionsPrecedentesComponent, canActivate: [AuthGuard], data: { roles: ['TECHNICIEN'] } },
  { path: 'rapports/coutMaintenance', component: CoutMaintenancesComponent, canActivate: [AuthGuard], data: { roles: ['RESPONSABLE','ADMIN'] } },
  { path: 'rapports/statistiques', component: StatistiquesInterventionsComponent, canActivate: [AuthGuard], data: { roles: ['RESPONSABLE','ADMIN'] } },
  { path: 'rapports/Utiliateurs', component: UserRapportComponent, canActivate: [AuthGuard], data: { roles: ['RESPONSABLE','ADMIN'] } },
  { path: 'maintenances/calendar', component: MaintenanceCalendarComponent , canActivate: [AuthGuard], data: { roles: ['RESPONSABLE','ADMIN'] } },
  { path: 'interventionsP/taches', component: TachesPreventivesAffecteeComponent, canActivate: [AuthGuard], data: { roles: ['TECHNICIEN'] } },
  { path: 'interventionsP/liste', component: InterventionsPreventivesPrecedentesComponent, canActivate: [AuthGuard], data: { roles: ['TECHNICIEN'] } },
  { path: 'CHAT', component: ChatComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN','RESPONSABLE','MAGASINIER','TECHNICIEN'] } },
  { path: 'parametres', component: ParametresGenerauxComponent},


  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
