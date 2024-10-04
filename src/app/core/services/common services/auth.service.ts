import { Injectable } from '@angular/core';
import { User } from '../../../core/models/interface/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUser: User | null = null;

  constructor() {
    this.loadUserData();
  }

  // Method to load user data from localStorage
  private loadUserData() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
    }
  }

  // Method to set and save user data to localStorage
  setUserData(user: User) {
    this.currentUser = user;
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Method to retrieve user data
  getUserData(): User | null {
    return this.currentUser;
  }

  // Method to clear user data from service and localStorage
  clearUserData() {
    this.currentUser = null;
    localStorage.removeItem('user');
  }
}
