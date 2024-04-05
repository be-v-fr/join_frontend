import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

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

constructor(private router: Router) {}

goToBoard() {
  this.router.navigate(['/board']);
}
}
