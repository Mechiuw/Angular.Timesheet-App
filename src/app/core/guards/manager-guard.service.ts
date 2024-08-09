import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {AuthService} from "../../modules/auth/services/auth.service";
import { Roles } from "../constants/roles";

@Injectable()
export class ManagerGuardService implements CanActivate {
    constructor( private readonly router: Router, private readonly authService: AuthService ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if(this.authService.currentUser?.role !== Roles.MANAGER){

            this.router.navigateByUrl('/dashboard')
            return false
        }
        return true
    }

}
