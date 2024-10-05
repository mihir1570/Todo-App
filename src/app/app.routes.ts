import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/Admin/dashboard/dashboard.component';
import { LoginComponent } from './pages/Admin/login/login.component';
import { MainComponent } from './pages/main/main/main.component';
import { LoginGuard } from './core/guards/login.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    // canActivate: [LoginGuard], // Protect this route
  },
];
