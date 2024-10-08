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
  users: any[] = [];
  filteredUsers: any[] = [];
  taskList: any[] = [];
  isDropdownOpen = false;

  selectedUserName: string = '';

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
    taskAssignedTo: new FormControl('', [Validators.required]), // Selected user's ID
    taskEstimatedTime: new FormControl('', [Validators.required]),
    taskDueDate: new FormControl('', [Validators.required]),
  });

  constructor(
    private toastService: ToastService,
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.fetchAllUsers();
    if (this.task) {
      this.populateForm(this.task);
    }
  }

  populateForm(task: any) {
    this.addTaskForm.patchValue({
      taskTitle: task.taskName,
      taskDescription: task.description,
      taskEstimatedTime: task.taskEstimatedTime,
      taskDueDate: task.dueDate.toISOString().slice(0, 10),
    });
    this.selectedUserName = task.taskAssignedTo;
  }

  // Fetch users from API
  fetchAllUsers() {
    this.apiService.getAllUsers().subscribe(
      (res: any) => {
        console.log('Response from API:', res); // Check if API response is correct
        this.users = res.data; // Assign users to the users array
        console.log('Users:', this.users); // Log the users data
        this.filteredUsers = this.users; // Initially display all users
        console.log('Filtered Users:', this.filteredUsers); // Log the filtered users to confirm assignment
      },
      (error) => {
        console.error('Error fetching users:', error); // Log any error
      }
    );
  }

  selectUser(user: any) {
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

  // Handle task form submission
  // onTaskSubmit() {
  //   if (this.addTaskForm.valid) {
  //     const currentUser = this.authService.getUserData();
  //     const formData = this.addTaskForm.value;
  //     if (!currentUser) {
  //       this.toastService.showError('No user logged in');
  //       return;
  //     }

  //     // Create a new Task object
  //     const newTask = new Task();
  //     newTask.title = this.addTaskForm.controls['taskTitle'].value;
  //     newTask.description = this.addTaskForm.controls['taskDescription'].value;
  //     newTask.assignedTo = this.addTaskForm.controls['taskAssignedTo'].value; // Selected user's ID
  //     newTask.dueDate = new Date(
  //       this.addTaskForm.controls['taskDueDate'].value
  //     );
  //     newTask.estimatedHours =
  //       this.addTaskForm.controls['taskEstimatedTime'].value;
  //     newTask.createAt = currentUser.id;

  //     // Submit the task to the API
  //     this.apiService.addTask(newTask).subscribe(
  //       (response: any) => {
  //         this.toastService.showSuccess('Task successfully added!');
  //         this.close(); // Close the modal
  //       },
  //       (error) => {
  //         this.toastService.showError('Failed to add task.');
  //       }
  //     );
  //   } else {
  //     this.toastService.showError('Please fill all fields correctly.');
  //     this.addTaskForm.markAllAsTouched();
  //   }
  // }

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
        // If editing, update the task using the task ID
        this.apiService.updateTask(this.taskId, updatedTask).subscribe(
          (response) => {
            this.toastService.showSuccess('Task successfully updated!');
            this.close(); // Close the modal
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
            this.close(); // Close the modal
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

  // Toggle the dropdown open/close state
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

  // Close the modal
  close() {
    this.closePopup.emit();
  }
}
