import { Component, HostListener, OnInit, signal } from '@angular/core';
import { NgxSpinnerComponent } from 'ngx-spinner';
import { LoginService } from './core/services/common services/login.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MainComponent } from './pages/main/main/main.component';
import { SidebarComponent } from './pages/common/sidebar/sidebar.component';
import { AddtaskModelpopupComponent } from './pages/common/addtask-modelpopup/addtask-modelpopup.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    NgxSpinnerComponent,
    RouterOutlet,
    MainComponent,
    SidebarComponent,
    AddtaskModelpopupComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  triggerError() {
    throw new Error('Method not implemented.');
  }
  triggerSuccess() {
    throw new Error('Method not implemented.');
  }
  isLeftSidebarCollapsed = signal<boolean>(false);
  screenWidth = signal<number>(window.innerWidth);

  constructor(private loginService: LoginService, private router: Router) {}

  @HostListener('window:resize')
  onResize() {
    this.screenWidth.set(window.innerWidth);
    if (this.screenWidth() < 768) {
      this.isLeftSidebarCollapsed.set(true);
    }
  }

  ngOnInit(): void {
    this.isLeftSidebarCollapsed.set(this.screenWidth() < 768);
  }

  changeIsLeftSidebarCollapsed(isLeftSidebarCollapsed: boolean): void {
    this.isLeftSidebarCollapsed.set(isLeftSidebarCollapsed);
  }

  isLoggedIn(): boolean {
    return this.loginService.isLoggedIn();
  }

  // New method to check if the current route is the login page
  isLoginPage(): boolean {
    return this.router.url === '/login';
  }

  // Expose signal values for use in template
  get isLeftSidebarCollapsedValue(): boolean {
    return this.isLeftSidebarCollapsed();
  }

  get screenWidthValue(): number {
    return this.screenWidth();
  }
}
