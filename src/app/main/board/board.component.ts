import { Component, inject, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../../models/task';
import { TasksService } from '../../services/tasks.service';
import { TaskViewComponent } from './task-view/task-view.component';
import { AddTaskComponent } from '../add-task/add-task.component';
import { TaskListComponent } from './task-list/task-list.component';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, FormsModule, TaskListComponent, TaskViewComponent, AddTaskComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {
  tasks: Task[] = [];
  private tasksService = inject(TasksService);
  private router = inject(Router);
  statusList: ('To do' | 'In progress' | 'Await feedback' | 'Done')[] = ['To do', 'In progress', 'Await feedback', 'Done'];
  viewTaskId: string = '';
  taskFormId: string | null = null;
  taskFormWrapperTranslated: boolean = true;
  dragCardHeight: number = 160;
  dragStartStatus: 'To do' | 'In progress' | 'Await feedback' | 'Done' = 'To do';
  searchFilter: string = '';

  ngOnInit() {
    this.updateTasks();
    this.tasksService.getCurrentTasks().subscribe(() => this.updateTasks());
  }

  updateTasks() {
    this.tasks = this.tasksService.tasks;
  }

  getFilteredTasks(status: 'To do' | 'In progress' | 'Await feedback' | 'Done') {
    const tasksFilteredByStatus = this.tasksService.getFilteredTasks(status);
    return tasksFilteredByStatus.filter(t => this.taskFitsSearch(t));
  }

  taskFitsSearch(task: Task): boolean {
    const title = task.title.toLowerCase();
    const description = task.description.toLowerCase();
    const searchFilter = this.searchFilter.toLowerCase();
    if(!title.includes(searchFilter) && !description.includes(searchFilter)) {return false}
    return true;
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
    this.slideTaskFormWrapper();
    setTimeout(() => this.taskFormId = null, 125);
  }

  // In case the add task form is opened in an overlay, this listener checks whether the window has been resized below the breakpoint width and triggers a function that closes the overlay in that case
  @HostListener('window:resize', ['$event'])
  onResize() {
    if (this.taskFormId != null && window.innerWidth <= 768) { this.taskFormId = null; }
  }

  addToStatus(status: 'To do' | 'In progress' | 'Await feedback' | 'Done') {
    if (status != 'Done') {
      this.tasksService.newTaskStatus = status;
      window.innerWidth > 768 ? this.showTaskForm('') : this.router.navigate(['/add_task']);
    }
  }

  slideTaskFormWrapper() {
    this.taskFormWrapperTranslated = !this.taskFormWrapperTranslated;
  }

  setDragCardHeight(height: number) {
    this.dragCardHeight = height;
  }

  setDragStartStatus(status: 'To do' | 'In progress' | 'Await feedback' | 'Done') {
    this.dragStartStatus = status;
  }
}
