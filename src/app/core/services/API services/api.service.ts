import { Injectable } from '@angular/core';
import { Constant } from '../../constant/constant';
import { HttpClient } from '@angular/common/http';
import { Task } from '../../models/class/task';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  // User Authentication Services
  adminLogin(obj: any) {
    debugger;
    return this.http.post(
      `${Constant.BASE_URL}${Constant.USER_AUTH.LOGIN}`,
      obj
    );
  }

  getAllUsers(): Observable<any> {
    debugger;
    return this.http.get(
      `${Constant.BASE_URL}${Constant.USER_AUTH.GET_ALL_USERS}`
    );
  }

  // ================ // ALL TASK // =================== //

  addTask(addTaskObj: Task): Observable<any> {
    debugger;
    return this.http.post(
      `${Constant.BASE_URL}${Constant.TASK_API.ADD_TASK}`,
      addTaskObj
    );
  }

  getAllTask(): Observable<any> {
    debugger;
    return this.http.get(
      `${Constant.BASE_URL}${Constant.TASK_API.GET_ALL_TASKS}`
    );
  }

  updateTask(taskId: string, taskData: Task) {
    debugger;
    return this.http.put(
      `${Constant.BASE_URL}${Constant.TASK_API.UPDATE_TASK}/${taskId}`,
      taskData
    );
  }

  deleteTask(taskId: string) {
    debugger;
    return this.http.delete(
      `${Constant.BASE_URL}${Constant.TASK_API.DELETE_TASK}/${taskId}`
    );
  }

  assignMe(userId: string) {
    debugger;
    return this.http.get(
      `${Constant.BASE_URL}${Constant.TASK_API.ASSIGN_ME}/${userId}`
    );
  }
}
