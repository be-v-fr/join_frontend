import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../../../../models/task';
import { User } from '../../../../models/user';
import { TaskCategoryComponent } from '../task-card/task-category/task-category.component';
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
    new User('test 1', 'email 1', 'password 1'),
    new User('test 2', 'email 2', 'password 2'),
  ];
  @Input() task: Task = new Task('');
  @Output() cancelOverlay = new EventEmitter<void>();

  cancel() {
    this.cancelOverlay.emit();
  }
}
