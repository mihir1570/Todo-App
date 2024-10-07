import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api services/todo.service';

@Component({
  selector: 'app-task-table',
  standalone: true,
  imports: [FormsModule, CommonModule, DatePipe],
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

  isModalOpen = false;
  selectedTask: any;

  constructor(private apiService: ApiService) {} // Inject the ApiService

  ngOnInit(): void {
    this.fetchTasks(); // Fetch tasks when the component initializes
  }

  fetchTasks() {
    this.apiService.getAllTask().subscribe((response) => {
      this.allTaskList = response.data.map((task: any) => ({
        id: task.id,
        taskName: task.title, // Renamed for consistency with your HTML
        taskEstimatedTime: task.estimatedHours,
        taskAssignedTo: task.createdBy.name, // Assuming you want the creator's name as assigned to
        dueDate: new Date(task.dueDate),
        status: task.status,
        description: task.description,
      }));
      this.updatePaginatedTasks(); // Update the pagination after fetching tasks
    });
  }

  updateTaskStatus(task: any) {
    console.log('Updated status for task:', task);
    // Call to service to update task status
  }

  openModal(task: any) {
    this.selectedTask = task;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedTask = null;
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
