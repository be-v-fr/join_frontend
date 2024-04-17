import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

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
