import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { TaskTableComponent } from '../task-table/task-table.component';
import { AddtaskModelpopupComponent } from '../../common/addtask-modelpopup/addtask-modelpopup.component';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/common services/auth.service';
import { ApiService } from '../../../core/services/API services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavbarComponent,
    TaskTableComponent,
    AddtaskModelpopupComponent,
    RouterOutlet,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements AfterViewInit {
  isModalOpen = false;
  selectedTask: any = null;
  selectedCard: string = 'tasksAssigned';
  filterType: string = 'mytask';

  // taskNotifications: any[] = [];
  // showNotificationDropdown: boolean = false;
  // assignedTasks: any[] = []; // This should be populated with current assigned tasks

  // Task counts for each type
  myTaskCount: number = 0;
  todayTaskCount: number = 0;
  createdByMeTaskCount: number = 0;
  overdueTaskCount: number = 0;
  taskCompleted: number = 0;

  ngOnInit(): void {}

  constructor(private apiService: ApiService) {
    // this.loadNotifications();
  }

  // // Load notifications from localStorage
  // loadNotifications() {
  //   const storedNotifications = localStorage.getItem('taskNotifications');
  //   if (storedNotifications) {
  //     this.taskNotifications = JSON.parse(storedNotifications);
  //   }
  // }

  // toggleNotificationDropdown() {
  //   this.showNotificationDropdown = !this.showNotificationDropdown;
  // }

  // removeNotification(index: number) {
  //   this.taskNotifications.splice(index, 1);
  // }

  // updateLocalStorage() {
  //   debugger;
  //   localStorage.setItem(
  //     'taskNotifications',
  //     JSON.stringify(this.taskNotifications)
  //   );
  // }

  // // Capture new task notifications
  // onNewTaskNotification(task: any) {
  //   // Check if the task is already in notifications
  //   const taskExists = this.taskNotifications.some(
  //     (notification) => notification.taskId === task.taskId // Use a unique identifier for the task
  //   );

  //   // Ensure the task is part of assigned tasks and not already notified
  //   if (
  //     !taskExists &&
  //     this.assignedTasks.find((t) => t.taskId === task.taskId)
  //   ) {
  //     this.taskNotifications.push(task);
  //     this.updateLocalStorage(); // Update localStorage with the new notification
  //   }
  // }

  // Capture the task counts emitted by TaskTableComponent
  onTaskCountUpdated(event: { type: string; count: number }) {
    switch (event.type) {
      case 'mytask':
        this.myTaskCount = event.count;
        break;
      case 'today':
        this.todayTaskCount = event.count;
        break;
      case 'createdByMe':
        this.createdByMeTaskCount = event.count;
        break;
      case 'overdue':
        this.overdueTaskCount = event.count;
        break;
      case 'taskcomplete':
        this.taskCompleted = event.count;
        break;
    }
  }

  ngAfterViewInit() {
    // Theme toggle
    const toggler = document.getElementById('theme-toggle') as HTMLInputElement;
    toggler.addEventListener('change', function () {
      if (toggler.checked) {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
    });
  }

  selectCard(cardName: string, filter: string): void {
    this.selectedCard = cardName;
    this.filterType = filter;
    this.isModalOpen = false;
  }

  openModal(task = null) {
    this.isModalOpen = true;
    this.selectedTask = task;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedTask = null;
  }

  // Listen for clicks on the document
  // @HostListener('document:click', ['$event'])
  // onDocumentClick(event: MouseEvent) {
  //   const targetElement = event.target as HTMLElement;
  //   const dropdownElement = document.querySelector('.notification-dropdown');
  //   const notificationIcon = document.querySelector('.notif');
  //   if (
  //     dropdownElement &&
  //     !dropdownElement.contains(targetElement) &&
  //     notificationIcon &&
  //     !notificationIcon.contains(targetElement)
  //   ) {
  //     this.showNotificationDropdown = false; // Close the dropdown
  //   }
  // }
}
