import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { ApiService } from '../../../core/services/API services/api.service';
import { AddtaskModelpopupComponent } from '../../common/addtask-modelpopup/addtask-modelpopup.component';
import { AuthService } from '../../../core/services/common services/auth.service';
import { AllTask, TaskApiResponse } from '../../../core/models/interface/user';

@Component({
  selector: 'app-task-table',
  standalone: true,
  imports: [FormsModule, CommonModule, DatePipe, AddtaskModelpopupComponent],
  templateUrl: './task-table.component.html',
  styleUrls: ['./task-table.component.css'],
})
export class TaskTableComponent implements OnInit {
  @Output() addTaskClicked = new EventEmitter<void>();
  @Input() filterType: string = 'mytask';
  @Output() taskCountUpdated = new EventEmitter<{
    type: string;
    count: number;
  }>(); // New Output for emitting task counts

  myTaskList: any[] = [];
  todayTaskList: any[] = [];
  taskCreatedByMeList: any[] = [];
  taskOverDueList: any[] = [];
  taskCompletedList: any = [];
  currentPage = 1;
  itemsPerPage = 3; // Number of tasks per page
  paginatedTasks: any[] = [];
  totalPages = 0;
  currentUser: any = null;

  // Modal state
  isModalOpen = false;
  showInfoModal = false;
  selectedTask: any = null;

  // Track the current view of tasks
  currentView: 'mytask' | 'today' | 'overdue' | 'taskcomplete' | 'createdByMe' =
    'mytask';

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {} // Inject the ApiService

  ngOnInit(): void {
    this.currentUser = this.authService.getUserData();
    this.applyFilter();
    this.myTask();
    this.todayAllTask();
    this.taskCreatedByMe();
    this.allTaskOverDue();
    this.myTaskCompleted();
  }

  ngOnChanges() {
    this.applyFilter();
  }

  // =======================API fetch===========================

  myTask() {
    const userId = this.currentUser?.id;
    this.apiService.assignMe(userId).subscribe((response: any) => {
      this.myTaskList = response.data.map((task: AllTask) => ({
        id: task.id,
        taskName: task.title,
        taskEstimatedTime: task.estimatedHours,
        taskAssignedTo: task.createdBy.name,
        dueDate: new Date(task.dueDate),
        status: task.status,
        description: task.description,
      }));
      this.currentView = 'mytask';
      this.updatePaginatedTasks();
      this.emitTaskCount('mytask', this.myTaskList.length);
    });
  }

  todayAllTask() {
    this.apiService.todayTask().subscribe((response: any) => {
      this.todayTaskList = response.data.map((task: any) => ({
        id: task.id,
        taskName: task.title,
        taskEstimatedTime: task.estimatedHours,
        taskAssignedTo: task.createdBy.name,
        dueDate: new Date(task.dueDate),
        status: task.status,
        description: task.description,
      }));
      this.currentView = 'today';
      this.updatePaginatedTasks();
      this.emitTaskCount('today', this.todayTaskList.length);
    });
  }

  taskCreatedByMe() {
    const userId = this.currentUser?.id;
    this.apiService.taskCreatedByMe(userId).subscribe((response: any) => {
      this.taskCreatedByMeList = response.data.map((task: any) => ({
        id: task.id,
        taskName: task.title,
        taskEstimatedTime: task.estimatedHours,
        taskAssignedTo: task.createdBy.name,
        dueDate: new Date(task.dueDate),
        status: task.status,
        description: task.description,
      }));
      this.currentView = 'createdByMe'; // Update current view
      this.emitTaskCount('createdByMe', this.taskCreatedByMeList.length);
      this.updatePaginatedTasks();
    });
  }

  allTaskOverDue() {
    this.apiService.overDueTask().subscribe((response: any) => {
      this.taskOverDueList = response.data.map((task: any) => ({
        id: task.id,
        taskName: task.title,
        taskEstimatedTime: task.estimatedHours,
        taskAssignedTo: task.createdBy.name,
        dueDate: new Date(task.dueDate),
        status: task.status,
        description: task.description,
      }));
      this.currentView = 'overdue'; // Update current view
      this.updatePaginatedTasks();
      this.emitTaskCount('overdue', this.taskOverDueList.length);
    });
  }

  myTaskCompleted() {
    debugger;
    this.apiService.taskCompleted().subscribe((response: any) => {
      this.taskCompletedList = response.data.map((task: any) => ({
        id: task.id,
        taskName: task.title,
        taskEstimatedTime: task.estimatedHours,
        taskAssignedTo: task.createdBy.name,
        dueDate: new Date(task.dueDate),
        status: task.status,
        description: task.description,
      }));
      this.currentView = 'taskcomplete';
      this.updatePaginatedTasks();
      this.emitTaskCount('taskcomplete', this.taskCompletedList.length);
    });
  }

  emitTaskCount(type: string, count: number) {
    this.taskCountUpdated.emit({ type, count });
  }

  applyFilter() {
    switch (this.filterType) {
      case 'mytask':
        this.myTask();
        break;
      case 'today':
        this.todayAllTask();
        break;
      case 'createdByMe':
        this.taskCreatedByMe();
        break;
      case 'overdue':
        this.allTaskOverDue();
        break;
      case 'taskcomplete':
        this.myTaskCompleted();
        break;
      default:
        this.myTask();
        break;
    }
  }

  // Pagination logic
  updatePaginatedTasks() {
    let tasksToPaginate = [];
    switch (this.currentView) {
      case 'mytask':
        tasksToPaginate = this.myTaskList;
        break;
      case 'today':
        tasksToPaginate = this.todayTaskList;
        break;
      case 'createdByMe':
        tasksToPaginate = this.taskCreatedByMeList;
        break;
      case 'overdue':
        tasksToPaginate = this.taskOverDueList;
        break;
      case 'taskcomplete':
        tasksToPaginate = this.taskCompletedList;
        break;
    }

    this.totalPages = Math.ceil(tasksToPaginate.length / this.itemsPerPage);
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedTasks = tasksToPaginate.slice(start, end);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedTasks();
    }
  }

  // ==================================================

  updateTaskStatus(task: any) {
    console.log('Updated status for task:', task);
  }

  // Method to open the edit modal
  openInfoModal(task: any) {
    this.selectedTask = task;
    this.showInfoModal = true;
  }

  closeInfoModal() {
    this.showInfoModal = false;
    this.selectedTask = null;
  }

  onEditTask(task: any) {
    this.selectedTask = task;
    this.isModalOpen = true;
    this.selectedTask.taskId = task.id;
    this.selectedTask.task = task;
  }

  closeEditModel() {
    this.isModalOpen = false;
    this.selectedTask = null;
  }

  deleteTask(taskId: string) {
    // Delete task logic here
  }
}
