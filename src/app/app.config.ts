import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import {
  BrowserAnimationsModule,
  provideAnimations,
} from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { authInterceptor } from './core/interceptor/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    importProvidersFrom([BrowserAnimationsModule]),
    provideAnimations(),
    provideToastr({
      // Toastr configuration for notifications
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      closeButton: true,
      timeOut: 3000,
      progressBar: true,
      progressAnimation: 'increasing',
    }),
    provideAnimationsAsync(),
  ],
};
