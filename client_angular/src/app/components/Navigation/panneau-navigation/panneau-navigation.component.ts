import {Component, OnInit} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {AuthService} from "../../../services/auth.service";
import {NgClass, NgIf} from "@angular/common";

@Component({
  selector: 'app-panneau-navigation',
  templateUrl: './panneau-navigation.component.html',
  standalone: true,
  imports: [
    NgClass,
    NgIf,
    RouterLink
  ],
  styleUrl: './panneau-navigation.component.css'
})
export class PanneauNavigationComponent implements OnInit{
  isSidebarCollapsed: boolean = false;
  showLogoutConfirm: boolean = false;
  user: any;
  submenuState: { [key: string]: boolean } = {};

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.user = this.authService.getUser();
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }

  hasAccess(route: string): boolean {
    if (!this.user || !this.user.role) {
      return false;
    }

    const role = this.user.role;

    const accessControl: { [key: string]: string[] } = {
      '/dashboard': ['admin', 'technician', 'user'],
      '/users': ['admin'],
      '/equipements': ['admin', 'technician'],
      '/maintenance': ['admin', 'technician'],
      '/stock': [''],
      '/reports': ['admin'],
      '/settings': ['admin'],
    };

    return accessControl[route]?.includes(role) || false;
  }

  toggleSubmenu(menu: string) {
    this.submenuState[menu] = !this.submenuState[menu];
  }

  isSubmenuOpen(menu: string): boolean {
    return this.submenuState[menu];
  }

  logout() {
    this.showLogoutConfirm = true;
  }

  confirmLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  cancelLogout() {
    this.showLogoutConfirm = false;
  }
}
