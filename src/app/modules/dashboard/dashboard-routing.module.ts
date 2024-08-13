import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { DashboardGuardService } from '../../core/guards/dashboard-guard.service';
import { SummaryComponent } from './pages/summary/summary.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [DashboardGuardService],
    children: [
      { path: '', component: SummaryComponent },
      // { path: '', redirectTo: 'nfts', pathMatch: 'full' },
      { path: '**', redirectTo: 'errors/404' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
