import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  isLoggedIn(): boolean {
    return !!localStorage.getItem('adminToken'); // Returns true if the token exists in localStorage
  }

  logout(): void {
    localStorage.removeItem('adminToken'); // Remove the token from localStorage on logout
  }
}
