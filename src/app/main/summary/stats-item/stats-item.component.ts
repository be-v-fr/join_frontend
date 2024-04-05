import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stats-item',
  standalone: true,
  imports: [],
  templateUrl: './stats-item.component.html',
  styleUrl: './stats-item.component.scss'
})
export class StatsItemComponent {
@Input() name: string = '';
@Input() value: number | string = 0;
}
