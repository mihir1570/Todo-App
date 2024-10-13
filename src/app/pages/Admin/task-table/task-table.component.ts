import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { ApiService } from '../../../core/services/API services/api.service';
import { AddtaskModelpopupComponent } from '../../common/addtask-modelpopup/addtask-modelpopup.component';
import { AuthService } from '../../../core/services/common services/auth.service';
import { AllTask } from '../../../core/models/interface/user';
import { ToastService } from '../../../core/services/common services/toast.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LoaderService } from '../../../core/services/common services/loader.service';

@Component({
  selector: 'app-task-table',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    DatePipe,
    AddtaskModelpopupComponent,
    MatProgressBarModule,
  ],
  templateUrl: './task-table.component.html',
  styleUrls: ['./task-table.component.css'],
})
export class TaskTableComponent implements OnInit {
  @Output() addTaskClicked = new EventEmitter<void>();
  @Input() filterType: string = 'mytask';
  @Output() taskCountUpdated = new EventEmitter<{
    type: string;
    count: number;
  }>(); // for emitting task counts
  @Output() newTaskAssigned = new EventEmitter<any>(); // Emit new task as notification




  myTaskList: AllTask[] = [];
  todayTaskList: AllTask[] = [];
  taskCreatedByMeList: AllTask[] = [];
  taskOverDueList: AllTask[] = [];
  taskCompletedList: AllTask[] = [];
  paginatedTasks: any[] = [];

  currentUser: any = null;
  showSortDropdown = false;

  public assignedColumnTitle: string = 'Assigned';
  public tableTitle: string = 'Task List';

  // pagination
  currentPage = 1;
  itemsPerPage = 4;
  totalPages = 0;
  maxPageDisplay = 5; // Maximum number of pagination buttons displayed at a time
  startPage = 1;
  endPage = this.maxPageDisplay;

  // Modal state
  isModalOpen = false;
  showInfoModal = false;
  selectedTask: any = null;

