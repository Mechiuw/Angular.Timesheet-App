import { NgModule } from '@angular/core';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardGuardService } from '../../core/guards/dashboard-guard.service';
import { AuthService } from '../auth/services/auth.service';

@NgModule({
  imports: [DashboardRoutingModule],
  providers: [DashboardGuardService, AuthService]
})
export class DashboardModule {}
