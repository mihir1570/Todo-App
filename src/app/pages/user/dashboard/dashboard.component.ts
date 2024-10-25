import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskTableComponent } from '../task-table/task-table.component';
import { AddtaskModelpopupComponent } from '../../common/addtask-modelpopup/addtask-modelpopup.component';
import { RouterOutlet } from '@angular/router';
import { ApiService } from '../../../services/API services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
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

  userName = 'Katherine Cooper';
  userHandle = '@probablykat66';
  isMenuActive = false;
  toggleMenu() {
    this.isMenuActive = !this.isMenuActive;
  }
  // Task counts for each type
  myTaskCount: number = 0;
  todayTaskCount: number = 0;
  createdByMeTaskCount: number = 0;
  overdueTaskCount: number = 0;
  taskCompleted: number = 0;

  ngOnInit(): void {}

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
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark');
      toggler.checked = true;
    } else {
      document.body.classList.remove('dark');
      toggler.checked = false; // Default is light mode
    }
    toggler.addEventListener('change', () => {
      if (toggler.checked) {
        document.body.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.body.classList.remove('dark');
        localStorage.setItem('theme', 'light');
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
}
