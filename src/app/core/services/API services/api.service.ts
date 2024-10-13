import { Injectable } from '@angular/core';
import { Constant } from '../../constant/constant';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Task } from '../../models/class/task';
import { finalize, Observable, Subject, tap } from 'rxjs';
import { LoaderService } from '../common services/loader.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient, private loaderService: LoaderService) {}

  private _refreshRequire = new Subject<void>();

  get RefreshRequired() {
    return this._refreshRequire;
  }

  // ================ // User Authentication Services // =================== //

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

  // ================ // All Perform Tasks API's // =================== //

  addTask(addTaskObj: Task): Observable<any> {
    debugger;
    this.loaderService.busy();
    return this.http
      .post(`${Constant.BASE_URL}${Constant.TASK_API.ADD_TASK}`, addTaskObj)
      .pipe(
        finalize(() => {
          this.loaderService.idle();
        }),
        tap(() => {
          this._refreshRequire.next();
        })
      );
  }

  updateTask(updateTaskId: string, updatedTask: Task): Observable<any> {
    debugger;
    this.loaderService.busy();
    return this.http
      .patch(
        `${Constant.BASE_URL}${Constant.TASK_API.UPDATE_TASK}/${updateTaskId}`,
        updatedTask
      )
      .pipe(
        finalize(() => {
          this.loaderService.idle();
        }),
        tap(() => {
          this._refreshRequire.next();
        })
      );
  }

  statusUpdate(taskId: string, statusObj: { status: string }) {
    this.loaderService.busy();
    return this.http
      .patch(
        `${Constant.BASE_URL}${Constant.TASK_API.STATUS_UPDATE}/${taskId}`,
        statusObj
      )
      .pipe(
        finalize(() => {
          this.loaderService.idle();
        })
      );
  }

  duplicateTask(taskId: string) {
    this.loaderService.busy();
    return this.http
      .post(
        `${Constant.BASE_URL}${Constant.TASK_API.DUPLICATE_TASK}/${taskId}`,
        null
      )
      .pipe(
        finalize(() => {
          this.loaderService.idle();
        })
      );
  }

  deleteTask(taskId: string) {
    this.loaderService.busy();
    return this.http
      .delete(`${Constant.BASE_URL}${Constant.TASK_API.DELETE_TASK}/${taskId}`)
      .pipe(
        finalize(() => {
          this.loaderService.idle();
        })
      );
  }

  // ================== // Table Data API's // ====================== //

  assignMe(userId: string) {
    this.loaderService.isLoading.next(true);
    return this.http
      .get(`${Constant.BASE_URL}${Constant.TASK_API.TASK_DETAIL}/${userId}`)
      .pipe(
        finalize(() => {
          this.loaderService.isLoading.next(false);
        })
      );
  }

  todayTask() {
    this.loaderService.isLoading.next(true);
    let params = new HttpParams();
    params = params.set('TodayTask', 'true');
    return this.http
      .get(`${Constant.BASE_URL}${Constant.TASK_API.TASK_DETAIL}`, {
        params,
      })
      .pipe(
        finalize(() => {
          this.loaderService.isLoading.next(false);
        })
      );
  }

  taskCreatedByMe(userId: string) {
    this.loaderService.isLoading.next(true);
    let params = new HttpParams();
    params = params.set('TaskCreatedBy', userId);
    return this.http
      .get(`${Constant.BASE_URL}${Constant.TASK_API.TASK_DETAIL}`, {
        params,
      })
      .pipe(
        finalize(() => {
          this.loaderService.isLoading.next(false);
        })
      );
  }

  overDueTask() {
    this.loaderService.isLoading.next(true);
    let params = new HttpParams();
    params = params.set('TaskOverDue', 'true');
    return this.http
      .get(`${Constant.BASE_URL}${Constant.TASK_API.TASK_DETAIL}`, {
        params,
      })
      .pipe(
        finalize(() => {
          this.loaderService.isLoading.next(false);
        })
      );
  }

  taskCompleted() {
    this.loaderService.isLoading.next(true);
    let params = new HttpParams();
    params = params.set('TaskCompleted', 'true');
    return this.http
      .get(`${Constant.BASE_URL}${Constant.TASK_API.TASK_DETAIL}`, {
        params,
      })
      .pipe(
        finalize(() => {
          this.loaderService.isLoading.next(false);
        })
      );
  }
}
