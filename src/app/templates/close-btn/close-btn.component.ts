import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';


/**
 * This component displays a button in X shape.
 */
@Component({
  selector: 'app-close-btn',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './close-btn.component.html',
  styleUrl: './close-btn.component.scss'
})
export class CloseBtnComponent {
@Input() bright?: boolean;
}
