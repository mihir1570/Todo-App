import { CommonModule, JsonPipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostListener,
  Output,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Task } from '../../../core/models/class/task';
import { User } from '../../../core/models/interface/user';
import { ToastService } from '../../../services/common services/toast.service';
import { ApiService } from '../../../services/API services/api.service';
import { AuthService } from '../../../services/common services/auth.service';
import { TaskValidatorService } from '../../../services/common services/task-validator.service';
import { CustomValidators } from '../../../core/utils/validator';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-addtask-modelpopup',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, JsonPipe],
  templateUrl: './addtask-modelpopup.component.html',
  styleUrls: ['./addtask-modelpopup.component.css'],
})
export class AddtaskModelpopupComponent implements OnInit, OnDestroy {
  @ViewChild('taskTitleInput') taskTitleInput!: ElementRef; // For focusing task title input
  @Output() closePopup = new EventEmitter<void>();

  @Input() task: any;
  @Input() taskId: any;
  users: User[] = [];
  filteredUsers: User[] = [];
  taskList: Task[] = [];

  isDropdownOpen = false;
  selectedUserName: string = '';

  subscriptionList: Subscription[] = [];

  // addTaskForm: FormGroup = new FormGroup(
  //   {
  //     taskTitle: new FormControl('', [
  //       Validators.required,
  //       CustomValidators.trimmedMinLength(3),
  //       CustomValidators.trimmedMaxLength(25),
  //     ]),
  //     taskDescription: new FormControl('', [
  //       Validators.required,
  //       Validators.minLength(10),
  //       Validators.maxLength(250),
  //     ]),
  //     taskAssignedTo: new FormControl('', [Validators.required]),
  //     taskEstimatedTime: new FormControl('', [Validators.required]),
  //     taskDueDate: new FormControl('', [Validators.required]),
  //   },
  //   { validators: TaskValidatorService.validateTaskTime() } // Apply custom validator
  // );

  addTaskForm: FormGroup = new FormGroup(
    {
      taskTitle: new FormControl('', [
        Validators.required,
        CustomValidators.trimmedMinLength(3),
        CustomValidators.trimmedMaxLength(25),
      ]),
      taskDescription: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(250),
      ]),
      taskAssignedTo: new FormControl('', [Validators.required]),
      taskEstimatedTime: new FormControl('', [
        Validators.required,
        TaskValidatorService.validTimeFormat(), // Apply the new validator here
      ]),
      taskDueDate: new FormControl('', [Validators.required]),
    },
    { validators: TaskValidatorService.validateTaskTime() } // Apply custom validator for date & time
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
      // console.log(this.task);
    }
  }

  ngAfterViewInit() {
    this.taskTitleInput.nativeElement.focus();
  }

  populateForm(task: any) {
    // Patch the form with task values
    this.addTaskForm.patchValue({
      taskTitle: task.taskName,
      taskDescription: task.description,
      taskEstimatedTime: task.taskEstimatedTime,
      taskDueDate: task.dueDate.toISOString().slice(0, 10),
      taskAssign: task.taskAssign,
      taskAssignedTo: task.AssignToId,
    });
    this.selectedUserName = task.taskAssign;
  }

  // Fetch users from API
  fetchAllUsers() {
    this.apiService.getAllUsers().subscribe({
      next: (res: { data: User[] }) => {
        this.users = res.data;
        this.filteredUsers = this.users;
      },
      error: (error: any) => {
        console.error('Error fetching users:', error);
      },
      complete: () => {
        console.log('User fetching operation completed.');
      },
    });
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

  // Add and Edit Task
  onTaskSubmit() {
    if (this.addTaskForm.valid) {
      debugger;
      const currentUser = this.authService.getUserData();
      if (!currentUser) {
        this.toastService.showError('No user logged in');
        return;
      }
      // Create a Task object with the form data
      const task = new Task();
      debugger;
      task.title = this.addTaskForm.controls['taskTitle'].value.trim();
      task.description =
        this.addTaskForm.controls['taskDescription'].value.trim();
      task.assignedTo =
        this.addTaskForm.controls['taskAssignedTo'].value.trim();
      task.dueDate = new Date(this.addTaskForm.controls['taskDueDate'].value);
      task.estimatedHours =
        this.addTaskForm.controls['taskEstimatedTime'].value;

      // Call the save method
      const destoryAddUpdateTask = this.apiService
        .save(this.taskId, task)
        .subscribe({
          next: (response) => {
            // console.log('Task saved successfully:', response);
            const message = this.taskId
              ? 'Task successfully updated!'
              : 'Task successfully added!';
            this.toastService.showSuccess(message);
            this.close();
          },
          error: (error) => {
            const errorMessage = this.taskId
              ? 'Failed to update task.'
              : 'Failed to add task.';
            this.toastService.showError(errorMessage);
            // console.log(errorMessage, error);
          },
          complete: () => {
            // console.log('Task operation complete.');
          },
        });
      this.subscriptionList.push(destoryAddUpdateTask);
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

  onBackgroundClick(event: Event) {
    event.stopPropagation();
  }

  ngOnDestroy(): void {
    this.subscriptionList.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
  }
}
