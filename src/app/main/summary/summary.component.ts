import { Component } from '@angular/core';
import { Task } from '../../../models/task';
import { TasksService } from '../../shared/tasks.service';
import { StatsItemComponent } from './stats-item/stats-item.component';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [StatsItemComponent],
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
      return -1;
    } else {
      urgentTasks.sort((a, b) => {
        return a.due.localeCompare(b.due);
      });
      return urgentTasks[0].due;
    }
  }
}