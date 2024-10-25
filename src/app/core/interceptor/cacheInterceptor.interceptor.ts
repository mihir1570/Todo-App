// import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
// import { of, tap } from 'rxjs';

// const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes
// const CACHE_PREFIX = 'cache_';

// export const cacheInterceptor: HttpInterceptorFn = (req, next) => {
//   if (req.method !== 'GET') {
//     return next(req);
//   }

//   const cacheKey = `${CACHE_PREFIX}${req.urlWithParams}`;
//   const cachedResponse = localStorage.getItem(cacheKey);
//   const cachedTime = localStorage.getItem(`${cacheKey}_time`);

//   if (cachedResponse && cachedTime) {
//     const now = new Date().getTime();
//     if (now - parseInt(cachedTime) < CACHE_EXPIRY) {
//       console.log(`Serving from cache: ${req.urlWithParams}`);
//       return of(
//         new HttpResponse({
//           body: JSON.parse(cachedResponse),
//           status: 200,
//           statusText: 'OK',
//         })
//       );
//     } else {
//       // Cache expired, remove it
//       localStorage.removeItem(cacheKey);
//       localStorage.removeItem(`${cacheKey}_time`);
//     }
//   }

//   console.log(`Fetching from API: ${req.urlWithParams}`);

//   return next(req).pipe(
//     tap((event) => {
//       if (event instanceof HttpResponse) {
//         localStorage.setItem(cacheKey, JSON.stringify(event.body));
//         localStorage.setItem(
//           `${cacheKey}_time`,
//           new Date().getTime().toString()
//         );
//       }
//     })
//   );
// };
