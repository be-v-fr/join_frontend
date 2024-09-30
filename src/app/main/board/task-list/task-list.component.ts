import { Component, Input, Output, EventEmitter, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Task } from '../../../../models/task';
import { TaskCardComponent } from './task-card/task-card.component';
import { TasksService } from '../../../services/tasks.service';
import { CommonModule } from '@angular/common';
import { AutoscrollService } from '../../../services/autoscroll.service';
import { Subject, Subscription } from 'rxjs';


/**
 * This component displays a list of task cards defined by a task status.
 * The task cards are draggable from one list to another, requiring communication with the parent component.
 */
@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, TaskCardComponent],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements OnDestroy {
  tasks: Task[] = [];
  tasksSub = new Subscription();
  @Input() status: 'To do' | 'In progress' | 'Await feedback' | 'Done' = 'To do';
  draggingOver: boolean = false;
  private lastDragOver: number = 0;
  draggedTaskCard: HTMLElement | null = null;
  dragYStart: number = 0;
  @Input() dragStartStatus: 'To do' | 'In progress' | 'Await feedback' | 'Done' | null = null;
  @Output() setDragStartStatus = new EventEmitter<'To do' | 'In progress' | 'Await feedback' | 'Done'>();
  @Output() addToStatusClick = new EventEmitter<void>();
  @Input() closingTaskStatusDropdown: Subject<void> = new Subject<void>();
  @Output() taskClick = new EventEmitter<number>();
  @Input() dragCardHeight: number = 0;
  @Output() setDragCardHeight = new EventEmitter<number>();
  @Output() dragging = new EventEmitter<boolean>();


  /**
   * Create TasksService instance
   * @param tasksService instance of TasksService
   */
  constructor(
    private tasksService: TasksService,
    private scrollService: AutoscrollService,
    private cd: ChangeDetectorRef,
  ) {
    this.tasksSub = this.subTasks();
  }


  ngOnDestroy(): void {
    this.tasksSub.unsubscribe();
  }


  subTasks(): Subscription {
    return this.tasksService.tasks$.subscribe(() => {
      this.tasks = this.tasksService.getFilteredTasks(this.status);
      console.log(this.status, this.tasks);
      this.cd.detectChanges();
    });
  }


  /**
   * This function handles a drag start of a task card within the current task list.
   * It sets the data to be transferred by dragging and emits the following information to the parent component:
   * - The task status before the drag event
   * - 
   * @param ev task drag event
   * @param id task ID
   */
  onTaskDragStart(ev: DragEvent, id: number) {
    ev.dataTransfer?.setData('text/plain', id.toString());
    this.draggedTaskCard = ev.target as HTMLElement;
    this.dragYStart = ev.clientY;
    this.setDragStartStatus.emit(this.status);
    this.setDragCardHeight.emit(this.draggedTaskCard.offsetHeight);
  }


  /**
   * Enable vertical scrolling (without additional click, purely by moving the cursor) while dragging
   * @param ev task drag event
   */
  onDrag(ev: DragEvent) {
    const dragSpeed = ev.clientY - this.dragYStart;
    this.scrollService.scrollWhileDragging(dragSpeed);
  }


  /**
   * On task drag end, unset "draggedTaskCard"
   */
  onTaskDragEnd() {
    if (this.draggedTaskCard != null) { this.draggedTaskCard = null }
  }


  /**
   * When the task drag enters this task list, call a function
   * @param ev task drag event
   */
  onTaskDragEnter(ev: DragEvent) {
    this.setDraggingOver(ev);
  }


  /**
   * When the task drag hovers over this task list, call a function
   * @param ev task drag event
   */
  onTaskDragOver(ev: DragEvent) {
    this.setDraggingOver(ev);
  }


  /**
   * This function not only sets the "draggingOver" property to true, but also sets "lastDragOver" to the current timestamp.
   * The timestamp is required to facilitate a workaround (see function "unsetDraggingOverAfterWaiting()").
   * @param ev task drag event
   */
  setDraggingOver(ev: DragEvent) {
    ev.preventDefault();
    this.draggingOver = true;
    this.lastDragOver = Date.now();
  }


  /**
   * On task drag leave, call a function
   * @param ev task drag event
   */
  onTaskDragLeave(ev: DragEvent) {
    ev.preventDefault();
    this.unsetDraggingOverAfterWaiting();
  }


  /**
   * This function uses the "lastDragOver" property for a workaround for the premature "(dragleave)" emitting that occurs by default.
   * It only unsets the current dragging state in case neither "(dragenter)" nor "(dragover)" have been re-triggered 20ms after "(dragleave)" 
   */
  async unsetDraggingOverAfterWaiting() {
    setTimeout(() => {
      if (Date.now() - this.lastDragOver > 20) {
        this.lastDragOver = 0;
        this.draggingOver = false;
      }
    }, 20);
  }


  /**
   * On task drop, get the Firestore task ID which was stored in "dataTransfer" before.
   * Update the status of the dragged task using the ID.
   * @param ev 
   */
  onTaskDrop(ev: DragEvent) {
    ev.preventDefault();
    this.draggingOver = false;
    const id = ev.dataTransfer?.getData('text/plain');
    if (id) { this.updateTaskStatus(id as unknown as number) }
  }


  /**
   * Retrieve the full task from Firestore/tasksService using the task ID.
   * Update the task status to the current list. Then update the task in Firestore/tasksService.
   * @param taskId Firestore task ID
   */
  updateTaskStatus(taskId: number) {
    let task = this.tasksService.getTaskById(taskId);
    if (task) {
      task.status = this.status;
      this.tasksService.updateTask(task);
    }
  }


  /**
   * Add new task to this list's defining status by emitting the corresponding event to the parent component
   */
  addToStatus() {
    this.addToStatusClick.emit();
  }


  /**
   * View task by emitting the corresponding event to the parent component
   * @param id Firestore task ID
   */
  viewTask(id: number) {
    this.taskClick.emit(id);
  }
}
