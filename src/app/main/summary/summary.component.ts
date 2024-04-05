import { Component } from '@angular/core';
import { Task } from '../../../models/task';
import { TasksService } from '../../shared/tasks.service';
import { StatsItemComponent } from './stats-item/stats-item.component';
import { HeadlineSloganComponent } from '../../templates/headline-slogan/headline-slogan.component';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [StatsItemComponent, HeadlineSloganComponent],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export class SummaryComponent {
  tasks: Task[] = [];

  constructor(private tasksService: TasksService) {
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

  getGreeting(): string {
    const currentHour = new Date().getHours();
    if(currentHour < 4) {return 'Good evening'}
    else if(currentHour < 11) {return 'Good morning'}
    else if(currentHour < 18) {return 'Good day'}
    else {return 'Good evening'}
  }
}