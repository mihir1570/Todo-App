import { Injectable } from '@angular/core';
import { Constant } from '../../constant/constant';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  constructor(private http: HttpClient) {}
  adminLogin(obj: any) {
    return this.http.post(
      `${Constant.ADMIN_AUTHENTICATION}${Constant.ADMIN_AUTH.ADMIN_LOGIN}`,
      obj
    );
  }

  getAlltask() {
    return this.http.get(
      `${Constant.TODO_APP}${Constant.TODO_METHODS.GetAllTaskList}`
    );
  }

  addTask(obj: any) {
    debugger;
    return this.http.post(
      `${Constant.TODO_APP}${Constant.TODO_METHODS.CreateNewTask}`,
      obj
    );
  }
}
