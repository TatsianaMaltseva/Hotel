import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HotelCardsComponent } from './Components/hotel-cards/hotel-cards.component';

const routes: Routes = [
  { path: '', component: HotelCardsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}