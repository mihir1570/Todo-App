import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { AddtaskModelpopupComponent } from '../../common/addtask-modelpopup/addtask-modelpopup.component';
import { AllTask, TaskStatus } from '../../../core/models/interface/user';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Subscription } from 'rxjs';
import { ApiService } from '../../../services/API services/api.service';
import { AuthService } from '../../../services/common services/auth.service';
import { ToastService } from '../../../services/common services/toast.service';
import { LoaderService } from '../../../services/common services/loader.service';
import { OrderByPipe } from '../../../core/pips/orderby.pipe';
import { SortingColumnService } from '../../../services/common services/sorting-column.service';

@Component({
  selector: 'app-task-table',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    DatePipe,
    AddtaskModelpopupComponent,
    MatProgressBarModule,
    OrderByPipe,
  ],
  templateUrl: './task-table.component.html',
  styleUrls: ['./task-table.component.css'],
})
export class TaskTableComponent implements OnInit, OnDestroy {
  @Output() addTaskClicked = new EventEmitter<void>();
  @Input() filterType: string = 'mytask';
  @Output() taskCountUpdated = new EventEmitter<{
    type: string;
    count: number;
  }>(); // for emitting task counts

  myTaskList: AllTask[] = [];
  todayTaskList: AllTask[] = [];
  taskCreatedByMeList: AllTask[] = [];
  taskOverDueList: AllTask[] = [];
  taskCompletedList: AllTask[] = [];
  paginatedTasks: any[] = [];
  // Destory Subscribe function
  subscriptionList: Subscription[] = [];

  currentUser: any = null;
  showSortDropdown = false;

  public assignedColumnTitle: string = 'Assigned';
  public tableTitle: string = 'Task List';

  // pagination
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 0;
  maxPageDisplay = 5;
  startPage = 1;
  endPage = this.maxPageDisplay;

  // Modal state
  isModalOpen = false;
  showInfoModal = false;
  selectedTask: any = null;
  taskToDelete: any = null;
  isDeleteModalOpen = false;

  // Get the keys of TaskStatus enum
  taskStatusKeys: TaskStatus[] = Object.keys(TaskStatus) as TaskStatus[];

  taskStatusDisplayNames = {
    PENDING: 'Pending Approval',
    IN_PROGRESS: 'Work in Progress',
    COMPLETED: 'Task Completed',
  };

