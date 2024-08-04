import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {AuthService} from "../../modules/auth/services/auth.service";

@Injectable()
export class DashboardGuardService implements CanActivate {
    constructor( private readonly router: Router, private readonly authService: AuthService ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if(!this.authService.currentUser){
            this.router.navigateByUrl('auth')
            return false
        }
        return true
    }

}
