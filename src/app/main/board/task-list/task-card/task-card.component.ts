import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { Task } from '../../../../../models/task';
import { User } from '../../../../../models/user';
import { UsersService } from '../../../../services/users.service';
import { PersonBadgeComponent } from '../../../../templates/person-badge/person-badge.component';
import { TaskCategoryComponent } from './task-category/task-category.component';
import { PrioIconComponent } from '../../../../templates/prio-icon/prio-icon.component';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule, PersonBadgeComponent, TaskCategoryComponent, PrioIconComponent],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss'
})
export class TaskCardComponent implements OnInit {
  users: User[] = [];
  @Input() task: Task = new Task('');
  private usersService = inject(UsersService);

  ngOnInit(): void {
    this.users = this.usersService.users;   
  }

  printDescription() {
    let printed = this.task.description.slice(0,35);
    if(this.task.description.length > 36) {
      for (let i = 36; i < this.task.description.length; i++) {
        const char = this.task.description.charAt(i);
        if(this.noBreak(char)) {
          printed = printed + char;
        } else {
          printed = printed + '...';
          break;
        }
      }
    }
    return printed;
  }

  noBreak(char: string): boolean {
    const cesura = [' ', ',', '.', ':', '!', '?'];
    return !cesura.includes(char);
  }

  getSubtasksDoneNumber(): number {
    return this.task.subtasks.filter(s => s.status == 'Done').length;
  }
}
