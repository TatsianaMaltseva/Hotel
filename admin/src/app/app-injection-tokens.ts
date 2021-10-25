import { InjectionToken } from "@angular/core";

export const AUTH_API_URL = new InjectionToken<string>('auth api url') // are the same
export const STORE_API_URL = new InjectionToken<string>('bookstore api url') // delete this one and places it is used in