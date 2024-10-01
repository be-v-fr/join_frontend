import { Component, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../../models/task';
import { TasksService } from '../../services/tasks.service';
import { TaskViewComponent } from './task-view/task-view.component';
import { AddTaskComponent } from '../add-task/add-task.component';
import { TaskListComponent } from './task-list/task-list.component';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';


/**
 * This component displays the task board.
 * It contains an overview of all tasks sorted by their respective status.
 * It also contains a search function to filter tasks.
 */
@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, FormsModule, TaskListComponent, TaskViewComponent, AddTaskComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {
  private tasksService = inject(TasksService);
  private router = inject(Router);
  statusList: ('To do' | 'In progress' | 'Await feedback' | 'Done')[] = ['To do', 'In progress', 'Await feedback', 'Done'];
  viewTaskId: number = -1;
  taskFormId: number | null = null;
  taskFormWrapperTranslated: boolean = true;
  dragCardHeight: number = 160;
  dragStartStatus: 'To do' | 'In progress' | 'Await feedback' | 'Done' = 'To do';
  searchFilter: string = '';
  closingTaskStatusDropdown: Subject<void> = new Subject<void>();


  /**
   * This function returns a full task by its ID
   * @param id Firestore task ID
   * @returns task
   */
  getTaskById(id: number): Task {
    return this.tasksService.getTaskById(id) || new Task({});
  }


  /**
   * This function sets the "viewTaskId" property, which will result in displaying the "task view" component
   * @param id task ID
   */
  viewTask(id: number) {
    this.viewTaskId = id;
  }


  /**
   * This functon closes the "task view" component/overlay by unsetting the "viewTaskId" property
   */
  closeTaskView() {
    this.viewTaskId = -1;
  }


  /**
   * Show the "add task" component.
   * Leaving "id" empty ('') will result in "add" mode. Using an actual ID will result in editing the corresponding task.
   * @param id task ID
   */
  showTaskForm(id: number) {
    this.taskFormId = id;
  }


  /**
   * Hide "add task" component with slide animation.
   */
  hideTaskForm() {
    this.slideTaskFormWrapper();
    setTimeout(() => this.taskFormId = null, 125);
  }


  /**
   * When the "add task" form is opened from the board, it depends on the screen resolution whether the form is displayed in an overlay or using router navigation.
   * Smaller screens will use router navigation.
   * In case the screen resolution is reduced below a certain threshold while the form is displayed in an overlay, close the overlay.
   * In this case, the user will have to click another time to open the form. The previous form data will be lost since it is never saved or loaded. 
   */
  @HostListener('window:resize', ['$event'])
  onResize() {
    if (this.taskFormId == -1 && window.innerWidth <= 768) { this.router.navigate(['/add_task']) }
  }


  /**
   * Set task status to be used for "add task" initialization in adding mode (not for editing tasks)
   * @param status task status/list
   */
  addToStatus(status: 'To do' | 'In progress' | 'Await feedback' | 'Done') {
    if (status != 'Done') {
      this.tasksService.newTaskStatus = status;
      window.innerWidth > 768 ? this.showTaskForm(-1) : this.router.navigate(['/add_task']);
    }
  }


  /**
   * Trigger slide animation for "add task" component
   */
  slideTaskFormWrapper() {
    this.taskFormWrapperTranslated = !this.taskFormWrapperTranslated;
  }


  /**
   * Set "dragCardHeight" property to a certain height in pixels.
   * The height should be retrieved from the currently dragged task card HTML element.
   * @param height card height
   */
  setDragCardHeight(height: number) {
    this.dragCardHeight = height;
  }


  /**
   * Set "dragStartStatus" property to a certain task status.
   * The status should be retrieved from the currently dragged task card HTML element or the task list containing it. 
   * @param status task status
   */
  setDragStartStatus(status: 'To do' | 'In progress' | 'Await feedback' | 'Done') {
    this.dragStartStatus = status;
  }


  /**
   * Close dropdown menu in "task card" element (child of "task list" element)
   */
  closeTaskStatusDropdown() {
    this.closingTaskStatusDropdown.next();
  }
}
