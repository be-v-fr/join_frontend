import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Subtask } from '../../../interfaces/subtask.interface';
import { SubtaskComponent } from './subtask/subtask.component';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [CommonModule, SubtaskComponent],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss'
})
export class AddTaskComponent {
  prio: 'Urgent' | 'Medium' | 'Low' | null = 'Medium';
  category: 'Technical Task' | 'User Story' | null = null;
  subtasks: Subtask[] = [
    {
      name: 'test 1',
      status: 'To do'
    },
    {
      name: 'test 2',
      status: 'To do'
    },
    {
      name: 'test 3',
      status: 'To do'
    }
  ];
  showCategoryDropdown: boolean = false;

  selectPrio(prio: 'Urgent' | 'Medium' | 'Low') {
    this.prio != prio ? this.prio = prio : this.prio = null;
  }

  toggleCategoryDropdown(e: Event) {
    e.stopPropagation();
    if (e.target != null) {
      (e.target as HTMLInputElement).blur();
    }
    this.showCategoryDropdown = !this.showCategoryDropdown;
  }

  setCategory(category: 'Technical Task' | 'User Story') {
    this.category = category;
  }

  deleteSubtask(index: number) {
    this.subtasks.splice(index, 1);
  }

  handleGeneralClick() {
    this.showCategoryDropdown = false;
  }
}
