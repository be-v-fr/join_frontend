import { Component } from '@angular/core';
import { Task } from '../../../models/task';
import { TaskCardComponent } from './task-card/task-card.component';
import { MainService } from '../../shared/main.service';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [TaskCardComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {
  tasks: Task[] = [];

  constructor(private mainService: MainService ) {
    mainService.tasksChanged$.subscribe((tasks: Task[]) => {this.tasks = tasks});
  }

  filterTasksBy(status: 'To do' | 'In progress' | 'Await feedback' | 'Done'): Task[] {
    if(this.tasks.filter(t => t.status == status).length > 0) {
      console.log(this.tasks.filter(t => t.status == status));
    }
    return this.tasks.filter(t => t.status == status);
  }
}
