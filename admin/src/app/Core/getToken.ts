import { HttpHeaders } from '@angular/common/http';

export const ACCESS_TOKEN_KEY: string = 'access_token';

export function getToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export const authorizationHeader = {
  headers: new HttpHeaders()
  .set('Authorization', `Bearer ${getToken()}`) 
};