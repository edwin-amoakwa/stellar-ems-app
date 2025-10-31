import { Injectable } from '@angular/core';
import {CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {UserSession} from './user-session';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  // Array of routes that should always allow routing without any check
  private allowedRoutes: string[] = [
    'login',
    'register',
    'password-reset',
    'denied'
  ];

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    console.log('AuthGuard: canActivate .. ' +route.url);
    // const currentRoute = route.url.join('/');
    const currentRoute = state.url.replace(/^\/+|\/+$/g, ''); // Remove leading/trailing slashes
    const routePath = currentRoute.split('?')[0]; // Remove query params for permission checks

    if (this.allowedRoutes.includes(routePath)) {
      return true;
    }

    const sessionId = localStorage.getItem(UserSession.SessionId);

    if (sessionId) {
      // When logged in, verify permission for the route
      try {
        const allowed = UserSession.allowRoute(routePath);
        if (allowed) {
          return true;
        } else {
          console.log('Access denied for route:', routePath);
          this.router.navigate(['/denied']);
          return false;
        }
      } catch (e) {
        // If something goes wrong (e.g., missing permissions), be safe and redirect to denied
        this.router.navigate(['/denied']);
        return false;
      }
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }


}
