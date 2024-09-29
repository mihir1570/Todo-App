import { Component, EventEmitter, Output } from '@angular/core';
import { AddtaskModelpopupComponent } from "../../common/addtask-modelpopup/addtask-modelpopup.component";

@Component({
  selector: 'app-task-table',
  standalone: true,
  imports: [AddtaskModelpopupComponent],
  templateUrl: './task-table.component.html',
  styleUrl: './task-table.component.css'
})
export class TaskTableComponent {
  @Output() addTaskClicked = new EventEmitter<void>();

}
