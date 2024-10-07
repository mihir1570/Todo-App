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
      `${Constant.ADMIN_AUTHENTICATION}${Constant.ADMIN_AUTH.ADD_TASK}`,
      addTaskObj
    );
  }

  getAllUsers(): Observable<any> {
    debugger;
    return this.http.get(
      `${Constant.ADMIN_AUTHENTICATION}${Constant.ADMIN_AUTH.GET_ALL_USER}`
    );
  }

  getAllTask(): Observable<any> {
    debugger;
    return this.http.get(
      `${Constant.ADMIN_AUTHENTICATION}${Constant.ADMIN_AUTH.GET_ALL_TASK}`
    );
  }

  updateTask(taskId: string, taskData: Task) {
    debugger;
    return this.http.put(
      `${Constant.ADMIN_AUTHENTICATION}${Constant.ADMIN_AUTH.UPDATE_TASK}${taskId}`,
      taskData
    );
  }

  deleteTask(taskId: string) {
    debugger;
    return this.http.delete(
      `${Constant.ADMIN_AUTHENTICATION}${Constant.ADMIN_AUTH.DELETE_TASK}${taskId}`
    )
  }


}
