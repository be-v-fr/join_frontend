import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Task } from '../../models/task';
import { Contact } from '../../models/contact';

@Injectable({ providedIn: 'root'})
export class MainService {
  private taskChangeSource = new Subject<Task>();
  taskSubmitted$ = this.taskChangeSource.asObservable();

  submitTask(task: Task) {
    this.taskChangeSource.next(task);
  }
}