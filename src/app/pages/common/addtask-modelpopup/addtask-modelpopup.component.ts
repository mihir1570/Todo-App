import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../core/services/common services/toast.service';

@Component({
  selector: 'app-addtask-modelpopup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './addtask-modelpopup.component.html',
  styleUrl: './addtask-modelpopup.component.css'
})
export class AddtaskModelpopupComponent {
  @Output() closePopup = new EventEmitter<void>();

  constructor(private toastService: ToastService){}
  taskTitle: string = '';
  description: string = '';
  assignedTo: string = '';
  estimatedTime: number | null = null;
  dueDate: string = '';
  
  // Placeholder for assigned users
  users = ['John Doe', 'Jane Smith', 'Alex Johnson', 'Assign to me'];

  // Handle form submission
  addTask() {
    if (this.taskTitle && this.description && this.assignedTo && this.estimatedTime !== null && this.dueDate) {
      console.log({
        title: this.taskTitle,
        description: this.description,
        assignedTo: this.assignedTo,
        estimatedTime: this.estimatedTime,
        dueDate: this.dueDate,
      });
      this.closePopup.emit(); // Close the modal after adding the task
    } else {
      alert('Please fill all fields correctly!');
    }
  }

  // Close modal
  close() {
    this.closePopup.emit();
  }
}
