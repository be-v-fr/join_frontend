import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../../../../models/task';
import { TasksService } from '../../../shared/tasks.service';
import { User } from '../../../../models/user';
import { TaskCategoryComponent } from '../task-list/task-card/task-category/task-category.component';
import { ContactListItemComponent } from '../../contacts/contact-list-item/contact-list-item.component';
import { CloseBtnComponent } from '../../../templates/close-btn/close-btn.component';
import { PrioIconComponent } from '../../../templates/prio-icon/prio-icon.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-view',
  standalone: true,
  imports: [CommonModule, CloseBtnComponent, TaskCategoryComponent, PrioIconComponent, ContactListItemComponent],
  templateUrl: './task-view.component.html',
  styleUrl: './task-view.component.scss'
})
export class TaskViewComponent {
  users: User[] = [
    new User('test 1', 'id 1'),
    new User('test 2', 'id 2'),
  ];
  @Input() task: Task = new Task('');
  @Output() cancelOverlay = new EventEmitter<void>();
  @Output() editThisTask = new EventEmitter<void>();

  constructor(private tasksService: TasksService) {}

  cancel() {
    this.cancelOverlay.emit();
  }

  toggleSubtaskStatus(index: number) {
    const subtask = this.task.subtasks[index];
    subtask.status == 'To do' ? subtask.status = 'Done' : subtask.status = 'To do';
    this.tasksService.updateTask(this.task);
  }

  deleteTask() {
    this.cancel();
    this.tasksService.deleteTask(this.task.id);
  }

  editTask() {
    this.editThisTask.emit();
  }
}
