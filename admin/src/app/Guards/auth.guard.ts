import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  public constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
  }

  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> | boolean {
    if (this.isLoggedIn){
      return true;
    }
    return this.router.navigate(['']);
  }
}
