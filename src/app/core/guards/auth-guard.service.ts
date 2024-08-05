import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor( private readonly router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = sessionStorage.getItem("token");

    if(token){
      this.router.navigateByUrl('/dashboard')
      return false
    }
    return true

  }

}
