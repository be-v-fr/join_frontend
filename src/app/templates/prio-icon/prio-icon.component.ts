import { Component, Input } from '@angular/core';


/**
 * This component displays a priority icon (i.e., one of three icons corresponding to the three priority values).
 */
@Component({
  selector: 'app-prio-icon',
  standalone: true,
  imports: [],
  templateUrl: './prio-icon.component.html',
  styleUrl: './prio-icon.component.scss'
})
export class PrioIconComponent {
@Input() prio: 'Urgent' | 'Medium' | 'Low' | '' = '';
}
