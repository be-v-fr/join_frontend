import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { Task } from '../../../../models/task';
import { TasksService } from '../../../services/tasks.service';
import { User } from '../../../../models/user';
import { UsersService } from '../../../services/users.service';
import { TaskCategoryComponent } from '../task-list/task-card/task-category/task-category.component';
import { ContactListItemComponent } from '../../contacts/contact-list-item/contact-list-item.component';
import { CloseBtnComponent } from '../../../templates/close-btn/close-btn.component';
import { PrioIconComponent } from '../../../templates/prio-icon/prio-icon.component';
import { CommonModule } from '@angular/common';
import { SlideComponent } from '../../../templates/slide/slide.component';

@Component({
  selector: 'app-task-view',
  standalone: true,
  imports: [CommonModule, CloseBtnComponent, TaskCategoryComponent, PrioIconComponent, ContactListItemComponent],
  templateUrl: './task-view.component.html',
  styleUrl: './task-view.component.scss'
})
export class TaskViewComponent extends SlideComponent {
  @Input() task: Task = new Task('');
  @Input() users: User[] = [];
  @Output() cancelOverlay = new EventEmitter<void>();
  @Output() editThisTask = new EventEmitter<void>();
  private usersService = inject(UsersService);
  private tasksService = inject(TasksService);

  constructor() {
    super();
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.users = this.usersService.users;   
  }

  cancel() {
    this.slideInOut();
    setTimeout(() => this.cancelOverlay.emit(), 125);
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