  // Loading states
  isLoadingTasks = false;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private toastService: ToastService,
    public loadrService: LoaderService,
    public sortingColumn: SortingColumnService
  ) {}

  ngOnInit(): void {
    this.emitTaskCount('mytask', this.myTaskList.length);
    this.loadAllTasks();
    this.currentView = 'mytask';
    this.updatePaginatedTasks();
  }

  loadAllTasks() {
    // this.myTask();
    this.todayAllTask();
    this.taskCreatedByMe();
    this.allTaskOverDue();
    this.myTaskCompleted();
  }

  ngOnChanges() {
    this.currentUser = this.authService.getUserData();
    this.applyFilter();
    this.loadTasksForCurrentView();
    this.apiService.RefreshRequired.subscribe((result) => {
      this.loadAllTasks();
    });
  }

  // Track the current view of tasks
  currentView: 'mytask' | 'today' | 'overdue' | 'taskcomplete' | 'createdByMe' =
    'mytask';

  // =================== Handle Filters and View Switches ================
  applyFilter() {
    this.currentView = this.filterType as
      | 'mytask'
      | 'today'
      | 'overdue'
      | 'taskcomplete'
      | 'createdByMe';
    this.currentPage = 1;
    this.totalPages = 0;
    this.isLoadingTasks = true; // Show loader until data is fetched
    this.updatePaginatedTasks();
    this.loadTasksForCurrentView();
  }

  // ===================Pagination==============

  // Pagination logic
  updatePaginatedTasks() {
    let tasksToPaginate: AllTask[] = [];
    switch (this.currentView) {
      case 'mytask':
        tasksToPaginate = this.myTaskList;
        this.assignedColumnTitle = 'Assigned By';
        this.tableTitle = 'Task List';
        break;
      case 'today':
        tasksToPaginate = this.todayTaskList;
        this.assignedColumnTitle = 'Assigned By';
        this.tableTitle = "Today's Tasks";
        break;
      case 'createdByMe':
        tasksToPaginate = this.taskCreatedByMeList;
        this.assignedColumnTitle = 'Assign To';
        this.tableTitle = 'Tasks created by you';
        break;
      case 'overdue':
        tasksToPaginate = this.taskOverDueList;
        this.assignedColumnTitle = 'Assigned By';
        this.tableTitle = 'Tasks overdue';
        break;
      case 'taskcomplete':
        tasksToPaginate = this.taskCompletedList;
        this.assignedColumnTitle = 'Assigned By';
        this.tableTitle = 'Tasks completed';
        break;
    }

    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedTasks = tasksToPaginate.slice(start, end);

    this.startPage = Math.max(
      1,
      this.currentPage - Math.floor(this.maxPageDisplay / 2)
    );
    this.endPage = Math.min(
      this.startPage + this.maxPageDisplay - 1,
      this.totalPages
    );
    if (this.endPage - this.startPage < this.maxPageDisplay - 1) {
      this.startPage = Math.max(1, this.endPage - this.maxPageDisplay + 1);
    }

    this.isLoadingTasks = false; // Stop loader once tasks are updated
  }

  loadTasksForCurrentView() {
    this.isLoadingTasks = true; // Loading state
    switch (this.currentView) {
      case 'mytask':
        this.myTask();
        break;
      case 'today':
        this.todayAllTask();
        break;
      case 'overdue':
        this.allTaskOverDue();
        break;
      case 'taskcomplete':
        this.myTaskCompleted();
        break;
      case 'createdByMe':
        this.taskCreatedByMe();
        break;
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadTasksForCurrentView();
      this.updatePaginatedTasks();
    }
  }

  goToFirstPage() {
    this.goToPage(1);
  }

  goToLastPage() {
    this.goToPage(this.totalPages);
  }

  // =================== API task data ====================

  toggleSortOrder(column: string) {
    this.sortingColumn.toggleSortOrder(column);
    this.loadTasksForCurrentView();
    this.updatePaginatedTasks();
  }

  myTask() {
    debugger;
    const userId = this.currentUser?.id;
    const itemsPerPage = this.itemsPerPage;
    const sortParams = this.sortingColumn.buildSortParam();
    const destoryMyTask = this.apiService
      .assignMe(userId, this.currentPage, sortParams, itemsPerPage)
      .subscribe({
        next: (response: any) => {
          this.myTaskList = response.result.map((task: AllTask) => ({
            id: task.id,
            taskName: task.title,
            taskEstimatedTime: task.estimatedHours,
            taskAssign: task.createdBy.name,
            dueDate: new Date(task.dueDate),
            status: task.status,
            description: task.description,
            createdById: task.createdBy?.id,
            AssignToId: task.assignedTo?.id,
          }));
          this.totalPages = response.pageCount;
          this.updatePaginatedTasks();
          this.paginatedTasks = this.myTaskList;
          this.emitTaskCount('mytask', response.totalTask);
        },
        error: (error: any) => {
          console.error('Error fetching my tasks:', error);
        },
      });
    this.subscriptionList.push(destoryMyTask);
  }

  todayAllTask() {
    const sortParams = this.sortingColumn.buildSortParam();
    const itemsPerPage = this.itemsPerPage;
    const destorytodayAllTask = this.apiService
      .todayTask(this.currentPage, sortParams, itemsPerPage)
      .subscribe({
        next: (response: any) => {
          this.todayTaskList = response.data.result.map((task: AllTask) => ({
            id: task.id,
            taskName: task.title,
            taskEstimatedTime: task.estimatedHours,
            taskAssign: task.createdBy.name,
            dueDate: new Date(task.dueDate),
            status: task.status,
            description: task.description,
            createdById: task.createdBy?.id,
            AssignToId: task.assignedTo?.id,
          }));
          this.updatePaginatedTasks();
          this.emitTaskCount('today', response.data.totalTask);
          this.paginatedTasks = this.todayTaskList;
          this.totalPages = response.data.pageCount;
        },
        error: (error: any) => {
          console.error("Error fetching today's tasks:", error);
        },
      });
    this.subscriptionList.push(destorytodayAllTask);
  }

  taskCreatedByMe() {
    const sortParams = this.sortingColumn.buildSortParam();
    const itemsPerPage = this.itemsPerPage;
    const destorytaskCreatedByMe = this.apiService
      .taskCreatedByMe(this.currentPage, sortParams, itemsPerPage)
      .subscribe({
        next: (response: any) => {
          this.taskCreatedByMeList = response.data.result.map(
            (task: AllTask) => ({
              id: task.id,
              taskName: task.title,
              taskEstimatedTime: task.estimatedHours,
              taskAssign: task.assignedTo.name,
              dueDate: new Date(task.dueDate),
              status: task.status,
              description: task.description,
              createdById: task.createdBy?.id,
              AssignToId: task.assignedTo?.id,
            })
          );
          this.emitTaskCount('createdByMe', response.data.totalTask);
          this.updatePaginatedTasks();
          this.totalPages = response.data.pageCount;
          this.paginatedTasks = this.taskCreatedByMeList;
        },
        error: (error: any) => {
          console.error('Error fetching tasks created by me:', error);
        },
      });
    this.subscriptionList.push(destorytaskCreatedByMe);
  }

  allTaskOverDue() {
    const sortParams = this.sortingColumn.buildSortParam();
    const itemsPerPage = this.itemsPerPage;
    const destoryallTaskOverDue = this.apiService
      .overDueTask(this.currentPage, sortParams, itemsPerPage)
      .subscribe({
        next: (response: any) => {
          this.taskOverDueList = response.data.result.map((task: AllTask) => ({
            id: task.id,
            taskName: task.title,
            taskEstimatedTime: task.estimatedHours,
            taskAssign: task.createdBy.name,
            dueDate: new Date(task.dueDate),
            status: task.status,
            description: task.description,
            createdById: task.createdBy?.id,
            AssignToId: task.assignedTo?.id,
          }));
          this.updatePaginatedTasks();
          this.emitTaskCount('overdue', response.data.totalTask);
          this.totalPages = response.data.pageCount;
          this.paginatedTasks = this.taskOverDueList;
        },
        error: (error: any) => {
          console.error('Error fetching overdue tasks:', error);
        },
      });
    this.subscriptionList.push(destoryallTaskOverDue);
  }

  myTaskCompleted() {
    const sortParams = this.sortingColumn.buildSortParam();
    const itemsPerPage = this.itemsPerPage;
    const destorymyTaskCompleted = this.apiService
      .taskCompleted(this.currentPage, sortParams, itemsPerPage)
      .subscribe({
        next: (response: any) => {
          this.taskCompletedList = response.data.result.map(
            (task: AllTask) => ({
              id: task.id,
              taskName: task.title,
              taskEstimatedTime: task.estimatedHours,
              taskAssign: task.createdBy.name,
              dueDate: new Date(task.dueDate),
              status: task.status,
              description: task.description,
              createdById: task.createdBy?.id,
              AssignToId: task.assignedTo?.id,
            })
          );
          this.updatePaginatedTasks();
          this.emitTaskCount('taskcomplete', response.data.totalTask);
          this.totalPages = response.data.pageCount;
          this.paginatedTasks = this.taskCompletedList;
        },
        error: (error: any) => {
          console.error('Error fetching completed tasks:', error);
        },
      });
    this.subscriptionList.push(destorymyTaskCompleted);
  }

  emitTaskCount(type: string, count: number) {
    this.taskCountUpdated.emit({ type, count });
  }

  // =================== API for perform =====================

  statusUpdate(taskId: string, status: TaskStatus): void {
    const statusObj = { status }; // Create object with the updated status
    this.apiService.statusUpdate(taskId, statusObj).subscribe({
      next: (response) => {
        if (response) {
          this.loadAllTasks(); // Reload tasks after status update
          this.toastService.showSuccess('Task status updated successfully');
        } else {
          this.toastService.showWarning('Error while updating task');
        }
      },
      error: (error) => {
        console.error('Error updating task status:', error);
        this.toastService.showWarning('Error while updating task');
      },
    });
  }

  openDeleteModal(task: any) {
    this.taskToDelete = task;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
    this.taskToDelete = null;
  }

  confirmDeleteTask() {
    if (this.taskToDelete) {
      this.deleteTask(this.taskToDelete.id, this.taskToDelete);
      this.closeDeleteModal();
    }
  }

  deleteTask(taskId: string, task: any) {
    const userId = this.currentUser?.id;
    if (userId && task.createdById === userId) {
      this.apiService.deleteTask(taskId).subscribe((response: any) => {
        if (response) {
          this.loadAllTasks();
          this.toastService.showSuccess('Task deleted successfully');
        } else {
          this.toastService.showError('Task deletion failed');
        }
      });
    } else {
      this.toastService.showWarning(
        'You are not authorized to delete this task'
      );
    }
  }

  onEditTask(task: any) {
    const userId = this.currentUser?.id;
    if (userId && task.createdById === userId) {
      this.isModalOpen = true;
      this.selectedTask = task; // send to model popup component dynamic data of editing user
      this.selectedTask.taskId = task.id; // send to model popup dynamic task.id
    } else {
      this.toastService.showWarning('You are not authorized to edit this task');
    }
  }

  closeEditModel() {
    this.isModalOpen = false;
    this.selectedTask = null;
  }

  duplicateTask(taskId: string, task: any) {
    const userId = this.currentUser?.id;
    if (userId && task.createdById === userId) {
      const destoryDuplicateTask = this.apiService
        .duplicateTask(taskId)
        .subscribe((response: any) => {
          if (response) {
            this.updatePaginatedTasks();
            this.loadAllTasks();
            this.toastService.showSuccess('Task duplicated success');
          } else {
            this.toastService.showError('Task duplicated failed');
          }
        });
      this.subscriptionList.push(destoryDuplicateTask);
    } else {
      this.toastService.showWarning(
        'You are not authorized to duplicate this task'
      );
    }
  }

  // ============== Method to open the modal ==============

  openInfoModal(task: AllTask) {
    this.selectedTask = task;
    this.showInfoModal = true;
  }

  closeInfoModal() {
    this.showInfoModal = false;
    this.selectedTask = null;
  }

  // Filter Task by latest or oldest
  toggleSortDropdown() {
    this.showSortDropdown = !this.showSortDropdown;
  }

  // Hide dropdown with animation
  closeSortDropdown() {
    const dropdownElement = document.querySelector('.sorting-dropdown');
    if (dropdownElement) {
      dropdownElement.classList.add('hide-dropdown');
      setTimeout(() => {
        this.showSortDropdown = false;
      }, 300);
    }
  }

  // Sort logic as before
  sortTasks(order: string) {
    if (order === 'latest') {
      this.paginatedTasks.sort((a, b) => {
        return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
      });
    } else if (order === 'oldest') {
      this.paginatedTasks.sort((a, b) => {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
    }

    // Close the dropdown after sorting
    this.closeSortDropdown();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.sorting-dropdown') && !target.closest('.bx-filter')) {
      this.showSortDropdown = false;
    }
  }

  // Destory subscriptions
  ngOnDestroy() {
    this.subscriptionList.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
  }
}
