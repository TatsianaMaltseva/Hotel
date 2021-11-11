export const ACCESS_TOKEN_KEY: string = 'access_token';

export function getToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}