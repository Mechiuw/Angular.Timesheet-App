import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApprovalRoutingModule } from './approval-routing.module';
import { DashboardGuardService } from '../../core/guards/dashboard-guard.service';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ApprovalRoutingModule
  ],
  providers: [
    DashboardGuardService
  ]
})
export class ApprovalModule { }
