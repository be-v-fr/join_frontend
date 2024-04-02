import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Task } from '../../models/task';
import { Contact } from '../../models/contact';

@Injectable({ providedIn: 'root'})
export class MainService {

  private taskSubmitSource = new Subject<Task>();
  private tasksChangeSource = new Subject<Task[]>();
  taskSubmitted$ = this.taskSubmitSource.asObservable();
  tasksChanged$ = this.tasksChangeSource.asObservable();

  submitTask(task: Task) {
    this.taskSubmitSource.next(task);
  }

  changeTasks(tasks: Task[]) {
    this.tasksChangeSource.next(tasks);
  }
}