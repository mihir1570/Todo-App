import { CommonModule, JsonPipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostListener,
  Output,
  OnInit,
  Input,
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
import { ApiService } from '../../../core/services/API services/api.service';
import { User } from '../../../core/models/interface/user';
import { TaskValidatorService } from '../../../core/services/common services/task-validator.service';

@Component({
  selector: 'app-addtask-modelpopup',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, JsonPipe],
  templateUrl: './addtask-modelpopup.component.html',
  styleUrls: ['./addtask-modelpopup.component.css'],
})
export class AddtaskModelpopupComponent implements OnInit {
  @Output() closePopup = new EventEmitter<void>();
  @Input() task: any;
  @Input() taskId: any;
  users: User[] = [];
  filteredUsers: User[] = [];
  taskList: Task[] = [];
  isDropdownOpen = false;

  selectedUserName: string = '';

  addTaskForm: FormGroup = new FormGroup(
    {
      taskTitle: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      taskDescription: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(250),
      ]),
      taskAssignedTo: new FormControl('', [Validators.required]), // Selected user's ID
      taskEstimatedTime: new FormControl('', [Validators.required]),
      taskDueDate: new FormControl('', [Validators.required]),
    },
    { validators: TaskValidatorService.validateTaskTime() } // Apply custom validator
  );

  constructor(
    private toastService: ToastService,
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.fetchAllUsers();
    if (this.task) {
      this.populateForm(this.task);
      console.log(this.task);
    }
  }

  populateForm(task: any) {
    // Patch the form with task values
    this.addTaskForm.patchValue({
      taskTitle: task.taskName,
      taskDescription: task.description,
      taskEstimatedTime: task.taskEstimatedTime,
      taskDueDate: task.dueDate.toISOString().slice(0, 10),
      taskAssignedTo: task.taskAssignedTo,
    });

    // Set the selectedUserName based on the user ID
    const selectedUser = this.users.find(
      (user) => user.id === task.taskAssignedTo
    );
    if (selectedUser) {
      this.selectedUserName = selectedUser.name; // Set the selected user's name
    }
  }


  // Fetch users from API
  fetchAllUsers() {
    this.apiService.getAllUsers().subscribe(
      (res: any) => {
        this.users = res.data;
        this.filteredUsers = this.users;
      },
      (error) => {
        console.error('Error fetching users:', error); // Log any error
      }
    );
  }

  selectUser(user: User) {
    this.addTaskForm.controls['taskAssignedTo'].setValue(user.id);
    this.selectedUserName = user.name;
    this.isDropdownOpen = false;
  }

  // Filter users based on the search input
  filterUsers(event: Event) {
    const searchValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredUsers = this.users.filter((user) =>
      user.name.toLowerCase().includes(searchValue)
    );
  }


  onTaskSubmit() {
    if (this.addTaskForm.valid) {
      const currentUser = this.authService.getUserData();
      const formData = this.addTaskForm.value;
      if (!currentUser) {
        this.toastService.showError('No user logged in');
        return;
      }
      // Create a Task object with the updated data
      const updatedTask = new Task();
      updatedTask.title = this.addTaskForm.controls['taskTitle'].value;
      updatedTask.description =
        this.addTaskForm.controls['taskDescription'].value;
      updatedTask.assignedTo =
        this.addTaskForm.controls['taskAssignedTo'].value; // Selected user's ID
      updatedTask.dueDate = new Date(
        this.addTaskForm.controls['taskDueDate'].value
      );
      updatedTask.estimatedHours =
        this.addTaskForm.controls['taskEstimatedTime'].value;
      updatedTask.createdBy = currentUser.id;

      // Check if editing or adding a task
      if (this.taskId) {
        console.log(updatedTask);
        this.apiService.updateTask(this.taskId, updatedTask).subscribe(
          (response) => {
            this.toastService.showSuccess('Task successfully updated!');
            this.close();
          },
          (error) => {
            this.toastService.showError('Failed to update task.');
          }
        );
      } else {
        // If adding, submit the new task to the API
        this.apiService.addTask(updatedTask).subscribe(
          (response) => {
            this.toastService.showSuccess('Task successfully added!');
            this.close();
          },
          (error) => {
            this.toastService.showError('Failed to add task.');
           
          }
        );
      }
    } else {
      this.toastService.showError('Please fill all fields correctly.');
      this.addTaskForm.markAllAsTouched();
    }
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

  close() {
    this.closePopup.emit();
  }
}
