import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, collectionData, onSnapshot, addDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import { Task } from '../../models/task';

@Injectable({
  providedIn: 'root'
})

export class TasksService {
  tasks: Task[] = [];
  private tasksUpdate: Subject<void> = new Subject<void>();
  unsubTasks;
  firestore: Firestore = inject(Firestore);

  constructor() {
    this.unsubTasks = this.subTasks();
  }

  ngOnDestroy() {
    this.unsubTasks();
  }

  subTasks() {
    return onSnapshot(this.getColRef(), (list: any) => {
      this.tasks = [];
      list.forEach((element: any) => {
        this.tasks.push(this.setTaskObject(element.data(), element.id));
      });
      this.tasksUpdate.next();
    });
  }

  getCurrentTasks(): Observable<void> {
    return this.tasksUpdate.asObservable();
  }

  getColRef() {
    return collection(this.firestore, 'tasks');
  }

  getSingleDocRef(id: string) {
    return doc(this.getColRef(), id);
  }

  async addTask(task: Task) {
    await addDoc(this.getColRef(), this.getJsonFromTask(task))
      .catch((err: Error) => { console.error(err) });
  }

  async updateTask(task: Task) {
    if (task.id) {
      let docRef = this.getSingleDocRef(task.id);
      let taskJson = this.getJsonFromTask(task);
      await updateDoc(docRef, taskJson)
        .catch((err: Error) => { console.error(err) });
    }
  }
  
  async deleteTask(id: string) {
    let docRef = this.getSingleDocRef(id);
    await deleteDoc(docRef)
      .catch((err: Error) => { console.error(err) });
  }

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

  getTaskById(id: string): Task {
    let task = new Task('');
    this.tasks.forEach(t => {
      if(t.id == id) {task = t}
    });
    return task;
  }

  getFilteredTasks(status: 'To do' | 'In progress' | 'Await feedback' | 'Done') {
    return this.tasks.filter(t => t.status == status);
  }

  setTaskObject(obj: any, id: string): Task {
    const defaultTask = new Task('null');
    return {
      id: id || defaultTask.id,
      title: obj.title || defaultTask.title,
      description: obj.description || defaultTask.description,
      assigned: obj.assigned || defaultTask.assigned,
      due: obj.due || defaultTask.due,
      prio: obj.prio || defaultTask.prio,
      category: obj.category || defaultTask.category,
      subtasks: obj.subtasks || defaultTask.subtasks,
      timestamp: obj.timestamp || defaultTask.timestamp,
      status: obj.status || defaultTask.status
    };
  }
}