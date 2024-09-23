import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subtask } from '../../../../models/subtask';
import { FormsModule } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';


/**
 * This component displays a Task's Subtask.
 * It shows the task ('name') in an editable manner.
 */
@Component({
  selector: 'app-subtask',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './subtask.component.html',
  styleUrl: './subtask.component.scss'
})
export class SubtaskComponent implements OnInit {
  @Input() task = new Subtask({
    name: 'Task created',
    status: 'To do'
  });
  editing: boolean = false;
  previousName: string = '';
  @Output() taskChange = new EventEmitter<Subtask>();
  @Output() delete = new EventEmitter<boolean>();
  private formSubscription = new Subscription();
  @Input() formClick = new Observable<void>();
  @ViewChild('editInput') editInputRef!: ElementRef;


  /**
   * Subscribe to form click observable from parent component; call "cancel()" method in case the form is clicked directly.
   * Save previous task name to reload when editing is aborted.
   */
  ngOnInit() {
    this.formSubscription = this.formClick.subscribe(() => this.cancel());
    this.previousName = this.task.name;
  }


  /**
   * Unsubscribe when component is destroyed.
   */
  ngOnDestroy() {
    this.formSubscription.unsubscribe();
  }


  /**
   * Edit subtask. Save previous name to redeem in case editing is aborted.
   */
  edit() {
    this.editing = true;
    this.previousName = this.task.name;
    this.focusLastPosition();
  }


  /**
   * Focus input element at last character
   */
  focusLastPosition() {
    setTimeout(() => {
      const input: HTMLInputElement = this.editInputRef.nativeElement;
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    }, 0);
  }


  /**
   * Confirm subtask editing
   * @param enter keydown.enter event
   */
  confirm(enter?: Event) {
    if (enter && this.editInputRef.nativeElement == document.activeElement) { enter.stopPropagation() }
    this.editing = false;
    this.taskChange.emit(this.task);
  }


  /**
   * Cancel subtask editing
   */
  cancel() {
    if (this.editing) {
      this.task.name = this.previousName;
      this.confirm();
    }
  }


  /**
   * Delete this subtask
   */
  deleteTask() {
    this.delete.emit(true);
  }
}
