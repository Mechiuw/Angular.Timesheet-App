import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardGuardService } from "../../core/guards/dashboard-guard.service";
import { YourProfileComponent } from '../layout/components/navbar/profile-menu/your-profile/your-profile.component';
import { CreateTimesheetComponent } from '../timesheet/pages/create-timesheet/create-timesheet.component';
import { DetailTimesheetComponent } from '../timesheet/pages/detail-timesheet/detail-timesheet.component';
import { ListTimesheetComponent } from '../timesheet/pages/list-timesheet/list-timesheet.component';
import { UpdateTimesheetComponent } from '../timesheet/pages/update-timesheet/update-timesheet.component';
import { UserComponent } from "../user/user.component";
import { LayoutComponent } from './layout.component';
import { WorkComponent } from '../work/work.component';
import { MasterGuardService } from '../../core/guards/master-guard.service';

const routes: Routes = [
  {
    path: 'dashboard',
    component: LayoutComponent,
    canActivate: [DashboardGuardService],
    loadChildren: () =>
      import('../dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'users',
    component: LayoutComponent,
    canActivate: [DashboardGuardService, MasterGuardService],
    children: [
      {
        path: '',
        canActivate: [DashboardGuardService],
        component: UserComponent,
      },
    ],
  },
  {
    path: 'works',
    canActivate: [DashboardGuardService, MasterGuardService],
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: WorkComponent,
      },
      {
        path: ':id',
        component: WorkComponent,
      },
    ],
  },
  {
    path: 'timesheets',
    canActivate: [DashboardGuardService],
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'create', pathMatch: 'full' },
      { path: 'create', component: CreateTimesheetComponent },
      { path: 'list', component: ListTimesheetComponent },
      { path: 'view/:id', component: DetailTimesheetComponent },
      { path: 'update/:id', component: UpdateTimesheetComponent },
    ],
  },
  {
    path: 'approvals',
    canActivate: [DashboardGuardService],
    component: LayoutComponent,
    loadChildren: () =>
      import('../approval/approval.module').then((m) => m.ApprovalModule),
  },
  {
    path: 'profile',
    component: LayoutComponent,
    canActivate: [DashboardGuardService],
    children: [
      {
        path: '',
        component: YourProfileComponent
      }
    ]
  },

  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'error/404' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
