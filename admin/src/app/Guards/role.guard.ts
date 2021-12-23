import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  public hotelId: number = 0;
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
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (route.data['roles'].indexOf(this.role) !== -1){
      return true;
    }
    void this.router.navigate(['']);
    return false;
  }
}
