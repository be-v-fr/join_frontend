import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { Task } from '../../../../../models/task';
import { User } from '../../../../../models/user';
import { UsersService } from '../../../../services/users.service';
import { PersonBadgeComponent } from '../../../../templates/person-badge/person-badge.component';
import { TaskCategoryComponent } from './task-category/task-category.component';
import { PrioIconComponent } from '../../../../templates/prio-icon/prio-icon.component';
import { ArrowBackBtnComponent } from '../../../../templates/arrow-back-btn/arrow-back-btn.component';
import { TasksService } from '../../../../services/tasks.service';
import { CloseBtnComponent } from '../../../../templates/close-btn/close-btn.component';
import { Observable } from 'rxjs';


/**
 * This component displays a task as a small card which can be clicked to edit.
 */
@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule, PersonBadgeComponent, TaskCategoryComponent, PrioIconComponent, ArrowBackBtnComponent, CloseBtnComponent],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss'
})
export class TaskCardComponent implements OnInit {
  users: User[] = [];
  @Input() task: Task = new Task('');
  displayDropdown: boolean = false;
  @Input() closeDropdown: Observable<void> = new Observable<void>();
  private usersService = inject(UsersService);
  private tasksService = inject(TasksService);


  /**
   * Initialize users array and closing dropdown menu subscription
   * (to react to clicks onto the "board" component)
   */
  ngOnInit(): void {
    this.users = this.usersService.users;
    this.closeDropdown.subscribe(() => this.displayDropdown = false);
  }


  /**
   * This function prints the task description as displayed to the user.
   * The description is only to be displayed up to a certain length.
   * Thus, longer descriptions are cut off, which is signaled to the user by adding dots ("...").
   * @returns transformed description
   */
  printDescription(): String {
    let printed = this.task.description.slice(0,35);
    if(this.task.description.length > 36) {
      for (let i = 36; i < this.task.description.length; i++) {
        const char = this.task.description.charAt(i);
        if(!this.isBreak(char)) {printed = printed + char}
        else {
          printed = printed + '...';
          break;
        }
      }
    }
    return printed;
  }


  /**
   * Check if a character marks a cesura/break between words
   * @param char character to check
   * @returns check result 
   */
  isBreak(char: string): boolean {
    const cesura = [' ', ',', '.', ':', '!', '?'];
    return cesura.includes(char);
  }


  /**
   * This function returns the number of subtasks whose status is set to "Done"
   * @returns "Done" number
   */
  getSubtasksDoneNumber(): number {
    return this.task.subtasks.filter(s => s.status == 'Done').length;
  }


  toggleDropdown(): void {
    this.displayDropdown = !this.displayDropdown;
  }


  setStatus(status: 'To do' | 'In progress' | 'Await feedback' | 'Done'): void {
    this.task.status = status;
    this.tasksService.updateTask(this.task);
  }
}
