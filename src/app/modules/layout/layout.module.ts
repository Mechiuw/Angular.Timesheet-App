import { NgModule } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { DashboardGuardService } from '../../core/guards/dashboard-guard.service';
import { AuthService } from '../auth/services/auth.service';
import { LayoutRoutingModule } from './layout-routing.module';
import { MasterGuardService } from '../../core/guards/master-guard.service';
import { ManagerGuardService } from '../../core/guards/manager-guard.service';
import {ConfirmationService, MessageService} from "primeng/api";

@NgModule({
  imports: [LayoutRoutingModule, AngularSvgIconModule.forRoot()],
  providers: [
    AuthService,
    DashboardGuardService,
    MasterGuardService,
    ManagerGuardService,
    ConfirmationService,
    MessageService
  ],
})
export class LayoutModule {}
