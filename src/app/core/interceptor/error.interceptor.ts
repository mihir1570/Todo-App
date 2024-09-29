// import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
// import { inject } from '@angular/core';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { catchError, throwError } from 'rxjs';

// export const errorInterceptor: HttpInterceptorFn = (req, next) => {
//   const snackBar = inject(MatSnackBar);

//   return next(req).pipe(
//     catchError((error: HttpErrorResponse) => {
//       let errorMessage = 'An unknown error occurred!';

//       if (error.error instanceof ErrorEvent) {
//         // Client-side error
//         errorMessage = `Client Error: ${error.error.message}`;
//       } else {
//         // Server-side error
//         errorMessage = `Server Error: ${error.status} - ${error.message}`;
//       }

//       // Display error notification
//       snackBar.open(errorMessage, 'Close', { duration: 5000 });

//       return throwError(() => new Error(errorMessage));
//     })
//   );
// };

import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unknown error occurred!';

      if (error.error instanceof ErrorEvent) {
        errorMessage = `Client Error: ${error.error.message}`;
      } else {
        errorMessage = `Server Error: ${error.status} - ${error.message}`;
      }

      snackBar.open(errorMessage, 'Close', {
        duration: 5000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['custom-snackbar'],
      });

      return throwError(() => new Error(errorMessage));
    })
  );
};
