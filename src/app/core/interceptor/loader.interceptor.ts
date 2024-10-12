// import { HttpInterceptorFn } from '@angular/common/http';
// import { inject } from '@angular/core';
// import { finalize } from 'rxjs';
// import { LoaderService } from '../services/common services/loader.service';

// export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
//   const loaderService = inject(LoaderService);
//   LoaderService.busy(); // Show the spinner when the request starts
//   return next(req).pipe(
//     finalize(() => {
//       loaderService.idle(); // Hide the spinner when the request completes
//     })
//   );
// };
