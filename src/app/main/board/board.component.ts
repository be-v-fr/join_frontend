import { Component } from '@angular/core';
import { Task } from '../../../models/task';
import { TaskCardComponent } from './task-card/task-card.component';
import { TasksService } from '../../shared/tasks.service';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [TaskCardComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {
  tasks: Task[];
  toDo: Task[];
  inProgress: Task[];
  awaitFeedback: Task[];
  done: Task[];

  constructor(private tasksService: TasksService ) {
    this.tasks = this.tasksService.tasks;
    this.toDo = this.filterTasksBy('To do');
    this.inProgress = this.filterTasksBy('In progress');
    this.awaitFeedback = this.filterTasksBy('Await feedback');
    this.done = this.filterTasksBy('Done');;
  }

  filterTasksBy(status: 'To do' | 'In progress' | 'Await feedback' | 'Done'): Task[] {
    return this.tasks.filter(t => t.status == status);
  }
}
