import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AddtaskModelpopupComponent } from '../../common/addtask-modelpopup/addtask-modelpopup.component';
import { TodoService } from '../../../core/services/API services/todo.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-task-table',
  standalone: true,
  imports: [AddtaskModelpopupComponent, FormsModule, CommonModule, DatePipe],
  templateUrl: './task-table.component.html',
  styleUrl: './task-table.component.css',
})
export class TaskTableComponent implements OnInit {
  @Output() addTaskClicked = new EventEmitter<void>();
  allTaskList: any[] = [];
  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.getAllTask();
  }

  getAllTask() {
    this.todoService.getAlltask().subscribe((res: any) => {
      this.allTaskList = res.data;
      console.log(res.data);
    });
  }
}
