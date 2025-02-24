import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: any): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userType = user?.role;

    // Check if route is restricted to the user's role
    if (route.data?.roles && !route.data.roles.includes(userType)) {
      this.router.navigate(['/login']); // Redirect to login if not authorized
      return false;
    }

    return true;
  }
}






