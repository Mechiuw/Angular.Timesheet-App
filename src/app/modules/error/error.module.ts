import { NgModule } from "@angular/core";
import { ErrorRoutingModule } from "./error-routing.module";
import {
  provideHttpClient,
  withFetch,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { AngularSvgIconModule } from "angular-svg-icon";

@NgModule({
  declarations: [],
  imports: [ErrorRoutingModule, AngularSvgIconModule.forRoot()],
  providers: [provideHttpClient(withFetch(), withInterceptorsFromDi())],
})
export class ErrorModule {}
