import { Component, inject, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { LoginObj } from '../../../core/models/class/task';
import { User } from '../../../core/models/interface/user';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/API services/api.service';
import { ToastService } from '../../../services/common services/toast.service';
import { LoginService } from '../../../services/common services/login.service';
import { AuthService } from '../../../services/common services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnDestroy {
  userData: User[] = [];
  loginObj: LoginObj = new LoginObj();
  errorMessage: string = ''; // Error message placeholder

  cookiesService = inject(CookieService);

  subscriptionList: Subscription[] = [];

  constructor(
    private router: Router,
    private apiService: ApiService,
    private toastService: ToastService,
    private loginService: LoginService,
    private authService: AuthService
  ) {}

  onLogin() {
    this.errorMessage = '';
    const destoryLogin = this.apiService.adminLogin(this.loginObj).subscribe({
      next: (res: any) => {
        if (res.token) {
          this.userData = res;
          this.authService.setUserData(res.user);
          this.loginService.setCookie('cookiesAdmin', res.token, 24, 'hours');
          this.toastService.showSuccess('Welcome Back');
          this.router.navigate(['main']);
        }
      },
      error: (error) => {
        // console.log(error);
        this.errorMessage = 'Invalid Credentials';
      },
    });
    this.subscriptionList.push(destoryLogin);
  }

  ngOnDestroy(): void {
    this.subscriptionList.forEach((sub: Subscription) => sub.unsubscribe());
  }
}
