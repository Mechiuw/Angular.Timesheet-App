import {
  provideHttpClient,
  withFetch,
  withInterceptors
} from "@angular/common/http";
import { NgModule } from "@angular/core";
import { AngularSvgIconModule } from "angular-svg-icon";

import { DashboardGuardService } from "../../core/guards/dashboard-guard.service";
import { requestInterceptor } from "../../core/interceptor/request.interceptor";
import { AuthService } from "../auth/services/auth.service";
import { LayoutRoutingModule } from "./layout-routing.module";
@NgModule({
  imports: [LayoutRoutingModule, AngularSvgIconModule.forRoot()],
  providers: [provideHttpClient(withFetch(),withInterceptors([requestInterceptor])), AuthService, DashboardGuardService],

})
export class LayoutModule {}
