import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../../models/task';
import { TasksService } from '../../services/tasks.service';
import { User } from '../../../models/user';
import { UsersService } from '../../services/users.service';
import { TaskViewComponent } from './task-view/task-view.component';
import { AddTaskComponent } from '../add-task/add-task.component';
import { TaskListComponent } from './task-list/task-list.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, TaskListComponent, TaskViewComponent, AddTaskComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {
  tasks: Task[] = [];
  users: User[] = [];
  private usersService = inject(UsersService);
  private tasksService = inject(TasksService);
  statusList: ('To do' | 'In progress' | 'Await feedback' | 'Done')[] = ['To do', 'In progress', 'Await feedback', 'Done'];
  viewTaskId: string = '';
  taskFormId: string | null = null;
  newTaskStatus: 'To do' | 'In progress' | 'Await feedback' = 'To do';

  ngOnInit() {
    this.updateTasks();
    this.tasksService.getCurrentTasks().subscribe(() => this.updateTasks());
    this.users = this.usersService.users;
  }

  updateTasks() {
    this.tasks = this.tasksService.tasks;
  }

  getFilteredTasks(status: 'To do' | 'In progress' | 'Await feedback' | 'Done') {
    return this.tasksService.getFilteredTasks(status);
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

  addToStatus(status: 'To do' | 'In progress' | 'Await feedback' | 'Done') {
    if (status != 'Done') {
      this.newTaskStatus = status;
      this.showTaskForm('');
    }
  }
}
