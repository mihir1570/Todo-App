import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AddtaskModelpopupComponent } from '../../common/addtask-modelpopup/addtask-modelpopup.component';
import { TodoService } from '../../../core/services/API services/todo.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-task-table',
  standalone: true,
  imports: [AddtaskModelpopupComponent, FormsModule, CommonModule, DatePipe],
  templateUrl: './task-table.component.html',
  styleUrls: ['./task-table.component.css'],
})
export class TaskTableComponent implements OnInit {
  @Output() addTaskClicked = new EventEmitter<void>();
  allTaskList: any[] = [];
  isModalOpen = false;
  selectedTask: any;

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.getAllTask();
  }

  getAllTask() {
    this.todoService.getAllTask().subscribe({
      next: (response: any) => {
        // Assuming response.data contains the task array
        console.log(response.data);
        this.allTaskList = response.data.map((task: any) => ({
          id: task.id,
          taskName: task.title,
          taskEstimatedTime: task.estimatedHours,
          taskAssignedTo: task.createdBy.name, // Use the creator's name as the assigned user
          dueDate: new Date(task.dueDate),
          status: task.status,
        }));
      },
      error: (error) => {
        console.error('Error fetching tasks:', error);
      },
    });
  }

  updateTaskStatus(task: any) {
    // Logic to send the updated status to the API
    console.log('Updated status for task:', task);
    // Here you would typically call the API service to update the task status
  }

  openModal(task: any) {
    this.selectedTask = task;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedTask = null; // Reset selected task
  }
}
