import { NgModule } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthService } from './services/auth.service';
import { AuthGuardService } from '../../core/guards/auth-guard.service';

@NgModule({
  imports: [AuthRoutingModule, AngularSvgIconModule.forRoot()],
  providers: [AuthService, AuthGuardService],

})
export class AuthModule {}
