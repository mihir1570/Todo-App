import { CommonModule } from '@angular/common';
import { Component, input, OnInit, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from '../../../core/services/common services/login.service';
import { AuthService } from '../../../core/services/common services/auth.service';
import { User } from '../../../core/models/interface/user';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit {
  isLeftSidebarCollapsed = input.required<boolean>();
  changeIsLeftSidebarCollapsed = output<boolean>();
  user: User | null = null;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.user = this.authService.getUserData();
  }

  items = [
    {
      routeLink: 'dashboard',
      icon: 'fal fa-home',
      label: 'Dashboard',
    },
    // {
    //   routeLink: 'products',
    //   icon: 'fal fa-box-open',
    //   label: 'Products',
    // },
    // {
    //   routeLink: 'pages',
    //   icon: 'fal fa-file',
    //   label: 'Pages',
    // },
    // {
    //   routeLink: 'settings',
    //   icon: 'fal fa-cog',
    //   label: 'Settings',
    // },
  ];

  toggleCollapse(): void {
    this.changeIsLeftSidebarCollapsed.emit(!this.isLeftSidebarCollapsed());
  }

  closeSidenav(): void {
    this.changeIsLeftSidebarCollapsed.emit(true);
  }

  logout() {
    this.loginService.logout();
    this.authService.clearUserData();
    this.router.navigate(['login']);
  }
}
