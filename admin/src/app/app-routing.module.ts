import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChangePasswordComponent } from './Components/change-password/change-password.component';
import { HotelCardsComponent } from './Components/hotel-cards/hotel-cards.component';

const routes: Routes = [
  { path: '', component: HotelCardsComponent },
  { path: 'change-password', component: ChangePasswordComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}