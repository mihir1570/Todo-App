import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TodoService } from '../../../core/services/API services/todo.service';
import { ToastService } from '../../../core/services/common services/toast.service';
import { CookieService } from 'ngx-cookie-service';
import { LoginService } from '../../../core/services/common services/login.service';
import { LoginObj } from '../../../core/models/class/task';
import { User } from '../../../core/models/interface/user';
import { AuthService } from '../../../core/services/common services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  userData: User[] = [];

  loginObj: LoginObj = new LoginObj();

  cookiesService = inject(CookieService);

  constructor(
    private router: Router,
    private todoServices: TodoService,
    private toastService: ToastService,
    private loginService: LoginService,
    private authService: AuthService
  ) {}

  onLogin() {
    if (!this.loginObj.email || !this.loginObj.password) {
      alert('Please enter both email and password.');
      return;
    }

    this.todoServices.adminLogin(this.loginObj).subscribe({
      next: (res: any) => {
        debugger;
        if (res.token) {
          this.userData = res;
          this.authService.setUserData(res.user);
          console.log(res);
          this.loginService.setCookie('cookiesAdmin', res.token, 24, 'hours'); // For 30 seconds/minutes/hours
          this.toastService.showSuccess('Welcome Back');
          this.router.navigate(['dashboard']);
        } else {
          alert('Invalid Credentials');
        }
      },
      error: (err) => {
        console.error('Login failed', err);
        alert('Error occurred during login.');
      },
    });
  }
}
