import { NgModule } from "@angular/core";
import { ErrorRoutingModule } from "./error-routing.module";
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { AngularSvgIconModule } from "angular-svg-icon";
import { requestInterceptor } from "../../core/interceptor/request.interceptor";

@NgModule({
  declarations: [],
  imports: [ErrorRoutingModule, AngularSvgIconModule.forRoot()],
  providers: [provideHttpClient(withFetch(),withInterceptors([requestInterceptor]))],
})
export class ErrorModule {}
