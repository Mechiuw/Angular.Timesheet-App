import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from "@angular/common/http";
import { NgModule } from "@angular/core";
import { AngularSvgIconModule } from "angular-svg-icon";

import { DashboardGuardService } from "../../core/guards/dashboard-guard.service";
import { requestInterceptor } from "../../core/interceptor/request.interceptor";
import { AuthService } from "../auth/services/auth.service";
import { LayoutRoutingModule } from "./layout-routing.module";
import { MasterGuardService } from "../../core/guards/master-guard.service";
import { ManagerGuardService } from "../../core/guards/manager-guard.service";
@NgModule({
  imports: [LayoutRoutingModule, AngularSvgIconModule.forRoot()],
  providers: [
    AuthService,
    DashboardGuardService,
    MasterGuardService,
    ManagerGuardService,
  ],
})
export class LayoutModule {}
