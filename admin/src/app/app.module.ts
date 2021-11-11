import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { JwtModule } from '@auth0/angular-jwt';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthorizationDialogComponent } from './Components/authorizationDialog/authorizationDialog.component';
import { NavbarComponent } from './Components/navbar/navbar.component';
import { AuthorizationComponent } from './Components/authorization/authorization.component';
import { AdminButtonsComponent } from './Components/admin-buttons/admin-buttons.component';
import { RegistrationComponent } from './Components/registration/registration.component';
import { getToken } from './Core/getToken';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    AuthorizationDialogComponent,
    NavbarComponent,
    AuthorizationComponent,
    AdminButtonsComponent,
    RegistrationComponent
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
    JwtModule.forRoot({
      config: {
        tokenGetter: getToken,
        allowedDomains: environment.allowedDomains
      }
    })
],
  bootstrap: [AppComponent]
})
export class AppModule { }