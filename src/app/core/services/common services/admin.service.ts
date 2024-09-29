import { Injectable } from '@angular/core';
import { Constant } from '../../constant/constant';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private http: HttpClient) {}
  adminLogin(obj: any) {
    debugger
    return this.http.post(
      `${Constant.ADMIN_AUTHENTICATION}${Constant.ADMIN_AUTH.ADMIN_LOGIN}`,
      obj
    );
  }
}
