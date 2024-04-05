import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../../../../models/task';
import { TaskCardComponent } from './task-card/task-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, TaskCardComponent],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent {
@Input() tasks: Task[] = [];
@Input() status: 'To do' | 'In progress' | 'Await feedback' | 'Done' = 'To do';


draggingOver: boolean = false;
// dragLeave-Funktion??


@Output() addToStatusClick = new EventEmitter<void>();
@Output() taskClick = new EventEmitter<string>();

onTaskDragStart() {
  console.log('drag start!');
}

onTaskDragOver(ev: Event) {
  ev.preventDefault();
  console.log('drag over!');
  this.draggingOver = true;
}

onTaskDrop(ev: Event) {
  ev.preventDefault();
  console.log(ev.target);
  this.draggingOver = false;
}

addToStatus() {
  this.addToStatusClick.emit();
}

viewTask(id: string) {
  this.taskClick.emit(id);
}
}
