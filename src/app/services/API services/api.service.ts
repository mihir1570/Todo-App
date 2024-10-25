import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { finalize, Observable, Subject, tap } from 'rxjs';
import { LoaderService } from '../common services/loader.service';
import { Constant } from '../constant/constant';
import { Task } from '../../core/models/class/task';
import {
  TaskApiResponse,
  TaskStatus,
  User,
} from '../../core/models/interface/user';

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

  getAllUsers(): Observable<{ data: User[] }> {
    return this.http.get<{ data: User[] }>(
      `${Constant.BASE_URL}${Constant.USER_AUTH.GET_ALL_USERS}`
    );
  }

  // ================ // All Perform Tasks API's // =================== //

  save(taskId: string | null, task: Task): Observable<{ data: Task }> {
    this.loaderService.busy();
    const taskOperation = taskId
      ? this.http.patch<{ data: Task }>(
          `${Constant.BASE_URL}${Constant.TASK_API.UPDATE_TASK}/${taskId}`,
          task
        )
      : this.http.post<{ data: Task }>(
          `${Constant.BASE_URL}${Constant.TASK_API.ADD_TASK}`,
          task
        );

    return taskOperation.pipe(
      finalize(() => {
        this.loaderService.idle();
      }),
      tap(() => {
        this._refreshRequire.next();
      })
    );
  }

  statusUpdate(taskId: string, statusObj: { status: TaskStatus }) {
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

  assignMe(
    userId: string,
    page: number,
    sortParams: { [key: string]: string },
    itemsPerPage: number
  ): Observable<TaskApiResponse> {
    debugger;
    this.loaderService.isLoading.next(true);
    let params = new HttpParams().set('page', page).set('limit', itemsPerPage);
    Object.keys(sortParams).forEach((key) => {
      params = params.set(key, sortParams[key]);
    });
    return this.http
      .get<TaskApiResponse>(
        `${Constant.BASE_URL}${Constant.TASK_API.TASK_DETAIL}/${userId}`,
        { params }
      )
      .pipe(
        finalize(() => {
          this.loaderService.isLoading.next(false);
        })
      );
  }

  todayTask(
    page: number,
    sortParams: { [key: string]: string },
    itemsPerPage: number
  ) {
    debugger;
    this.loaderService.isLoading.next(true);
    let params = new HttpParams();
    Object.keys(sortParams).forEach((key) => {
      params = params.set(key, sortParams[key]);
    });
    params = params
      .set('TodayTask', '')
      .set('page', page)
      .set('limit', itemsPerPage);

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

  taskCreatedByMe(
    page: number,
    sortParams: { [key: string]: string },
    itemsPerPage: number
  ) {
    debugger;
    this.loaderService.isLoading.next(true);
    let params = new HttpParams();
    Object.keys(sortParams).forEach((key) => {
      params = params.set(key, sortParams[key]);
    });
    params = params
      .set('TaskCreatedBy', 'true')
      .set('page', page)
      .set('limit', itemsPerPage);

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

  overDueTask(
    page: number,
    sortParams: { [key: string]: string },
    itemsPerPage: number
  ) {
    debugger;
    this.loaderService.isLoading.next(true);
    let params = new HttpParams();
    Object.keys(sortParams).forEach((key) => {
      params = params.set(key, sortParams[key]);
    });
    params = params
      .set('TaskOverDue', 'true')
      .set('page', page)
      .set('limit', itemsPerPage);

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

  taskCompleted(
    page: number,
    sortParams: { [key: string]: string },
    itemsPerPage: number
  ) {
    debugger;
    this.loaderService.isLoading.next(true);
    let params = new HttpParams();
    Object.keys(sortParams).forEach((key) => {
      params = params.set(key, sortParams[key]);
    });
    params = params
      .set('TaskCompleted', 'true')
      .set('page', page)
      .set('limit', itemsPerPage);

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
