import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccountsListComponent } from './Components/accounts-list/accounts-list.component';
import { AddFacilitiesComponent } from './Components/add-facilities/add-facilities.component';
import { ChangePasswordComponent } from './Components/change-password/change-password.component';
import { HotelCardsComponent } from './Components/hotel-cards/hotel-cards.component';
import { HotelForAdminComponent } from './Components/hotel-for-admin/hotel-for-admin.component';
import { HotelComponent } from './Components/hotel/hotel.component';
import { NotFoundComponent } from './Components/not-found/not-found.component';
import { OrdersListComponent } from './Components/orders-list/orders-list.component';
import { Role } from './Core/roles';
import { AuthGuard } from './Guards/auth.guard';
import { RoleGuard } from './Guards/role.guard';

const routes: Routes = [
  { path: '', redirectTo: '/hotels', pathMatch: 'full' },
  {
    path: 'hotels',
    children: [
      { path: '', component: HotelCardsComponent },
      {
        path: 'add-new',
        canActivate: [RoleGuard],
        data: {
          roles: [Role.admin]
        },
        component: HotelForAdminComponent
      },
      {
        path: ':id',
        children: [
          { path: '', component: HotelComponent },
          {
            path: 'edit',
            canActivate: [RoleGuard],
            data: {
              roles: [Role.admin]
            },
            component: HotelForAdminComponent
          }
        ]
      }
    ]
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
      roles: [Role.admin]
    },
    component: AddFacilitiesComponent
  },
  {
    path: 'orders',
    data: {
      roles: [Role.client]
    },
    component: OrdersListComponent
  },
  {
    path: 'accounts',
    canActivate: [RoleGuard],
    data: {
      roles: [Role.admin]
    },
    component: AccountsListComponent
  },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}