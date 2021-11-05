import { ACCESS_TOKEN_KEY } from '../auth.service';


export function getToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}