  // Track the current view of tasks
  currentView: 'mytask' | 'today' | 'overdue' | 'taskcomplete' | 'createdByMe' =
    'mytask';

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private toastService: ToastService,
    public loadrService: LoaderService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getUserData();
    this.loadAllTasks();
    this.currentView = 'mytask';
    this.updatePaginatedTasks();
    this.emitTaskCount('mytask', this.myTaskList.length);
    this.apiService.RefreshRequired.subscribe(result => {
     this.loadAllTasks();
    });
  }

  loadAllTasks() {
    this.myTask();
    this.todayAllTask();
    this.taskCreatedByMe();
    this.allTaskOverDue();
    this.myTaskCompleted();
  }

  ngOnChanges() {
    this.applyFilter();
  }

  // =================== API task data ====================

  myTask() {
    const userId = this.currentUser?.id;
    this.apiService.assignMe(userId).subscribe((response: any) => {
      this.myTaskList = response.data.map((task: AllTask) => ({
        id: task.id,
        taskName: task.title,
        taskEstimatedTime: task.estimatedHours,
        taskAssign: task.createdBy.name,
        dueDate: new Date(task.dueDate),
        status: task.status,
        description: task.description,
        createdById: task.createdBy?.id,
      }));
      this.updatePaginatedTasks();
      this.emitTaskCount('mytask', this.myTaskList.length);
      this.myTaskList.forEach((task) => {
        this.newTaskAssigned.emit(task); // Emit new task to parent (Dashboard)
      });
    });
  }

  todayAllTask() {
    this.apiService.todayTask().subscribe((response: any) => {
      this.todayTaskList = response.data.map((task: AllTask) => ({
        id: task.id,
        taskName: task.title,
        taskEstimatedTime: task.estimatedHours,
        taskAssign: task.createdBy.name,
        dueDate: new Date(task.dueDate),
        status: task.status,
        description: task.description,
        createdById: task.createdBy?.id,
      }));
      // this.currentView = 'today';
      this.updatePaginatedTasks();
      this.emitTaskCount('today', this.todayTaskList.length);
    });
  }

  taskCreatedByMe() {
    const userId = this.currentUser?.id;
    this.apiService.taskCreatedByMe(userId).subscribe((response: any) => {
      this.taskCreatedByMeList = response.data.map((task: AllTask) => ({
        id: task.id,
        taskName: task.title,
        taskEstimatedTime: task.estimatedHours,
        taskAssign: task.assignedTo.name,
        dueDate: new Date(task.dueDate),
        status: task.status,
        description: task.description,
        createdById: task.createdBy?.id,
      }));
      // this.assignedColumnTitle = 'Assign To';
      this.emitTaskCount('createdByMe', this.taskCreatedByMeList.length);
      this.updatePaginatedTasks();
    });
  }

  allTaskOverDue() {
    this.apiService.overDueTask().subscribe((response: any) => {
      this.taskOverDueList = response.data.map((task: AllTask) => ({
        id: task.id,
        taskName: task.title,
        taskEstimatedTime: task.estimatedHours,
        taskAssign: task.createdBy.name,
        dueDate: new Date(task.dueDate),
        status: task.status,
        description: task.description,
        createdById: task.createdBy?.id,
      }));
      this.updatePaginatedTasks();
      this.emitTaskCount('overdue', this.taskOverDueList.length);
    });
  }

  myTaskCompleted() {
    this.apiService.taskCompleted().subscribe((response: any) => {
      this.taskCompletedList = response.data.map((task: AllTask) => ({
        id: task.id,
        taskName: task.title,
        taskEstimatedTime: task.estimatedHours,
        taskAssign: task.createdBy.name,
        dueDate: new Date(task.dueDate),
        status: task.status,
        description: task.description,
        createdById: task.createdBy?.id,
      }));
      this.updatePaginatedTasks();
      this.emitTaskCount('taskcomplete', this.taskCompletedList.length);
    });
  }

  // =================== API for perform =====================

  statusUpdate(taskId: string, status: string) {
    const statusObj = { status: status };
    this.apiService
      .statusUpdate(taskId, statusObj)
      .subscribe((response: any) => {
        if (response) {
          this.updatePaginatedTasks();
          this.loadAllTasks();
          this.toastService.showSuccess('Task status updated successfully');
        } else {
          this.toastService.showWarning('Error while updating task');
        }
      });
  }

  deleteTask(taskId: string, task: any) {
    const userId = this.currentUser?.id;
    if (userId && task.createdById === userId) {
      this.apiService.deleteTask(taskId).subscribe((response: any) => {
        if (response) {
          this.loadAllTasks();
          this.toastService.showSuccess('Task delete successfully');
        } else {
          this.toastService.showError('Task deleted failed');
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
      // this.selectedTask.task = task;
    } else {
      this.toastService.showWarning('You are not authorized to edit this task');
    }
  }

  duplicateTask(taskId: string, task: any) {
    const userId = this.currentUser?.id;
    if (userId && task.createdById === userId) {
      this.apiService.duplicateTask(taskId).subscribe((response: any) => {
        if (response) {
          this.updatePaginatedTasks();
          this.loadAllTasks();
          this.toastService.showSuccess('Task duplicated success');
        } else {
          this.toastService.showError('Task duplicated failed');
        }
      });
    } else {
      this.toastService.showWarning(
        'You are not authorized to duplicate this task'
      );
    }
  }

  emitTaskCount(type: string, count: number) {
    this.taskCountUpdated.emit({ type, count });
  }

  applyFilter() {
    // Do not call the API again, just update the view based on the filter
    this.currentView = this.filterType as
      | 'mytask'
      | 'today'
      | 'overdue'
      | 'taskcomplete'
      | 'createdByMe';
    this.updatePaginatedTasks();
  }

  // ===================Pagination==============

  updatePaginatedTasks() {
    let tasksToPaginate = [];

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

    this.totalPages = Math.ceil(tasksToPaginate.length / this.itemsPerPage);
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedTasks = tasksToPaginate.slice(start, end);

    // Adjust startPage and endPage for pagination buttons
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
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedTasks();
    }
  }

  goToFirstPage() {
    this.goToPage(1);
  }

  goToLastPage() {
    this.goToPage(this.totalPages);
  }

  // Method to open the edit modal
  openInfoModal(task: AllTask) {
    this.selectedTask = task;
    this.showInfoModal = true;
  }

  closeInfoModal() {
    this.showInfoModal = false;
    this.selectedTask = null;
  }

  closeEditModel() {
    this.isModalOpen = false;
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
        this.showSortDropdown = false; // Remove it after animation ends
      }, 300); // Timing should match the CSS animation
    }
  }

  sortTasks(order: string) {
    // Sort logic as before
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
}
