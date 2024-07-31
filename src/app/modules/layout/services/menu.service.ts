import { Injectable, OnDestroy, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MenuItem, SubMenuItem } from '../../../core/models/menu.model';
import {Menu} from "../../../core/constants/menu";

@Injectable({
  providedIn: 'root',
})
export class MenuService implements OnDestroy {
  private _showSidebar = signal(true);
  private _showMobileMenu = signal(false);
  private _pagesMenu = signal<MenuItem[]>([]);
  private _subscription = new Subscription();
  private role:string = 'Admin';
  private menu:MenuItem[] = Menu.pages;

  // filteredMenus(role:string) {
  //   this.menus.filter
  // }

  constructor(private router: Router) {

    /** Set dynamic menu by role */
    this._pagesMenu.set(this.filterMenuByRole(this.menu,this.role));
  
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

// Filter function
private filterMenuByRole(menu: MenuItem[], role: string): MenuItem[] {
  // Helper function to filter sub-menu items
  function filterSubMenuItems(items: SubMenuItem[], role: string): SubMenuItem[] {
    return items
      .filter(item => item.role.includes(role))  // Filter based on role
      .map(item => ({
        ...item,
        children: item.children ? filterSubMenuItems(item.children, role) : []  // Recur for children
      }))
      .filter(item => item.children.length > 0 || item.role.includes(role));  // Ensure that items with children are included if they match the role
  }

  return menu
    .map(menuItem => ({
      ...menuItem,
      items: filterSubMenuItems(menuItem.items, role)  // Apply filter to each menu item's sub-items
    }))
    .filter(menuItem => menuItem.items.length > 0);  // Ensure that only menu items with filtered sub-items are included
}


  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
