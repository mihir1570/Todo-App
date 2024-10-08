import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { ApiService } from '../../../core/services/API services/api.service';
import { AddtaskModelpopupComponent } from '../../common/addtask-modelpopup/addtask-modelpopup.component';

@Component({
  selector: 'app-task-table',
  standalone: true,
  imports: [FormsModule, CommonModule, DatePipe, AddtaskModelpopupComponent],
  templateUrl: './task-table.component.html',
  styleUrls: ['./task-table.component.css'],
})
export class TaskTableComponent implements OnInit {
  @Output() addTaskClicked = new EventEmitter<void>();

  allTaskList: any[] = []; // Array to hold tasks fetched from the API
  currentPage = 1;
  itemsPerPage = 3; // Number of tasks per page
  paginatedTasks: any[] = [];
  totalPages = 0;

  // Modal state
  isModalOpen = false;
  showInfoModal = false;
  selectedTask: any = null;

  constructor(private apiService: ApiService) {} // Inject the ApiService

  ngOnInit(): void {
    this.fetchTasks(); // Fetch tasks when the component initializes
  }

  fetchTasks() {
    this.apiService.getAllTask().subscribe((response: any) => {
      this.allTaskList = response.data.map((task: any) => ({
        id: task.id, // Ensure task ID is included
        taskName: task.title,
        taskEstimatedTime: task.estimatedHours,
        taskAssignedTo: task.createdBy.name,
        dueDate: new Date(task.dueDate),
        status: task.status,
        description: task.description,
      }));
      this.updatePaginatedTasks();
    });
  }

  updateTaskStatus(task: any) {
    console.log('Updated status for task:', task);
  }

  // Method to open the edit modal
  openInfoModal(task: any) {
    this.selectedTask = task;
    this.showInfoModal = true; // Change modal state
  }

  closeInfoModal() {
    this.showInfoModal = false;
    this.selectedTask = null;
  }

  onEditTask(task: any) {
    this.selectedTask = task;
    this.isModalOpen = true; // Open edit modal
    this.selectedTask.taskId = task.id; // Set the task ID in the modal
    this.selectedTask.task = task; // Pass the entire task object to populate the form
  }

  closeEditModel() {
    this.isModalOpen = false; // Close edit modal
    this.selectedTask = null; // Clear selected task
  }

  deleteTask(taskId: string) {
    // Delete task logic here
  }

  // Pagination logic
  updatePaginatedTasks() {
    this.totalPages = Math.ceil(this.allTaskList.length / this.itemsPerPage);
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedTasks = this.allTaskList.slice(start, end);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedTasks();
    }
  }
}
