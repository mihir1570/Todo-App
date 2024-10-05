// import { HttpInterceptorFn } from '@angular/common/http';

// export const authInterceptor: HttpInterceptorFn = (req, next) => {
//   const adminToken = localStorage.getItem('adminToken');
//   const userToken = localStorage.getItem('token');

//   let token = adminToken || userToken;

//   if (token) {
//     const clonedReq = req.clone({
//       setHeaders: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     return next(clonedReq);
//   }

//   return next(req);
// };

import {
  HttpEvent,
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const cookieService = inject(CookieService);
  const router = inject(Router);

  const token = cookieService.get('cookiesAdmin');

  // if (token) {
  //   debugger;
  //   const clonedReq = req.clone({
  //     setHeaders: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   });
  //   return next(clonedReq);
  // } else {
  //   router.navigate(['/login']);
  // }

  return next(req);

  // if (!token) {
  //   router.navigate(['/login']);
  // }
  // return next(req);
};
