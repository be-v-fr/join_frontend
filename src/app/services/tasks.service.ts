import { Injectable, inject, OnDestroy } from '@angular/core';
import { Firestore, collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Task } from '../../models/task';


/**
 * This injectable handles generic tasks operations, including Firestore communication.
 */
@Injectable({
  providedIn: 'root'
})

export class TasksService implements OnDestroy {
  tasks: Task[] = [];
  newTaskStatus: 'To do' | 'In progress' | 'Await feedback' = 'To do';
  unsubTasks;
  firestore: Firestore = inject(Firestore);


  /**
   * Create subscription
   */
  constructor() {
    this.unsubTasks = this.subTasks();
  }


  /**
   * Unsubscribe
   */
  ngOnDestroy() {
    this.unsubTasks();
  }


  /**
   * Subscribe to Firestore "tasks" collection to synchronize "tasks" array
   * @returns subscription
   */
  subTasks() {
    return onSnapshot(this.getColRef(), (list: any) => {
      this.tasks = [];
      list.forEach((element: any) => {
        this.tasks.push(this.setTaskObject(element.data(), element.id));
      });
    });
  }


  /**
   * Get reference to Firestore "tasks" collection
   * @returns reference
   */
  getColRef() {
    return collection(this.firestore, 'tasks');
  }


  /**
   * Get reference to single Firestore task document
   * @param id Firestore task ID
   * @returns reference
   */
  getSingleDocRef(id: string) {
    return doc(this.getColRef(), id);
  }


  /**
   * Add task to Firestore collection
   * @param task task to be added
   */
  async addTask(task: Task) {
    await addDoc(this.getColRef(), this.getJsonFromTask(task))
      .catch((err: Error) => { console.error(err) });
  }


  /**
   * Update task in Firestore collection.
   * The update will only be executed if the task (i.e., its Firestore ID) exists in the Firestore collection.
   * @param task task to be updated
   */
  async updateTask(task: Task) {
    if (task.id) {
      let docRef = this.getSingleDocRef(task.id);
      let taskJson = this.getJsonFromTask(task);
      await updateDoc(docRef, taskJson)
        .catch((err: Error) => { console.error(err) });
    }
  }


  /**
   * Delete task from Firestore collection
   * @param id Firestore task ID of task to be deleted
   */
  async deleteTask(id: string) {
    let docRef = this.getSingleDocRef(id);
    await deleteDoc(docRef)
      .catch((err: Error) => { console.error(err) });
  }


  /**
   * Transform task object properties to JSON
   * @param task task to be transformed
   * @returns JSON
   */
  getJsonFromTask(task: Task): {} {
    return {
      'id': task.id,
      'title': task.title,
      'description': task.description,
      'assigned': task.assigned,
      'due': task.due,
      'prio': task.prio,
      'category': task.category,
      'subtasks': task.subtasks,
      'timestamp': task.timestamp,
      'status': task.status
    }
  }


  /**
   * Retrieve a complete task object from task ID
   * @param id Firestore task ID
   * @returns task object
   */
  getTaskById(id: string): Task {
    let task = new Task('');
    this.tasks.forEach(t => {
      if (t.id == id) { task = t }
    });
    return task;
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
   * Set "Task" object from "any" object and ID
   * @param obj any object (should consist of task properties)
   * @param id Firestore task ID
   * @returns task object
   */
  setTaskObject(obj: any, id: string): Task {
    const task = new Task('null');
    task.id = id;
    if (obj.title) { task.title = obj.title }
    if (obj.description) { task.description = obj.description }
    if (obj.assigned) { task.assigned = obj.assigned }
    if (obj.due) { task.due = obj.due }
    if (obj.prio) { task.prio = obj.prio }
    if (obj.category) { task.category = obj.category }
    if (obj.subtasks) { task.subtasks = obj.subtasks }
    if (obj.timestamp) { task.timestamp = obj.timestamp }
    if (obj.status) { task.status = obj.status }
    return task;
  }
}