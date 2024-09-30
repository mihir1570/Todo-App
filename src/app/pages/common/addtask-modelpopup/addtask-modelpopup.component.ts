import { CommonModule, JsonPipe } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastService } from '../../../core/services/common services/toast.service';
import { TodoService } from '../../../core/services/API services/todo.service';

@Component({
  selector: 'app-addtask-modelpopup',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, JsonPipe],
  templateUrl: './addtask-modelpopup.component.html',
  styleUrl: './addtask-modelpopup.component.css',
})
export class AddtaskModelpopupComponent {
  @Output() closePopup = new EventEmitter<void>();

  constructor(
    private toastService: ToastService,
    private todoService: TodoService
  ) {}

  users = ['John Doe', 'Jane Smith', 'Alex Johnson', 'Assign to me'];
  taskFormValue: any;
  addTaskForm: FormGroup = new FormGroup({
    taskTitle: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    taskDescription: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(250),
    ]),
    taskAssignedTo: new FormControl('', [Validators.required]),
    taskEstimatedTime: new FormControl('', [Validators.required]),
    taskDueDate: new FormControl('', [Validators.required]),
  });

  // Handle form submission
  onTaskSubmit() {
    if (this.addTaskForm.valid) {
      this.taskFormValue = this.addTaskForm.value;
      this.todoService
        .addTask(this.taskFormValue)
        .subscribe((response: any) => {
          debugger;
          if (response.result) {
            this.toastService.showSuccess('Task added successfully');
            console.log(response);
          } else {
            this.toastService.showError('Error adding task');
          }
        });
    } else {
      this.toastService.showError('Please fill all the fields');
      this.addTaskForm.markAllAsTouched();
    }
  }
  // Close modal
  close() {
    this.closePopup.emit();
  }
}
