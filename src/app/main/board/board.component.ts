import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../../models/task';
import { TaskCardComponent } from './task-card/task-card.component';
import { TasksService } from '../../shared/tasks.service';
import { TaskViewComponent } from './task-view/task-view.component';
import { AddTaskComponent } from '../add-task/add-task.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, TaskCardComponent, TaskViewComponent, AddTaskComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {
  toDo: Task[] = [];
  inProgress: Task[] = [];
  awaitFeedback: Task[] = [];
  done: Task[] = [];
  viewTaskId: string = '';
  taskFormId: string | null = null;
  newTaskStatus: 'To do' | 'In progress' | 'Await feedback' = 'To do';

  constructor(private tasksService: TasksService) {
    this.updateTasks();
    this.tasksService.getCurrentTasks().subscribe(() => this.updateTasks());
  }

  updateTasks() {
    const allTasks = this.tasksService.tasks;
    this.toDo = allTasks.filter(t => t.status == 'To do');
    this.inProgress = allTasks.filter(t => t.status == 'In progress');
    this.awaitFeedback = allTasks.filter(t => t.status == 'Await feedback');
    this.done = allTasks.filter(t => t.status == 'Done');
  }

  getTaskById(id: string): Task {
    return this.tasksService.getTaskById(id);
  }

  viewTask(id: string) {
    this.viewTaskId = id;
  }

  closeTaskView() {
    this.viewTaskId = '';
  }

  showTaskForm(id: string) {
    this.taskFormId = id;
  }

  hideTaskForm() {
    this.taskFormId = null;
  }

  addToStatus(status: 'To do' | 'In progress' | 'Await feedback') {
    this.newTaskStatus = status;
    this.showTaskForm('');
  }

  onTaskDragStart() {
    console.log('drag start!');
  }

  onTaskDragOver() {
    console.log('drag over!');
  }

  onTaskDrop(ev: Event) {
    ev.preventDefault();
    console.log(ev.target);
  }
}
