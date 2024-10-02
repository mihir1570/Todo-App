import { inject, Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { setCookieExpirationTime } from '../../utils/cookie-expire-utils';

@Injectable({
  providedIn: 'root',
})

// expire cookies form frontend
export class LoginService {
  cookieService = inject(CookieService);

  isLoggedIn(): boolean {
    return !!this.cookieService.get('cookiesAdmin');
  }

  logout(): void {
    this.cookieService.delete('cookiesAdmin');
  }

  setCookie(
    name: string,
    value: string,
    expireTime: number,
    unit: 'seconds' | 'minutes' | 'hours'
  ) {
    const expirationDate = setCookieExpirationTime(expireTime, unit);
    this.cookieService.set(name, value, { expires: expirationDate });
  }
}
