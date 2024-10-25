import { Routes } from '@angular/router';
import { LoginGuard } from './core/guards/login.guard';
import { LoginComponent } from './pages/user/login/login.component';
import { DashboardComponent } from './pages/user/dashboard/dashboard.component';
import { SidebarComponent } from './pages/common/sidebar/sidebar.component';
import { MainComponent } from './pages/main/main/main.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'main',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'main',
    component: MainComponent,
    canActivate: [LoginGuard], // Protect this route
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [LoginGuard], // Protect this route
      },
    ],
  },
];
