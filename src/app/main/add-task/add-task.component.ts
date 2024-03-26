import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss'
})
export class AddTaskComponent {
  prio: 'Urgent' | 'Medium' | 'Low' | null = 'Medium';
  category: 'Technical Task' | 'User Story' | null = null;
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

  handleGeneralClick() {
    this.showCategoryDropdown = false;
  }
}
