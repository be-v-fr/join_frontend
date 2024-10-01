import { Injectable } from '@angular/core';
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

export class TasksService {
  tasks: Task[] = [];
  tasks$: Subject<void> = new Subject<void>();
  newTaskStatus: 'To do' | 'In progress' | 'Await feedback' = 'To do';
  public syncingSubtasks: boolean = false;


  /**
   * Create subscription
   */
  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {  }


  init() {
    const tasksEvents = new EventSource(environment.BASE_URL + 'tasks/stream');
    const subtasksEvents = new EventSource(environment.BASE_URL + 'subtasks/stream');
    tasksEvents.onmessage = () => this.syncTasks();
    subtasksEvents.onmessage = () => this.syncSubtasks();
    this.syncTasks();
  }


  async syncTasks(): Promise<void> {
    const url = environment.BASE_URL + 'tasks';
    const resp = await lastValueFrom(this.http.get(url, {
      headers: this.authService.getAuthTokenHeaders(),
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
        headers: this.authService.getAuthTokenHeaders(),
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
    this.addTaskLocally(task);
    const url = environment.BASE_URL + 'tasks';
    const body = task.toJson();
    return lastValueFrom(this.http.post(url, body, {
      headers: this.authService.getAuthTokenHeaders(),
    }));
  }


  addTaskLocally(task: Task): void {
    this.tasks.push(task);
    this.tasks$.next();
  }


  /**
   * Update task in database.
   * The update will only be executed if the task has a valid database ID.
   * @param task task to be updated
   */
  async updateTask(task: Task): Promise<Object | undefined> {
    if (task.id != -1) {
      this.updateTaskLocally(task);
      const url = environment.BASE_URL + 'tasks/' + task.id;
      const body = task.toJson();
      return lastValueFrom(this.http.put(url, body, {
        headers: this.authService.getAuthTokenHeaders(),
      }));
    } else return;
  }


  updateTaskLocally(task: Task): void {
    const tasksArrayIndex = this.tasks.findIndex(t => t.id == task.id);
    if(tasksArrayIndex >= 0) {
      this.tasks[tasksArrayIndex] = task;
      this.tasks$.next();
    } else {
      console.error('Task with ID', task.id, 'could not be updated (task not found).');
    }
  }


  /**
   * Delete task from database
   * @param id ID of task to be deleted
   */
  async deleteTask(id: number): Promise<Object | undefined> {
    if (id != -1) {
      this.deleteTaskLocally(id);
      const url = environment.BASE_URL + 'tasks/' + id;
      return lastValueFrom(this.http.delete(url, {
        headers: this.authService.getAuthTokenHeaders(),
      }));
    } else return;
  }


  deleteTaskLocally(id: number): void {
    const tasksArrayIndex = this.tasks.findIndex(t => t.id == id);
    if(tasksArrayIndex >= 0) {
      this.tasks.splice(tasksArrayIndex, 1);
      this.tasks$.next();
    } else {
      console.error('Task with ID', id, 'could not be deleted (task not found).');
    }
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
      headers: this.authService.getAuthTokenHeaders(),
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
        headers: this.authService.getAuthTokenHeaders(),
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
      headers: this.authService.getAuthTokenHeaders(),
    }));
  }
}