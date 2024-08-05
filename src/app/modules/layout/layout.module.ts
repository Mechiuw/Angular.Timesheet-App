import {
    provideHttpClient,
    withFetch,
    withInterceptors,
    withInterceptorsFromDi,
} from "@angular/common/http";
import { NgModule } from "@angular/core";
import { AngularSvgIconModule } from "angular-svg-icon";

import { LayoutRoutingModule } from "./layout-routing.module";
import { AuthService } from "../auth/services/auth.service";
import { requestInterceptor } from "../../core/interceptor/request.interceptor";
@NgModule({
  imports: [LayoutRoutingModule, AngularSvgIconModule.forRoot()],
  providers: [provideHttpClient(withFetch(),withInterceptors([requestInterceptor])), AuthService],

})
export class LayoutModule {}
