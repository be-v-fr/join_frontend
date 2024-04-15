import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subtask } from '../../../../interfaces/subtask.interface';
import { FormsModule } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'app-subtask',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './subtask.component.html',
  styleUrl: './subtask.component.scss'
})
export class SubtaskComponent implements OnInit {
  @Input() task: Subtask = {
    name: 'Task created',
    status: 'To do'
  };
  editing: boolean = false;
  previousName: string = '';
  @Output() taskChange = new EventEmitter<Subtask>();
  @Output() delete = new EventEmitter<boolean>();
  private formSubscription: Subscription | undefined;
  @Input() formClick: Observable<void> | undefined;
  @ViewChild('editInput') editInputRef!: ElementRef;

  ngOnInit() {
    if (this.formClick) {
      this.formSubscription = this.formClick.subscribe(() => this.cancel());
    }
    this.previousName = this.task.name;
  }

  ngOnDestroy() {
    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
    }
  }

  edit() {
    this.editing = true;
    this.previousName = this.task.name;
    this.focusLastPosition();
  }

  focusLastPosition() {
    setTimeout(() => {
      const input: HTMLInputElement = this.editInputRef.nativeElement;
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
      }, 0);
  }

  confirm(ev?: Event) {
    if(ev && this.editInputRef.nativeElement == document.activeElement) {ev.stopPropagation()}
    this.editing = false;
    this.taskChange.emit(this.task);
  }

  cancel() {
    if (this.editing) {
      this.task.name = this.previousName;
      this.confirm();
    }
  }

  deleteTask() {
    this.delete.emit(true);
  }
}
