import { Component, inject, OnInit } from '@angular/core';
import { Task } from '../../../models/task';
import { TasksService } from '../../services/tasks.service';
import { AuthService} from '../../services/auth.service';
import { StatsItemComponent } from './stats-item/stats-item.component';
import { HeadlineSloganComponent } from '../../templates/headline-slogan/headline-slogan.component';
import { CommonModule } from '@angular/common';
import { GreetingComponent } from './greeting/greeting.component';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule, StatsItemComponent, HeadlineSloganComponent, GreetingComponent],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export class SummaryComponent implements OnInit {
  private authService = inject(AuthService);
  private tasksService = inject(TasksService);
  tasks: Task[] = [];
  currentUserName: string | null = null;

  constructor() {
    this.tasks = this.tasksService.tasks;
  }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.currentUserName = user.displayName;
      } else {
        this.currentUserName = null;
      }
    });
    this.updateTasks();
    this.tasksService.getCurrentTasks().subscribe(() => this.updateTasks());
  }

  updateTasks() {
    this.tasks = this.tasksService.tasks;
  }

  getFilteredTasks(status: 'To do' | 'In progress' | 'Await feedback' | 'Done') {
    return this.tasksService.getFilteredTasks(status);
  }

  getUrgent() {
    return this.tasks.filter(t => t.prio == 'Urgent');
  }

  getMostUrgent() {
    const urgentTasks: Task[] = this.getUrgent();
    if (urgentTasks.length == 0) {
      return '';
    } else {
      urgentTasks.sort((a, b) => {
        return a.due.localeCompare(b.due);
      });
      return urgentTasks[0].due;
    }
  }

  printDate(due: string): string {
    const date = new Date(due);
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    return month + ' ' + day + ', ' + year;
  }


}