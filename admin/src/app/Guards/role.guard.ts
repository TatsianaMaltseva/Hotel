import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  private get role(): string | null {
    return this.authService.role();
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
    const roles = route.data.roles;
    if (roles === undefined || roles.indexOf(this.role) !== -1){
      return true;
    }
    return this.router.navigate(['']);
  }
}
