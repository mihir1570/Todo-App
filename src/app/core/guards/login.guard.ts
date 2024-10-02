// import { Injectable } from '@angular/core';
// import { CanActivate, Router } from '@angular/router';
// import { LoginService } from '../services/common services/login.service';

// @Injectable({
//   providedIn: 'root',
// })
// export class LoginGuard implements CanActivate {
//   constructor(private loginService: LoginService, private router: Router) {}

//   canActivate(): boolean {
//     if (this.loginService.isLoggedIn()) {
//       return true;
//     } else {
//       this.router.navigate(['/login']); // Redirect to login if not authenticated
//       return false;
//     }
//   }
// }

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate {
  constructor(private router: Router, private cookieService: CookieService) {}

  // Using for Routes sefty
  canActivate(): boolean {
    const token = this.cookieService.get('cookiesAdmin');
    if (token) {
      return true;
    } else {
      this.router.navigate(['/login']); // Redirect to login if not authenticated
      return false;
    }
  }
}
