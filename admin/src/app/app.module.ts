import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRadioModule } from '@angular/material/radio';
import { MatListModule } from '@angular/material/list';
import { JwtModule } from '@auth0/angular-jwt';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthenticationDialogComponent } from './Components/authenticationDialog/authenticationDialog.component';
import { NavbarComponent } from './Components/navbar/navbar.component';
import { AuthorizationComponent } from './Components/authorization/authorization.component';
import { AdminButtonsComponent } from './Components/admin-buttons/admin-buttons.component';
import { CreateAdminComponent } from './Components/create-admin/create-admin.component';
import { getToken } from './Core/get-token';
import { environment } from 'src/environments/environment';
import { LoginComponent } from './Components/login/login.component';
import { RegisterComponent } from './Components/register/register.component';
import { HotelCardsComponent } from './Components/hotel-cards/hotel-cards.component';
import { HotelsFilterComponent } from './Components/hotels-filter/hotels-filter.component';
import { AccountMenuComponent } from './Components/account-menu/account-menu.component';
import { ChangePasswordComponent } from './Components/change-password/change-password.component';
import { HotelComponent } from './Components/hotel/hotel.component';
import { ImagesComponent } from './Components/images/images.component';
import { HotelForAdminComponent } from './Components/hotel-for-admin/hotel-for-admin.component';
import { ImagesForAdminComponent } from './Components/images-for-admin/images-for-admin.component';
import { ImagesUploadButtonComponent } from './Components/images-upload-button/images-upload-button.component';
import { ImagesDialogComponent } from './Components/images-dialog/images-dialog.component';
import { RoomsComponent } from './Components/rooms/rooms.component';
import { ImagesForAdminDialogComponent } from './Components/images-for-admin-dialog/images-for-admin-dialog.component';
import { RoomsForAdminComponent } from './Components/rooms-for-admin/rooms-for-admin.component';
import { AddFacilitiesComponent } from './Components/add-facilities/add-facilities.component';
import { ChooseFacilitiesForAdminComponent } from './Components/choose-facilities-for-admin/choose-facilities-for-admin.component';
import { OrderComponent } from './Components/order/order.component';
import { AuthInterceptor } from './Components/auth.interceptor';
import { OrdersListComponent } from './Components/orders-list/orders-list.component';
import { BadRequestInterceptor } from './Components/bad-request.interceptor';
import { AccountsListComponent } from './Components/accounts-list/accounts-list.component';
import { AccountComponent } from './Components/account/account.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthenticationDialogComponent,
    NavbarComponent,
    AuthorizationComponent,
    AdminButtonsComponent,
    CreateAdminComponent,
    LoginComponent,
    RegisterComponent,
    HotelCardsComponent,
    HotelsFilterComponent,
    AccountMenuComponent,
    ChangePasswordComponent,
    HotelComponent,
    ImagesComponent,
    HotelForAdminComponent,
    ImagesForAdminComponent,
    ImagesUploadButtonComponent,
    RoomsComponent,
    ImagesDialogComponent,
    ImagesForAdminDialogComponent,
    RoomsForAdminComponent,
    AddFacilitiesComponent,
    ChooseFacilitiesForAdminComponent,
    OrderComponent,
    OrdersListComponent,
    AccountsListComponent,
    AccountComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatFormFieldModule,
    MatDialogModule,
    MatIconModule,
    MatSnackBarModule,
    MatTabsModule,
    MatCardModule,
    MatGridListModule,
    MatPaginatorModule,
    MatMenuModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatTableModule,
    MatSelectModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
    MatRadioModule,
    MatListModule,
    NgxMaterialTimepickerModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: getToken,
        allowedDomains: environment.allowedDomains
      }
    })
],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BadRequestInterceptor,
      multi: true
    }
  ]
})

export class AppModule { }