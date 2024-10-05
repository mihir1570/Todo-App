import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-task-table',
  standalone: true,
  imports: [FormsModule, CommonModule, DatePipe],
  templateUrl: './task-table.component.html',
  styleUrls: ['./task-table.component.css'],
})
export class TaskTableComponent implements OnInit {
  @Output() addTaskClicked = new EventEmitter<void>();

  // List of tasks with random data
  allTaskList = [
    {
      id: 1,
      taskName: 'Design Homepage',
      taskEstimatedTime: 4,
      taskAssignedTo: 'Alice Johnson',
      dueDate: new Date('2024-10-15'),
      status: 'IN_PROGRESS',
      description: 'Complete the design of the main homepage UI for the client.',
    },
    {
      id: 2,
      taskName: 'Fix Login Bugs',
      taskEstimatedTime: 2,
      taskAssignedTo: 'Bob Smith',
      dueDate: new Date('2024-10-12'),
      status: 'PENDING',
      description: 'Resolve issues with user login, including error handling.',
    },
    {
      id: 3,
      taskName: 'Develop API for Dashboard',
      taskEstimatedTime: 6,
      taskAssignedTo: 'Carol White',
      dueDate: new Date('2024-10-20'),
      status: 'COMPLETED',
      description: 'Build and integrate the API for the admin dashboard.',
    },
    {
      id: 4,
      taskName: 'Update User Profiles',
      taskEstimatedTime: 3,
      taskAssignedTo: 'David Brown',
      dueDate: new Date('2024-10-18'),
      status: 'IN_PROGRESS',
      description: 'Enhance the user profile feature with new data fields.',
    },
    {
      id: 5,
      taskName: 'Test Payment Gateway',
      taskEstimatedTime: 5,
      taskAssignedTo: 'Eva Green',
      dueDate: new Date('2024-10-22'),
      status: 'PENDING',
      description: 'Test the integration of the new payment gateway with the app.',
    },
    {
      id: 6,
      taskName: 'Create Analytics Report',
      taskEstimatedTime: 8,
      taskAssignedTo: 'Frank Blue',
      dueDate: new Date('2024-10-25'),
      status: 'PENDING',
      description: 'Generate an analytics report for Q3 performance metrics.',
    },
  ];

  currentPage = 1;
  itemsPerPage = 3;  // Number of tasks per page
  paginatedTasks: any[] = [];
  totalPages = 0;

  isModalOpen = false;
  selectedTask: any;

  ngOnInit(): void {
    this.updatePaginatedTasks();
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
