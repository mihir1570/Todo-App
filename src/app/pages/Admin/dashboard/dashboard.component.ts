import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { TaskTableComponent } from '../task-table/task-table.component';
import { AddtaskModelpopupComponent } from '../../common/addtask-modelpopup/addtask-modelpopup.component';
import { RouterOutlet } from '@angular/router';
import { ApiService } from '../../../core/services/API services/api.service';
import { AuthService } from '../../../core/services/common services/auth.service';

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
export class DashboardComponent {
  isModalOpen = false;
  selectedTask: any = null;
  selectedCard: string = 'tasksAssigned'; // Default selected card
  assignedTasksCount: number = 0; // Store the count of tasks assigned to the user
  currentUser: any = null;

  // Placeholder for the tasks based on selected card
  assignedTasks: any[] = [];
  allTasks: any[] = []; // Store all tasks fetched from API

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getUserData();
    this.loadAssignedTasks(); // Fetch tasks assigned to the user on init
  }

  loadAssignedTasks() {
    const userId = this.currentUser?.id; // Assuming the user ID is available in the currentUser object

    if (userId) {
      this.apiService.assignMe(userId).subscribe(
        (response: any) => {
          this.assignedTasks = response.data || []; // Adjust this based on your API response structure
          this.assignedTasksCount = this.assignedTasks.length;
        },
        (error) => {
          console.error('Error fetching assigned tasks:', error);
        }
      );
    } else {
      console.error('User ID not found');
    }
  }

  selectCard(cardName: string): void {
    this.selectedCard = cardName;
    this.updateDisplayedTasks(); // Update displayed tasks based on selected card
  }

  updateDisplayedTasks() {
    if (this.selectedCard === 'tasksAssigned') {
      this.loadAssignedTasks(); // Reload assigned tasks when the card is selected
    } else if (this.selectedCard === 'todaysTasks') {
      const today = new Date().toISOString().split('T')[0]; // Format to YYYY-MM-DD
      this.assignedTasks = this.assignedTasks.filter(
        (task: any) => task.dueDate.split('T')[0] === today
      );
    } else if (this.selectedCard === 'tasksOverdue') {
      const today = new Date().toISOString().split('T')[0];
      this.assignedTasks = this.assignedTasks.filter(
        (task: any) => task.dueDate < today && task.status !== 'COMPLETED'
      );
    } else if (this.selectedCard === 'tasksCompleted') {
      this.assignedTasks = this.assignedTasks.filter(
        (task: any) => task.status === 'COMPLETED'
      );
    } else if (this.selectedCard === 'tasksCreated') {
      this.assignedTasks = this.assignedTasks.filter(
        (task: any) => task.createdBy.id === this.currentUser.id
      );
    }
  }

  openModal(task = null) {
    this.isModalOpen = true;
    this.selectedTask = task; // Pass task data to modal if editing
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedTask = null;
  }
}
