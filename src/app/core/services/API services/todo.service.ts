import { Injectable } from '@angular/core';
import { Constant } from '../../constant/constant';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Task } from '../../models/class/task';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  adminLogin(obj: any) {
    debugger;
    return this.http.post(
      `${Constant.ADMIN_AUTHENTICATION}${Constant.ADMIN_AUTH.ADMIN_LOGIN}`,
      obj
    );
  }

  addTask(addTaskObj: Task): Observable<any> {
    debugger;
    return this.http.post(
      `${Constant.TODO_APP}${Constant.TODO_METHODS.addTask}`,
      addTaskObj
    );
  }

  getAllUsers(): Observable<any> {
    return this.http.get(
      `https://2563-110-227-199-245.ngrok-free.app/api/users`
    );
  }

  getAllTask(): Observable<any> {
    debugger;
    return this.http.get(`http://192.168.29.138:3000/api/task`);
  }
}
