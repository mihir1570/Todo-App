// import { Injectable } from '@angular/core';
// import { User } from '../../../core/models/interface/user';

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthService {
//   private currentUser: User | null = null;

//   constructor() {
//     this.loadUserData();
//   }

//   // Method to load user data from localStorage
//   private loadUserData() {
//     const storedUser = localStorage.getItem('user');
//     if (storedUser) {
//       this.currentUser = JSON.parse(storedUser);
//     }
//   }

//   // Method to set and save user data to localStorage
//   setUserData(user: User) {
//     this.currentUser = user;
//     localStorage.setItem('user', JSON.stringify(user));
//   }

//   // Method to retrieve user data
//   getUserData(): User | null {
//     return this.currentUser;
//   }

//   // Method to clear user data from service and localStorage
//   clearUserData() {
//     this.currentUser = null;
//     localStorage.removeItem('user');
//   }
// }


import { Injectable } from '@angular/core';
import { User } from '../../../core/models/interface/user';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUser: User | null = null;
  private secretKey: string = 'mihir@123'; // Secret key for encryption and decryption

  constructor() {
    this.loadUserData();
  }

  private encryptData(data: string): string {
    return CryptoJS.AES.encrypt(data, this.secretKey).toString();
  }

  private decryptData(data: string): string {
    const bytes = CryptoJS.AES.decrypt(data, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  private loadUserData() {
    const encryptedUser = localStorage.getItem('user');
    if (encryptedUser) {
      const decryptedUser = this.decryptData(encryptedUser);
      this.currentUser = JSON.parse(decryptedUser);
    }
  }

  setUserData(user: User) {
    this.currentUser = user;
    const userDataString = JSON.stringify(user);
    const encryptedData = this.encryptData(userDataString);
    localStorage.setItem('user', encryptedData);
  }

  getUserData(): User | null {
    return this.currentUser;
  }

  clearUserData() {
    this.currentUser = null;
    localStorage.removeItem('user');
  }
}
