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
  prio: 'Urgent' | 'Medium' | 'Low' | null = 'Medium'

  selectPrio(prio: 'Urgent' | 'Medium' | 'Low') {
    this.prio != prio ? this.prio = prio : this.prio = null;
  }
}
