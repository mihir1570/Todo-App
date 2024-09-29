import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../../../core/services/common services/admin.service';
import { ToastService } from '../../../core/services/common services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  adminData: any[] = [];

  loginObj: any = {
    email: '',
    password: '',
  };

  constructor(
    private router: Router,
    private adminService: AdminService,
    private toastService: ToastService
  ) {}

  onLogin() {
    if (!this.loginObj.email || !this.loginObj.password) {
      alert('Please enter both email and password.');
      return;
    }

    this.adminService.adminLogin(this.loginObj).subscribe({
      next: (res: any) => {
        debugger;
        if (res.token) {
          localStorage.setItem('adminToken', res.token);
          this.toastService.showSuccess("Welcome Back");
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
