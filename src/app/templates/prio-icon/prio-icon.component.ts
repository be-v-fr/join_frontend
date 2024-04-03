import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-prio-icon',
  standalone: true,
  imports: [],
  templateUrl: './prio-icon.component.html',
  styleUrl: './prio-icon.component.scss'
})
export class PrioIconComponent {
@Input() prio: 'Urgent' | 'Medium' | 'Low' | null = null;
}
