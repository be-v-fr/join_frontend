import { Component, OnInit } from '@angular/core';
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
  tasks: Task[];
  toDo: Task[];
  inProgress: Task[];
  awaitFeedback: Task[];
  done: Task[];

  constructor(private mainService: MainService ) {
    this.tasks = [];
    this.toDo = [];
    this.inProgress = [];
    this.awaitFeedback = [];
    this.done = [];
  }

  ngOnInit() {
    this.mainService.tasksChanged$.subscribe((tasks: Task[]) => {
      this.tasks = tasks;
      this.filterTasks();
      console.log(this.toDo.length);
    });
  }

  filterTasks(): void {
    this.toDo = this.tasks.filter(t => t.status == 'To do');
    this.inProgress = this.tasks.filter(t => t.status == 'In progress');
    this.awaitFeedback = this.tasks.filter(t => t.status == 'Await feedback');
    this.done = this.tasks.filter(t => t.status == 'Done');
  }
}
