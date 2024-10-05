import { CommonModule, JsonPipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostListener,
  Output,
  OnInit,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastService } from '../../../core/services/common services/toast.service';
import { Task } from '../../../core/models/class/task';
import { AuthService } from '../../../core/services/common services/auth.service';
import { ApiService } from '../../../core/services/api services/todo.service';

@Component({
  selector: 'app-addtask-modelpopup',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, JsonPipe],
  templateUrl: './addtask-modelpopup.component.html',
  styleUrls: ['./addtask-modelpopup.component.css'],
})
export class AddtaskModelpopupComponent implements OnInit {
  @Output() closePopup = new EventEmitter<void>();

  // Static list of users
  users = ['John Doe', 'Jane Smith', 'Alex Johnson', 'Assign to me'];

  filteredUsers: any[] = []; // For filtered user list
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
    taskAssignedTo: new FormControl('', [Validators.required]), // Required to validate selection
    taskEstimatedTime: new FormControl('', [Validators.required]),
    taskDueDate: new FormControl('', [Validators.required]),
  });

  constructor(
    private toastService: ToastService,
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Initially, set filteredUsers to the full list of users
    this.filteredUsers = this.users;
  }

  // Function to handle task submission
  onTaskSubmit() {
    if (this.addTaskForm.valid) {
      const currentUser = this.authService.getUserData();
      if (!currentUser) {
        this.toastService.showError('No user logged in');
        return;
      }
      // Create a new Task object
      const newTask = new Task();
      // Assign the task details
      newTask.title = this.addTaskForm.controls['taskTitle'].value;
      newTask.description = this.addTaskForm.controls['taskDescription'].value;
      newTask.assignedTo = this.addTaskForm.controls['taskAssignedTo'].value;
      newTask.dueDate = new Date(
        this.addTaskForm.controls['taskDueDate'].value
      );
      newTask.estimatedHours =
        this.addTaskForm.controls['taskEstimatedTime'].value;
      newTask.createdBy = currentUser.id;

      // Call the service to add the task
      this.apiService.addTask(newTask).subscribe(
        (response) => {
          console.log('Task added successfully:', response);
          this.toastService.showSuccess('Task successfully added!');
          this.close();
        },
        (error) => {
          console.error('Error adding task:', error);
          this.toastService.showError('Failed to add task.');
        }
      );
    } else {
      this.toastService.showError('Please fill all the fields correctly');
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
    this.addTaskForm.controls['taskAssignedTo'].setValue(user); // Set selected user's name as value
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
}

