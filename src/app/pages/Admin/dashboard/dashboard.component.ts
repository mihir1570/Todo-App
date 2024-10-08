import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { TaskTableComponent } from '../task-table/task-table.component';
import { AddtaskModelpopupComponent } from '../../common/addtask-modelpopup/addtask-modelpopup.component';
import { RouterOutlet } from '@angular/router';
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
  selectedCard: string = 'tasksAssigned';
  filterType: string = 'mytask';

  // Task counts for each type
  myTaskCount: number = 0;
  todayTaskCount: number = 0;
  createdByMeTaskCount: number = 0;
  overdueTaskCount: number = 0;
  taskCompleted: number = 0;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

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
}
