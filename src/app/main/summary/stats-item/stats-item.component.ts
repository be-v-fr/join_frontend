import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';


/**
 * This component displays a task statistics item as seen on the summary/landing page
 */
@Component({
  selector: 'app-stats-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-item.component.html',
  styleUrl: './stats-item.component.scss'
})
export class StatsItemComponent {
@Input() name: string = '';
@Input() value: number | string = 0;
@Input() deadline: string = '';


/**
 * Create instance of Router
 * @param router instance of Router
 */
constructor(private router: Router) {}


/**
 * Navigate to "board" page
 */
goToBoard() {
  this.router.navigate(['/board']);
}
}
