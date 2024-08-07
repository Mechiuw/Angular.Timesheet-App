import { Injectable, OnDestroy, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MenuItem, SubMenuItem } from '../../../core/models/menu.model';
import { Menu } from '../../../core/constants/menu';
import { AuthService } from '../../auth/services/auth.service';
import { SessionService } from '../../../core/services/session.service';

@Injectable({
  providedIn: 'root',
})
export class MenuService implements OnDestroy {
  private _showSidebar = signal(true);
  private _showMobileMenu = signal(false);
  private _pagesMenu = signal<MenuItem[]>([]);
  private _subscription = new Subscription();
  private _role: string[] = [];
  private currentUser: any;

  constructor(private router: Router, private sessionService: SessionService) {

    /** Get role from current user */
    this.sessionService.token$.subscribe(() => {
      this.currentUser = this.sessionService.getCurrentUser();
      this._role[0] = <string>this.currentUser?.role;
      this._pagesMenu.set(this.filteredMenuByRole(Menu.pages, this._role));
      console.log(this._role);
    });

    /** Set dynamic menu by role */

    let sub = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        /** Expand menu base on active route */
        this._pagesMenu().forEach((menu) => {
          let activeGroup = false;
          menu.items.forEach((subMenu) => {
            const active = this.isActive(subMenu.route);
            subMenu.expanded = active;
            subMenu.active = active;
            if (active) activeGroup = true;
            if (subMenu.children) {
              this.expand(subMenu.children);
            }
          });
          menu.active = activeGroup;
        });
      }
    });
    this._subscription.add(sub);
  }

  get showSideBar() {
    return this._showSidebar();
  }
  get showMobileMenu() {
    return this._showMobileMenu();
  }
  get pagesMenu() {
    return this._pagesMenu();
  }

  set showSideBar(value: boolean) {
    this._showSidebar.set(value);
  }
  set showMobileMenu(value: boolean) {
    this._showMobileMenu.set(value);
  }

  public toggleSidebar() {
    this._showSidebar.set(!this._showSidebar());
  }

  public toggleMenu(menu: any) {
    this.showSideBar = true;
    menu.expanded = !menu.expanded;
  }

  public toggleSubMenu(submenu: SubMenuItem) {
    submenu.expanded = !submenu.expanded;
  }

  private expand(items: Array<any>) {
    items.forEach((item) => {
      item.expanded = this.isActive(item.route);
      if (item.children) this.expand(item.children);
    });
  }

  private isActive(instruction: any): boolean {
    return this.router.isActive(this.router.createUrlTree([instruction]), {
      paths: 'subset',
      queryParams: 'subset',
      fragment: 'ignored',
      matrixParams: 'ignored',
    });
  }

  // Function to check if any role in the array is included in the required roles
  hasRole(roles: string[], requiredRoles: string[]): boolean {
    return roles.some((role) => requiredRoles.includes(role));
  }

  // Function to filter menu items based on user roles
  filteredMenuByRole(menu: MenuItem[], roles: string[]): MenuItem[] {
    return menu
      .map((menuItem) => ({
        ...menuItem,
        active: menuItem.active ?? false, // Default to false if undefined
        items: menuItem.items.filter((subMenuItem) =>
          this.hasRole(roles, subMenuItem.role)
        ),
      }))
      .filter((menuItem) => menuItem.items.length > 0);
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
