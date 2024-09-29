// import { HttpInterceptorFn } from '@angular/common/http';
// import { inject } from '@angular/core';
// import { LoaderService } from '../services/user-services/loader.service';
// import { finalize } from 'rxjs';

// export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
//   const loaderService = inject(LoaderService);
//   loaderService.busy(); // Show the spinner when the request starts
//   return next(req).pipe(
//     finalize(() => {
//       loaderService.idle(); // Hide the spinner when the request completes
//     })
//   );
// };
