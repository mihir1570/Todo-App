import { CommonModule, JsonPipe } from '@angular/common';
import { Component, EventEmitter, HostListener, Output } from '@angular/core';
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
  styleUrls: ['./addtask-modelpopup.component.css'],
})
export class AddtaskModelpopupComponent {
  @Output() closePopup = new EventEmitter<void>();

  users = ['John Doe', 'Jane Smith', 'Alex Johnson', 'Assign to me'];
  filteredUsers = [...this.users]; // Create a copy for filtering
  taskFormValue: any;
  isDropdownOpen = false; // Track dropdown open state

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

  constructor(
    private toastService: ToastService,
    private todoService: TodoService
  ) {}

  // Handle form submission
  onTaskSubmit() {
    if (this.addTaskForm.valid) {
      this.taskFormValue = this.addTaskForm.value;
      this.todoService
        .addTask(this.taskFormValue)
        .subscribe((response: any) => {
          if (response.result) {
            this.toastService.showSuccess('Task added successfully');
            this.close();
          } else {
            this.toastService.showError('Error adding task');
          }
        });
    } else {
      this.toastService.showError('Please fill all the fields');
      this.addTaskForm.markAllAsTouched();
    }
  }

  // Filter users based on the search input
  filterUsers(event: Event) {
    const searchValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredUsers = this.users.filter((user) =>
      user.toLowerCase().includes(searchValue)
    );
  }

  // Select a user from the dropdown
  selectUser(user: string) {
    this.addTaskForm.controls['taskAssignedTo'].setValue(user);
    this.isDropdownOpen = false; // Close the dropdown after selection
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown-container')) {
      this.isDropdownOpen = false;
    }
  }

  // Close modal
  close() {
    this.closePopup.emit();
  }

  openCalendar() {
    // This method can be customized to handle extra functionalities if you're using a custom date picker
  }
}
