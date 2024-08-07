import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import { SessionService } from '../services/session.service';

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor( private readonly router: Router, private readonly sessionService: SessionService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    if(this.sessionService.isAuthenticated()){
      this.router.navigateByUrl('/dashboard')
      return false
    }
    return true

  }

}
