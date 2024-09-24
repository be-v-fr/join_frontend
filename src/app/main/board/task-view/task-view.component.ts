import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { Task } from '../../../../models/task';
import { TasksService } from '../../../services/tasks.service';
import { UsersService } from '../../../services/users.service';
import { TaskCategoryComponent } from '../task-list/task-card/task-category/task-category.component';
import { ContactListItemComponent } from '../../contacts/contact-list-item/contact-list-item.component';
import { CloseBtnComponent } from '../../../templates/close-btn/close-btn.component';
import { PrioIconComponent } from '../../../templates/prio-icon/prio-icon.component';
import { CommonModule } from '@angular/common';
import { SlideComponent } from '../../../templates/slide/slide.component';
import { AppUser } from '../../../../models/app-user';


/**
 * This component displays a "task viewer" within an overlay.
 * The viewer contains more detailed information than the "task card" component.
 * It also allows task editing.
 */
@Component({
  selector: 'app-task-view',
  standalone: true,
  imports: [CommonModule, CloseBtnComponent, TaskCategoryComponent, PrioIconComponent, ContactListItemComponent],
  templateUrl: './task-view.component.html',
  styleUrl: './task-view.component.scss'
})
export class TaskViewComponent extends SlideComponent {
  @Input() task?: Task;
  @Input() users: AppUser[] = [];
  @Output() cancelOverlay = new EventEmitter<void>();
  @Output() editThisTask = new EventEmitter<void>();
  public usersService = inject(UsersService);
  private tasksService = inject(TasksService);


  /**
   * Call super constructor
   */
  constructor() {
    super();
  }


  /**
   * Extend super class "ngOnInit()" method by initializing users array
   */
  override ngOnInit(): void {
    super.ngOnInit();
    this.users = this.usersService.users;
  }


  /**
   * Cancel task viewer overlay with slide animation
   */
  cancel() {
    this.slideInOut();
    setTimeout(() => this.cancelOverlay.emit(), 125);
  }


  /**
   * Toggle subtask status between options "To do" and "Done".
   * Immediately update the task in Firestore.
   * @param index subtask array index
   */
  async toggleSubtaskStatus(index: number) {
    if (this.task && this.task.subtasks) {
      const subtask = this.task.subtasks[index];
      subtask.status = (subtask.status == 'To do' ? 'Done' : 'To do');
      await this.tasksService.updateSubtask(subtask);
    }
  }


  /**
   * Completely delete this task
   */
  deleteTask() {
    if (this.task) {
      this.cancel();
      this.tasksService.deleteTask(this.task.id);
    }
  }


  /**
   * Edit this task (aside from subtask checking) by emitting the corresponding event to the parent component
   */
  editTask() {
    this.editThisTask.emit();
  }
}
