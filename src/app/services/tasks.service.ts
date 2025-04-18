import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task } from '../../models/task';
import { environment } from '../../environments/environment.development';
import { lastValueFrom, Subject } from 'rxjs';
import { Subtask } from '../../models/subtask';


/**
 * This injectable handles generic tasks operations, including backend communication.
 */
@Injectable({
  providedIn: 'root'
})

export class TasksService {
  TASKS_URL = environment.BASE_URL + 'tasks/';
  public tasksEventSource?: EventSource;
  public subtasksEventSource?: EventSource;
  tasks: Task[] = [];
  tasks$: Subject<void> = new Subject<void>();
  newTaskStatus: 'To do' | 'In progress' | 'Await feedback' = 'To do';
  public syncingSubtasks: boolean = false;


  /**
   * Create subscription
   */
  constructor(
    private http: HttpClient,
  ) {  }


  /**
   * Initialize task and subtask streaming from the server.
   * Listens for server-sent events to synchronize tasks and subtasks in real-time.
   */
  init() {
    this.tasksEventSource = new EventSource(this.TASKS_URL + 'stream/');
    this.subtasksEventSource = new EventSource(this.TASKS_URL + 'subtasks/stream/');
    this.tasksEventSource.onmessage = () => this.syncTasks();
    this.subtasksEventSource.onmessage = () => this.syncSubtasks();
    this.syncTasks();
  }


  /**
   * Synchronize tasks with the backend.
   * Fetches the latest tasks from the server and updates the local task list.
   * @returns A Promise resolving when tasks are synced.
   */
  async syncTasks(): Promise<void> {
    const url = this.TASKS_URL;
    const resp = await lastValueFrom(this.http.get(url));
    this.tasks = [];
    (resp as Array<any>).forEach(tData => {
      this.tasks.push(new Task(tData));
    });
    this.syncSubtasks();
    this.tasks$.next();
  }


  /**
   * Synchronize subtasks with the backend.
   * Fetches the latest subtasks and associates them with their respective tasks.
   * @returns A Promise resolving when subtasks are synced.
   */
  async syncSubtasks(): Promise<void> {
    if (this.tasks.length > 0) {
      this.syncingSubtasks = true;
      const url = this.TASKS_URL + 'subtasks/';
      const resp = await lastValueFrom(this.http.get(url));
      this.addSubtasksToTasks(resp as Array<any>);
      this.syncingSubtasks = false;
      this.tasks$.next();
    }
  }


  /**
   * Add subtasks to their respective tasks.
   * @param subtasksData Array of subtask data from the server.
   */
  addSubtasksToTasks(subtasksData: Array<any>) {
    this.clearSubtasks();
    subtasksData.forEach(stData => this.addSubtaskToTask(new Subtask(stData)));
  }


  /**
   * Clear all subtasks from the tasks.
   * This method is used before re-adding subtasks during synchronization.
   */
  clearSubtasks() {
    this.tasks.forEach(t => t.subtasks = []);
  }


  /**
   * Add a subtask to its corresponding task.
   * @param subtask The subtask to add.
   */
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
    const url = this.TASKS_URL;
    const body = task.toJson();
    return lastValueFrom(this.http.post(url, body));
  }


  /**
   * Add a task locally without communicating with the backend.
   * @param task The task to add locally.
   */
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
      const url = this.TASKS_URL + task.id + '/';
      const body = task.toJson();
      return lastValueFrom(this.http.put(url, body));
    } else return;
  }


  /**
   * Update a task locally without communicating with the backend.
   * @param task The task to update locally.
   */
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
      const url = this.TASKS_URL + id + '/';
      return lastValueFrom(this.http.delete(url));
    } else return;
  }


  /**
   * Delete a task locally without communicating with the backend.
   * @param id The ID of the task to delete locally.
   */
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
   * @param id task ID
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
    const url = this.TASKS_URL + 'subtasks/';
    const body = subtask.toJson();
    return lastValueFrom(this.http.post(url, body));
  }


  /**
   * Update subtask in database.
   * The update will only be executed if the task has a valid database ID.
   * @param task task to be updated
   */
  async updateSubtask(subtask: Subtask): Promise<Object | undefined> {
    if (subtask.id != -1) {
      const url = this.TASKS_URL + 'subtasks/' + subtask.id + '/';
      const body = subtask.toJson();
      return lastValueFrom(this.http.put(url, body));
    } else return;
  }


  /**
   * Delete subtask from database
   * @param id ID of subtask to be deleted
   */
  async deleteSubtask(id: number): Promise<Object> {
    const url = this.TASKS_URL + 'subtasks/' + id + '/';
    return lastValueFrom(this.http.delete(url));
  }
}