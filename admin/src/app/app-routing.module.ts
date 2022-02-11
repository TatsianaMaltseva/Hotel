import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddFacilitiesComponent } from './Components/add-facilities/add-facilities.component';

import { ChangePasswordComponent } from './Components/change-password/change-password.component';
import { HotelCardsComponent } from './Components/hotel-cards/hotel-cards.component';
import { HotelForAdminComponent } from './Components/hotel-for-admin/hotel-for-admin.component';
import { HotelComponent } from './Components/hotel/hotel.component';
import { roles } from './Core/roles';
import { AuthGuard } from './Guards/auth.guard';
import { RoleGuard } from './Guards/role.guard';

const routes: Routes = [
  { path: '', redirectTo: '/hotels', pathMatch: 'full' },
  { path: 'hotels', component: HotelCardsComponent },
  { path: 'hotels/:id', component: HotelComponent },
  { 
    path: 'hotels/:id/edit', 
    canActivate: [RoleGuard],
    data: {
      roles: [roles.admin]
    },
    component: HotelForAdminComponent 
  },
  { 
    path: 'change-password',
    canActivate: [AuthGuard],
    component: ChangePasswordComponent 
  },
  {
    path: 'facilities',
    canActivate: [RoleGuard],
    data: {
      roles: [roles.admin]
    },
    component: AddFacilitiesComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}