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
import { JwtModule } from '@auth0/angular-jwt';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { environment } from 'src/environments/environment';
import { AuthorizationDialogComponent } from './Components/authorizationDialog/authorizationDialog.component';
import { NavbarComponent } from './Components/navbar/navbar.component';
import { getToken } from './Core/getToken';
import { AuthorizationComponent } from './Components/authorization/authorization.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthorizationDialogComponent,
    NavbarComponent,
    AuthorizationComponent
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
      // any request sent using HttpClient will automatically attach token as an Authorization header
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