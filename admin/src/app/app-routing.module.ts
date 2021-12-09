import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChangePasswordComponent } from './Components/change-password/change-password.component';
import { HotelCardsComponent } from './Components/hotel-cards/hotel-cards.component';
import { HotelComponent } from './Components/hotel/hotel.component';

const routes: Routes = [
  { path: 'hotels', component: HotelCardsComponent },
  { path: '', redirectTo: '/hotels', pathMatch: 'full' },
  { path: 'change-password', component: ChangePasswordComponent },
  { path: 'hotels/:id', component: HotelComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}