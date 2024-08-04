import { NgModule } from "@angular/core";

import {
  provideHttpClient,
  withFetch,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { AngularSvgIconModule } from "angular-svg-icon";
import { AuthRoutingModule } from "./auth-routing.module";
import { AuthService } from "./services/auth.service";
import {AuthGuardService} from "../../core/guards/auth-guard.service";

@NgModule({
  imports: [AuthRoutingModule, AngularSvgIconModule.forRoot()],
  providers: [provideHttpClient(withFetch(), withInterceptorsFromDi()), AuthService, AuthGuardService],

})
export class AuthModule {}
