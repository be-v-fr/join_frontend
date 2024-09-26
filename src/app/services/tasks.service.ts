import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task } from '../../models/task';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment.development';
import { lastValueFrom, Subject } from 'rxjs';
import { Subtask } from '../../models/subtask';


/**
 * This injectable handles generic tasks operations, including Firestore communication.
 */
@Injectable({
  providedIn: 'root'
})

export class TasksService implements OnDestroy {
  tasks: Task[] = [];
  tasks$: Subject<void> = new Subject<void>();
  newTaskStatus: 'To do' | 'In progress' | 'Await feedback' = 'To do';
  unsubTasks;
  public syncingSubtasks: boolean = false;


  /**
   * Create subscription
   */
  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {
    this.unsubTasks = this.subTasks();
  }


  /**
   * Unsubscribe
   */
  ngOnDestroy() {
    // UNSUB
  }


  /**
   * Subscribe to Firestore "tasks" collection to synchronize "tasks" array
   * @returns subscription
   */
  subTasks() {
    // CREATE SERVER SUB
  }


  async syncTasks(): Promise<void> {
    const url = environment.BASE_URL + 'tasks';
    const resp = await lastValueFrom(this.http.get(url, {
      headers: environment.AUTH_TOKEN_HEADERS
    }));
    this.tasks = [];
    (resp as Array<any>).forEach(tData => {
      this.tasks.push(new Task(tData));
    });
    console.log('tasks synced!', this.tasks);
    this.syncSubtasks();
    this.tasks$.next();
  }


  async syncSubtasks(): Promise<void> {
    if (this.tasks.length > 0) {
      this.syncingSubtasks = true;
      const url = environment.BASE_URL + 'subtasks';
      const resp = await lastValueFrom(this.http.get(url, {
        headers: environment.AUTH_TOKEN_HEADERS
      }));
      this.addSubtasksToTasks(resp as Array<any>);
      console.log('subtasks synced!', this.tasks);
      this.syncingSubtasks = false;
      this.tasks$.next();
    } else {
      console.warn('Subtask syncing not executed because tasks array is empty.')
    }
  }


  addSubtasksToTasks(subtasksData: Array<any>) {
    this.clearSubtasks();
    subtasksData.forEach(stData => this.addSubtaskToTask(new Subtask(stData)));
  }


  clearSubtasks() {
    this.tasks.forEach(t => t.subtasks = []);
  }


  addSubtaskToTask(subtask: Subtask) {
    const tasksArrayIndex: number = this.tasks.findIndex(t => t.id == subtask.task_id);
    if (tasksArrayIndex == -1) {
      console.error('Task with index', subtask.task_id, 'not found!');
    } else {
      this.tasks[tasksArrayIndex].subtasks?.push(subtask);
    }
  }


  /**
   * Add task to database
   * @param task task to be added
   */
  async addTask(task: Task): Promise<Object> {
    const url = environment.BASE_URL + 'tasks';
    const body = task.toJson();
    return lastValueFrom(this.http.post(url, body, {
      headers: environment.AUTH_TOKEN_HEADERS
    }));
  }


  /**
   * Update task in database.
   * The update will only be executed if the task has a valid database ID.
   * @param task task to be updated
   */
  async updateTask(task: Task): Promise<Object | undefined> {
    if (task.id != -1) {
      const url = environment.BASE_URL + 'tasks/' + task.id;
      const body = task.toJson();
      return lastValueFrom(this.http.put(url, body, {
        headers: environment.AUTH_TOKEN_HEADERS
      }));
    } else return;
  }


  /**
   * Delete task from database
   * @param id ID of task to be deleted
   */
  async deleteTask(id: number): Promise<Object | undefined> {
    if (id != -1) {
      const url = environment.BASE_URL + 'tasks/' + id;
      return lastValueFrom(this.http.delete(url, {
        headers: environment.AUTH_TOKEN_HEADERS
      }));
    } else return;
  }


  /**
   * Retrieve a complete task object from task ID
   * @param id Firestore task ID
   * @returns task object
   */
  getTaskById(id: number): Task | undefined {
    return this.tasks.find(t => t.id == id);
  }


  /**
   * Get tasks filtered by task status
   * @param status task status
   * @returns filtered tasks array
   */
  getFilteredTasks(status: 'To do' | 'In progress' | 'Await feedback' | 'Done'): Task[] {
    return this.tasks.filter(t => t.status == status);
  }


  /**
   * Add task to database
   * @param task task to be added
   */
  async addSubtask(subtask: Subtask): Promise<Object> {
    const url = environment.BASE_URL + 'subtasks';
    const body = subtask.toJson();
    return lastValueFrom(this.http.post(url, body, {
      headers: environment.AUTH_TOKEN_HEADERS
    }));
  }


  /**
   * Update subtask in database.
   * The update will only be executed if the task has a valid database ID.
   * @param task task to be updated
   */
  async updateSubtask(subtask: Subtask): Promise<Object | undefined> {
    if (subtask.id != -1) {
      const url = environment.BASE_URL + 'subtasks/' + subtask.id;
      const body = subtask.toJson();
      return lastValueFrom(this.http.put(url, body, {
        headers: environment.AUTH_TOKEN_HEADERS
      }));
    } else return;
  }


  /**
   * Delete subtask from database
   * @param id ID of subtask to be deleted
   */
  async deleteSubtask(id: number): Promise<Object> {
    const url = environment.BASE_URL + 'subtasks/' + id;
    return lastValueFrom(this.http.delete(url, {
      headers: environment.AUTH_TOKEN_HEADERS
    }));
  }
}