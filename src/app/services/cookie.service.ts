import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CookieService {
  constructor() {}

  setInCookie(key: string, value: string): void {
    document.cookie = `${key}=${value}`;
  }

  getFromCookies(key: string): string {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [cookieKey, cookieValue] = cookie.split('=');
      if (cookieKey.trim() === key) {
        return cookieValue;
      }
    }
    return null;
  }
}
