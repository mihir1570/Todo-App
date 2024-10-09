import { Injectable } from '@angular/core';
import { Constant } from '../../constant/constant';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Task } from '../../models/class/task';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  // User Authentication Services
  adminLogin(obj: any) {
    return this.http.post(
      `${Constant.BASE_URL}${Constant.USER_AUTH.LOGIN}`,
      obj
    );
  }

  getAllUsers(): Observable<any> {
    return this.http.get(
      `${Constant.BASE_URL}${Constant.USER_AUTH.GET_ALL_USERS}`
    );
  }

  // ================ // ALL TASK // =================== //

  addTask(addTaskObj: Task): Observable<any> {
    return this.http.post(
      `${Constant.BASE_URL}${Constant.TASK_API.ADD_TASK}`,
      addTaskObj
    );
  }

  updateTask(taskId: string, taskData: Task): Observable<any> {
    return this.http.put(
      `${Constant.BASE_URL}${Constant.TASK_API.UPDATE_TASK}/${taskId}`,
      taskData
    );
  }

  statusUpdate(taskId: string, statusObj: { status: string }): Observable<any> {
    debugger;
    return this.http.patch(
      `${Constant.BASE_URL}${Constant.TASK_API.STATUS_UPDATE}/${taskId}`,
      statusObj // Send status object in the request body
    );
  }

  duplicateTask(taskId: string): Observable<any> {
    debugger;
    return this.http.post(
      `${Constant.BASE_URL}${Constant.TASK_API.DUPLICATE_TASK}/${taskId}`,
      null
    );
  }

  deleteTask(taskId: string): Observable<any> {
    debugger;
    return this.http.delete(
      `${Constant.BASE_URL}${Constant.TASK_API.DELETE_TASK}/${taskId}`
    );
  }

  assignMe(userId: string) {
    return this.http.get(
      `${Constant.BASE_URL}${Constant.TASK_API.TASK_DETAIL}/${userId}`
    );
  }

  todayTask() {
    let params = new HttpParams();
    params = params.set('TodayTask', 'true');
    return this.http.get(
      `${Constant.BASE_URL}${Constant.TASK_API.TASK_DETAIL}`,
      {
        params,
      }
    );
  }

  taskCreatedByMe(userId: string) {
    let params = new HttpParams();
    params = params.set('TaskCreatedBy', userId);
    return this.http.get(
      `${Constant.BASE_URL}${Constant.TASK_API.TASK_DETAIL}`,
      {
        params,
      }
    );
  }

  overDueTask() {
    let params = new HttpParams();
    params = params.set('TaskOverDue', 'true');
    return this.http.get(
      `${Constant.BASE_URL}${Constant.TASK_API.TASK_DETAIL}`,
      {
        params,
      }
    );
  }

  taskCompleted() {
    let params = new HttpParams();
    params = params.set('TaskCompleted', 'true');
    return this.http.get(
      `${Constant.BASE_URL}${Constant.TASK_API.TASK_DETAIL}`,
      {
        params,
      }
    );
  }
}
