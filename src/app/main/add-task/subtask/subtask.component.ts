import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subtask } from '../../../../interfaces/subtask.interface';

@Component({
  selector: 'app-subtask',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subtask.component.html',
  styleUrl: './subtask.component.scss'
})
export class SubtaskComponent {
  @Input() task: Subtask = {
    name: 'Task created',
    status: 'To do'
  };
  editing: boolean = false;
  @Output() delete = new EventEmitter<boolean>();

  toggleEdit() {
    this.editing = !this.editing;
  }

  deleteTask() {
    this.delete.emit(true);
  }
}
