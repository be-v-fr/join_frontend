import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-task-category',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-category.component.html',
  styleUrl: './task-category.component.scss'
})
export class TaskCategoryComponent {
@Input() category: 'Technical Task' | 'User Story' = 'Technical Task';
}
