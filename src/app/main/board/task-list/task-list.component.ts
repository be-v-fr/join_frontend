import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../../../../models/task';
import { TaskCardComponent } from './task-card/task-card.component';
import { TasksService } from '../../../services/tasks.service';
import { User } from '../../../../models/user';
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
  private lastDragOver: number = 0;
  draggedTaskCard: HTMLElement | null = null;
  @Output() addToStatusClick = new EventEmitter<void>();
  @Output() taskClick = new EventEmitter<string>();

  constructor(private tasksService: TasksService) {}

  onTaskDragStart(ev: DragEvent, id: string) {
    ev.dataTransfer?.setData('text/plain', id);
    this.draggedTaskCard = ev.target as HTMLElement;
  }

  onTaskDragEnd() {
    if (this.draggedTaskCard != null) {
      this.draggedTaskCard = null;
    }
  }

  onTaskDragEnter(ev: DragEvent) {
    this.setDraggingOver(ev);
  }


  onTaskDragOver(ev: DragEvent) {
    this.setDraggingOver(ev);
  }

  setDraggingOver(ev: DragEvent) {
    ev.preventDefault();
    this.draggingOver = true;
    this.lastDragOver = Date.now();
  }

  onTaskDragLeave(ev: DragEvent) {
    ev.preventDefault();
    this.unsetDraggingOverAfterWaiting();
  }

  async unsetDraggingOverAfterWaiting() {
    setTimeout(() => {
      if(Date.now() - this.lastDragOver > 20) {
        this.lastDragOver = 0;
        this.draggingOver = false;
      }
    }, 20);
  }

  onTaskDrop(ev: DragEvent) {
    ev.preventDefault();
    this.draggingOver = false;
    const id = ev.dataTransfer?.getData('text/plain');
    if (id) {
      let task = this.tasksService.getTaskById(id);
      task.status = this.status;
      this.tasksService.updateTask(task);
    }
  }

  addToStatus() {
    this.addToStatusClick.emit();
  }

  viewTask(id: string) {
    this.taskClick.emit(id);
  }
}
